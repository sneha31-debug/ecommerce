import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { products } from '../data/products.js'

const CartContext = createContext(null)
const KEY = 'brewbean-state'

export const PROMOS = {
  BREW10: { label: '10% off', percent: 10 },
  FREESHIP: { label: 'Free shipping', freeShip: true },
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const key = action.key
      const existing = state.find((i) => i.key === key)
      if (existing) return state.map((i) => (i.key === key ? { ...i, qty: i.qty + action.qty } : i))
      return [...state, { key, id: action.id, option: action.option, qty: action.qty }]
    }
    case 'setQty':
      return state.map((i) => (i.key === action.key ? { ...i, qty: Math.max(1, action.qty) } : i))
    case 'remove':
      return state.filter((i) => i.key !== action.key)
    case 'clear':
      return []
    default:
      return state
  }
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

export function CartProvider({ children }) {
  const saved = useMemo(load, [])
  const [lines, dispatch] = useReducer(reducer, saved.lines || [])
  const [wishlist, setWishlist] = useState(saved.wishlist || [])
  const [promo, setPromo] = useState(saved.promo || '')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ lines, wishlist, promo })) } catch { /* ignore */ }
  }, [lines, wishlist, promo])

  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const items = useMemo(
    () => lines.map((l) => ({ ...l, product: products.find((p) => p.id === l.id) })).filter((l) => l.product),
    [lines]
  )

  const add = useCallback((product, qty = 1, option) => {
    dispatch({ type: 'add', key: `${product.id}|${option || ''}`, id: product.id, option, qty })
    setToast(`${product.name} added to cart`)
  }, [])

  const toggleWish = useCallback((product) => {
    setWishlist((w) => {
      const has = w.includes(product.id)
      setToast(has ? 'Removed from wishlist' : 'Saved to wishlist ♥')
      return has ? w.filter((x) => x !== product.id) : [...w, product.id]
    })
  }, [])

  const applyPromo = (code) => {
    const c = code.trim().toUpperCase()
    if (PROMOS[c]) { setPromo(c); return true }
    return false
  }

  const value = {
    items,
    count: items.reduce((n, i) => n + i.qty, 0),
    subtotal: items.reduce((s, i) => s + i.qty * i.product.price, 0),
    add,
    setQty: (key, qty) => dispatch({ type: 'setQty', key, qty }),
    remove: (key) => dispatch({ type: 'remove', key }),
    clear: () => { dispatch({ type: 'clear' }); setPromo('') },
    wishlist, toggleWish,
    promo, applyPromo, removePromo: () => setPromo(''),
    toast,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
