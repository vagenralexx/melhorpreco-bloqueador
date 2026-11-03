<p align="center"><img src="platform/mv3/extension/img/icon_128.png" width="96" height="96" alt=""></p>

# MP Bloqueador (Melhor Preço Bloqueador)

Bloqueador de anúncios, rastreadores e sites perigosos para o Google Chrome (Manifest V3), feito para o usuário brasileiro.

É um fork do [uBlock Origin Lite](https://github.com/uBlockOrigin/uBOL-home) de Raymond Hill, sob a mesma licença [GPLv3](LICENSE.txt). **Não é um produto oficial do uBlock Origin.** O README original do projeto está em [README.uBlock.md](README.uBlock.md).

## O que tem a mais que o uBOL

- **Listas brasileiras:** EasyList Portuguese ligada por padrão; lista "Evite esses Sites" do Procon-SP (opcional), gerada do site oficial a cada build.
- **Listas no estilo Pi-hole:** HaGeZi (PRO, ULTIMATE, Ameaças, Lojas falsas, Pop-ups, Apostas), OISD (Big, Adulto) e StevenBlack.
- **Modos de proteção:** Leve, Recomendado, Máximo e Família, com um clique.
- **Painel de estatísticas** local (bloqueios por hora/dia, mapa de calor, domínios e sites), com permissão opcional e dados só no computador.
- **Correção** do bloqueio estrito: listas de domínios agora entram antes das regras regex (na uBOL a página de aviso da URLhaus era descartada pelo teto de regex do Chrome).
- Interface em português, tema azul-marinho e ícone próprio.

## Documentação

- [Como compilar, carregar e o que mudou](docs-melhorpreco/README.md)
- [Licenças das listas](docs-melhorpreco/LICENCAS-LISTAS.md)
- [Orçamento de regras do Chrome](docs-melhorpreco/ORCAMENTO-REGRAS.md)
- [Relatório de verificação](docs-melhorpreco/RELATORIO-VERIFICACAO.md)
- [Textos da Chrome Web Store](docs-melhorpreco/LOJA-CHROME-WEB-STORE.md)
- [Política de privacidade](https://vagenralexx.github.io/melhorpreco-bloqueador/privacidade.html)

## Compilar

Requisitos: Git Bash (ou Linux/macOS), Node.js 18+ e internet (as listas são baixadas no build).

```bash
git submodule update --init platform/mv3/extension/lib/codemirror/codemirror-ubol platform/mv3/extension/lib/s14e-serializer
bash tools/make-mv3.sh chromium            # build de desenvolvimento em dist/build/uBOLite.chromium
bash tools/make-mv3.sh chromium 2026.1103.2200   # build de loja + zip em dist/build/
```

## Relatar problemas

Use as [issues](https://github.com/vagenralexx/melhorpreco-bloqueador/issues) ou o botão **Relatar problema** da extensão.

## Créditos

uBlock Origin / uBlock Origin Lite © Raymond Hill e colaboradores. Listas de filtros dos seus respectivos autores (veja as licenças). Ícones de interface: [Lucide](https://lucide.dev/) (ISC).
