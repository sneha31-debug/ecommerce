import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import Stars from './Stars.jsx'
import ProductImage from './ProductImage.jsx'
import WishButton from './WishButton.jsx'

export default function ProductCard({ product }) {
  const { add } = useCart()
  return (
    <div className="card">
      <Link to={`/products/${product.id}`} className="card-img">
        <ProductImage product={product} />
      </Link>
      <WishButton product={product} />
      <div className="card-body">
        <span className="muted">{product.category}</span>
        <Link to={`/products/${product.id}`} className="card-title">{product.name}</Link>
        {product.specs?.Roast && <span className="notes">{product.specs.Roast} roast · {product.specs['Tasting notes']}</span>}
        <Stars rating={product.rating} reviews={product.reviews} />
        <div className="card-foot">
          <strong>${product.price.toFixed(2)}</strong>
          {product.options
            ? <Link to={`/products/${product.id}`} className="btn small">Choose</Link>
            : <button className="btn small" onClick={() => add(product)}>Add to cart</button>}
        </div>
      </div>
    </div>
  )
}
