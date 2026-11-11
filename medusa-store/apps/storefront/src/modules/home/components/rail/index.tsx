import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

type RailProps = {
  title: string
  subtitle?: string
  href: string
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

/** A titled, horizontally scrolling row of product cards. */
export default function Rail({ title, subtitle, href, products, region }: RailProps) {
  if (!products.length) {
    return null
  }

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p> : null}
        </div>
        <LocalizedClientLink
          href={href}
          className="shrink-0 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-indigo-700 shadow-sm ring-1 ring-gray-200 transition hover:bg-indigo-50"
        >
          View all
        </LocalizedClientLink>
      </div>
      <ul className="no-scrollbar -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-4 pt-1">
        {products.map((product) => (
          <li key={product.id} className="w-[200px] shrink-0 snap-start small:w-[220px]">
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </section>
  )
}
