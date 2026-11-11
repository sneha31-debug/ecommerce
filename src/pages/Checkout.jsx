import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import Summary, { totals } from '../components/Summary.jsx'

const empty = { name: '', email: '', address: '', city: '', zip: '', card: '' }

export default function Checkout() {
  const { items, subtotal, clear, promo } = useCart()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [order, setOrder] = useState(null)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!/^\d{4,10}$/.test(form.zip)) e.zip = 'Enter a valid ZIP'
    if (!/^\d{16}$/.test(form.card.replace(/\s/g, ''))) e.card = 'Enter a 16-digit card number'
    return e
  }

  const submit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    setOrder({ id: Math.random().toString(36).slice(2, 8).toUpperCase(), total: totals(subtotal, promo).total, email: form.email })
    clear()
  }

  if (order)
    return (
      <div className="empty">
        <h1>🎉 Thank you for your order!</h1>
        <p>Order <strong>#{order.id}</strong> for ${order.total.toFixed(2)} is confirmed. A receipt was sent to {order.email}.</p>
        <Link to="/products" className="btn">Keep shopping</Link>
      </div>
    )

  if (items.length === 0)
    return <div className="empty"><h1>Nothing to check out</h1><Link to="/products" className="btn">Browse products</Link></div>

  const field = (name, label, props = {}) => (
    <label className={props.className}>
      {label}
      <input name={name} value={form[name]} onChange={onChange} {...props} />
      {errors[name] && <span className="error">{errors[name]}</span>}
    </label>
  )

  return (
    <>
      <h1>Checkout</h1>
      <form className="two-col" onSubmit={submit} noValidate>
        <div className="form">
          <h3>Contact & shipping</h3>
          {field('name', 'Full name', { autoComplete: 'name' })}
          {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
          {field('address', 'Address', { autoComplete: 'street-address' })}
          <div className="form-row">
            {field('city', 'City')}
            {field('zip', 'ZIP code', { inputMode: 'numeric' })}
          </div>
          <h3>Payment</h3>
          {field('card', 'Card number', { placeholder: '1234 5678 9012 3456', inputMode: 'numeric' })}
          <p className="muted small-text">Demo only — do not enter real card details.</p>
        </div>
        <Summary subtotal={subtotal}>
          <button className="btn block" type="submit">Place order</button>
        </Summary>
      </form>
    </>
  )
}
