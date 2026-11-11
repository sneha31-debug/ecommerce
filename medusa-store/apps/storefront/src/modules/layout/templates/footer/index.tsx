import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const COLUMNS: { title: string; links: { name: string; href: string }[] }[] = [
  {
    title: "Company",
    links: [
      { name: "Contact us", href: "/contact" },
      { name: "Terms of use", href: "/terms" },
      { name: "Privacy notice", href: "/privacy" },
    ],
  },
  {
    title: "Discover",
    links: [
      { name: "Flash Deals", href: "/collections/todays-deals" },
      { name: "Top Sellers", href: "/collections/best-sellers" },
      { name: "Just In", href: "/collections/new-arrivals" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Your account", href: "/account" },
      { name: "Your orders", href: "/account/orders" },
      { name: "Shipping", href: "/shipping" },
      { name: "Returns", href: "/returns" },
      { name: "Your cart", href: "/cart" },
    ],
  },
]

export default async function Footer() {
  const categories = await listCategories({
    parent_category_id: "null",
    fields: "id,name,handle",
    limit: 20,
  }).catch(() => [])

  const linkClass = "text-sm text-gray-600 transition-colors hover:text-indigo-700"

  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="content-container grid gap-10 py-12 xsmall:grid-cols-2 small:grid-cols-5">
        <div className="small:col-span-1">
          <LocalizedClientLink href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-extrabold text-white">
              S
            </span>
            <span className="text-xl font-extrabold tracking-tight text-gray-900">
              Shop<span className="text-indigo-600">Sphere</span>
            </span>
          </LocalizedClientLink>
          <p className="mt-4 max-w-xs text-sm text-gray-500">
            Everything you need in one place: electronics, fashion, home, beauty, grocery and sports.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Departments</h3>
          <ul className="flex flex-col gap-2.5" data-testid="footer-categories">
            {categories.map((category) => (
              <li key={category.id}>
                <LocalizedClientLink href={`/categories/${category.handle}`} className={linkClass}>
                  {category.name}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">{column.title}</h3>
            <ul className="flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.name}>
                  <LocalizedClientLink href={link.href} className={linkClass}>
                    {link.name}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 py-5">
        <div className="content-container flex flex-col items-center justify-between gap-2 text-center text-xs text-gray-500 small:flex-row">
          <span>&copy; {new Date().getFullYear()} ShopSphere. All rights reserved.</span>
          <span>Demo store: product data and photos come from dummyjson.com, and no real orders are placed.</span>
        </div>
      </div>
    </footer>
  )
}
