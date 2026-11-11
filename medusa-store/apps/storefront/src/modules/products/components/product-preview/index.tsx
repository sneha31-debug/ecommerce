import { getProductPrice } from "@lib/util/get-product-price"
import { getProductMeta } from "@lib/util/product-meta"
import { HttpTypes } from "@medusajs/types"
import ProductCard from "@modules/common/components/product-card"
import PriceLine from "@modules/common/components/price-line"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })
  const meta = getProductMeta(product)

  return (
    <ProductCard
      href={`/products/${product.handle}`}
      image={product.thumbnail ?? product.images?.[0]?.url}
      title={product.title}
      brand={meta.brand}
      rating={meta.rating}
      reviewCount={meta.reviewCount}
      discountPct={meta.discountPct}
      compact={isFeatured}
      price={
        cheapestPrice ? (
          <PriceLine
            amount={cheapestPrice.calculated_price_number}
            currencyCode={cheapestPrice.currency_code}
            discountPct={meta.discountPct}
          />
        ) : null
      }
    />
  )
}
