import { Container } from "@/components/layout/container";
import { BrandTicker } from "@/components/sections/brand-ticker";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { ProgressTimeline } from "@/components/sections/progress-timeline";
import { TestimonialCard } from "@/components/sections/testimonial-card";
import { Button } from "@/components/ui/button";

export default function ProjectOutlinePage() {
  return (
    <>
      <section className="bg-surface-light-purple py-12">
        <Container className="max-w-2xl">
          <div className="animate-title-entrance text-center">
            <h1 className="font-inter-tight text-3xl font-semibold leading-tight tablet:text-4xl desktop:text-5xl">
              <span className="text-primary">Well done!</span> Access your
              requirements document!
            </h1>
          </div>

          {/* Vimeo video embed */}
          <div className="animate-rise-up mt-8 aspect-video overflow-hidden rounded-card">
            <iframe
              src="https://player.vimeo.com/video/1125765201?autopause=0&app_id=122963"
              className="h-full w-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="MVP Gurus — Congratulations"
            />
          </div>

          {/* Project Progress Tracker — post-workshop variant */}
          <div className="animate-rise-up mt-10">
            <ProgressTimeline variant="post-workshop" />
          </div>

          {/* Download button (placeholder — will be wired to Supabase later) */}
          <div className="mt-6 text-center">
            <Button variant="primary" size="default" disabled>
              <span className="mr-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              </span>
              Download Project Outline
            </Button>
            <p className="mt-2 text-xs text-muted-secondary">
              Your outline will be emailed to you shortly. We&apos;ll also review it before your call.
            </p>
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

      {/* Testimonial */}
      <section className="bg-surface-light-purple py-16">
        <Container className="max-w-2xl">
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-accent-purple">
            Testimonials
          </p>
          <h2 className="mb-2 text-center font-inter-tight text-2xl font-semibold tablet:text-3xl">
            Join 80+ Founders Who Shipped Fast
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-sm text-muted-secondary">
            Hear from founders who launched their MVP in under a week.
          </p>
          <TestimonialCard
            quote="My business partner and I approached MVP Guru for literally the quickest turnaround of a fencing lead-gen software. We got 3 customers in a week and the first covered the MVP costs (and then some). Thank you for taking us on."
            name="Louis W."
            role="Founder @ Fences-R-Us"
            image="/images/testimonial-photo.webp"
          />
        </Container>
      </section>

      <BrandTicker />
    </>
  );
}
