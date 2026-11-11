import { HttpTypes } from "@medusajs/types"

import { getProductMeta } from "@lib/util/product-meta"
import RatingStars from "@modules/common/components/rating-stars"

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

export default function ProductReviews({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const meta = getProductMeta(product)

  if (!meta.rating) {
    return null
  }

  const counts = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: meta.reviews.filter((r) => Math.round(r.rating) === stars).length,
  }))
  const total = meta.reviews.length || 1

  return (
    <section className="grid gap-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 small:grid-cols-[280px_1fr]" data-testid="product-reviews">
      <div>
        <h2 className="mb-2 text-xl font-extrabold tracking-tight text-gray-900">Customer reviews</h2>
        <div className="mb-3 flex items-center gap-2">
          <RatingStars rating={meta.rating} size={20} />
          <span className="text-lg font-semibold">{meta.rating.toFixed(1)} out of 5</span>
        </div>
        <p className="mb-4 text-sm text-gray-600">
          {meta.reviewCount.toLocaleString()} global ratings
        </p>
        <ul className="flex flex-col gap-2">
          {counts.map(({ stars, count }) => (
            <li key={stars} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-10">{stars} star</span>
              <span className="h-4 flex-1 overflow-hidden rounded bg-gray-200">
                <span
                  className="block h-full bg-[#f59e0b]"
                  style={{ width: `${(count / total) * 100}%` }}
                />
              </span>
              <span className="w-8 text-right text-gray-600">
                {Math.round((count / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-bold text-[#111827]">What customers say</h3>
        {meta.reviews.length ? (
          <ul className="flex flex-col gap-5">
            {meta.reviews.map((review, i) => (
              <li key={i} className="border-b border-gray-200 pb-5 last:border-0">
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
                    {review.reviewer.charAt(0)}
                  </span>
                  <span className="text-sm font-medium">{review.reviewer}</span>
                </div>
                <RatingStars rating={review.rating} size={14} />
                <p className="mt-1 text-xs text-gray-500">
                  Reviewed on {formatDate(review.date)}
                </p>
                <p className="mt-2 text-sm text-[#111827]">{review.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">No written reviews yet.</p>
        )}
      </div>
    </section>
  )
}
