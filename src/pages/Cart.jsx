import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PROMOS, useCart } from '../context/CartContext.jsx'
import Summary, { SHIPPING_FREE_OVER } from '../components/Summary.jsx'
import ProductImage from '../components/ProductImage.jsx'

export default function Cart() {
  const { items, subtotal, setQty, remove, promo, applyPromo, removePromo } = useCart()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')

  if (items.length === 0)
    return (
      <div className="empty">
        <h1>Your cart is empty</h1>
        <Link to="/products" className="btn">Continue shopping</Link>
      </div>
    )

  const submitPromo = (e) => {
    e.preventDefault()
    if (applyPromo(code)) { setMsg(''); setCode('') } else setMsg('Invalid code. Try BREW10 or FREESHIP.')
  }

  return (
    <>
      <h1>Shopping cart</h1>
      <div className="two-col">
        <div className="lines">
          {items.map(({ key, product, qty, option }) => (
            <div className="line" key={key}>
              <Link to={`/products/${product.id}`}><ProductImage product={product} size="sm" /></Link>
              <div className="grow">
                <Link to={`/products/${product.id}`} className="card-title">{product.name}</Link>
                {option && <div className="muted">{product.options.label}: {option}</div>}
                <div className="muted">${product.price.toFixed(2)} each</div>
                <button className="link" onClick={() => remove(key)}>Remove</button>
              </div>
              <div className="qty">
                <button onClick={() => setQty(key, qty - 1)} aria-label="Decrease">−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(key, qty + 1)} aria-label="Increase">+</button>
              </div>
              <strong className="line-total">${(product.price * qty).toFixed(2)}</strong>
            </div>
          ))}
        </div>
        <Summary subtotal={subtotal}>
          {promo ? (
            <p className="small-text good">✓ {promo} applied ({PROMOS[promo].label}) <button className="link" onClick={removePromo}>Remove</button></p>
          ) : (
            <form className="promo" onSubmit={submitPromo}>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code" aria-label="Promo code" />
              <button className="btn small" type="submit">Apply</button>
            </form>
          )}
          {msg && <p className="error">{msg}</p>}
          <button className="btn block" onClick={() => navigate('/checkout')}>Checkout</button>
          <p className="muted small-text">Free shipping on orders over ${SHIPPING_FREE_OVER}.</p>
        </Summary>
      </div>
    </>
  )
}
