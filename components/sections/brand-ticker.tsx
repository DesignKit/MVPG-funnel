"use client";

import Image from "next/image";

const BRANDS = [
  { src: "/images/brand-logo-1.jpg", alt: "MYER" },
  { src: "/images/brand-logo-2.jpg", alt: "HealthEngine" },
  { src: "/images/brand-logo-3.jpg", alt: "Accenture" },
  { src: "/images/brand-logo-4.jpg", alt: "Origin" },
];

// Repeat enough times so one strip spans well beyond the viewport
const LOGO_SET = [...BRANDS, ...BRANDS, ...BRANDS];

function LogoStrip({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      className="animate-scroll flex shrink-0 items-center gap-24 px-12 tablet:gap-32 tablet:px-16"
      aria-hidden={ariaHidden}
    >
      {LOGO_SET.map((brand, i) => (
        <Image
          key={i}
          src={brand.src}
          alt={ariaHidden ? "" : brand.alt}
          width={500}
          height={500}
          className="h-14 w-32 shrink-0 object-contain tablet:h-16 tablet:w-40"
        />
      ))}
    </div>
  );
}

export function BrandTicker() {
  return (
    <section className="overflow-hidden border-y border-border py-8">
      <p className="mb-6 text-center text-sm lowercase tracking-widest text-muted-secondary">
        trusted by teams around the globe
      </p>
      <div className="relative flex overflow-hidden">
        {/* Fade-out gradients on edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent tablet:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent tablet:w-40" />

        <LogoStrip />
        <LogoStrip ariaHidden />
      </div>
    </section>
  );
}
