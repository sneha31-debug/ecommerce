import { convertToLocale } from "@lib/util/money"
import { listPriceFor } from "@lib/util/product-meta"

type PriceLineProps = {
  amount: number
  currencyCode: string
  discountPct?: number
  size?: "sm" | "lg"
  prefix?: string
}

/** Price with an optional struck-through list price and a saving pill. */
export default function PriceLine({
  amount,
  currencyCode,
  discountPct = 0,
  size = "sm",
  prefix,
}: PriceLineProps) {
  const format = (value: number) =>
    convertToLocale({ amount: value, currency_code: currencyCode })
  const listPrice = listPriceFor(amount, discountPct)

  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1" data-testid="product-price">
      <span
        className={`font-extrabold tracking-tight text-gray-900 ${
          size === "lg" ? "text-4xl" : "text-lg"
        }`}
        data-value={amount}
      >
        {prefix}
        {format(amount)}
      </span>
      {listPrice ? (
        <span className={`text-gray-400 line-through ${size === "lg" ? "text-lg" : "text-xs"}`}>
          {format(listPrice)}
        </span>
      ) : null}
      {size === "lg" && listPrice ? (
        <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-bold text-rose-600">
          Save {Math.round(discountPct)}%
        </span>
      ) : null}
    </div>
  )
}
