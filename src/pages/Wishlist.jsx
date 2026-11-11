import { Link } from 'react-router-dom'
import { products } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function Wishlist() {
  const { wishlist } = useCart()
  const list = products.filter((p) => wishlist.includes(p.id))
  if (!list.length)
    return <div className="empty"><h1>Your wishlist is empty</h1><p>Tap the ♡ on any product to save it.</p><Link to="/products" className="btn">Browse products</Link></div>
  return (
    <>
      <h1>Wishlist</h1>
      <div className="grid">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </>
  )
}
