import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // More from the most specific category the product belongs to.
  const category =
    product.categories?.find((c) => c.parent_category_id) ??
    product.categories?.[0]

  const queryParams: HttpTypes.StoreProductListParams = {
    limit: 13,
    region_id: region.id,
    is_giftcard: false,
  }
  if (category) {
    queryParams.category_id = [category.id]
  }

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) =>
    response.products
      .filter((responseProduct) => responseProduct.id !== product.id)
      .slice(0, 12)
  )

  if (!products.length) {
    return null
  }

  return (
    <section>
      <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-gray-900">
        More {category ? `in ${category.name}` : "to explore"}
      </h2>
      <ul className="no-scrollbar -mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-4 pt-1">
        {products.map((related) => (
          <li key={related.id} className="w-[200px] shrink-0 snap-start small:w-[220px]">
            <Product region={region} product={related} isFeatured />
          </li>
        ))}
      </ul>
    </section>
  )
}
