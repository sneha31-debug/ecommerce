"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selected, setSelected] = useState(0)
  const current = images[Math.min(selected, images.length - 1)]

  if (!current) {
    return null
  }

  return (
    <div className="flex flex-col gap-4" data-testid="image-gallery">
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-indigo-50/60 ring-1 ring-gray-100">
        {current.url ? (
          <Image
            key={current.id}
            src={current.url}
            alt="Product image"
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 560px"
            className="object-contain p-8"
          />
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="flex gap-3">
          {images.map((image, index) => (
            <li key={image.id}>
              <button
                type="button"
                onMouseEnter={() => setSelected(index)}
                onClick={() => setSelected(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === selected}
                className={`relative block h-20 w-20 overflow-hidden rounded-2xl bg-gray-50 transition ${
                  index === selected
                    ? "ring-2 ring-indigo-600"
                    : "ring-1 ring-gray-200 hover:ring-indigo-300"
                }`}
              >
                {image.url ? (
                  <Image src={image.url} alt="" fill sizes="80px" className="object-contain p-1.5" />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default ImageGallery
