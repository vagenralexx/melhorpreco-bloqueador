/*******************************************************************************

    Melhor Preço Bloqueador — gerador da lista "Evite esses Sites" (Procon-SP)
    Copyright (C) 2026-present Melhor Preço

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Uso: node tools/make-procon-br.mjs <arquivo-de-saida>

    Baixa a relação pública de sites que o Procon-SP recomenda evitar e grava
    uma lista de filtros (sintaxe uBO/ABP) que o make-rulesets.js lê do cache
    local (dist/build/mv3-data/<plataforma>/procon-sp).

*/

import fs from 'node:fs/promises';
import path from 'node:path';

const ENDPOINT = 'https://sistemas.procon.sp.gov.br/evitesite/list/evitesite.php' +
    '?action=list&jtStartIndex=0&jtPageSize=5000&jtSorting=strSite%20ASC';
const HOME = 'https://sistemas.procon.sp.gov.br/evitesite/list/evitesites.php';

const outFile = process.argv[2];
if ( outFile === undefined ) {
    console.error('Uso: node tools/make-procon-br.mjs <arquivo-de-saida>');
    process.exit(1);
}

// O servidor do Procon recusa POST sem corpo (HTTP 411)
const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: '',
});
if ( response.ok !== true ) {
    throw new Error(`Procon-SP respondeu HTTP ${response.status}`);
}
const json = await response.json();
if ( json.Result !== 'OK' || Array.isArray(json.Records) === false ) {
    throw new Error('Resposta inesperada do Procon-SP');
}

const reHostname = /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/;
const hostnames = new Set();
const rejected = [];
for ( const record of json.Records ) {
    const hn = String(record.strSite || '')
        .trim()
        .toLowerCase()
        .replace(/^[a-z]+:\/\//, '')
        .replace(/[/?#].*$/, '')
        .replace(/^www\./, '')
        .replace(/\.$/, '');
    if ( reHostname.test(hn) ) {
        hostnames.add(hn);
    } else {
        rejected.push(record.strSite);
    }
}
if ( hostnames.size === 0 ) {
    throw new Error('Lista do Procon-SP veio vazia');
}

const lines = [
    '! Title: Procon-SP — Evite esses Sites',
    `! Description: Sites que o Procon-SP recomenda evitar (reclamações não respondidas). Fonte: ${HOME}`,
    `! Generated: ${new Date().toISOString()}`,
    `! Total: ${hostnames.size}`,
    '',
    ...Array.from(hostnames).sort().map(hn => `||${hn}^`),
    '',
];
await fs.mkdir(path.dirname(outFile), { recursive: true });
await fs.writeFile(outFile, lines.join('\n'));
console.log(`Procon-SP: ${hostnames.size} domínios gravados em ${outFile}`);
if ( rejected.length !== 0 ) {
    console.log(`Procon-SP: ignorados (formato inválido): ${rejected.join(', ')}`);
}
