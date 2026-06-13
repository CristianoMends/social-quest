/**
 * Botão de compra — o ÚNICO CTA da página, posicionado só no final.
 * Recebe o link de checkout (vindo do .env) por prop.
 */
export default function BuyButton({ href, children }) {
  return (
    <a className="buy-button" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}
