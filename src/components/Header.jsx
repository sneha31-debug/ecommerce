import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Header() {
  const { count, wishlist } = useCart()
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    navigate(q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : '/products')
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">Brew<span>&amp;</span>Bean</Link>
        <form className="search" onSubmit={submit} role="search">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search coffee, gear, treats…" aria-label="Search products" />
          <button type="submit">Search</button>
        </form>
        <nav className="nav">
          <NavLink to="/products">Shop</NavLink>
          <NavLink to="/wishlist">♥{wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}</NavLink>
          <NavLink to="/cart">Cart {count > 0 && <span className="badge">{count}</span>}</NavLink>
        </nav>
      </div>
    </header>
  )
}
