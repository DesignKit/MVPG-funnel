"use client";

import { useState } from "react";
import Image from "next/image";
import { StarRating } from "@/components/ui/star-rating";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Anton's a high-class design leader who has worked in very challenging environments. He thrives when faced with challenges. User experience is his bread and butter, and he works tirelessly to champion that mindset. Put all this aside, and you're still graced with an A-grade charismatic person. I am better off having worked closely with him.",
    name: "Jordan Barnard",
    role: "Director @ EY",
    image: "/images/avatar-3.webp",
  },
  {
    quote:
      "Rarely do you meet an individual with the vision, strategy, and drive to transform a business. Anton is just such an individual. I worked with him at a large Health systems provider and watched him identify a unique value proposition for our market, which became the critical innovation needed within our business.",
    name: "Troy Bebee",
    role: "CTO @ Google Cloud",
    image: "/images/avatar-1.webp",
  },
  {
    quote:
      "Anton is process-driven, research-focused, switched on and an absolute hoot to work with. An invaluable team member with the innate ability to simplify complex design problems, delivering effective and engaging user experiences. I know, right... an absolute unicorn!",
    name: "Angela Edwards",
    role: "Freelance Padel Trainer",
    image: "/images/avatar-2.webp",
  },
  {
    quote:
      "My business partner and I approached MVP Guru for literally the quickest turnaround of a fencing lead-gen software. We got 3 customers in a week and the first covered the MVP costs (and then some). Thank you for taking us on.",
    name: "Louis W.",
    role: "Founder @ Fences-R-Us",
    image: "/images/testimonial-photo.webp",
  },
  {
    quote:
      "Anton is a deeply impressive Design Leader, with a breadth and depth of wider Digital domain expertise that is extremely rare in the Australian market. Anton brings holistic design thinking outcomes together with commercial acumen and data-driven thinking in a way that informs truly value-additive feature delivery for customers and organisations alike.",
    name: "Stu French",
    role: "Chief Digital Officer @ AGL",
    image: "/images/avatar-1.webp",
  },
];

function QuoteIcon() {
  return (
    <svg
      width="40"
      height="34"
      viewBox="0 0 40 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.4545 15.3592H36.3636C38.3636 15.3592 40 16.9956 40 18.9956V29.9047C40 31.9047 38.3636 33.541 36.3636 33.541H25.4545C23.4545 33.541 21.8182 31.9047 21.8182 29.9047V18.9956C21.8182 16.9956 23.4545 15.3592 25.4545 15.3592ZM3.63636 15.3592H14.5455C16.5455 15.3592 18.1818 16.9956 18.1818 18.9956V29.9047C18.1818 31.9047 16.5455 33.541 14.5455 33.541H3.63636C1.63636 33.541 0 31.9047 0 29.9047V18.9956C0 16.9956 1.63636 15.3592 3.63636 15.3592Z"
        fill="#CBCBCB"
      />
      <path
        d="M30.9102 0.81463C27.2738 4.45099 25.4556 9.90554 25.4556 15.3601V22.6328M9.09197 0.81463C5.45561 4.45099 3.63743 9.90554 3.63743 15.3601V22.6328"
        stroke="#CBCBCB"
        strokeWidth="7.27273"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);

  const prev = () =>
    setIndex((i) => (i === 0 ? TESTIMONIALS.length - 1 : i - 1));
  const next = () =>
    setIndex((i) => (i === TESTIMONIALS.length - 1 ? 0 : i + 1));

  const testimonial = TESTIMONIALS[index];

  return (
    <div className="relative mx-auto max-w-2xl">
      {/* Left arrow */}
      <button
        onClick={prev}
        aria-label="Previous testimonial"
        className="absolute -left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted-secondary transition-colors hover:text-foreground tablet:-left-12"
      >
        <ArrowLeft />
      </button>

      {/* Card */}
      <div className="rounded-card bg-white p-8 shadow-card tablet:p-10">
        {/* Quote icon */}
        <QuoteIcon />

        {/* Quote text */}
        <p className="mt-5 font-geist text-base leading-relaxed text-foreground tablet:text-lg">
          {testimonial.quote}
        </p>

        {/* Stars */}
        <div className="mt-5">
          <StarRating />
        </div>

        {/* Dashed divider */}
        <div className="my-5 border-t border-dashed border-border" />

        {/* Author */}
        <div className="flex items-center gap-3">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
          <div>
            <p className="font-geist text-sm font-semibold text-foreground">
              {testimonial.name}
            </p>
            <p className="font-geist text-sm text-muted-secondary">
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>

      {/* Right arrow */}
      <button
        onClick={next}
        aria-label="Next testimonial"
        className="absolute -right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted-secondary transition-colors hover:text-foreground tablet:-right-12"
      >
        <ArrowRight />
      </button>
    </div>
  );
}
