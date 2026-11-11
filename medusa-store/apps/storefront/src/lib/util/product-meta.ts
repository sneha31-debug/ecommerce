import { HttpTypes } from "@medusajs/types"

export type ProductReview = {
  rating: number
  comment: string
  date: string
  reviewer: string
}

export type ProductMeta = {
  brand: string | null
  rating: number
  reviewCount: number
  stock: number | null
  availability: string | null
  discountPct: number
  warranty: string | null
  shippingInfo: string | null
  returnPolicy: string | null
  sku: string | null
  reviews: ProductReview[]
}

const toNumber = (value: unknown) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

const toText = (value: unknown) =>
  typeof value === "string" && value.trim() ? value : null

/** Reads the marketplace fields the import script stores in product metadata. */
export const getProductMeta = (
  product: Pick<HttpTypes.StoreProduct, "metadata">
): ProductMeta => {
  const m = (product.metadata ?? {}) as Record<string, unknown>

  return {
    brand: toText(m.brand),
    rating: toNumber(m.rating),
    reviewCount: toNumber(m.review_count),
    stock: m.stock === undefined ? null : toNumber(m.stock),
    availability: toText(m.availability),
    discountPct: toNumber(m.discount_pct),
    warranty: toText(m.warranty),
    shippingInfo: toText(m.shipping_info),
    returnPolicy: toText(m.return_policy),
    sku: toText(m.sku),
    reviews: Array.isArray(m.reviews) ? (m.reviews as ProductReview[]) : [],
  }
}

/** The "was" price implied by a sale price and a percentage discount. */
export const listPriceFor = (salePrice: number, discountPct: number) =>
  discountPct >= 1 && discountPct < 90
    ? salePrice / (1 - discountPct / 100)
    : null
