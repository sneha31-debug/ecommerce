import Image from "next/image"
import { ReactNode } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import RatingStars from "@modules/common/components/rating-stars"

type ProductCardProps = {
  href: string
  image?: string | null
  title: string
  brand?: string | null
  rating?: number
  reviewCount?: number
  discountPct?: number
  price: ReactNode
  compact?: boolean
}

/** Soft, rounded product tile shared by lists, rails and search results. */
export default function ProductCard({
  href,
  image,
  title,
  brand,
  rating,
  reviewCount,
  discountPct = 0,
  price,
}: ProductCardProps) {
  return (
    <LocalizedClientLink
      href={href}
      className="group flex h-full flex-col rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-indigo-100"
    >
      <div
        className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50"
        data-testid="product-wrapper"
      >
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 240px"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-110"
            draggable={false}
          />
        ) : null}
        {discountPct >= 5 ? (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-bold text-white">
            {Math.round(discountPct)}% off
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1 px-1">
        {brand ? (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
            {brand}
          </span>
        ) : null}
        <span
          className="text-sm font-semibold leading-snug text-gray-900 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden"
          data-testid="product-title"
        >
          {title}
        </span>
        {rating ? <RatingStars compact rating={rating} count={reviewCount} /> : null}
        <div className="mt-auto pt-2">{price}</div>
        <span className="text-xs font-medium text-emerald-600">Free delivery</span>
      </div>
    </LocalizedClientLink>
  )
}
