# Orçamento de regras do Chrome (declarativeNetRequest)

Fonte: documentação oficial, conferida em 03/11/2026:
- https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest
- https://developer.chrome.com/docs/extensions/develop/concepts/content-filtering

| Limite | Valor |
|---|---|
| Regras estáticas garantidas por extensão (`GUARANTEED_MINIMUM_STATIC_RULES`) | 30.000 |
| Reserva global compartilhada entre todas as extensões instaladas | 300.000 (o que passa dos 30.000 de cada extensão sai daqui; consultar com `getAvailableStaticRuleCount()`) |
| Rulesets estáticos declarados (`MAX_NUMBER_OF_STATIC_RULESETS`) | 100 |
| Rulesets estáticos ligados ao mesmo tempo (`MAX_NUMBER_OF_ENABLED_STATIC_RULESETS`) | 50 |
| Regras regex (`MAX_NUMBER_OF_REGEX_RULES`) | 1.000 |
| Regras dinâmicas (`MAX_NUMBER_OF_DYNAMIC_RULES`) | 30.000 (até 5.000 "inseguras") |
| Regras de sessão (`MAX_NUMBER_OF_SESSION_RULES`) | 5.000 |
| Regras estáticas desativadas individualmente (`updateStaticRules`) | 5.000 |

## O que isso significa para nós

- Medido no build: com a configuração padrão de um usuário brasileiro (6 rulesets do uBOL + `bra-0` + `spa-1`) e o Procon ligado, o painel mostra **20.290 regras**. Fica abaixo das 30.000 garantidas, então não dependemos da reserva global, mesmo com outro bloqueador instalado. A uBOL compacta listas de domínios: a lista inteira do Peter Lowe vira 1 regra com milhares de domínios.
- A EasyList Portuguese acrescenta 245 regras e o Procon-SP 1. Folga para ligar mais listas: cerca de 9.700 regras dentro do garantido.
- **Teto que importa de verdade: regex.** As regras de bloqueio estrito (página de aviso) são regras de sessão com regex e disputam o limite de 1.000 (a uBOL usa até 950). A uBOL oficial estoura esse teto com o `ublock-badware` e descarta as listas seguintes. No fork, as listas de domínios passaram a ter prioridade (ver RELATORIO-VERIFICACAO.md, item 4).
- Somos 58 rulesets declarados (o uBOL tem 56 + nossos 2); continuamos abaixo de 100. Ligados por padrão: 7 (6 do uBOL + `bra-0`), mais `spa-1` quando o navegador está em português.

## Contagem por ruleset (build 2026.1103.1545, regras DNR)

| Ruleset | Padrão | Regras | Regex | Bloqueio estrito |
|---|---|---|---|---|
| ublock-filters | ligado | 5.820 | 210 | 50 |
| easylist | ligado | 3.736 | 18 | 21 |
| easyprivacy | ligado | 9.087 | 7 | 1 |
| pgl | ligado | 1 (lista de domínios) | 0 | 1 |
| ublock-badware | ligado | 455 | 22 | 1.055 |
| urlhaus-full | ligado | 1 (lista de domínios) | 0 | 1 |
| bra-0 (novo) | ligado | 245 | 3 | 1 |
| spa-1 | ligado se o navegador estiver em português | 944 | 7 | 2 |
| procon-sp (novo) | desligado | 1 (lista de domínios) | 0 | 1 |
