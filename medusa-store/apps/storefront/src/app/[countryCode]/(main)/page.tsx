import { Metadata } from "next"

import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import DepartmentCards from "@modules/home/components/department-cards"
import HeroCarousel, { HeroSlide } from "@modules/home/components/hero-carousel"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Rail from "@modules/home/components/rail"
import { getRegion, listRegions } from "@lib/data/regions"
import { toJsonLd } from "@lib/util/product-structured-data"
import { getSiteOrigin, listCountryCodes, STORE_NAME } from "@lib/util/site"
import { buildRegionsReturnPolicies } from "@lib/util/store-policies"

export const dynamic = "force-static"
export const revalidate = 60

export async function generateMetadata(props: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await props.params
  const [origin, regions] = await Promise.all([getSiteOrigin(), listRegions()])

  return {
    title: "ShopSphere: everything you need, delivered",
    description:
      "Shop thousands of products across electronics, home and kitchen, beauty, fashion, grocery and sports.",
    alternates: {
      canonical: `${origin}/${countryCode}`,
      languages: {
        ...Object.fromEntries(
          listCountryCodes(regions).map((code) => [
            `en-${code.toUpperCase()}`,
            `${origin}/${code}`,
          ])
        ),
        "x-default": origin,
      },
    },
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const [{ collections }, departments] = await Promise.all([
    listCollections({ fields: "id, handle, title" }),
    listCategories({
      parent_category_id: "null",
      fields: "id,name,handle",
      limit: 20,
    }),
  ])

  if (!collections || !region) {
    return null
  }

  const fetchProducts = (
    params: { collection_id?: string[]; category_id?: string[] },
    limit = 12
  ) =>
    listProducts({
      regionId: region.id,
      queryParams: { ...params, limit, fields: "*variants.calculated_price,+metadata" },
    }).then(({ response }) => response.products)

  const collection = (handle: string) =>
    collections.find((c) => c.handle === handle)
  const department = (handle: string) =>
    departments.find((c) => c.handle === handle)

  const [deals, best, fresh, electronics, home, womens, departmentProducts] =
    await Promise.all([
      fetchProducts({ collection_id: [collection("todays-deals")?.id ?? ""] }),
      fetchProducts({ collection_id: [collection("best-sellers")?.id ?? ""] }),
      fetchProducts({ collection_id: [collection("new-arrivals")?.id ?? ""] }),
      fetchProducts({ category_id: [department("electronics")?.id ?? ""] }),
      fetchProducts({ category_id: [department("home-and-kitchen")?.id ?? ""] }),
      fetchProducts({ category_id: [department("women-s-fashion")?.id ?? ""] }),
      Promise.all(
        departments.map((d) => fetchProducts({ category_id: [d.id] }, 4))
      ),
    ])

  const slides: HeroSlide[] = [
    {
      eyebrow: "Limited time",
      title: "Flash deals: up to 20% off",
      subtitle: "Hand-picked savings across every department, refreshed daily.",
      cta: "Shop the deals",
      href: "/collections/todays-deals",
      image: deals[0]?.thumbnail,
      gradient: "linear-gradient(120deg, #4338ca 0%, #6d28d9 60%, #c026d3 130%)",
    },
    {
      eyebrow: "Tech",
      title: "Phones, laptops and tablets",
      subtitle: "Upgrade your setup with the latest electronics and accessories.",
      cta: "Shop electronics",
      href: "/categories/electronics",
      image: electronics[0]?.thumbnail,
      gradient: "linear-gradient(120deg, #0f766e 0%, #0891b2 60%, #38bdf8 130%)",
    },
    {
      eyebrow: "Style",
      title: "Fresh fashion for every season",
      subtitle: "Dresses, shoes, handbags, watches and more, for men and women.",
      cta: "Shop fashion",
      href: "/categories/women-s-fashion",
      image: womens[0]?.thumbnail,
      gradient: "linear-gradient(120deg, #be185d 0%, #e11d48 60%, #fb923c 130%)",
    },
    {
      eyebrow: "Home",
      title: "Make your space your own",
      subtitle: "Furniture, decor and kitchen essentials delivered to your door.",
      cta: "Shop home & kitchen",
      href: "/categories/home-and-kitchen",
      image: home[0]?.thumbnail,
      gradient: "linear-gradient(120deg, #047857 0%, #16a34a 60%, #a3e635 130%)",
    },
  ]

  const departmentCards = departments.map((d, i) => ({
    name: d.name,
    handle: d.handle,
    products: departmentProducts[i] ?? [],
  }))

  const [origin, regions] = await Promise.all([getSiteOrigin(), listRegions()])
  const homeUrl = `${origin}/${countryCode}`
  const returnPolicies = buildRegionsReturnPolicies(regions)
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: STORE_NAME,
      url: origin,
      ...(returnPolicies.length
        ? { hasMerchantReturnPolicy: returnPolicies }
        : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: STORE_NAME,
      url: homeUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${homeUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(structuredData) }}
      />
      <div className="bg-[#f6f7fb] pb-16">
        <div className="content-container flex flex-col gap-12 pt-6">
          <HeroCarousel slides={slides} />

          <section>
            <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-gray-900">
              Browse departments
            </h2>
            <DepartmentCards departments={departmentCards}>
              <li>
                <LocalizedClientLink
                  href="/account"
                  className="flex h-44 flex-col justify-between rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 text-white transition hover:shadow-xl hover:shadow-indigo-200"
                >
                  <div>
                    <h3 className="text-lg font-extrabold leading-tight">Join ShopSphere</h3>
                    <p className="mt-1 text-sm text-white/80">
                      Save your details, track orders and get free delivery over 50.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-bold">
                    Create account <span aria-hidden="true">&rarr;</span>
                  </span>
                </LocalizedClientLink>
              </li>
            </DepartmentCards>
          </section>

          <Rail title="Flash deals" subtitle="Biggest savings right now" href="/collections/todays-deals" products={deals} region={region} />
          <Rail title="Top sellers" subtitle="What everyone is buying" href="/collections/best-sellers" products={best} region={region} />
          <Rail title="Tech picks" href="/categories/electronics" products={electronics} region={region} />
          <Rail title="Just in" subtitle="Fresh arrivals this week" href="/collections/new-arrivals" products={fresh} region={region} />
          <Rail title="For your home" href="/categories/home-and-kitchen" products={home} region={region} />
        </div>
      </div>
    </>
  )
}
