import { HttpTypes } from "@medusajs/types"

import { getProductMeta } from "@lib/util/product-meta"

export default function ProductDetails({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const meta = getProductMeta(product)
  const weight = product.weight ? `${product.weight} g` : null

  const rows: [string, string | null][] = [
    ["Brand", meta.brand],
    ["Model / SKU", meta.sku],
    ["Weight", weight],
    ["Warranty", meta.warranty],
    ["Shipping", meta.shippingInfo],
    ["Returns", meta.returnPolicy],
    ["Availability", meta.availability],
  ]

  return (
    <section className="grid gap-6 small:grid-cols-2" data-testid="product-details">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h2 className="mb-3 text-xl font-extrabold tracking-tight text-gray-900">Description</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-[#111827]" data-testid="product-description">
          {product.description}
        </p>
        {product.tags?.length ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <li key={tag.id} className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize text-gray-700">
                {tag.value}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h2 className="mb-3 text-xl font-extrabold tracking-tight text-gray-900">Specifications</h2>
        <table className="w-full border-collapse text-sm">
          <tbody>
            {rows
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <tr key={label} className="border-b border-gray-100">
                  <th scope="row" className="w-36 px-3 py-2.5 text-left font-medium text-gray-500">
                    {label}
                  </th>
                  <td className="px-3 py-2 text-[#111827]">{value}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
