type RatingStarsProps = {
  rating: number
  count?: number
  size?: number
  className?: string
  /** One star, the number and the count, for tight spaces such as product cards. */
  compact?: boolean
}

export default function RatingStars({
  rating,
  count,
  size = 14,
  className,
  compact,
}: RatingStarsProps) {
  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs ${className ?? ""}`}
        aria-label={`${rating.toFixed(1)} out of 5 stars`}
      >
        <span className="text-[#f59e0b]" aria-hidden="true">★</span>
        <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
        {count ? (
          <span className="text-gray-400">({count.toLocaleString()})</span>
        ) : null}
      </span>
    )
  }

  const percent = (Math.max(0, Math.min(5, rating)) / 5) * 100

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${className ?? ""}`}
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      <span
        className="relative inline-block leading-none tracking-tight"
        style={{ fontSize: size }}
        aria-hidden="true"
      >
        <span className="text-gray-200">★★★★★</span>
        <span
          className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-[#f59e0b]"
          style={{ width: `${percent}%` }}
        >
          ★★★★★
        </span>
      </span>
      {count ? (
        <span className="text-xs text-gray-500">{count.toLocaleString()}</span>
      ) : null}
    </span>
  )
}
