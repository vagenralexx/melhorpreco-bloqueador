/*******************************************************************************

    Melhor Preço Bloqueador - modos de proteção (combinações de listas)
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

import { dom, qs$, qsa$ } from './dom.js';
import { i18n$ } from './i18n.js';
import { renderFilterLists } from './filter-lists.js';
import { sendMessage } from './ext.js';

/******************************************************************************/

// Regional and imported lists are not part of any mode: they are kept as
// the user (or the browser language) configured them.
const KEPT_GROUPS = new Set([ 'regions', 'imported' ]);

const LEVE = [
    'ublock-filters',
    'easylist',
    'easyprivacy',
    'pgl',
    'ublock-badware',
    'urlhaus-full',
    'bra-0',
];

const RECOMENDADO = [
    ...LEVE,
    'hagezi-pro',
    'hagezi-tif',
    'hagezi-fake',
    'hagezi-popupads',
];

export const PRESETS = {
    leve: LEVE,
    recomendado: RECOMENDADO,
    maximo: [
        ...LEVE,
        'hagezi-ultimate',
        'oisd-big',
        'stevenblack',
        'hagezi-tif',
        'hagezi-fake',
        'hagezi-popupads',
        'adguard-spyware-url',
        'annoyances-cookies',
        'annoyances-overlays',
        'annoyances-social',
        'annoyances-widgets',
        'annoyances-others',
        'annoyances-notifications',
        'annoyances-ai',
        'procon-sp',
    ],
    familia: [
        ...RECOMENDADO,
        'hagezi-gambling',
        'oisd-nsfw',
        'procon-sp',
    ],
};

const PRESET_NAMES = {
    leve: 'mpPresetLeve',
    recomendado: 'mpPresetRecomendado',
    maximo: 'mpPresetMaximo',
    familia: 'mpPresetFamilia',
};

/******************************************************************************/

async function getState() {
    const [ enabledRulesets, rulesetDetails ] = await Promise.all([
        sendMessage({ what: 'getEnabledRulesets' }),
        sendMessage({ what: 'getRulesetDetails' }),
    ]);
    const groupOf = new Map(rulesetDetails.map(a => [ a.id, a.group ]));
    return { enabledRulesets, groupOf };
}

function presetFromEnabled(enabledRulesets, groupOf) {
    const managed = new Set(
        enabledRulesets.filter(id => KEPT_GROUPS.has(groupOf.get(id)) === false)
    );
    for ( const [ name, ids ] of Object.entries(PRESETS) ) {
        // A mode may force a regional list on (bra-0), but regional lists
        // are not used to tell modes apart
        const wanted = new Set(ids.filter(id =>
            groupOf.has(id) && KEPT_GROUPS.has(groupOf.get(id)) === false
        ));
        if ( wanted.size !== managed.size ) { continue; }
        if ( Array.from(wanted).every(id => managed.has(id)) ) { return name; }
    }
    return '';
}

function renderCurrent(name) {
    for ( const button of qsa$('#mpPresets [data-preset]') ) {
        dom.attr(button, 'aria-pressed', `${button.dataset.preset === name}`);
    }
    dom.text('#mpPresetCurrent',
        i18n$(name !== '' ? PRESET_NAMES[name] : 'mpPresetCustom')
    );
}

async function refresh() {
    const { enabledRulesets, groupOf } = await getState();
    renderCurrent(presetFromEnabled(enabledRulesets, groupOf));
}

async function applyPreset(name) {
    const buttons = qsa$('#mpPresets [data-preset]');
    dom.attr(buttons, 'disabled', '');
    try {
        const { enabledRulesets, groupOf } = await getState();
        const kept = enabledRulesets.filter(id => KEPT_GROUPS.has(groupOf.get(id)));
        const wanted = PRESETS[name].filter(id => groupOf.has(id));
        const result = await sendMessage({
            what: 'applyRulesets',
            enabledRulesets: Array.from(new Set([ ...wanted, ...kept ])),
        });
        dom.text('#dnrError', result?.error || '');
        await renderFilterLists();
    } finally {
        dom.attr(buttons, 'disabled', null);
        await refresh();
    }
}

/******************************************************************************/

dom.on('#mpPresets', 'click', '[data-preset]', ev => {
    const button = ev.target;
    if ( button.hasAttribute('disabled') ) { return; }
    applyPreset(button.dataset.preset);
});

// Manual changes to individual lists are committed by filter-lists.js after
// a short delay: re-evaluate the current mode once they are applied.
let refreshTimer;
dom.on('#lists', 'change', 'input[type="checkbox"]', ( ) => {
    self.clearTimeout(refreshTimer);
    refreshTimer = self.setTimeout(refresh, 2000);
});

if ( qs$('#mpPresets') !== null ) {
    refresh();
}
