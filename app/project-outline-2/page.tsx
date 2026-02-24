import { Container } from "@/components/layout/container";
import { BrandTicker } from "@/components/sections/brand-ticker";
import { TestimonialCard } from "@/components/sections/testimonial-card";
import { Button } from "@/components/ui/button";

export default function ProjectOutlinePage() {
  return (
    <>
      <section className="bg-surface-light-purple py-12">
        <Container className="max-w-2xl">
          <div className="text-center">
            <h1 className="font-inter-tight text-4xl font-semibold">
              <span className="text-primary">Well done!</span>
            </h1>
            <p className="mt-4 text-muted-secondary">
              Review your project outline below.
            </p>
          </div>

          {/* Project outline content */}
          <div className="mt-10 rounded-card bg-white p-8 shadow-card">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-sm text-muted-secondary">
                Project Outline
              </span>
              <span className="text-xs text-muted-secondary">21 lines</span>
            </div>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-secondary">
              <p>
                Your project outline will appear here after our AI processes
                your consultation responses. It will include:
              </p>
              <ul className="list-inside list-disc space-y-1">
                <li>Project summary and goals</li>
                <li>Core MVP features</li>
                <li>Technical scope and stack</li>
                <li>Timeline and milestones</li>
                <li>Delivery expectations</li>
              </ul>
            </div>
          </div>

          {/* Download button */}
          <div className="mt-6 text-center">
            <Button variant="primary" size="default">
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
              Download File
            </Button>
          </div>

          {/* Continue to booked */}
          <div className="mt-6 text-center">
            <Button href="/booked" variant="primary" size="lg" className="w-full">
              Continue to Booking
            </Button>
          </div>
        </Container>
      </section>

      <BrandTicker />

      {/* Testimonial */}
      <section className="bg-surface-warm py-16">
        <Container className="max-w-2xl">
          <h2 className="mb-8 text-center font-inter-tight text-2xl font-semibold">
            What Our Customers Say
          </h2>
          <TestimonialCard
            quote="My business partner and I approached MVP Guru for literally the quickest turnaround of a fencing lead-gen software. We got 3 customers in a week and the first covered the MVP costs (and then some). Thank you for taking us on."
            name="Louis W."
            role="Founder"
            image="/images/testimonial-photo.webp"
          />
        </Container>
      </section>
    </>
  );
}
