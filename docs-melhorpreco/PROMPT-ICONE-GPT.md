# Prompt para gerar o ícone do MP Bloqueador (ChatGPT / gerador de imagem)

Anexe ao ChatGPT as duas imagens de referência da família Melhor Preço antes de colar o prompt:
- `P:\Melhor_Preco\public\favicon.png` (ícone do app)
- `P:\Melhor_Preco\chrome-extension\icons\icon128.png` (ícone da extensão do WhatsApp)

---

Crie o ícone de um produto novo da família **Melhor Preço**: o **MP Bloqueador**, uma extensão do Google Chrome que bloqueia anúncios, rastreadores e sites golpistas para o público brasileiro.

**Use as imagens anexas como referência de estilo obrigatória.** O ícone novo precisa parecer irmão delas:
- ilustração 3D com acabamento "clay"/brinquedo: formas arredondadas, cantos macios, sombras suaves e contorno branco fino em volta dos objetos;
- uma **esfera de vidro azul** brilhante (gradiente do azul-ciano #3FB6E0 ao azul #1E6FC0), com reflexos brancos no alto à esquerda, ocupando quase todo o quadro;
- paleta da família: verde-claro da cédula (#8EDB6A), amarelo-ouro (#F5B820), vermelho-coral da etiqueta (#EF6B6B) e branco-gelo (#F2EEE6).

**O que vai dentro da esfera (o conceito):**
- uma **etiqueta de preço vermelho-coral** (a mesma da referência, com cordão cinza e ilhós amarelo), inclinada;
- por cima dela, em primeiro plano, um **símbolo de proibido** grande: círculo amarelo-ouro grosso com a barra diagonal, em 3D, com contorno branco;
- atrás, sem destaque, um pequeno banner retangular verde-claro com dois pontinhos amarelos, como a cédula da referência, sugerindo "anúncio".

A leitura deve ser: "o Melhor Preço barra o que atrapalha a sua compra". O símbolo de proibido é o elemento principal e tem de ser reconhecível mesmo minúsculo.

**Regras:**
- Nenhum texto, letra ou número no ícone (nada de "Price", "AD", "$" ou "MP").
- **Não usar escudo** nem nada parecido com o logotipo do uBlock Origin (escudo vermelho) ou de outros bloqueadores (AdBlock, AdGuard).
- Composição centralizada e simétrica o bastante para funcionar em 16x16 pixels; poucos elementos, silhuetas fortes, sem detalhes finos.
- Fundo **transparente** (PNG com canal alfa), sem sombra projetada fora da esfera.
- Formato quadrado 1024x1024, com uns 4% de margem.

**Entregue três imagens, todas 1024x1024 com fundo transparente:**
1. **Ícone principal**, completo, como descrito.
2. **Versão simplificada para 16 e 32 px:** só a esfera azul e o símbolo de proibido amarelo, sem etiqueta nem banner, com contraste máximo.
3. **Versão "pausado":** igual à principal, mas toda em tons de cinza (esfera cinza-azulado #8A9099, símbolo cinza-claro). É mostrada quando a extensão está desligada num site.

---

## Depois de gerar

Salve os PNG e me avise o caminho. Eu gero os tamanhos que o Chrome pede, um por arquivo:
- `icon_16.png`, `icon_32.png`, `icon_64.png`, `icon_128.png` e `icon_512.png`;
- as versões pausadas `icon_*_off.png`;
- o SVG do painel.

Depois confiro tudo na barra do Chrome, em tema claro e escuro, antes de trocar o ícone provisório atual (o círculo verde com a barra).
