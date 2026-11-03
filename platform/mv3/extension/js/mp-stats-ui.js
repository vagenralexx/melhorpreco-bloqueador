/*******************************************************************************

    Melhor Preço Bloqueador - painel de estatísticas
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

import { STATS_KEY, dayKeyFromTime } from './mp-stats-common.js';
import { dom, qs$ } from './dom.js';
import { i18n$ } from './i18n.js';

/******************************************************************************/

const PERMISSION = { permissions: [ 'webRequest' ] };
const TOP_COUNT = 10;
const uiLang = chrome.i18n.getUILanguage();
const numberFormat = new Intl.NumberFormat(uiLang);
const fmt = n => numberFormat.format(n);

let rangeDays = 1;

/******************************************************************************/

function lastDayKeys(count) {
    const out = [];
    const now = new Date();
    for ( let i = count - 1; i >= 0; i-- ) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        out.push(dayKeyFromTime(d.getTime()));
    }
    return out;
}

function niceMax(value) {
    if ( value <= 5 ) { return 5; }
    const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
    for ( const step of [ 1, 2, 2.5, 5, 10 ] ) {
        if ( step * magnitude >= value ) { return step * magnitude; }
    }
    return 10 * magnitude;
}

function compact(value) {
    return new Intl.NumberFormat(uiLang, { notation: 'compact' }).format(value);
}

function mergeCounts(days, field) {
    const out = new Map();
    for ( const day of days ) {
        for ( const [ key, count ] of Object.entries(day[field] || {}) ) {
            out.set(key, (out.get(key) || 0) + count);
        }
    }
    return out;
}

function topEntries(map) {
    return Array.from(map).sort((a, b) => b[1] - a[1]).slice(0, TOP_COUNT);
}

/******************************************************************************/

function renderRank(selector, entries, labelFn = a => a) {
    const ol = qs$(selector);
    ol.textContent = '';
    const max = entries.length !== 0 ? entries[0][1] : 0;
    for ( const [ key, count ] of entries ) {
        const li = document.createElement('li');
        const name = document.createElement('span');
        name.className = 'mpRankName';
        name.textContent = labelFn(key);
        const value = document.createElement('span');
        value.className = 'mpRankCount';
        value.textContent = fmt(count);
        const bar = document.createElement('span');
        bar.className = 'mpRankBar';
        bar.setAttribute('aria-hidden', 'true');
        const fill = document.createElement('span');
        fill.style.width = `${max !== 0 ? Math.max(2, count / max * 100) : 0}%`;
        bar.append(fill);
        li.append(name, value, bar);
        ol.append(li);
    }
}

function typeLabel(type) {
    return i18n$(`mpType_${type}`) || type;
}

function renderChart(buckets) {
    const barsElem = qs$('#mpChartBars');
    barsElem.textContent = '';
    const max = niceMax(Math.max(0, ...buckets.map(a => a.value)));
    dom.text('#mpChartMax', compact(max));
    for ( const bucket of buckets ) {
        const bar = document.createElement('div');
        bar.className = 'mpBar';
        bar.tabIndex = 0;
        bar.dataset.label = bucket.label;
        bar.dataset.value = `${bucket.value}`;
        bar.setAttribute('role', 'img');
        bar.setAttribute('aria-label', `${bucket.label}: ${fmt(bucket.value)}`);
        const fill = document.createElement('span');
        fill.style.height = bucket.value !== 0
            ? `${Math.max(1, bucket.value / max * 100)}%`
            : '0';
        bar.append(fill);
        barsElem.append(bar);
    }
    const xAxis = qs$('#mpChartXAxis');
    xAxis.textContent = '';
    const ticks = [ buckets[0], buckets[Math.floor(buckets.length / 2)], buckets.at(-1) ];
    for ( const tick of ticks ) {
        const span = document.createElement('span');
        span.textContent = tick.label;
        xAxis.append(span);
    }
    const tbody = qs$('#mpChartTableBody');
    tbody.textContent = '';
    for ( const bucket of buckets ) {
        const tr = document.createElement('tr');
        const th = document.createElement('td');
        th.textContent = bucket.label;
        const td = document.createElement('td');
        td.textContent = fmt(bucket.value);
        tr.append(th, td);
        tbody.append(tr);
    }
}

function showTooltip(bar) {
    const tooltip = qs$('#mpTooltip');
    tooltip.textContent = `${bar.dataset.label}: ${fmt(Number(bar.dataset.value))}`;
    tooltip.hidden = false;
    const plot = qs$('.mpChartPlot').getBoundingClientRect();
    const rect = bar.getBoundingClientRect();
    const width = tooltip.offsetWidth;
    let left = rect.left - plot.left + rect.width / 2 - width / 2;
    left = Math.max(0, Math.min(left, plot.width - width));
    tooltip.style.left = `${left}px`;
}

function hideTooltip() {
    qs$('#mpTooltip').hidden = true;
}

/******************************************************************************/

async function render() {
    const granted = await chrome.permissions.contains(PERMISSION);
    qs$('#mpStatsOff').hidden = granted;
    qs$('#mpStatsOn').hidden = granted === false;
    if ( granted === false ) { return; }

    const bin = await chrome.storage.local.get(STATS_KEY);
    const allDays = bin[STATS_KEY]?.days || {};
    const dayKeys = lastDayKeys(rangeDays);
    const days = dayKeys.map(key => allDays[key]).filter(a => a !== undefined);

    const blocked = days.reduce((acc, day) => acc + day.total, 0);
    const strict = days.reduce((acc, day) => acc + day.strict, 0);
    const domains = mergeCounts(days, 'domains');
    const sites = mergeCounts(days, 'sites');
    const types = mergeCounts(days, 'types');

    dom.text('#mpTileBlocked', fmt(blocked));
    dom.text('#mpTileStrict', fmt(strict));
    dom.text('#mpTileDomains', fmt(domains.size));
    dom.text('#mpTileSites', fmt(sites.size));
    qs$('#mpStatsEmpty').hidden = blocked + strict !== 0;

    let buckets;
    if ( rangeDays === 1 ) {
        const hours = allDays[dayKeys[0]]?.hours || new Array(24).fill(0);
        buckets = hours.map((value, hour) => ({ label: `${hour}h`, value }));
        dom.text('#mpChartTitle', i18n$('mpStatsChartHours'));
    } else {
        buckets = dayKeys.map(key => {
            const [ y, m, d ] = key.split('-').map(Number);
            const label = new Date(y, m - 1, d).toLocaleDateString(uiLang, {
                day: '2-digit', month: '2-digit',
            });
            return { label, value: allDays[key]?.total || 0 };
        });
        dom.text('#mpChartTitle', i18n$('mpStatsChartDays'));
    }
    renderChart(buckets);

    renderRank('#mpTopDomains', topEntries(domains));
    renderRank('#mpTopSites', topEntries(sites));
    renderRank('#mpTopTypes', topEntries(types), typeLabel);
}

/******************************************************************************/

qs$('.mpStatsRange').setAttribute('aria-label', i18n$('mpStatsRangeLabel'));

dom.on('#mpStatsEnable', 'click', async ( ) => {
    const granted = await chrome.permissions.request(PERMISSION).catch(( ) => false);
    qs$('#mpStatsDenied').hidden = granted;
    render();
});

dom.on('#mpStatsDisable', 'click', async ( ) => {
    await chrome.permissions.remove(PERMISSION);
    render();
});

dom.on('#mpStatsClear', 'click', async ( ) => {
    if ( self.confirm(i18n$('mpStatsClearConfirm')) !== true ) { return; }
    await chrome.storage.local.remove(STATS_KEY);
    render();
});

dom.on('.mpStatsRange', 'change', 'input[name="mpRange"]', ev => {
    rangeDays = Number(ev.target.value);
    render();
});

dom.on('#mpChartBars', 'pointerover', '.mpBar', ev => {
    showTooltip(ev.target.closest('.mpBar'));
});
dom.on('#mpChartBars', 'focusin', '.mpBar', ev => {
    showTooltip(ev.target.closest('.mpBar'));
});
dom.on('#mpChartBars', 'pointerleave', hideTooltip);
dom.on('#mpChartBars', 'focusout', hideTooltip);

chrome.storage.onChanged.addListener((changes, area) => {
    if ( area !== 'local' || changes[STATS_KEY] === undefined ) { return; }
    if ( dom.body.dataset.pane !== 'stats' ) { return; }
    render();
});

dom.on('#dashboard-nav', 'click', '.tabButton[data-pane="stats"]', ( ) => {
    render();
});

render();
