# Relatório de verificação (03/11/2026)

Ambiente: Windows 11, Chrome for Testing 154.0.8037.57 (aceita `--load-extension`), perfil novo a cada rodada, idioma pt-BR, janela 1366x900. Automação: Playwright (scripts de teste fora do repositório). Build `2026.1103.1545`. As capturas estão em `verificacao/`.

## 1. Build

- `bash tools/make-mv3.sh chromium` no Git Bash: **passou**. São 58 rulesets e a versão é gerada pela data.
- `bra-0` (EasyList Portuguese): 335 filtros de entrada, 334 aceitos, 245 regras de rede e 143 seletores CSS.
- `procon-sp`: 81 domínios, que viram 1 regra de bloqueio de rede e 1 regra de bloqueio estrito (página de aviso).

## 2. Rulesets ligados numa instalação nova (Chrome em pt-BR)

`ublock-filters, easylist, easyprivacy, pgl, ublock-badware, urlhaus-full, bra-0, spa-1`. A `spa-1` (AdGuard Spanish/Portuguese) entrou sozinha por causa do idioma. O painel mostra "20.290 regras, convertidas de 137.089 filtros de rede" (já com o Procon ligado).

## 3. Sites brasileiros: sem extensão × com extensão

Uma rodada em cada modo, página inicial, rolagem de 2.500 px e 6 s de espera. "Bloqueadas" conta as requisições com `ERR_BLOCKED_BY_CLIENT`.

| Site | Requisições sem → com | Bloqueadas (principais hosts) | Texto na página sem → com | Quebrou? |
|---|---|---|---|---|
| g1.globo.com | 626 → 193 | 42 (horizon-track.globo.com, trackid.globoid.globo.com) | 5.368 → 5.417 | Não |
| uol.com.br | 620 → 165 | 15 (tm.jsuol.com.br, me.jsuol.com.br) | 12.508 → 10.571 | Não (blocos de anúncio/vídeo a menos) |
| terra.com.br | 3.952 → 254 | 10 (trrsf, tailtarget) | 8.478 → 8.123 | Não |
| folha.uol.com.br | 248 → 82 | 4 (tm.jsuol.com.br) | 29.839 → 30.396 | Não |
| estadao.com.br | 365 → 241 | 79 (adnxs, rubicon, pubmatic) | 13.161 → 12.442 | Não |
| metropoles.com | 587 → 127 | 4 (membrana, taboola) | 13.765 → 13.430 | Não |
| tecmundo.com.br | 251 → 188 | 61 (adnxs, rubicon, casalemedia) | 8.388 → 8.248 | Não |
| mercadolivre.com.br | 319 → 233 | 43 (mercadoclics = produtos patrocinados, melidata, hotjar) | varia (ver abaixo) | Não |
| americanas.com.br | 485 → 220 | 2 (api.useinsider.com, activity-flow.vtex.com) | 10.657 → 6.150 | Parcial, esperado (ver abaixo) |
| casasbahia.com.br | 252 → 263 | 67 (patrocinados, techlab-cdn) | 21.797 → 21.878 | Não. Com a extensão as fotos carregaram e o item "Patrocinado" sumiu |
| magazineluiza.com.br | — | 0 | 176 → 176 | Sem conclusão: o Magalu barra o navegador automatizado nos dois modos (página anti-robô / HTTP 403) |
| shopee.com.br | 199 → 220 | 31 (ubta.tracking.shopee.com.br) | 438 → 438 | Sem conclusão: a Shopee mostra só a tela de login para navegador automatizado nos dois modos |

Detalhes:
- **Mercado Livre:** repeti 2 vezes em cada modo, mais uma página de busca. O tamanho da página oscila **também sem a extensão** (4.908 a 25.870 caracteres), porque às vezes o ML serve a tela anti-robô. Nas rodadas com a página completa não houve diferença de conteúdo além dos patrocinados.
- **Americanas:** diferença consistente nas 3 rodadas (cerca de 57 preços na home com a extensão, contra cerca de 105 sem ela). A causa é o bloqueio de `americanas.api.useinsider.com`. A Insider é um motor de personalização e rastreamento, e é bloqueada pelas listas **originais** (EasyPrivacy e uBlock filters), não pelas nossas. Somem o pop-up "oferta do dia" e os carrosséis "recomendados para você"; busca, ofertas e navegação continuam funcionando. É o comportamento da uBOL oficial; o usuário pode liberar o site pelo popup.
- **Contribuição da lista BR:** na rodada dos 12 sites, as regras de rede que bateram foram `easyprivacy` 197, `pgl` 149, `ublock-filters` 58, `easylist` 13, `spa-1` 9 e `bra-0` 3. O ganho da EasyList Portuguese nesses portais grandes é pequeno na rede. O forte dela são os 143 seletores cosméticos e sites menores de notícia e streaming.

## 4. Lista do Procon-SP e bloqueio estrito

- Ligada pelo painel (Listas de filtros → Proteção contra malware): `123importados.com` e `laserfast.com` abrem a página "O MP Bloqueador impediu o carregamento da seguinte página… *Procon-SP: Evite esses sites (lojas com reclamações)*", com Voltar e Prosseguir. Captura: `verificacao/ui/strict-123importados.com.png`.
- **Bug encontrado e corrigido (vem da uBOL oficial):** as regras de bloqueio estrito são regras de sessão com regex, e a uBOL limita o total a 95% de `MAX_NUMBER_OF_REGEX_RULES` (950). Os rulesets entram em ordem, e o `ublock-badware` sozinho tem mais de 1.000 regras regex de padrão. Com isso, os rulesets seguintes (`urlhaus-full` e o nosso `procon-sp`) eram **descartados em silêncio**. Na uBOL oficial isso quer dizer que a página de aviso da URLhaus nunca aparece no Chrome. Correção em `platform/mv3/extension/js/ruleset-manager.js` (`updateStrictBlockRules`): as regras que são listas de domínios (uma regra cobre milhares de sites) entram antes das regras de padrão. Prova: depois da correção, `0rder-ver1f2345.com` (URLhaus) e os domínios do Procon mostram a página de aviso; antes, abriam normalmente.
- Os domínios "no ar" segundo o Procon já não são lojas: um não existe mais no DNS, um virou domínio à venda e outro redireciona para um site de novelas. Isso confirma o risco de dado desatualizado e é mais um motivo para a lista ficar opcional.

## 5. Interface

- Painel (Configurações, Listas de filtros, Sobre) conferido em 1024x768, claro e escuro, sem rolagem horizontal. Nome "Melhor Preço Bloqueador", ícone novo, aviso de fork e créditos do Raymond Hill na aba Sobre.
- Corrigido durante a conferência: a frase do fork na aba Sobre quebrava em colunas (faltava um `<span>`). Também tirei a bandeira 🇧🇷 do nome da lista do Procon, porque o Windows a mostra como "BR" na página de aviso.

## 6. Modos de proteção (build 2026.1103.1612)

Cada modo foi aplicado **pelo botão do painel**, e depois rodou a navegação em 12 sites (a lista anterior com KaBuM! e Zoom no lugar de Magalu e Shopee), a 1024x768. Capturas em `verificacao/presets/`.

| Modo | Aplicação | Regras | Resultado nos 12 sites |
|---|---|---|---|
| Leve | estado inicial, reconhecido como "Leve" | 20.289 | igual à seção 3 |
| Recomendado | 2,9 s | 20.293 | nenhuma quebra; bloqueios quase iguais ao Leve (nesses sites grandes a EasyPrivacy já pega quase tudo) |
| Máximo | 3,5 s | 26.039 | nenhuma quebra; Terra caiu de 210 para 87 requisições; some o aviso de cookies |
| Família | — | 20.294 | bet365 e Blaze → aviso "HaGeZi Gambling"; dois sites adultos → aviso "OISD NSFW"; loja do Procon → aviso do Procon; g1 e Google abrem normalmente |

- **KaBuM!:** com a extensão (já no modo Leve) aparecem 143 preços na home, contra 204 sem ela, nas duas repetições na mesma largura. Somem "Recomendados para você" (2x) e "Produtos em oferta", que vêm da Insider (`kabum.api.useinsider.com`), além do aviso de cookies. Quem bloqueia é a EasyPrivacy/uBlock filters (listas originais), não as listas novas. Mesmo caso da Americanas.
- **Zoom (comparador de preços):** 50 preços na listagem de celulares com e sem a extensão. O domínio `s.zst.com.br` aparece entre os mais bloqueados, mas a página não perde conteúdo.
- Bugs achados e corrigidos durante o teste: (1) os botões dos modos não respondiam ao clique no texto, porque o `dom.on` da uBOL só dispara quando o alvo é o próprio botão; (2) o modo Leve nunca era reconhecido, porque a `bra-0` está no grupo de regiões; (3) com a aba nova, "Sobre" quebrava para uma segunda linha; (4) o quarto cartão de número ficava sozinho na linha.

## 7. Estatísticas

- Testadas numa cópia do build com a permissão `webRequest` já concedida (`dist/build/test-stats`), porque a automação não consegue clicar no pedido de permissão do Chrome.
- Depois dos 12 sites, o painel mostrou 492 requisições bloqueadas, contra 464 contadas pela automação (a diferença são requisições de quadros internos que a automação não vê). Mostrou também 98 domínios, 16 sites e a distribuição por tipo (Requisição de dados 270, Script 109, Imagem 92…).
- Páginas barradas com aviso são contadas à parte (o teste do modo Família gera essas entradas).
- Telas conferidas: claro e escuro a 1024x768 (gráfico com dica ao passar o mouse e ao focar pelo teclado, tabela opcional, rankings) e 600 px de largura (medido: nenhum elemento passa da área visível).

## 8. Ícone, redesenho do painel e WhatsApp Web (03/11/2026, tarde)

- **Ícone:** convertido de `D:\Smart Print\Downloads\596adcbd-….png` (1254 px). Os pontinhos soltos na borda foram limpos com máscara circular. Gerados 16/32/64/128/512 e as versões pausadas `_off`, conferidos em fundo claro e escuro; o símbolo de proibido continua legível em 16 px.
- **Painel:** redesenhado com as diretrizes do MCP (`get_design_guidance`), a skill ui-ux-pro-max e as regras de visualização de dados. Paleta da rosca validada pelo script (no escuro passa em tudo; no claro, 3 cores com contraste abaixo de 3:1 são compensadas pela legenda com números e %). Barras: azul primário, pico em âmbar com rótulo escrito. Mapa de calor: um só tom de azul. Branco sobre o azul do seletor de período: 4,6:1.
- Conferido com 30 dias de dados simulados: 1280, 1024 e 600 px, claro e escuro. Nenhum elemento passa da área visível e não há erro no console. Capturas em `verificacao/redesenho/`.
- Defeitos achados e corrigidos na conferência: a seção sumia (regra de exibição perdida no CSS novo); o nome da marca ficava sobreposto à primeira aba; o cartão "Ativar" aparecia com a permissão já dada (`display:flex` anulava `hidden`); os títulos dos cartões herdavam o estilo fixo do `<header>` da uBOL; "Modo : Leve" com espaço; conteúdo encostado na borda a 1024 px; descrições desalinhadas nos cartões de modo; rótulo de 3 linhas.
- **Botão "Ativar estatísticas" no Chrome normal:** confirmado pelo dono (captura com 135 bloqueios).
- **WhatsApp Web no modo Máximo:** na tela de login, Leve e Máximo bloqueiam a mesma única requisição, `web.whatsapp.com/ajax/bz` (telemetria; regra `/ajax/bz?_` da EasyPrivacy). O QR code aparece nos dois. Os 65 bloqueios da sessão logada do dono devem ser essa telemetria repetida, mais `dit.whatsapp.net` e `crashlogs.whatsapp.net`. A sessão logada não foi aberta aqui (exige login): se algo do WhatsApp falhar, a confirmação é manual.

## 9. Configurações e Listas de filtros (03/11/2026, noite)

- Redesenhadas só com CSS e dados, sem mudar a lógica da uBOL. Configurações: cada seção num cartão; modos de filtragem com destaque azul no escolhido (empilham abaixo de 640 px); comportamentos como linhas com título e explicação; botões de backup no padrão novo. Listas: total de regras em faixa de destaque, busca maior, cada grupo num cartão com a contagem em pílula, linhas com hover, e as listas ligadas em negrito.
- 14 nomes de listas traduzidos, mantendo o nome próprio (ex.: "Peter Lowe – Anúncios, rastreadores e mais", "EasyList/uBO – Avisos de cookies").
- **Bug achado e corrigido:** as listas de apostas e adulto não apareciam na aba de listas (só o modo Família as ligava). Na uBOL, o grupo "Outras" reúne as listas *sem* grupo, e eu tinha posto . Agora aparecem em "Outras" e a busca por "apostas" as encontra. O modo Família continua reconhecido e bloqueando (bet365, Blaze, sites adultos).
- Conferido em 1280, 1024 e 600 px, claro e escuro, sem nada passando da área visível e sem erro no console. Interação testada: trocar o modo de filtragem e voltar, ligar e desligar uma opção, buscar listas. Capturas em .

## Sem prova
- ~~Botão "Ativar estatísticas" no Chrome normal~~: confirmado pelo dono (seção 8).

- **Popup aberto pelo ícone da barra:** a automação não clica no ícone de extensão. O popup aberto como aba não tem site associado e não representa o uso real. A mudança nele é só o nome (vem das traduções).
- **Ícone na barra do Chrome** (16/32 px): gerado, mas não visto na barra.
- **Magalu e Shopee:** os dois barram navegador automatizado. Precisam de teste manual num Chrome normal.
- **Filtros cosméticos da `bra-0` em sites menores:** a rodada mediu rede; a remoção de elementos por CSS não foi medida site a site.
- **Chrome estável do usuário:** testado no Chrome for Testing 154 (mesmo motor). No Chrome estável a extensão descompactada é carregada pelo modo de desenvolvedor.
