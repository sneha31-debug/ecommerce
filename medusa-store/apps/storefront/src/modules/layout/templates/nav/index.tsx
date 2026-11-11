import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import HeaderSearch from "@modules/layout/components/header-search"
import SideMenu from "@modules/layout/components/side-menu"

const QUICK_LINKS = [
  { name: "Flash Deals", href: "/collections/todays-deals", tone: "text-rose-600" },
  { name: "Top Sellers", href: "/collections/best-sellers", tone: "text-indigo-700" },
  { name: "Just In", href: "/collections/new-arrivals", tone: "text-indigo-700" },
]

const chip =
  "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors hover:bg-indigo-50 hover:text-indigo-700"

export default async function Nav() {
  const [regions, locales, currentLocale, categories] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    listCategories({
      parent_category_id: "null",
      fields: "id,name,handle",
      limit: 20,
    }).catch(() => []),
  ])

  const departments = categories.map((c) => c.name)

  return (
    <div
      className="sticky top-0 inset-x-0 z-50 group border-b border-gray-200 bg-white/95 backdrop-blur"
      id="top"
    >
      <header>
        <nav className="content-container flex h-[68px] items-center gap-4 small:gap-8">
          <LocalizedClientLink
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            data-testid="nav-store-link"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-extrabold text-white shadow-md shadow-indigo-200">
              S
            </span>
            <span className="hidden text-xl font-extrabold tracking-tight text-gray-900 xsmall:inline">
              Shop<span className="text-indigo-600">Sphere</span>
            </span>
          </LocalizedClientLink>

          <div className="mx-auto min-w-0 max-w-2xl flex-1">
            <HeaderSearch departments={departments} />
          </div>

          <LocalizedClientLink
            href="/account"
            className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-gray-700 hover:text-indigo-700 small:flex"
            data-testid="nav-account-link"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            Sign in
          </LocalizedClientLink>

          <div className="shrink-0">
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>

      <div className="relative">
        <nav className="content-container flex h-12 items-center gap-1 overflow-x-auto whitespace-nowrap no-scrollbar text-gray-700">
          <div className="shrink-0 pr-2 [&_button]:rounded-full [&_button]:bg-gray-900 [&_button]:px-4 [&_button]:py-1.5 [&_button]:text-sm [&_button]:font-semibold [&_button]:text-white [&_button:hover]:bg-indigo-700">
            <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
          </div>
          {QUICK_LINKS.map((link) => (
            <LocalizedClientLink
              key={link.href}
              href={link.href}
              className={`${chip} font-semibold ${link.tone}`}
            >
              {link.name}
            </LocalizedClientLink>
          ))}
          <span className="mx-1 h-4 w-px shrink-0 bg-gray-300" aria-hidden="true" />
          {categories.map((category) => (
            <LocalizedClientLink
              key={category.id}
              href={`/categories/${category.handle}`}
              className={chip}
            >
              {category.name}
            </LocalizedClientLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
