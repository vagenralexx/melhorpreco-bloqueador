# Chrome Web Store: o que preencher

Pacote: `dist/build/MPBloqueador_<versão>.chromium.zip` (gerado por `bash tools/make-mv3.sh chromium <versão>`). Imagens em `store/`.

## Aba "Detalhes do item"

**Nome:** Melhor Preço Bloqueador (vem do pacote)

**Resumo (vem do pacote, até 132 caracteres):** usa o `extShortDesc` de cada idioma.

**Descrição (cole):**

```
Bloqueie anúncios, rastreadores e sites perigosos no Chrome, com listas pensadas para o Brasil.

O MP Bloqueador é leve: o bloqueio é feito pelo próprio Chrome, sem processo rodando o tempo todo e sem deixar as páginas lentas.

O que ele faz
• Bloqueia anúncios e rastreadores em portais, lojas e redes de anúncio, com a EasyList Portuguese ligada por padrão.
• Avisa antes de abrir sites de golpe, lojas falsas, phishing e malware.
• Opcional: lojas da lista "Evite esses Sites" do Procon-SP.
• Quatro modos com um clique:
  – Leve: quase nunca quebra site.
  – Recomendado: mais proteção contra golpes, ameaças e pop-ups.
  – Máximo: todas as listas, inclusive as no estilo Pi-hole (HaGeZi, OISD, StevenBlack) e avisos de cookies.
  – Família: Recomendado + bloqueio de sites de apostas e conteúdo adulto.
• Painel de estatísticas: bloqueios por hora e por dia, mapa de calor da semana, domínios e sites com mais bloqueios. Opcional, e os dados ficam só no seu computador.
• Ferramentas para remover elementos da página e criar seus próprios filtros.

Privacidade
Nada sai do seu computador. A extensão não tem servidor, não usa ferramentas de análise e não mostra anúncios.

Código aberto
Projeto derivado do uBlock Origin Lite, de Raymond Hill, sob a licença GPLv3. Não é um produto oficial do uBlock Origin.
Código: https://github.com/vagenralexx/melhorpreco-bloqueador
```

**Categoria:** Privacidade e segurança (se não houver, use Ferramentas).
**Idioma principal:** Português (Brasil).

**Imagens (pasta `store/`):**
- Ícone 128x128: vem do pacote (`img/icon_128.png`).
- Capturas 1280x800: `captura-1-estatisticas.png`, `captura-2-modos.png`, `captura-3-aviso.png`, `captura-4-configuracoes.png`, `captura-5-estatisticas-claro.png`.
- Bloco promocional pequeno 440x280: `promo-440x280.png`.
- Bloco de destaque 1400x560 (opcional): `promo-1400x560.png`.

**Site oficial:** https://vagenralexx.github.io/melhorpreco-bloqueador/
**URL de suporte:** https://github.com/vagenralexx/melhorpreco-bloqueador/issues

## Aba "Privacidade"

**Finalidade única (cole):**

```
Bloquear anúncios, rastreadores e sites perigosos durante a navegação, usando listas de filtros aplicadas pela API declarativeNetRequest do Chrome.
```

**Justificativa das permissões (cole cada uma no campo correspondente):**

| Permissão | Justificativa |
|---|---|
| declarativeNetRequest | É o mecanismo principal: as listas de filtros são convertidas em regras que o próprio Chrome usa para bloquear anúncios, rastreadores e sites perigosos. |
| scripting | Injetar CSS e scripts de filtragem que escondem anúncios e elementos indesejados que não podem ser bloqueados só pela rede. |
| userScripts | Aplicar filtros de scriptlets e filtros cosméticos de listas que o usuário importa ou cria. |
| activeTab | Ferramentas acionadas pelo usuário na aba atual: remover um elemento da página (zapper), criar filtro (picker) e relatar problema. |
| storage | Guardar as configurações, as listas ligadas e, se o usuário ativar, as estatísticas locais de bloqueio. |
| unlimitedStorage | As listas compiladas e os filtros importados podem passar do limite padrão do armazenamento local. |
| alarms | Agendar tarefas internas de baixa prioridade, como atualizar listas importadas pelo usuário. |
| offscreen | Compilar listas de filtros importadas pelo usuário num documento fora da tela, sem bloquear a interface. |
| Permissão de host (todos os sites) | Os filtros precisam funcionar em qualquer site que o usuário visitar, e os filtros cosméticos precisam ser aplicados dentro dessas páginas. O conteúdo não é coletado nem enviado. |
| webRequest (opcional) | Pedida só quando o usuário ativa as estatísticas. Usada apenas para contar requisições já bloqueadas (erro ERR_BLOCKED_BY_CLIENT) e as páginas barradas com aviso; os dados ficam no computador por até 30 dias. |

**Código remoto:** Não, não estou usando código remoto. (Listas de filtros são dados, não código executável; os scriptlets já vêm no pacote.)

**Uso de dados:** não marque nenhuma categoria. Marque as três declarações:
- Não vendo nem transfiro dados de usuários para terceiros, fora dos casos de uso aprovados.
- Não uso nem transfiro dados de usuários para finalidades não relacionadas à finalidade única do item.
- Não uso nem transfiro dados de usuários para determinar capacidade de crédito ou para fins de empréstimo.

**Política de privacidade:** https://vagenralexx.github.io/melhorpreco-bloqueador/privacidade.html

## Aba "Distribuição"

- Visibilidade: Pública (ou "Não listada" para testar antes com poucas pessoas).
- Regiões: todas, ou só Brasil e Portugal.
- Preço: gratuito.

## Antes de enviar

- Conferir se a conta de desenvolvedor está verificada (taxa única e dados do desenvolvedor).
- A primeira revisão de um bloqueador com acesso a todos os sites costuma levar de alguns dias a algumas semanas.
- Não usar "uBlock" no nome nem nas palavras-chave; no texto, só como crédito ("derivado do uBlock Origin Lite").
