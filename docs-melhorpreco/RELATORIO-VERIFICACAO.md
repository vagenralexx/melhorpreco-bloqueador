# Relatório de verificação (03/11/2026)

## Provado

- Código de origem clonado com histórico completo (`upstream` = gorhill/uBlock) e arquitetura conferida no código: `tools/make-mv3.sh`, `platform/mv3/make-rulesets.js`, `platform/mv3/rulesets.json`, `platform/mv3/chromium/manifest.json` (declarativeNetRequest, scripting, userScripts, offscreen, alarms; sem background persistente).
- Rulesets ligados por padrão no oficial: ublock-filters, easylist, easyprivacy, pgl, ublock-badware, urlhaus-full (confere com o pedido).
- **Correção da premissa:** o uBOL já tem a lista AdGuard Spanish/Portuguese (`spa-1`, `lang` inclui `pt`). `getDefaultRulesetsFromEnv()` em `platform/mv3/extension/js/ruleset-manager.js` liga essa lista sozinha quando o idioma do navegador é português. O que falta é uma lista dedicada ao Brasil: a EasyList Portuguese (ativa, atualizada em 03/11/2026) não está no uBOL.
- **Correção da premissa:** a interface já tem tradução pt_BR completa (116 de 116 mensagens). Só sobravam o nome da marca e "Backup".
- Gerador do Procon-SP rodou contra o endpoint oficial: 83 registros, 81 domínios válidos após normalizar (lista atualizada pelo Procon em 12/05/2026).
- Limites do Chrome conferidos na documentação oficial (ver ORCAMENTO-REGRAS.md).

## Sem prova (ainda)

- **Build completo** (`bash tools/make-mv3.sh chromium`): bloqueado nesta sessão pelo controle de permissões do Claude Code, que não deixou executar o código baixado do repositório de origem. Falta rodar com a liberação do dono.
- Contagem de regras por ruleset (sai do `log.txt` do build).
- Carregar a extensão descompactada no Chrome e testar sites brasileiros (g1, UOL, Terra, Folha, Metrópoles, Mercado Livre, Magazine Luiza, Americanas, Casas Bahia, Shopee): medir o que foi bloqueado (contador do ícone + `declarativeNetRequestFeedback`, que o build local liga) e se algo quebrou.
- Aparência dos ícones novos no Chrome (gerados, não vistos na barra).
