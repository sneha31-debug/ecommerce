export default function ProductImage({ product, size = 'md' }) {
  return (
    <div className={`pimg ${size}`}>
      <img src={product.image} alt={product.name} loading="lazy" />
    </div>
  )
}
