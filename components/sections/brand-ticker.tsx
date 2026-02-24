"use client";

import Image from "next/image";

const BRANDS = [
  { src: "/images/brand-1.png", alt: "Brand 1" },
  { src: "/images/brand-2.png", alt: "Brand 2" },
  { src: "/images/brand-3.png", alt: "Brand 3" },
  { src: "/images/brand-4.png", alt: "Brand 4" },
  { src: "/images/brand-5.png", alt: "Brand 5" },
  { src: "/images/brand-6.png", alt: "Brand 6" },
  { src: "/images/brand-7.png", alt: "Brand 7" },
  { src: "/images/brand-8.png", alt: "Brand 8" },
  { src: "/images/brand-9.png", alt: "Brand 9" },
];

export function BrandTicker() {
  return (
    <section className="overflow-hidden border-y border-border py-6">
      <p className="mb-4 text-center text-xs uppercase tracking-widest text-muted-secondary">
        trusted by teams around the globe
      </p>
      <div className="relative flex overflow-hidden">
        <div className="animate-scroll flex shrink-0 items-center gap-12 px-6">
          {BRANDS.map((brand, i) => (
            <Image
              key={i}
              src={brand.src}
              alt={brand.alt}
              width={120}
              height={40}
              className="h-8 w-auto object-contain opacity-60 grayscale"
            />
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div
          className="animate-scroll flex shrink-0 items-center gap-12 px-6"
          aria-hidden
        >
          {BRANDS.map((brand, i) => (
            <Image
              key={`dup-${i}`}
              src={brand.src}
              alt=""
              width={120}
              height={40}
              className="h-8 w-auto object-contain opacity-60 grayscale"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
