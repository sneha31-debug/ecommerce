import Image from "next/image"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type DepartmentCard = {
  name: string
  handle: string
  products: HttpTypes.StoreProduct[]
}

const TINTS = [
  "bg-indigo-50 hover:bg-indigo-100",
  "bg-amber-50 hover:bg-amber-100",
  "bg-rose-50 hover:bg-rose-100",
  "bg-emerald-50 hover:bg-emerald-100",
  "bg-sky-50 hover:bg-sky-100",
  "bg-violet-50 hover:bg-violet-100",
  "bg-orange-50 hover:bg-orange-100",
]

/** One big tile per department: a name, a photo and an arrow. */
export default function DepartmentCards({
  departments,
  children,
}: {
  departments: DepartmentCard[]
  children?: React.ReactNode
}) {
  return (
    <ul className="grid grid-cols-2 gap-4 small:grid-cols-4">
      {departments.map((department, i) => {
        const image = department.products[0]?.thumbnail
        return (
          <li key={department.handle}>
            <LocalizedClientLink
              href={`/categories/${department.handle}`}
              className={`group relative flex h-44 flex-col justify-between overflow-hidden rounded-3xl p-5 transition ${TINTS[i % TINTS.length]}`}
            >
              <div className="relative z-10 max-w-[60%]">
                <h3 className="text-lg font-extrabold leading-tight text-gray-900">
                  {department.name}
                </h3>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 transition-all group-hover:gap-2">
                  Explore <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
              {image ? (
                <div className="absolute -bottom-2 -right-2 h-32 w-32 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-contain drop-shadow-lg"
                  />
                </div>
              ) : null}
            </LocalizedClientLink>
          </li>
        )
      })}
      {children}
    </ul>
  )
}
