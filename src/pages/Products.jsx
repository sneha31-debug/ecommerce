import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { products, categories } from '../data/products.js'

export default function Products() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const category = params.get('category') || ''
  const sort = params.get('sort') || 'featured'

  const set = (key, value) => {
    const next = new URLSearchParams(params)
    value ? next.set(key, value) : next.delete(key)
    setParams(next)
  }

  const list = useMemo(() => {
    let r = products.filter((p) =>
      (!category || p.category === category) &&
      (!q || `${p.name} ${p.description}`.toLowerCase().includes(q.toLowerCase())))
    if (sort === 'low') r = [...r].sort((a, b) => a.price - b.price)
    if (sort === 'high') r = [...r].sort((a, b) => b.price - a.price)
    if (sort === 'rating') r = [...r].sort((a, b) => b.rating - a.rating)
    return r
  }, [q, category, sort])

  return (
    <>
      <h1>{category || 'All products'}{q && <span className="muted"> — “{q}”</span>}</h1>
      <div className="toolbar">
        <div className="chips">
          <button className={!category ? 'chip active' : 'chip'} onClick={() => set('category', '')}>All</button>
          {categories.map((c) => (
            <button key={c} className={category === c ? 'chip active' : 'chip'} onClick={() => set('category', c)}>{c}</button>
          ))}
        </div>
        <select value={sort} onChange={(e) => set('sort', e.target.value === 'featured' ? '' : e.target.value)} aria-label="Sort">
          <option value="featured">Featured</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>
      {list.length === 0 ? (
        <p className="empty">No products match your search.</p>
      ) : (
        <div className="grid">{list.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </>
  )
}
