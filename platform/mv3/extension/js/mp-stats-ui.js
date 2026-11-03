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
import { getProtectionSummary, presetLabel } from './mp-presets.js';
import { i18n$ } from './i18n.js';

/******************************************************************************/

const PERMISSION = { permissions: [ 'webRequest' ] };
const TOP_COUNT = 10;
const DONUT_SLICES = 5;
const HEAT_DAYS = 30;
const SPARK_DAYS = 14;
const SVG_NS = 'http://www.w3.org/2000/svg';
const uiLang = chrome.i18n.getUILanguage();
const numberFormat = new Intl.NumberFormat(uiLang);
const percentFormat = new Intl.NumberFormat(uiLang, { style: 'percent', maximumFractionDigits: 0 });
const fmt = n => numberFormat.format(n);

let rangeDays = 1;

/******************************************************************************/

function dayKeysEndingAt(endOffset, count) {
    const out = [];
    const now = new Date();
    for ( let i = count - 1; i >= 0; i-- ) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - endOffset - i);
        out.push(dayKeyFromTime(d.getTime()));
    }
    return out;
}

function dateFromKey(key) {
    const [ y, m, d ] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
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

function topEntries(map, count = TOP_COUNT) {
    return Array.from(map).sort((a, b) => b[1] - a[1]).slice(0, count);
}

function typeLabel(type) {
    return i18n$(`mpType_${type}`) || type;
}

function weekdayName(index, style = 'short') {
    // 2023-01-01 was a Sunday
    return new Date(2023, 0, 1 + index).toLocaleDateString(uiLang, { weekday: style });
}

function svgElem(name, attrs = {}) {
    const elem = document.createElementNS(SVG_NS, name);
    for ( const [ k, v ] of Object.entries(attrs) ) { elem.setAttribute(k, v); }
    return elem;
}

/******************************************************************************/

function summarize(dayKeys, allDays) {
    const days = dayKeys.map(key => allDays[key]).filter(a => a !== undefined);
    return {
        days,
        blocked: days.reduce((acc, day) => acc + day.total, 0),
        strict: days.reduce((acc, day) => acc + day.strict, 0),
        domains: mergeCounts(days, 'domains'),
        sites: mergeCounts(days, 'sites'),
        types: mergeCounts(days, 'types'),
    };
}

function renderDelta(selector, current, previous) {
    const elem = qs$(selector);
    const suffix = i18n$(rangeDays === 1 ? 'mpStatsVsYesterday' : 'mpStatsVsPrevious');
    let text;
    let trend = 'flat';
    if ( previous === 0 && current === 0 ) {
        text = i18n$('mpStatsNoChange');
    } else if ( previous === 0 ) {
        text = `${i18n$('mpStatsNew')} ${suffix}`;
        trend = 'up';
    } else {
        const ratio = (current - previous) / previous;
        trend = ratio > 0.005 ? 'up' : ratio < -0.005 ? 'down' : 'flat';
        const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
        text = `${arrow} ${percentFormat.format(Math.abs(ratio))} ${suffix}`;
    }
    elem.textContent = text;
    elem.dataset.trend = trend;
}

function renderSpark(selector, values) {
    const svg = qs$(selector);
    svg.textContent = '';
    const max = Math.max(1, ...values);
    const step = values.length > 1 ? 100 / (values.length - 1) : 100;
    const points = values.map((v, i) => [ i * step, 26 - (v / max) * 24 ]);
    const line = points.map(([ x, y ], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    svg.append(svgElem('path', { d: `${line} L100,28 L0,28 Z`, class: 'mpSparkArea' }));
    svg.append(svgElem('path', { d: line, class: 'mpSparkLine' }));
    const [ lx, ly ] = points.at(-1);
    svg.append(svgElem('circle', { cx: lx.toFixed(1), cy: ly.toFixed(1), r: '2.5', class: 'mpSparkDot' }));
}

function renderRank(selector, entries, labelFn = a => a) {
    const ol = qs$(selector);
    ol.textContent = '';
    const max = entries.length !== 0 ? entries[0][1] : 0;
    entries.forEach(([ key, count ], index) => {
        const li = document.createElement('li');
        const pos = document.createElement('span');
        pos.className = 'mpRankPos';
        pos.textContent = `${index + 1}`;
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
        li.append(pos, name, value, bar);
        ol.append(li);
    });
}

function renderChart(buckets, peakIndex) {
    const barsElem = qs$('#mpChartBars');
    barsElem.textContent = '';
    const values = buckets.map(a => a.value);
    const max = niceMax(Math.max(0, ...values));
    const total = values.reduce((a, b) => a + b, 0);
    const avg = buckets.length !== 0 ? total / buckets.length : 0;
    dom.text('#mpChartMax', compact(max));
    buckets.forEach((bucket, index) => {
        const bar = document.createElement('div');
        bar.className = 'mpBar';
        if ( index === peakIndex && bucket.value !== 0 ) { bar.classList.add('mpBarPeak'); }
        bar.tabIndex = 0;
        bar.dataset.label = bucket.label;
        bar.dataset.value = `${bucket.value}`;
        bar.setAttribute('role', 'img');
        bar.setAttribute('aria-label', `${bucket.label}: ${fmt(bucket.value)}`);
        const fill = document.createElement('span');
        fill.style.setProperty('--h', bucket.value !== 0
            ? `${Math.max(1, bucket.value / max * 100)}%`
            : '0%'
        );
        bar.append(fill);
        barsElem.append(bar);
    });
    // Average reference line
    if ( avg > 0 ) {
        const line = document.createElement('div');
        line.className = 'mpAvgLine';
        line.style.bottom = `${avg / max * 100}%`;
        const label = document.createElement('span');
        label.textContent = `${i18n$('mpStatsAvgLabel')} ${fmt(Math.round(avg))}`;
        line.append(label);
        barsElem.append(line);
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

function renderDonut(types) {
    const svg = qs$('#mpDonut');
    svg.textContent = '';
    const legend = qs$('#mpTopTypes');
    legend.textContent = '';
    const sorted = topEntries(types, Infinity);
    const total = sorted.reduce((acc, [ , n ]) => acc + n, 0);
    dom.text('#mpDonutTotal', compact(total));
    const slices = sorted.slice(0, DONUT_SLICES);
    const rest = sorted.slice(DONUT_SLICES).reduce((acc, [ , n ]) => acc + n, 0);
    if ( rest !== 0 ) { slices.push([ '__others', rest ]); }
    const r = 48;
    const circumference = 2 * Math.PI * r;
    const gap = slices.length > 1 ? 2 : 0;
    svg.append(svgElem('circle', { cx: 60, cy: 60, r, class: 'mpDonutTrack' }));
    let offset = 0;
    const labels = [];
    slices.forEach(([ type, count ], index) => {
        const length = total !== 0 ? count / total * circumference : 0;
        const slot = type === '__others' ? 'others' : `${index + 1}`;
        const circle = svgElem('circle', {
            cx: 60, cy: 60, r,
            class: `mpDonutSlice mpSlot${slot}`,
            'stroke-dasharray': `${Math.max(0, length - gap)} ${circumference}`,
            'stroke-dashoffset': `${-offset}`,
        });
        svg.append(circle);
        offset += length;
        const label = type === '__others' ? i18n$('mpStatsOthers') : typeLabel(type);
        const share = total !== 0 ? percentFormat.format(count / total) : '0%';
        labels.push(`${label} ${share}`);
        const li = document.createElement('li');
        const swatch = document.createElement('span');
        swatch.className = `mpSwatch mpSlot${slot}`;
        swatch.setAttribute('aria-hidden', 'true');
        const name = document.createElement('span');
        name.className = 'mpLegendName';
        name.textContent = label;
        const value = document.createElement('span');
        value.className = 'mpLegendValue';
        value.textContent = `${fmt(count)} · ${share}`;
        li.append(swatch, name, value);
        legend.append(li);
    });
    svg.setAttribute('aria-label', labels.join(', '));
}

function renderHeat(allDays) {
    const grid = qs$('#mpHeat');
    grid.textContent = '';
    const matrix = Array.from({ length: 7 }, ( ) => new Array(24).fill(0));
    for ( const key of dayKeysEndingAt(0, HEAT_DAYS) ) {
        const day = allDays[key];
        if ( day === undefined ) { continue; }
        const weekday = dateFromKey(key).getDay();
        day.hours.forEach((n, hour) => { matrix[weekday][hour] += n; });
    }
    let max = 0;
    let peak = null;
    matrix.forEach((row, weekday) => row.forEach((n, hour) => {
        if ( n > max ) { max = n; peak = { weekday, hour, n }; }
    }));
    dom.text('#mpHeatMax', compact(max));
    // Header row with a few hour labels
    grid.append(document.createElement('span'));
    for ( let hour = 0; hour < 24; hour++ ) {
        const label = document.createElement('span');
        label.className = 'mpHeatHour';
        label.textContent = hour % 6 === 0 ? `${hour}h` : '';
        grid.append(label);
    }
    // Monday first
    for ( const weekday of [ 1, 2, 3, 4, 5, 6, 0 ] ) {
        const label = document.createElement('span');
        label.className = 'mpHeatDay';
        label.textContent = weekdayName(weekday);
        grid.append(label);
        for ( let hour = 0; hour < 24; hour++ ) {
            const n = matrix[weekday][hour];
            const cell = document.createElement('span');
            cell.className = 'mpHeatCell';
            const level = max !== 0 && n !== 0 ? Math.min(6, Math.ceil(n / max * 6)) : 0;
            cell.dataset.level = `${level}`;
            cell.dataset.label = `${weekdayName(weekday)} ${hour}h`;
            cell.dataset.value = `${n}`;
            cell.title = `${weekdayName(weekday)} ${hour}h: ${fmt(n)}`;
            grid.append(cell);
        }
    }
    grid.setAttribute('aria-label', peak !== null
        ? `${i18n$('mpStatsHeatPeak')}: ${weekdayName(peak.weekday, 'long')} ${peak.hour}h, ${fmt(peak.n)}`
        : i18n$('mpStatsEmpty')
    );
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

async function renderHero() {
    const summary = await getProtectionSummary();
    dom.text('#mpHeroMode', `${i18n$('mpStatsModeLabel')}: ${presetLabel(summary.preset)}`);
    dom.text('#mpHeroMeta',
        `${fmt(summary.listCount)} ${i18n$('mpStatsListsActive')} · ${fmt(summary.ruleCount)} ${i18n$('mpStatsRules')}`
    );
}

async function render() {
    const granted = await chrome.permissions.contains(PERMISSION);
    qs$('#mpStatsOff').hidden = granted;
    qs$('#mpStatsOn').hidden = granted === false;
    if ( granted === false ) { return; }

    const bin = await chrome.storage.local.get(STATS_KEY);
    const allDays = bin[STATS_KEY]?.days || {};
    const dayKeys = dayKeysEndingAt(0, rangeDays);
    const current = summarize(dayKeys, allDays);
    const previous = summarize(dayKeysEndingAt(rangeDays, rangeDays), allDays);

    dom.text('#mpTileBlocked', fmt(current.blocked));
    dom.text('#mpTileStrict', fmt(current.strict));
    dom.text('#mpTileDomains', fmt(current.domains.size));
    dom.text('#mpTileSites', fmt(current.sites.size));
    renderDelta('#mpDeltaBlocked', current.blocked, previous.blocked);
    renderDelta('#mpDeltaStrict', current.strict, previous.strict);
    renderDelta('#mpDeltaDomains', current.domains.size, previous.domains.size);
    renderDelta('#mpDeltaSites', current.sites.size, previous.sites.size);

    const sparkKeys = dayKeysEndingAt(0, SPARK_DAYS);
    const sparkDays = sparkKeys.map(key => allDays[key]);
    renderSpark('#mpSparkBlocked', sparkDays.map(d => d?.total || 0));
    renderSpark('#mpSparkStrict', sparkDays.map(d => d?.strict || 0));
    renderSpark('#mpSparkDomains', sparkDays.map(d => Object.keys(d?.domains || {}).length));
    renderSpark('#mpSparkSites', sparkDays.map(d => Object.keys(d?.sites || {}).length));

    qs$('#mpStatsEmpty').hidden = current.blocked + current.strict !== 0;

    // Hours over the selected period, for the peak hour
    const hours = new Array(24).fill(0);
    for ( const day of current.days ) {
        day.hours.forEach((n, hour) => { hours[hour] += n; });
    }
    const peakHour = hours.indexOf(Math.max(...hours));
    const hasData = current.blocked !== 0;

    let buckets;
    let peakIndex;
    if ( rangeDays === 1 ) {
        buckets = hours.map((value, hour) => ({ label: `${hour}h`, value }));
        peakIndex = peakHour;
        dom.text('#mpChartTitle', i18n$('mpStatsChartHours'));
    } else {
        buckets = dayKeys.map(key => ({
            label: dateFromKey(key).toLocaleDateString(uiLang, { day: '2-digit', month: '2-digit' }),
            value: allDays[key]?.total || 0,
        }));
        const values = buckets.map(a => a.value);
        peakIndex = values.indexOf(Math.max(...values));
        dom.text('#mpChartTitle', i18n$('mpStatsChartDays'));
    }
    renderChart(buckets, peakIndex);
    dom.text('#mpChartPeak', hasData
        ? `${i18n$('mpStatsPeakLabel')}: ${buckets[peakIndex].label} (${fmt(buckets[peakIndex].value)})`
        : ''
    );

    renderDonut(current.types);
    renderHeat(allDays);

    // Summary
    dom.text('#mpSumPeakHour', hasData ? `${peakHour}h – ${peakHour + 1}h` : '—');
    let busiest = null;
    for ( const key of dayKeys ) {
        const n = allDays[key]?.total || 0;
        if ( n !== 0 && (busiest === null || n > busiest.n) ) { busiest = { key, n }; }
    }
    dom.text('#mpSumBusiestDay', busiest !== null
        ? `${dateFromKey(busiest.key).toLocaleDateString(uiLang, { weekday: 'short', day: '2-digit', month: '2-digit' })} · ${fmt(busiest.n)}`
        : '—'
    );
    dom.text('#mpSumDailyAvg', fmt(Math.round(current.blocked / rangeDays)));
    const topDomain = topEntries(current.domains, 1)[0];
    dom.text('#mpSumTopDomain', topDomain ? `${topDomain[0]} · ${fmt(topDomain[1])}` : '—');

    renderRank('#mpTopDomains', topEntries(current.domains));
    renderRank('#mpTopSites', topEntries(current.sites));
    renderHero();
}

/******************************************************************************/

qs$('.mpSegmented').setAttribute('aria-label', i18n$('mpStatsRangeLabel'));

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

dom.on('.mpSegmented', 'change', 'input[name="mpRange"]', ev => {
    rangeDays = Number(ev.target.value);
    render();
});

dom.on('#mpChartBars', 'pointerover', '.mpBar', ev => {
    showTooltip(ev.target);
});
dom.on('#mpChartBars', 'focusin', '.mpBar', ev => {
    showTooltip(ev.target);
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
