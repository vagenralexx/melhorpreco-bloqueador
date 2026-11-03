# Lacunas encontradas e melhorias propostas

Fontes: código e testes desta sessão (RELATORIO-VERIFICACAO.md) e a pesquisa do GPT do dono (arquivo local). Cada item diz o que já está provado e o que é sugestão.

## Decisões do dono antes de publicar

1. **Canal de relato próprio.** O botão "Relatar problema" (`platform/mv3/extension/js/report.js`) e o texto de ajuda abrem issue no GitHub do uAssets (uBlock oficial). Num fork, esses relatos não são deles. Precisamos de um destino nosso (repositório público ou formulário) antes de distribuir.
2. **Links da aba Sobre** (Política de privacidade, Documentação, Notas de lançamento) ainda levam às páginas do uBOL. Precisam de páginas nossas: a política de privacidade é exigida pela Chrome Web Store.
3. **Procon-SP por padrão?** Hoje está desligado. Os testes mostraram domínios da lista que já viraram outra coisa (domínio à venda, redirecionamento para site de novelas). Não há licença explícita dos dados.
4. **Repositório público e Chrome Web Store:** a GPLv3 exige oferecer o código-fonte de cada versão distribuída.
5. **Tamanho do pacote com as listas DNS:** 38 MB em zip, contra 9 MB sem elas; as listas de apostas e adulto respondem por mais da metade. **Decisão do dono (03/11/2026): manter tudo embutido.** As alternativas descartadas foram publicar duas versões ou usar assinatura remota.
6. **Permissão `webRequest` das estatísticas:** é opcional (só pedida quando o usuário ativa), mas aparece na revisão da Chrome Web Store e precisa estar na política de privacidade ("dados só locais").
7. **Mensagem de vitrine:** com a extensão, KaBuM! e Americanas perdem os carrosséis "Recomendados para você" da Insider (rastreador bloqueado pelas listas originais). Decidir se liberamos a Insider por padrão (perde privacidade) ou explicamos no popup/FAQ.

## Melhorias propostas (ordem sugerida)

| # | Melhoria | Impacto | Esforço | Base |
|---|---|---|---|---|
| 1 | Nomes das listas em português no painel ("Ads, trackers, and more" etc. aparecem em inglês, porque vêm do `rulesets.json`) | Médio | Baixo | Visto no painel |
| 2 | Lista própria "MP Brasil" com os rastreadores e anúncios BR que as listas grandes não pegam, mantida a partir de relatos dos usuários | Alto | Médio, contínuo | A `bra-0` bateu só 3 regras de rede nos 12 portais; os grandes já são cobertos pela EasyPrivacy |
| 3 | Lista de golpes brasileiros (Pix, boleto falso, lojas falsas, phishing de bancos) com página de aviso. O mecanismo de bloqueio estrito já foi provado com o Procon | Alto | Médio | Pesquisa do GPT; falta achar fonte ativa e licenciada |
| 4 | Enviar a correção do teto de regex do bloqueio estrito para a uBOL oficial (beneficia todos e diminui a diferença do fork) | Médio | Baixo | Bug provado (item 4 do relatório) |
| 5 | Automatizar a geração de versões (build agendado com listas novas e versão nova). No MV3, regras estáticas novas só chegam por atualização da extensão | Médio | Médio | Limite do MV3 |
| 6 | Exportar diagnóstico em português (a aba Sobre já tem "Informações para solução de problemas") | Baixo | Baixo | Pesquisa do GPT |
| 7 | ~~Modo família~~ **Feito** (modos de proteção, com apostas e adulto) | — | — | Seção 6 do relatório |
| 8 | Estatísticas por lista ("qual lista bloqueou"): o Chrome só informa isso com a permissão `declarativeNetRequestFeedback`; avaliar o custo na loja | Médio | Médio | Estatísticas atuais mostram domínio, site e tipo |
| 9 | Contador de bloqueios no popup ligado às estatísticas ("hoje: N bloqueios"), com link para a aba | Médio | Baixo | Estatísticas prontas |
| 10 | Exportar estatísticas em CSV (como o Pi-hole) | Baixo | Baixo | — |
