import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { products } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'
import Stars from '../components/Stars.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductImage from '../components/ProductImage.jsx'
import WishButton from '../components/WishButton.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find((p) => p.id === Number(id))
  if (!product) return <p className="empty">Product not found. <Link to="/products">Back to shop</Link></p>
  return <Detail key={product.id} product={product} />
}

function Detail({ product }) {
  const { add } = useCart()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [option, setOption] = useState(product.options?.values[0])

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <>
      <Link to="/products" className="muted">← Back to shop</Link>
      <div className="detail">
        <div className="detail-img"><ProductImage product={product} size="lg" /><WishButton product={product} /></div>
        <div>
          <span className="muted">{product.category}</span>
          <h1>{product.name}</h1>
          <Stars rating={product.rating} reviews={product.reviews} />
          <p className="price">${product.price.toFixed(2)}</p>
          <p>{product.description}</p>
          {product.specs && (
            <dl className="specs">
              {Object.entries(product.specs).map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
            </dl>
          )}
          {product.options && (
            <div className="opts">
              <span className="muted">{product.options.label}</span>
              <div className="chips">
                {product.options.values.map((v) => (
                  <button key={v} className={v === option ? 'chip active' : 'chip'} onClick={() => setOption(v)}>{v}</button>
                ))}
              </div>
            </div>
          )}
          <div className="qty-row">
            <div className="qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">+</button>
            </div>
            <button className="btn" onClick={() => add(product, qty, option)}>Add to cart</button>
            <button className="btn ghost" onClick={() => { add(product, qty, option); navigate('/cart') }}>Buy now</button>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <>
          <h2>You may also like</h2>
          <div className="grid">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </>
      )}
    </>
  )
}
