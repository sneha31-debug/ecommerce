import { PROMOS, useCart } from '../context/CartContext.jsx'

export const SHIPPING_FREE_OVER = 50
export function totals(subtotal, promoCode) {
  const promo = PROMOS[promoCode]
  const discount = promo?.percent ? subtotal * promo.percent / 100 : 0
  const shipping = subtotal === 0 || subtotal >= SHIPPING_FREE_OVER || promo?.freeShip ? 0 : 5.99
  const tax = (subtotal - discount) * 0.08
  return { discount, shipping, tax, total: subtotal - discount + shipping + tax }
}

export default function Summary({ subtotal, children }) {
  const { promo } = useCart()
  const { discount, shipping, tax, total } = totals(subtotal, promo)
  return (
    <aside className="summary">
      <h3>Order summary</h3>
      <div className="row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
      {discount > 0 && <div className="row good"><span>Promo {promo}</span><span>−${discount.toFixed(2)}</span></div>}
      <div className="row"><span>Shipping</span><span>{shipping ? `$${shipping.toFixed(2)}` : 'Free'}</span></div>
      <div className="row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
      <div className="row total"><span>Total</span><span>${total.toFixed(2)}</span></div>
      {children}
    </aside>
  )
}
