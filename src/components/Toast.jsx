import { useCart } from '../context/CartContext.jsx'

export default function Toast() {
  const { toast } = useCart()
  return toast ? <div className="toast" role="status">{toast}</div> : null
}
