/*******************************************************************************

    Melhor Preço Bloqueador - estatísticas locais de bloqueio
    Copyright (C) 2026-present Melhor Preço

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

*/

// The declarativeNetRequest API does not tell which URLs were blocked, so
// the statistics rely on the optional `webRequest` permission, which the
// user grants from the dashboard. Only failed requests (blocked by a client)
// and redirections to the strict-block page are observed, so the service
// worker is not woken up for every network request. Everything is stored
// locally, never sent anywhere.

/******************************************************************************/

import { STATS_KEY, dayKeyFromTime } from './mp-stats-common.js';

/******************************************************************************/

const MAX_DAYS = 30;
const MAX_HOSTS_PER_DAY = 500;
const FLUSH_DELAY = 2000;

const pending = [];
let flushTimer;

/******************************************************************************/

function hostnameFromURL(url) {
    if ( typeof url !== 'string' ) { return ''; }
    try { return new URL(url).hostname; } catch { }
    return '';
}

function newDay() {
    return {
        total: 0,
        strict: 0,
        hours: new Array(24).fill(0),
        domains: {},
        sites: {},
        types: {},
    };
}

function bump(dict, key) {
    if ( key === '' ) { return; }
    dict[key] = (dict[key] || 0) + 1;
}

function pruneDict(dict, max) {
    const entries = Object.entries(dict);
    if ( entries.length <= max ) { return dict; }
    entries.sort((a, b) => b[1] - a[1]);
    return Object.fromEntries(entries.slice(0, max));
}

/******************************************************************************/

async function flush() {
    flushTimer = undefined;
    if ( pending.length === 0 ) { return; }
    const events = pending.splice(0);
    const bin = await chrome.storage.local.get(STATS_KEY);
    const stats = bin[STATS_KEY] || { days: {} };
    for ( const ev of events ) {
        const dayKey = dayKeyFromTime(ev.time);
        const day = stats.days[dayKey] || (stats.days[dayKey] = newDay());
        if ( ev.strict ) {
            day.strict += 1;
        } else {
            day.total += 1;
            day.hours[new Date(ev.time).getHours()] += 1;
            bump(day.types, ev.type);
        }
        bump(day.domains, ev.hostname);
        bump(day.sites, ev.site);
    }
    const dayKeys = Object.keys(stats.days).sort();
    for ( const dayKey of dayKeys.slice(0, -MAX_DAYS) ) {
        delete stats.days[dayKey];
    }
    for ( const day of Object.values(stats.days) ) {
        day.domains = pruneDict(day.domains, MAX_HOSTS_PER_DAY);
        day.sites = pruneDict(day.sites, MAX_HOSTS_PER_DAY);
    }
    await chrome.storage.local.set({ [STATS_KEY]: stats });
}

function record(details, strict) {
    // Ignore requests made by extensions, including this one
    const initiator = details.initiator || '';
    if ( initiator.startsWith('chrome-extension:') ) { return; }
    pending.push({
        time: details.timeStamp || Date.now(),
        hostname: hostnameFromURL(details.url),
        site: strict
            ? hostnameFromURL(details.url)
            : hostnameFromURL(initiator || details.documentUrl),
        type: details.type || 'other',
        strict,
    });
    if ( flushTimer !== undefined ) { return; }
    flushTimer = setTimeout(( ) => { flush(); }, FLUSH_DELAY);
}

function onErrorOccurred(details) {
    if ( details.error !== 'net::ERR_BLOCKED_BY_CLIENT' ) { return; }
    record(details, false);
}

function onBeforeRedirect(details) {
    if ( details.type !== 'main_frame' ) { return; }
    const { redirectUrl } = details;
    if ( typeof redirectUrl !== 'string' ) { return; }
    if ( redirectUrl.startsWith('chrome-extension:') === false ) { return; }
    if ( redirectUrl.includes('/strictblock.html#') === false ) { return; }
    record(details, true);
}

function addListeners() {
    const wr = chrome.webRequest;
    if ( wr === undefined ) { return; }
    if ( wr.onErrorOccurred.hasListener(onErrorOccurred) ) { return; }
    const filter = { urls: [ '<all_urls>' ] };
    wr.onErrorOccurred.addListener(onErrorOccurred, filter);
    wr.onBeforeRedirect.addListener(onBeforeRedirect, filter);
}

function removeListeners() {
    const wr = chrome.webRequest;
    if ( wr === undefined ) { return; }
    wr.onErrorOccurred.removeListener(onErrorOccurred);
    wr.onBeforeRedirect.removeListener(onBeforeRedirect);
}

/******************************************************************************/

// Listeners must be registered synchronously at service worker startup to
// wake it up. The `webRequest` namespace exists only when the optional
// permission has been granted.
addListeners();

chrome.permissions.onAdded.addListener(perms => {
    if ( perms.permissions?.includes('webRequest') !== true ) { return; }
    addListeners();
});

chrome.permissions.onRemoved.addListener(perms => {
    if ( perms.permissions?.includes('webRequest') !== true ) { return; }
    removeListeners();
});
