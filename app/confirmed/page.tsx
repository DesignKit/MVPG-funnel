"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/layout/container";
import { BrandTicker } from "@/components/sections/brand-ticker";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { ProgressTimeline } from "@/components/sections/progress-timeline";
import { TestimonialCarousel } from "@/components/sections/testimonial-carousel";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { Button } from "@/components/ui/button";
import { useFunnelProgress } from "@/lib/hooks/use-funnel-progress";
import { createCheckoutSession } from "@/lib/actions/payment";
import { getPublicPricingTiers } from "@/lib/actions/admin";

interface PricingTier {
  id: string;
  key: string;
  name: string;
  badge: string | null;
  duration: string;
  price_cents: number;
  display_price: string;
  features: string[];
  recommended: boolean;
}

const CASE_STUDIES = [
  {
    title: "Homely Place",
    description:
      "We built an Airbnb-style coworking booking platform that enabled teams to discover and book shared workspaces, launched from idea to live product in just 48 hours.",
    vimeoId: "1108823763",
    href: "https://homely.place/",
    deliveryTime: "48 hours",
  },
  {
    title: "Method Loop",
    description:
      "We created a phygital platform where physical card decks unlock premium digital resources, allowing users to access tools and templates within 80 hours of concept to launch.",
    vimeoId: "1108982548",
    href: "https://methodloop.com/",
    deliveryTime: "80 hours",
  },
];

export default function BookedPage() {
  const { bookingId } = useFunnelProgress();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [tiers, setTiers] = useState<PricingTier[]>([]);

  useEffect(() => {
    getPublicPricingTiers().then(setTiers);
  }, []);

  async function handleTierClick(tierKey: string, isFree: boolean) {
    if (isFree) return;
    setLoadingTier(tierKey);
    try {
      const { url } = await createCheckoutSession(
        tierKey,
        bookingId,
        window.location.origin
      );
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Checkout failed:", err);
      setLoadingTier(null);
    }
  }

  return (
    <>
      {/* Hero / Video */}
      <section className="bg-surface-light-purple py-12">
        <Container className="max-w-2xl">
          <div className="animate-title-entrance text-center">
            <h1 className="font-inter-tight text-3xl font-semibold leading-tight tablet:text-4xl desktop:text-5xl">
              You&apos;re <span className="text-primary">booked!</span>
            </h1>
            <p className="mt-2 text-lg text-foreground">
              Watch this before your call
            </p>
            <p className="mt-4 text-sm text-muted-secondary">
              This 3-minute video explains exactly what happens next so we can
              hit the ground running.
            </p>
          </div>

          {/* Vimeo video embed */}
          <div className="animate-rise-up mt-8 aspect-video overflow-hidden rounded-card">
            <iframe
              src="https://player.vimeo.com/video/1125765201?autopause=0&app_id=122963"
              className="h-full w-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="MVP Gurus — 5 Day MVP Software"
            />
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="bg-white py-16">
        <Container className="max-w-2xl">
          <div className="animate-title-entrance">
            <p className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-accent-purple">
              Timeline
            </p>
            <h2 className="text-center font-inter-tight text-2xl font-semibold tablet:text-3xl">
              What Happens Next
            </h2>
          </div>

          <div className="animate-rise-up mt-10">
            <ProgressTimeline variant="default" />
          </div>

          {/* Must-complete callout */}
          <div className="mt-8 rounded-card border-2 border-primary bg-primary/5 p-6 text-center">
            <p className="font-inter-tight font-semibold text-foreground">
              To make the most of your call, complete your requirements first —
              it only takes 8-10 minutes:
            </p>
            <div className="mt-4">
              <Button href="#pricing-tiers" variant="orange" size="lg">
                Get Started
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Requirements Gathering Options */}
      <section id="pricing-tiers" className="bg-surface-gray py-16">
        <Container>
          <div className="animate-title-entrance">
            <p className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-accent-purple">
              Requirements Gathering
            </p>
            <h2 className="text-center font-inter-tight text-2xl font-semibold tablet:text-3xl">
              Complete your requirements before the call
            </h2>
          </div>

          <div className="animate-rise-up mt-12 grid gap-6 tablet:grid-cols-3">
            {tiers.map((tier) => {
              const isFree = tier.price_cents === 0;
              return (
                <div
                  key={tier.key}
                  className={`relative flex flex-col rounded-card border p-6 transition-shadow hover:shadow-lg ${
                    tier.recommended
                      ? "border-primary bg-primary/5 shadow-card"
                      : "border-border bg-white"
                  }`}
                >
                  {tier.badge && (
                    <span
                      className={`mb-3 inline-block w-fit rounded-pill px-3 py-1 text-xs font-medium ${
                        tier.recommended
                          ? "bg-primary text-white"
                          : "bg-accent-purple/10 text-accent-purple"
                      }`}
                    >
                      {tier.badge}
                    </span>
                  )}
                  <h3 className="font-inter-tight text-lg font-semibold">
                    {tier.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-secondary">
                    {tier.duration}
                  </p>
                  <p className="mt-3 font-inter-tight text-2xl font-semibold">
                    {tier.display_price}
                  </p>
                  <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-secondary">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <svg
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent-purple"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    {isFree ? (
                      <a
                        href="#questionnaire"
                        className="inline-block rounded-pill bg-foreground px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                      >
                        Get Started
                      </a>
                    ) : (
                      <button
                        onClick={() => handleTierClick(tier.key, isFree)}
                        disabled={loadingTier !== null}
                        className={`inline-block rounded-pill px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40 ${
                          tier.recommended
                            ? "bg-primary text-white"
                            : "bg-foreground text-white"
                        }`}
                      >
                        {loadingTier === tier.key
                          ? "Redirecting..."
                          : tier.key === "comprehensive-workshop"
                            ? "Book Now"
                            : "Get Started"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16">
        <Container className="max-w-2xl">
          <div className="animate-title-entrance">
            <p className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-accent-purple">
              FAQ
            </p>
            <h2 className="mb-2 text-center font-inter-tight text-2xl font-semibold tablet:text-3xl">
              Common Questions
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-center text-muted-secondary">
              Find clear answers to the most frequently asked questions about our
              services, process, and collaboration.
            </p>
          </div>
          <div className="animate-rise-up">
            <FaqAccordion />
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="bg-surface-light-purple py-16">
        <Container>
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-accent-purple">
            Testimonials
          </p>
          <h2 className="mb-2 text-center font-inter-tight text-2xl font-semibold tablet:text-3xl">
            Founders Who Launched With Us
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-sm text-muted-secondary">
            Hear from founders who launched their MVP in under a week.
          </p>
          <TestimonialCarousel />
        </Container>
      </section>

      {/* Case Studies */}
      <section className="bg-white py-16">
        <Container>
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-accent-purple">
            Case Studies
          </p>
          <h2 className="mb-10 text-center font-inter-tight text-2xl font-semibold tablet:text-3xl">
            See What We&apos;ve Built
          </h2>
          <div className="flex flex-col gap-10">
            {CASE_STUDIES.map((study, i) => (
              <CaseStudyCard key={study.title} {...study} index={i} />
            ))}
          </div>
        </Container>
      </section>

      <BrandTicker />
    </>
  );
}
