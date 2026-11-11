import { useCart } from '../context/CartContext.jsx'

export default function WishButton({ product }) {
  const { wishlist, toggleWish } = useCart()
  const on = wishlist.includes(product.id)
  return (
    <button
      className={on ? 'wish on' : 'wish'}
      onClick={(e) => { e.preventDefault(); toggleWish(product) }}
      aria-pressed={on}
      aria-label={on ? 'Remove from wishlist' : 'Add to wishlist'}
    >{on ? '♥' : '♡'}</button>
  )
}
