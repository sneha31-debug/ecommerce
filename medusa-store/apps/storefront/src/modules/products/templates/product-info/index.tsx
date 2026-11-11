import { getProductPrice } from "@lib/util/get-product-price"
import { getProductMeta } from "@lib/util/product-meta"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PriceLine from "@modules/common/components/price-line"
import RatingStars from "@modules/common/components/rating-stars"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const meta = getProductMeta(product)
  const { cheapestPrice } = getProductPrice({ product })
  const firstSentence = product.description?.split(/(?<=\.)\s/)[0]

  return (
    <div id="product-info" className="flex flex-col gap-4">
      {meta.brand ? (
        <LocalizedClientLink
          href={`/store?product[refinementList][brand][0]=${encodeURIComponent(meta.brand)}`}
          className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 transition hover:bg-indigo-100"
        >
          More from {meta.brand}
        </LocalizedClientLink>
      ) : null}

      <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900" data-testid="product-title">
        {product.title}
      </h1>

      {meta.rating ? (
        <div className="flex items-center gap-3 text-sm">
          <RatingStars rating={meta.rating} size={18} />
          <span className="font-semibold text-gray-900">{meta.rating.toFixed(1)}</span>
          <span className="text-gray-500">{meta.reviewCount.toLocaleString()} ratings</span>
        </div>
      ) : null}

      {cheapestPrice ? (
        <PriceLine
          amount={cheapestPrice.calculated_price_number}
          currencyCode={cheapestPrice.currency_code}
          discountPct={meta.discountPct}
          size="lg"
        />
      ) : null}

      {firstSentence ? (
        <p className="text-base leading-relaxed text-gray-600" data-testid="product-summary">
          {firstSentence}
        </p>
      ) : null}
    </div>
  )
}

export default ProductInfo
