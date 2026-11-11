import { HttpTypes } from "@medusajs/types"

import { getProductMeta } from "@lib/util/product-meta"

const Icon = ({ path }: { path: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={path} />
  </svg>
)

/** Stock status plus delivery, returns and checkout assurances under the buy buttons. */
export default function BuyBoxInfo({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const meta = getProductMeta(product)
  const lowStock = meta.stock !== null && meta.stock > 0 && meta.stock <= 10
  const outOfStock = meta.stock === 0

  const tiles = [
    { icon: "M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a1.5 1.5 0 1 0 0-.01M17 19a1.5 1.5 0 1 0 0-.01", title: "Free delivery", text: meta.shippingInfo ?? "Ships in 1-2 days" },
    { icon: "M4 4v6h6M20 20v-6h-6M20 10A8 8 0 0 0 6 6L4 10M4 14a8 8 0 0 0 14 4l2-4", title: "Easy returns", text: meta.returnPolicy ?? "30 day returns" },
    { icon: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4", title: "Secure checkout", text: "Encrypted payment" },
  ]

  return (
    <div className="flex flex-col gap-5" data-testid="buy-box-info">
      <div className="flex items-center gap-2 text-sm font-semibold">
        {outOfStock ? (
          <span className="flex items-center gap-2 text-rose-600">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Currently unavailable
          </span>
        ) : lowStock ? (
          <span className="flex items-center gap-2 text-amber-600">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-500" /> Only {meta.stock} left, order soon
          </span>
        ) : (
          <span className="flex items-center gap-2 text-emerald-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> In stock and ready to ship
          </span>
        )}
        <span className="font-normal text-gray-500">
          Sold by {meta.brand ?? "ShopSphere"}
        </span>
      </div>

      <ul className="grid gap-3 xsmall:grid-cols-3">
        {tiles.map((tile) => (
          <li key={tile.title} className="flex flex-col gap-1.5 rounded-2xl bg-white p-4 ring-1 ring-gray-200">
            <span className="text-indigo-600"><Icon path={tile.icon} /></span>
            <span className="text-sm font-bold text-gray-900">{tile.title}</span>
            <span className="text-xs leading-snug text-gray-500">{tile.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
