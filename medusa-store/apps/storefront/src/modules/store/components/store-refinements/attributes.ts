import { PRODUCT_INDEX_NAME, priceAttribute } from "@lib/search-client"

export const OPTION_VALUES_ATTRIBUTE = "option_values"
export const CATEGORY_ATTRIBUTE = "category"
// The index calls the product's tags "labels".
export const LABELS_ATTRIBUTE = "labels"
export const BRAND_ATTRIBUTE = "brand"

export const getSortOptions = (currencyCode: string) => {
  const minPrice = priceAttribute("min_price", currencyCode)

  return [
    { value: PRODUCT_INDEX_NAME, label: "Relevance" },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/created_at:desc`,
      label: "Latest Arrivals",
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/${minPrice}:asc`,
      label: "Price: Low -> High",
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/${minPrice}:desc`,
      label: "Price: High -> Low",
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/rating:desc`,
      label: "Avg. Customer Review",
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/discount_pct:desc`,
      label: "Biggest Discount",
    },
    { value: `${PRODUCT_INDEX_NAME}/sort/title:asc`, label: "Title: A -> Z" },
    { value: `${PRODUCT_INDEX_NAME}/sort/title:desc`, label: "Title: Z -> A" },
  ]
}
