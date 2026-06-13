# Social Quest — Página de Vendas (Next.js)

Landing page de produto único, pensada para público frio: o argumento é
construído ao longo da página e o **botão de compra aparece só no final**.

## Como rodar

```bash
# 1. configure o link do checkout
cp .env.example .env.local
# edite .env.local e coloque seu CHECKOUT_URL real

# 2. instale e rode
npm install
npm run dev
```

Abra http://localhost:3000

## Onde fica o link de compra

No arquivo `.env.local`:

```
CHECKOUT_URL=https://seu-checkout-real.com
```

A página lê essa variável no servidor (`app/page.js`) e injeta no único botão
de compra, no final. Não precisa mexer no código pra trocar o link.

## Editar conteúdo

- **Textos, níveis, benefícios:** arrays no topo de `app/page.js`.
- **Preço exibido:** constante `PRICE` em `app/page.js` (deixe `''` para ocultar).
- **Cores e fontes:** variáveis no topo de `app/globals.css`.

## Decisões de design (conforme o briefing)

- Um único CTA, no fim da página (recomendado para tráfego frio).
- Paleta calma e neutra de gênero: verde-petróleo + creme + âmbar suave.
- Fontes do sistema, limpas e legíveis (nada extravagante).
- Sem nenhuma prova social (depoimentos, números, selos).
