import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { products, categories } from '../data/products.js'

const catEmoji = { Beans: '🫘', 'Brewing Gear': '⚙️', 'Cold & Ready': '🧊', Treats: '🍪' }

export default function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <h1>Small-batch coffee, roasted for your morning.</h1>
          <p>Single-origin beans, brewing gear and cold brew, roasted to order. Use code <strong>BREW10</strong> for 10% off.</p>
          <Link to="/products" className="btn">Shop now</Link>
        </div>
              </section>

      <section>
        <h2>Shop by category</h2>
        <div className="cats">
          {categories.map((c) => (
            <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} className="cat">
              <span className="cat-emoji">{catEmoji[c]}</span>{c}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>Customer favourites</h2>
        <div className="grid">
          {[...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="perks">
        <div>🚚<strong>Free shipping</strong><span>on orders over $50</span></div>
        <div>🔥<strong>Roasted to order</strong><span>ships within 48 hours</span></div>
        <div>↩️<strong>30-day returns</strong><span>love it or send it back</span></div>
      </section>
    </>
  )
}
