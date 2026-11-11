import React, { Suspense } from "react"

import VariantImageGallery from "@modules/products/components/image-gallery/variant-image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import BuyBoxInfo from "@modules/products/components/buy-box-info"
import ProductDetails from "@modules/products/components/product-details"
import ProductReviews from "@modules/products/components/product-reviews"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const department = product.categories?.find((c) => !c.parent_category_id)
  const category = product.categories?.find((c) => c.parent_category_id)
  const crumb = "transition-colors hover:text-indigo-700"

  return (
    <div className="bg-[#f6f7fb]">
      <div className="content-container pb-2 pt-5 text-sm text-gray-500" aria-label="Breadcrumb">
        <LocalizedClientLink href="/" className={crumb}>Home</LocalizedClientLink>
        {department ? (
          <>
            <span className="mx-2">/</span>
            <LocalizedClientLink href={`/categories/${department.handle}`} className={crumb}>
              {department.name}
            </LocalizedClientLink>
          </>
        ) : null}
        {category ? (
          <>
            <span className="mx-2">/</span>
            <LocalizedClientLink href={`/categories/${category.handle}`} className={crumb}>
              {category.name}
            </LocalizedClientLink>
          </>
        ) : null}
      </div>

      <div
        className="content-container grid gap-10 py-6 small:grid-cols-2 small:items-start"
        data-testid="product-container"
      >
        <div className="small:sticky small:top-36">
          <VariantImageGallery product={product} />
        </div>

        <div className="flex flex-col gap-6">
          <ProductInfo product={product} />
          <div className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <ProductActions product={product} region={region} />
          </div>
          <BuyBoxInfo product={product} />
        </div>
      </div>

      <div className="content-container flex flex-col gap-8 py-10">
        <ProductDetails product={product} />
        <ProductReviews product={product} />
      </div>

      <div className="pb-16 pt-4" data-testid="related-products-container">
        <div className="content-container">
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default ProductTemplate
