# Licenças das listas de filtros

Todas as listas são baixadas e compiladas **no momento do build** (`tools/make-mv3.sh`) e embutidas no pacote como rulesets do `declarativeNetRequest`. Cada linha abaixo diz se a lista pode ser redistribuída dentro de um pacote GPLv3.

Conferido em 03/11/2026.

## Listas acrescentadas pelo Melhor Preço Bloqueador

| Ruleset | Lista | Fonte | Licença | Pode embutir? | Padrão |
|---|---|---|---|---|---|
| `bra-0` | EasyList Portuguese | https://easylist-downloads.adblockplus.org/easylistportuguese.txt | GPLv3 (ou posterior) **ou** CC BY-SA 3.0, à escolha (https://easylist.to/pages/licence.html). Atribuição: "The EasyList authors (https://easylist.to/)" | Sim (usamos a opção GPLv3) | Ligado |
| `procon-sp` | Procon-SP "Evite esses Sites" | https://sistemas.procon.sp.gov.br/evitesite/list/evitesites.php (gerada por `tools/make-procon-br.mjs`) | Dado público de órgão do governo de SP. **Sem licença explícita publicada.** | Provável, mas **não confirmado**: decisão do dono antes de publicar | Desligado |

## Listas que vêm do uBOL oficial (sem mudança)

| Ruleset | Lista | Licença |
|---|---|---|
| `ublock-filters`, `ublock-badware`, demais `ublock-*` | uBlock filters (uAssets) | GPLv3 (https://github.com/uBlockOrigin/uAssets/blob/master/LICENSE) |
| `easylist`, `easyprivacy`, `annoyances-*` | EasyList / EasyPrivacy / Fanboy | GPLv3 ou CC BY-SA 3.0 (https://easylist.to/pages/licence.html) |
| `pgl` | Peter Lowe's list | Uso livre com atribuição, conforme termos em https://pgl.yoyo.org/adservers/ (conferir antes de publicar comercialmente) |
| `urlhaus-full` | Malicious URL Blocklist | CC0 / MIT (https://gitlab.com/malware-filter/urlhaus-filter) |
| `spa-1` | AdGuard Spanish/Portuguese (já existe no uBOL, liga sozinha com o navegador em português) | GPLv3 (https://github.com/AdguardTeam/AdguardFilters/blob/master/LICENSE) |
| demais regionais | ver `homeURL` em `platform/mv3/rulesets.json` | cada uma a sua; não alteradas |

## Listas avaliadas e NÃO usadas

| Lista | Motivo |
|---|---|
| glauberlima/procon-blocklist (MIT) | Mesma fonte do Procon, mas parou de atualizar em 31/10/2025 e tem entradas com espaço. Preferimos gerar direto do endpoint oficial. |
| ialexsilva/anti-clutter (GPLv3) | Sem commits desde 21/02/2024. |
| edgard/paywall-filters-br | Contorna paywall de jornais: risco jurídico e de política da Chrome Web Store. |
| eyeo ABP Anti-CV "portuguese.txt" (GPLv3) | Usa a sintaxe de snippets do Adblock Plus (`#$#`), que a uBOL não interpreta; quase nada viraria regra. |
| EasyList Brasil (CC BY-SA 4.0) | Última atualização em 04/09/2021. |
