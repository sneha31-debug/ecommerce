import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div><strong>Brew&amp;Bean</strong><br />Small-batch coffee roasters.</div>
        <div className="footer-links">
          <Link to="/products">Shop all</Link>
          <Link to="/products?category=Beans">Beans</Link>
          <Link to="/products?category=Brewing Gear">Brewing gear</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/credits">Photo credits</Link>
        </div>
        <div className="muted">© {new Date().getFullYear()} Brew&amp;Bean. Demo store — no real orders are placed.</div>
      </div>
    </footer>
  )
}
