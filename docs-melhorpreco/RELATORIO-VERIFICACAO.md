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

## Sem prova

- **Popup aberto pelo ícone da barra:** a automação não clica no ícone de extensão. O popup aberto como aba não tem site associado e não representa o uso real. A mudança nele é só o nome (vem das traduções).
- **Ícone na barra do Chrome** (16/32 px): gerado, mas não visto na barra.
- **Magalu e Shopee:** os dois barram navegador automatizado. Precisam de teste manual num Chrome normal.
- **Filtros cosméticos da `bra-0` em sites menores:** a rodada mediu rede; a remoção de elementos por CSS não foi medida site a site.
- **Chrome estável do usuário:** testado no Chrome for Testing 154 (mesmo motor). No Chrome estável a extensão descompactada é carregada pelo modo de desenvolvedor.
