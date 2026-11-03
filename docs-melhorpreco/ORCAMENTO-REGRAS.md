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

- O uBOL oficial, só com os rulesets padrão, já passa dos 30.000 garantidos e usa parte da reserva global. Se o usuário tiver outro bloqueador grande instalado, a reserva global pode acabar e alguns rulesets não ligam. O painel do uBOL avisa quando isso acontece.
- A EasyList Portuguese é pequena (~1.700 linhas no arquivo, das quais só parte vira regra de rede) e o Procon-SP tem 81 domínios: o acréscimo é pequeno.
- Somos 58 rulesets declarados (o uBOL tem 56 + nossos 2); continuamos abaixo de 100. Ligados por padrão: 7 (6 do uBOL + `bra-0`), mais `spa-1` quando o navegador está em português.

## Contagem por ruleset

PENDENTE: sai do `log.txt` do build. Ver [RELATORIO-VERIFICACAO.md](RELATORIO-VERIFICACAO.md).
