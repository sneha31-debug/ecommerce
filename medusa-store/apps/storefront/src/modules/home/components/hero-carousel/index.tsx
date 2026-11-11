"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type HeroSlide = {
  eyebrow: string
  title: string
  subtitle: string
  cta: string
  href: string
  image?: string | null
  gradient: string
}

const INTERVAL_MS = 6000

/** A rounded banner card that rotates through featured offers. */
export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || slides.length < 2) {
      return
    }
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      INTERVAL_MS
    )
    return () => window.clearInterval(timer)
  }, [paused, slides.length])

  const go = (next: number) =>
    setIndex((next + slides.length) % slides.length)

  return (
    <section
      className="relative h-[320px] w-full overflow-hidden rounded-3xl shadow-lg shadow-indigo-100 small:h-[360px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured offers"
      data-testid="hero-carousel"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          style={{ background: slide.gradient }}
          aria-hidden={i !== index}
        >
          <div className="flex h-full items-center justify-between gap-6 px-8 pb-10 small:px-14">
            <div className="max-w-lg text-white">
              <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
                {slide.eyebrow}
              </span>
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight small:text-5xl">
                {slide.title}
              </h2>
              <p className="mt-3 text-base text-white/85 small:text-lg">
                {slide.subtitle}
              </p>
              <LocalizedClientLink
                href={slide.href}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow-md transition hover:gap-3 hover:bg-indigo-50"
                tabIndex={i === index ? 0 : -1}
              >
                {slide.cta} <span aria-hidden="true">&rarr;</span>
              </LocalizedClientLink>
            </div>
            {slide.image ? (
              <div className="relative hidden h-[82%] w-[320px] shrink-0 small:block">
                <div className="absolute inset-0 rounded-full bg-white/15 blur-sm" />
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  sizes="320px"
                  className="object-contain p-6 drop-shadow-2xl"
                  priority={i === 0}
                />
              </div>
            ) : null}
          </div>
        </div>
      ))}

      <div className="absolute bottom-5 left-8 flex gap-2 small:left-14">
        {slides.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-4 right-5 hidden gap-2 small:flex">
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous slide"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl text-white backdrop-blur transition hover:bg-white/40"
        >
          &#8249;
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next slide"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl text-white backdrop-blur transition hover:bg-white/40"
        >
          &#8250;
        </button>
      </div>
    </section>
  )
}
