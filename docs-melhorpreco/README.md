# Melhor Preço Bloqueador

Bloqueador de anúncios, rastreadores e sites perigosos para Google Chrome (Manifest V3), voltado ao usuário brasileiro.

É um **fork do uBlock Origin Lite (uBOL)** de Raymond Hill, distribuído sob a mesma licença **GPLv3** (`LICENSE.txt` na raiz). Não é um produto oficial do uBlock Origin. Produto separado do app Melhor Preço e da extensão do WhatsApp (`chrome-extension/` do app não foi tocada).

## Origem do fork

- Repositório de origem: https://github.com/gorhill/uBlock (remoto `upstream`), commit `6b217d11d682d96a38f2cdb18dff027e072049a4` (03/11/2026). A versão publicada de referência era 2026.1026.1812 (https://github.com/uBlockOrigin/uBOL-home); o uBOL não tem tag por versão no repositório de build, então partimos do topo do `master` daquele dia.
- Nosso trabalho fica na branch `melhorpreco`. O histórico completo do upstream foi mantido. Para trazer atualizações: `git fetch upstream && git merge upstream/master`.
- Não há remoto público nosso: publicar (GitHub ou Chrome Web Store) é decisão do dono.

## Arquitetura (igual ao uBOL)

- Bloqueio de rede 100% declarativo: `declarativeNetRequest` com rulesets estáticos gerados no build a partir das listas de filtros (`platform/mv3/make-rulesets.js` lê `platform/mv3/rulesets.json`).
- Filtros cosméticos (CSS) e scriptlets injetados pelo navegador via `scripting` / `userScripts`.
- Recursos neutros (noop.js etc.) em `web_accessible_resources`.
- Zapper e picker; sem processo permanente (só service worker).

## O que mudou em relação ao oficial

| Mudança | Arquivo |
|---|---|
| Nome "Melhor Preço Bloqueador" / "MP Bloqueador" em todos os idiomas, ícone próprio (sem o escudo do uBlock) | `platform/mv3/extension/_locales/*/messages.json`, `platform/mv3/extension/img/*` |
| Idioma padrão `pt_BR` (o uBOL já tinha tradução pt_BR completa: 116/116 mensagens) | `platform/mv3/chromium/manifest.json` |
| Autor e `short_name` do manifesto | `platform/mv3/chromium/manifest.json` |
| Aviso de fork e GPLv3 na aba "Sobre", créditos de Raymond Hill mantidos | `platform/mv3/extension/dashboard.html` |
| Nova lista **EasyList Portuguese** (`bra-0`), ligada por padrão para todos | `platform/mv3/rulesets.json` |
| Nova lista **Procon-SP "Evite esses Sites"** (`procon-sp`), opcional (desligada), gerada do endpoint oficial a cada build | `platform/mv3/rulesets.json`, `tools/make-procon-br.mjs` |
| Build roda no Git Bash do Windows (troca de `jq` por `node`) | `tools/make-mv3.sh` |
| Correção: o bloqueio estrito (página de aviso) da URLhaus e do Procon era descartado pelo teto de regex; listas de domínios agora têm prioridade | `platform/mv3/extension/js/ruleset-manager.js` |
| 9 listas no estilo Pi-hole (listas DNS), opcionais: HaGeZi PRO, ULTIMATE, Threat Intelligence, Fake, Pop-Up Ads e Gambling; OISD Big e NSFW; StevenBlack | `platform/mv3/rulesets.json` |
| **Modos de proteção** (Leve, Recomendado, Máximo, Família): um clique liga a combinação de listas; listas regionais e importadas são mantidas | `platform/mv3/extension/js/mp-presets.js`, `dashboard.html`, `css/mp.css` |
| Ícone novo da família Melhor Preço (gerado no GPT a partir de `PROMPT-ICONE-GPT.md`), com versões pausadas em cinza | `platform/mv3/extension/img/icon_*.png` |
| Abas Configurações e Listas de filtros redesenhadas (cartões, linhas com descrição, busca, grupos em cartões) e nomes das listas em português | `css/mp.css`, `rulesets.json` |
| Painel redesenhado: cabeçalho com marca e selo do modo atual, tema escuro azul-marinho, cartões de modo com ícones (Lucide, ISC) | `css/mp.css`, `dashboard.html` |
| **Estatísticas** estilo Pi-hole (aba própria): cartões com variação contra o período anterior e minigráfico de 14 dias, barras por hora/dia com pico e média, rosca por tipo, mapa de calor dia × hora (30 dias), resumo do período e rankings: bloqueios por hora/dia, domínios mais bloqueados, sites, tipos e páginas barradas. Usa a permissão **opcional** `webRequest`, pedida só quando o usuário ativa; dados só locais, por até 30 dias | `platform/mv3/extension/js/mp-stats*.js`, `chromium/manifest.json` |

Licenças de cada lista: [LICENCAS-LISTAS.md](LICENCAS-LISTAS.md). Orçamento de regras do Chrome: [ORCAMENTO-REGRAS.md](ORCAMENTO-REGRAS.md). Prova ao vivo: [RELATORIO-VERIFICACAO.md](RELATORIO-VERIFICACAO.md). Lacunas e melhorias: [PROPOSTAS.md](PROPOSTAS.md).

## Como compilar (Windows)

Requisitos: Git for Windows (Git Bash), Node.js 18+ (testado com 24), acesso à internet (as listas são baixadas no build).

```bash
cd melhorpreco-bloqueador
git submodule update --init platform/mv3/extension/lib/codemirror/codemirror-ubol platform/mv3/extension/lib/s14e-serializer
bash tools/make-mv3.sh chromium
```

Saída: `dist/build/uBOLite.chromium/` (o nome da pasta vem do script original). O log do build fica em `dist/build/uBOLite.chromium/log.txt`, com o número de regras de cada ruleset.

As listas baixadas ficam em cache em `dist/build/mv3-data/`. Para compilar com as listas mais novas, apague essa pasta antes (a do Procon é regenerada sempre).

## Como carregar no Chrome

1. Abra `chrome://extensions` e ligue o **Modo do desenvolvedor**.
2. **Carregar sem compactação** e escolha `dist/build/uBOLite.chromium`.
3. Para filtros cosméticos e scriptlets completos, nos detalhes da extensão ligue **Permitir scripts do usuário** (exigência do Chrome para a API `userScripts`).
4. Modo de proteção: painel → **Listas de filtros** → escolha Leve, Recomendado, Máximo ou Família.
5. Estatísticas: painel → **Estatísticas** → **Ativar estatísticas** e aceite o pedido de permissão do Chrome.

## Os modos de proteção

| Modo | Listas ligadas | Regras (Chrome) | Para quem |
|---|---|---|---|
| Leve (padrão) | uBlock filters, EasyList, EasyPrivacy, Peter Lowe, Badware, URLhaus, EasyList Portuguese | 20.289 | Quem não quer nenhuma surpresa |
| Recomendado | Leve + HaGeZi PRO, Threat Intelligence, Fake, Pop-Up Ads | 20.293 (798 mil filtros) | A maioria: mais proteção contra golpe e malware sem quebrar site nos testes |
| Máximo | Leve + HaGeZi ULTIMATE, OISD Big, StevenBlack, Threat Intelligence, Fake, Pop-Up Ads, proteção de URL, todas as listas de incômodos (cookies, sobreposições, redes sociais, widgets, notificações, IA) e Procon-SP | 26.039 (1,15 milhão de filtros) | Quem quer o máximo e aceita liberar um site de vez em quando |
| Família | Recomendado + HaGeZi Gambling (apostas), OISD NSFW (adulto) e Procon-SP | 20.294 | Computador de casa, crianças |

O idioma do navegador continua ligando sozinho a lista regional (ex.: AdGuard Spanish/Portuguese), em qualquer modo. Mudar uma lista à mão mostra "Personalizado".
