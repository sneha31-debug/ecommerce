"use client"

import { useParams, useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

type HeaderSearchProps = {
  departments: string[]
}

/** Pill-shaped search with an inline department selector. Results open on the store page. */
export default function HeaderSearch({ departments }: HeaderSearchProps) {
  const router = useRouter()
  const { countryCode } = useParams<{ countryCode: string }>()
  const [query, setQuery] = useState("")
  const [department, setDepartment] = useState("")

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) {
      params.set("product[query]", query.trim())
    }
    if (department) {
      params.set("product[refinementList][category][0]", department)
    }
    const qs = params.toString()
    router.push(`/${countryCode}/store${qs ? `?${qs}` : ""}`)
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      className="flex h-11 w-full items-center overflow-hidden rounded-full border border-gray-300 bg-gray-50 transition focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100"
    >
      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        aria-label="Search department"
        className="hidden h-full max-w-[150px] cursor-pointer border-0 border-r border-gray-200 bg-transparent pl-4 pr-2 text-sm font-medium text-gray-700 outline-none small:block"
      >
        <option value="">All departments</option>
        {departments.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products, brands and more"
        aria-label="Search products"
        className="min-w-0 flex-1 border-0 bg-transparent px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        data-testid="header-search-input"
      />
      <button
        type="submit"
        aria-label="Search"
        className="m-1 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-700"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
    </form>
  )
}
