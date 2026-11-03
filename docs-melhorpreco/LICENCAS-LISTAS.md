# Licenças das listas de filtros

Todas as listas são baixadas e compiladas **no momento do build** (`tools/make-mv3.sh`) e embutidas no pacote como rulesets do `declarativeNetRequest`. Cada linha abaixo diz se a lista pode ser redistribuída dentro de um pacote GPLv3.

Conferido em 03/11/2026.

## Listas acrescentadas pelo Melhor Preço Bloqueador

| Ruleset | Lista | Fonte | Licença | Pode embutir? | Padrão |
|---|---|---|---|---|---|
| `bra-0` | EasyList Portuguese | https://easylist-downloads.adblockplus.org/easylistportuguese.txt | GPLv3 (ou posterior) **ou** CC BY-SA 3.0, à escolha (https://easylist.to/pages/licence.html). Atribuição: "The EasyList authors (https://easylist.to/)" | Sim (usamos a opção GPLv3) | Ligado |
| `procon-sp` | Procon-SP "Evite esses Sites" | https://sistemas.procon.sp.gov.br/evitesite/list/evitesites.php (gerada por `tools/make-procon-br.mjs`) | Dado público de órgão do governo de SP. **Sem licença explícita publicada.** | Provável, mas **não confirmado**: decisão do dono antes de publicar | Desligado |

## Listas no estilo Pi-hole (listas DNS), todas opcionais

Conferido em 03/11/2026 pela API do GitHub (licença do repositório e último push) e pelo cabeçalho de cada arquivo. Todas no formato AdBlock (`||dominio^`), exceto a StevenBlack (formato hosts); o gerador da uBOL lê os dois. Cada lista vira **uma** regra do Chrome com todos os domínios.

| Ruleset | Lista | Fonte | Licença | Atualização | Domínios |
|---|---|---|---|---|---|
| `hagezi-pro` | HaGeZi Multi PRO | https://raw.githubusercontent.com/hagezi/dns-blocklists/main/adblock/pro.txt | GPLv3 (https://github.com/hagezi/dns-blocklists/blob/main/LICENSE) | diária (03/11/2026) | ~248 mil |
| `hagezi-ultimate` | HaGeZi Multi ULTIMATE | …/adblock/ultimate.txt | GPLv3 | diária | ~287 mil |
| `hagezi-tif` | HaGeZi Threat Intelligence Feeds (medium) | …/adblock/tif.medium.txt | GPLv3 | diária | ~319 mil |
| `hagezi-fake` | HaGeZi Fake (golpes, lojas falsas) | …/adblock/fake.txt | GPLv3 | diária | ~17,5 mil |
| `hagezi-popupads` | HaGeZi Pop-Up Ads | …/adblock/popupads.txt | GPLv3 | diária | ~78 mil |
| `hagezi-gambling` | HaGeZi Gambling (apostas) | …/adblock/gambling.txt | GPLv3 | diária | ~626 mil |
| `oisd-big` | OISD big | https://big.oisd.nl/ | GPLv3 (https://github.com/sjhgvr/oisd/blob/main/LICENSE) | diária | ~232 mil |
| `oisd-nsfw` | OISD nsfw (adulto) | https://nsfw.oisd.nl/ | GPLv3 | diária | ~486 mil |
| `stevenblack` | StevenBlack Unified Hosts | https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts | MIT (https://github.com/StevenBlack/hosts/blob/master/license.txt) | 01/11/2026 | ~78 mil |

Atenção: HaGeZi, OISD e StevenBlack **agregam** outras listas. Os mantenedores publicam sob as licenças acima, mas antes de publicar na loja vale ler a seção de fontes de cada repositório e conferir se alguma fonte agregada tem restrição de uso comercial.

### Avaliadas e não embutidas
| Lista | Motivo |
|---|---|
| AdGuard DNS filter (GPLv3, ativa) | Sobrepõe-se quase toda à EasyList/EasyPrivacy + HaGeZi. |
| 1Hosts Lite (MPL-2.0) | Última atualização em 03/09/2026 e sobreposição com HaGeZi. |
| The Block List Project | Repositório arquivado. |
| lightswitch05/hosts, notracking/hosts-blocklists, FadeMind/hosts.extras | Repositórios arquivados. |
| HaGeZi Light / Normal / Pro++ | Níveis intermediários do mesmo autor; PRO e ULTIMATE cobrem os dois extremos sem duplicar o pacote. |
| Perflyst (Smart TV), WindowsSpyBlocker | Bloqueiam telemetria de TV/Windows, que não passa pelo navegador. |

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

## Outros componentes de terceiros acrescentados

| Componente | Licença | Onde |
|---|---|---|
| Ícones Lucide (feather, shield-check, zap, users, ban, globe, monitor, octagon-alert, trash-2, power) | ISC (https://github.com/lucide-icons/lucide/blob/main/LICENSE) | SVG embutido em `dashboard.html`; crédito na aba Sobre |
