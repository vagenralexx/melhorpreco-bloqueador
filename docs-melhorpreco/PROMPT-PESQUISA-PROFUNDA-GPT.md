# Prompt de pesquisa profunda (ChatGPT Deep Research)

Cole o texto abaixo no ChatGPT com o modo "Deep Research" ligado.

---

Você é um pesquisador técnico. Faça uma pesquisa profunda e devolva um relatório em português do Brasil, com links para TODAS as fontes citadas (link direto para a página, arquivo, issue, commit ou documentação, não só para a página inicial). Quando uma afirmação não tiver fonte, marque como "sem fonte".

## Contexto do projeto

Estamos criando o **Melhor Preço Bloqueador**, um bloqueador de anúncios e rastreadores para Google Chrome (Manifest V3), como **fork de código aberto (GPLv3) do uBlock Origin Lite (uBOL)** de Raymond Hill.

- Código de origem: https://github.com/gorhill/uBlock (pasta `platform/mv3`, script `tools/make-mv3.sh`, gerador `platform/mv3/make-rulesets.js`, lista de rulesets `platform/mv3/rulesets.json`) e o pacote pronto em https://github.com/uBlockOrigin/uBOL-home (pasta `chromium/`). Versão de referência: 2026.1026.1812; nosso fork parte do commit de 03/11/2026.
- Arquitetura do uBOL: 100% declarativa. Usa `declarativeNetRequest` com rulesets estáticos compilados a partir de listas de filtros (ligados por padrão: ublock-filters, easylist, easyprivacy, pgl, ublock-badware, urlhaus-full). Filtros cosméticos (CSS) e scriptlets são injetados pelo navegador via `scripting`/`userScripts`. Recursos neutros (noop.js etc.) em `web_accessible_resources`. Tem zapper (apagar elemento) e picker (criar filtro). Não tem processo permanente (service worker).
- O que já descobrimos:
  - O uBOL já tem tradução completa da interface em pt_BR (via Crowdin).
  - O uBOL já tem a lista "AdGuard Spanish/Portuguese" (`spa-1`), que é ligada automaticamente quando o idioma do navegador é português. Não existe ruleset dedicado ao Brasil.
  - A **EasyList Portuguese** (https://easylist-downloads.adblockplus.org/easylistportuguese.txt) está ativa (atualizada em 03/11/2026, ~1.700 linhas, licença GPLv3 ou CC BY-SA 3.0) e NÃO está no uBOL. Vamos incluí-la ligada por padrão.
  - A Fundação Procon-SP publica a lista "Evite esses Sites" (lojas virtuais com reclamações não resolvidas; ~83 domínios) por um endpoint público. Vamos gerar um ruleset opcional a partir dela, desligado por padrão. O projeto comunitário https://github.com/glauberlima/procon-blocklist (MIT) parou de atualizar em out/2025.
  - Listas avaliadas e não usadas: ialexsilva/anti-clutter (parada desde 02/2024); edgard/paywall-filters-br (contorno de paywall, risco jurídico).
- Restrições: não alterar a marca uBlock (nome e ícone próprios), manter GPLv3 e os créditos do autor original, respeitar a licença de cada lista, e caber no orçamento de regras estáticas do Chrome.

## O que pesquisar

1. **Listas de filtros brasileiras e em português** ativas em 2025-2026 (anúncios, rastreadores, golpes, phishing, malware, pop-ups de cookies/LGPD, notificações push, anti-adblock em sites BR). Para cada uma: URL do arquivo bruto, mantenedor, data do último commit/atualização, número de regras, licença exata (com link para o arquivo de licença) e se a sintaxe é compatível com uBlock Origin / declarativeNetRequest. Inclua fontes como FilterLists.com, AdGuard (filtro 9 e outros), EasyList, listas de phishing/golpes brasileiras (ex.: bancos, Pix, boletos falsos, lojas falsas), e bases públicas de órgãos brasileiros (Procon, Febraban, CERT.br, Senacon/consumidor.gov.br, Anatel).
2. **Domínios de anúncio e rastreamento comuns em sites brasileiros** (portais de notícia como g1, UOL, Terra, Folha, Estadão, Metrópoles; e-commerce como Mercado Livre, Magazine Luiza, Americanas, Casas Bahia, Shopee, Amazon.com.br; afiliados, cashback, pixels de mídia programática nacionais). Quais redes e SSPs brasileiras ainda não estão na EasyList/EasyPrivacy? Cite estudos, relatórios ou repositórios que mediram isso.
3. **Limites do Chrome para extensões MV3 com declarativeNetRequest** na versão atual do Chrome: regras estáticas garantidas por extensão (GUARANTEED_MINIMUM_STATIC_RULES), limite global compartilhado, máximo de rulesets estáticos habilitados ao mesmo tempo, limite de regras regex, regras dinâmicas e de sessão, e mudanças recentes ou anunciadas. Links para a documentação oficial do Chrome e para o código-fonte do Chromium.
4. **Melhorias que outros forks e bloqueadores MV3 fizeram** sobre o uBOL ou concorrentes (AdGuard MV3, Ghostery, Brave, uBlock Origin Lite em Safari/Firefox): funcionalidades úteis para o usuário leigo brasileiro, como aviso de site golpista, relatório em português, atualização de listas sem publicar nova versão (o que o MV3 permite e o que não permite), exportação de diagnóstico, modo infantil.
5. **Riscos legais e de loja**: regras da Chrome Web Store para bloqueadores (finalidade única, permissões `<all_urls>` e `userScripts`, política de dados), obrigações da GPLv3 para um fork distribuído (código-fonte, avisos, mudança de marca), uso de marcas de terceiros, LGPD, e se bloquear lojas apontadas pelo Procon pode gerar problema jurídico (falso positivo, empresa que regularizou).
6. **Como testar de forma reproduzível** a eficácia de um bloqueador em sites brasileiros (ferramentas, métricas, sites de teste como d3ward/toolz, adblock-tester, e como medir quebras de página).

## Formato do resultado

- Resumo executivo em até 10 linhas.
- Tabela de listas recomendadas: nome, URL, licença (com link), última atualização, nº de regras, recomendação (ligar por padrão / opcional / não usar) e motivo.
- Lista priorizada de melhorias sugeridas para o Melhor Preço Bloqueador (alto / médio / baixo impacto), cada uma com esforço estimado e link de evidência.
- Seção "Riscos e pontos em aberto".
- Lista final de todas as fontes com links.
