/**
 * Replaces the starter's t-shirt demo with an Amazon-style marketplace catalogue:
 * departments with sub-categories, collections (deals / best sellers / new),
 * tags and ~180 products with brand, rating, stock, discount and reviews.
 *
 * Source data: https://dummyjson.com/products (demo data, with hosted photos).
 *
 *   npx medusa exec ./src/scripts/import-marketplace.ts
 *
 * Destructive: deletes every existing product, category and collection first.
 */
import {
  createCollectionsWorkflow,
  createProductCategoriesWorkflow,
  createProductTagsWorkflow,
  createProductsWorkflow,
  deleteCollectionsWorkflow,
  deleteProductCategoriesWorkflow,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import type { ExecArgs } from "@medusajs/framework/types"

type Dummy = {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand?: string
  sku: string
  weight: number
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  returnPolicy: string
  minimumOrderQuantity: number
  reviews: { rating: number; comment: string; date: string; reviewerName: string }[]
  thumbnail: string
  images: string[]
}

/** Department -> sub-categories (dummyjson slug -> display name). */
const DEPARTMENTS: Record<string, Record<string, string>> = {
  Electronics: {
    smartphones: "Smartphones",
    laptops: "Laptops",
    tablets: "Tablets",
    "mobile-accessories": "Mobile Accessories",
  },
  "Home & Kitchen": {
    furniture: "Furniture",
    "home-decoration": "Home Décor",
    "kitchen-accessories": "Kitchen & Dining",
  },
  "Beauty & Personal Care": {
    beauty: "Makeup",
    "skin-care": "Skin Care",
    fragrances: "Fragrances",
  },
  Grocery: { groceries: "Fresh & Pantry" },
  "Men's Fashion": {
    "mens-shirts": "Men's Shirts",
    "mens-shoes": "Men's Shoes",
    "mens-watches": "Men's Watches",
    sunglasses: "Sunglasses",
  },
  "Women's Fashion": {
    tops: "Tops",
    "womens-dresses": "Dresses",
    "womens-bags": "Handbags",
    "womens-shoes": "Women's Shoes",
    "womens-jewellery": "Jewellery",
    "womens-watches": "Women's Watches",
  },
  "Sports & Outdoors": { "sports-accessories": "Sports Accessories" },
}

const APPAREL_SIZES = ["S", "M", "L", "XL"]
const SHOE_SIZES = ["7", "8", "9", "10", "11"]
const SIZED: Record<string, string[]> = {
  "mens-shirts": APPAREL_SIZES,
  tops: APPAREL_SIZES,
  "womens-dresses": APPAREL_SIZES,
  "mens-shoes": SHOE_SIZES,
  "womens-shoes": SHOE_SIZES,
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

const round2 = (n: number) => Math.round(n * 100) / 100
/** Approximate conversion so each currency shows a sensible price. */
const FX: Record<string, number> = { usd: 1, eur: 0.92, gbp: 0.79, dkk: 6.9 }

export default async function importMarketplace({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // ---- Source data --------------------------------------------------------
  const res = await fetch("https://dummyjson.com/products?limit=0")
  if (!res.ok) {
    throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, `dummyjson responded ${res.status}`)
  }
  const all = ((await res.json()) as { products: Dummy[] }).products

  const known = new Set(Object.values(DEPARTMENTS).flatMap((d) => Object.keys(d)))
  const source = all.filter((p) => known.has(p.category))
  logger.info(`Importing ${source.length} of ${all.length} source products`)

  // ---- Prerequisites ------------------------------------------------------
  const { data: salesChannels } = await query.graph({ entity: "sales_channel", fields: ["id", "name"] })
  const { data: shippingProfiles } = await query.graph({ entity: "shipping_profile", fields: ["id"] })
  const { data: stores } = await query.graph({ entity: "store", fields: ["id", "supported_currencies.currency_code"] })
  const salesChannel = salesChannels[0]
  const shippingProfile = shippingProfiles[0]
  if (!salesChannel || !shippingProfile) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "No sales channel / shipping profile. Run the initial seed first.")
  }
  const currencies: string[] = (stores[0]?.supported_currencies ?? [])
    .map((c: any) => c?.currency_code)
    .filter(Boolean)

  // ---- Wipe the t-shirt demo ---------------------------------------------
  const { data: oldProducts } = await query.graph({ entity: "product", fields: ["id"] })
  for (let i = 0; i < oldProducts.length; i += 25) {
    await deleteProductsWorkflow(container).run({ input: { ids: oldProducts.slice(i, i + 25).map((p: any) => p.id) } })
  }
  const { data: oldCategories } = await query.graph({ entity: "product_category", fields: ["id", "parent_category_id"] })
  // children first, then parents
  const children = oldCategories.filter((c: any) => c.parent_category_id)
  const parents = oldCategories.filter((c: any) => !c.parent_category_id)
  if (children.length) await deleteProductCategoriesWorkflow(container).run({ input: children.map((c: any) => c.id) })
  if (parents.length) await deleteProductCategoriesWorkflow(container).run({ input: parents.map((c: any) => c.id) })
  const { data: oldCollections } = await query.graph({ entity: "product_collection", fields: ["id"] })
  if (oldCollections.length) await deleteCollectionsWorkflow(container).run({ input: { ids: oldCollections.map((c: any) => c.id) } })
  logger.info(`Removed ${oldProducts.length} products, ${oldCategories.length} categories, ${oldCollections.length} collections`)

  // ---- Categories (departments -> sub-categories) -------------------------
  const categoryIds: Record<string, { parent: string; child: string }> = {}
  for (const [dept, subs] of Object.entries(DEPARTMENTS)) {
    const { result: parentRes } = await createProductCategoriesWorkflow(container).run({
      input: { product_categories: [{ name: dept, handle: slugify(dept), is_active: true }] },
    })
    const parentId = parentRes[0].id
    const { result: kids } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: Object.values(subs).map((name) => ({
          name, handle: slugify(`${dept}-${name}`), is_active: true, parent_category_id: parentId,
        })),
      },
    })
    Object.keys(subs).forEach((slug, i) => { categoryIds[slug] = { parent: parentId, child: kids[i].id } })
  }
  logger.info(`Created ${Object.keys(DEPARTMENTS).length} departments`)

  // ---- Collections: deals / best sellers / new arrivals -------------------
  const byDiscount = [...source].sort((a, b) => b.discountPercentage - a.discountPercentage)
  const dealIds = new Set(byDiscount.slice(0, 12).map((p) => p.id))
  const bestIds = new Set(
    [...source].filter((p) => !dealIds.has(p.id)).sort((a, b) => b.rating * Math.log(b.stock + 2) - a.rating * Math.log(a.stock + 2)).slice(0, 12).map((p) => p.id)
  )
  const newIds = new Set(
    [...source].filter((p) => !dealIds.has(p.id) && !bestIds.has(p.id)).sort((a, b) => b.id - a.id).slice(0, 12).map((p) => p.id)
  )
  const { result: cols } = await createCollectionsWorkflow(container).run({
    input: {
      collections: [
        { title: "Flash Deals", handle: "todays-deals" },
        { title: "Top Sellers", handle: "best-sellers" },
        { title: "Just In", handle: "new-arrivals" },
      ],
    },
  })
  const [dealsCol, bestCol, newCol] = cols

  // ---- Tags ---------------------------------------------------------------
  const tagValues = [...new Set(source.flatMap((p) => p.tags.map((t) => t.toLowerCase())))]
  const { data: existingTags } = await query.graph({ entity: "product_tag", fields: ["id", "value"] })
  const have = new Map<string, string>(existingTags.map((t: any) => [t.value, t.id]))
  const missing = tagValues.filter((t) => !have.has(t))
  if (missing.length) {
    const { result } = await createProductTagsWorkflow(container).run({ input: { product_tags: missing.map((value) => ({ value })) } })
    result.forEach((t: any) => have.set(t.value, t.id))
  }

  // ---- Products -----------------------------------------------------------
  const products = source.map((p) => {
    const discount = round2(p.discountPercentage)
    const salePrice = p.price * (1 - discount / 100)
    const sizes = SIZED[p.category]
    const brand = p.brand || (p.tags[0] ? p.tags[0][0].toUpperCase() + p.tags[0].slice(1) : "Generic")
    const handle = `${slugify(p.title)}-${p.id}`
    const collection = dealIds.has(p.id) ? dealsCol : bestIds.has(p.id) ? bestCol : newIds.has(p.id) ? newCol : undefined
    const priceFor = (): { amount: number; currency_code: string }[] =>
      currencies.map((currency_code) => ({ amount: round2(salePrice * (FX[currency_code] ?? 1)), currency_code }))
    const images = (p.images?.length ? p.images : [p.thumbnail]).map((url) => ({ url }))
    const sizeOption = sizes ? [{ title: "Size", values: sizes }] : [{ title: "Title", values: ["Default"] }]
    const variants = sizes
      ? sizes.map((s) => ({ title: s, sku: `${p.sku}-${s}`, options: { Size: s }, manage_inventory: false, prices: priceFor() }))
      : [{ title: "Default", sku: p.sku, options: { Title: "Default" }, manage_inventory: false, prices: priceFor() }]

    return {
      title: p.title,
      handle,
      subtitle: brand,
      description: p.description,
      status: ProductStatus.PUBLISHED,
      thumbnail: p.thumbnail,
      images,
      weight: Math.round(p.weight * 50),
      shipping_profile_id: shippingProfile.id,
      collection_id: collection?.id,
      category_ids: [categoryIds[p.category].parent, categoryIds[p.category].child],
      tag_ids: p.tags.map((t) => have.get(t.toLowerCase())).filter(Boolean) as string[],
      sales_channels: [{ id: salesChannel.id }],
      options: sizeOption,
      variants,
      metadata: {
        brand,
        rating: round2(p.rating),
        review_count: 40 + ((p.id * 7919) % 4800),
        stock: p.stock,
        availability: p.availabilityStatus,
        discount_pct: discount,
        sku: p.sku,
        warranty: p.warrantyInformation,
        shipping_info: p.shippingInformation,
        return_policy: p.returnPolicy,
        min_order: p.minimumOrderQuantity,
        reviews: p.reviews.map((r) => ({ rating: r.rating, comment: r.comment, date: r.date, reviewer: r.reviewerName })),
      },
    }
  })

  let created = 0
  for (let i = 0; i < products.length; i += 10) {
    const batch = products.slice(i, i + 10)
    await createProductsWorkflow(container).run({ input: { products: batch as never } })
    created += batch.length
    logger.info(`Created ${created}/${products.length} products`)
  }

  // ---- Make sure the search index caught up -------------------------------
  const search = container.resolve(Modules.SEARCH)
  const { data: allProducts } = await query.graph({ entity: "product", fields: ["id"] })
  for (let i = 0; i < allProducts.length; i += 25) {
    await search.ingest({
      name: "product.created",
      data: allProducts.slice(i, i + 25).map((p: any) => ({ id: p.id })),
    } as never)
  }
  logger.info(`Done. ${allProducts.length} products indexed.`)
}
