import Image from "next/image";
import { Container } from "@/components/layout/container";
import { BrandTicker } from "@/components/sections/brand-ticker";
import { TestimonialCard } from "@/components/sections/testimonial-card";
import { Button } from "@/components/ui/button";

const PROGRESS_STEPS = [
  {
    title: "Contract Awarded",
    description: "Contract finalized and deposit paid, ready to start.",
    status: "completed" as const,
  },
  {
    title: "Requirements Gathering",
    label: "Now",
    description:
      "We'll dive into your business, analyze current goals and progress, and determine if our approach fits your scaling needs.",
    status: "in-progress" as const,
  },
  {
    title: "Clarification Call",
    label: "Next",
    description:
      "Within 1-2 days, meet founders, connect assets, and provide MVP support.",
    status: "upcoming" as const,
  },
  {
    title: "Development Setup",
    description:
      "Over 5 or 10 days, we build your infrastructure, MVP, funnel, and support first users.",
    status: "upcoming" as const,
  },
  {
    title: "Launch, Test & Scale",
    description:
      "A focused 14-day launch and support phase to validate market fit and go live.",
    status: "upcoming" as const,
  },
];

export default function ProjectOutlinePage() {
  return (
    <>
      <section className="bg-surface-light-purple py-12">
        <Container className="max-w-2xl">
          <div className="text-center">
            <h1 className="font-inter-tight text-4xl font-semibold">
              <span className="text-primary">Well done!</span> Access your
              requirements document!
            </h1>
          </div>

          {/* Vimeo video embed — matches Framer baseline */}
          <div className="mt-8 aspect-video overflow-hidden rounded-card">
            <iframe
              src="https://player.vimeo.com/video/1125765201?autopause=0&app_id=122963"
              className="h-full w-full border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="MVP Gurus — 5 Day MVP Software"
            />
          </div>

          {/* Project Progress Tracker */}
          <div className="mt-10 rounded-card bg-white p-8 shadow-card">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-sm font-medium text-foreground">
                Project Progress
              </span>
              <span className="text-xs text-muted-secondary">21 lines</span>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {PROGRESS_STEPS.map((step, index) => (
                <div key={step.title} className="flex items-start gap-4">
                  {/* Status indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                        step.status === "completed"
                          ? "bg-accent-purple text-white"
                          : step.status === "in-progress"
                            ? "bg-primary text-white"
                            : "bg-surface-gray text-muted-secondary"
                      }`}
                    >
                      {step.status === "completed" ? (
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < PROGRESS_STEPS.length - 1 && (
                      <div
                        className={`mt-1 h-8 w-0.5 ${
                          step.status === "completed"
                            ? "bg-accent-purple"
                            : "bg-border"
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-2">
                    <h3 className="font-inter-tight text-sm font-semibold">
                      {step.label && (
                        <span
                          className={`mr-2 rounded-pill px-2 py-0.5 text-xs font-medium ${
                            step.status === "in-progress"
                              ? "bg-primary/10 text-primary"
                              : "bg-accent-purple/10 text-accent-purple"
                          }`}
                        >
                          {step.label}
                        </span>
                      )}
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-secondary">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
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
              Download
            </Button>
          </div>
        </Container>
      </section>

      {/* "What Are Customers Say" section header + Testimonial */}
      <section className="bg-white py-16">
        <Container className="max-w-2xl">
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-muted-secondary">
            Testimonials
          </p>
          <h2 className="mb-2 text-center font-inter-tight text-3xl font-semibold tablet:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-sm text-muted-secondary">
            Explore intelligent tools designed to help you save smarter, spend
            wiser, and stay in full control.
          </p>
          <TestimonialCard
            quote="Anton's a high-class design leader who has worked in very challenging environments. He thrives when faced with challenges. User experience is his bread and butter, and he works tirelessly to champion that mindset. Put all this aside, and you're still graced with an A-grade charismatic person. I am better off having worked closely with him."
            name="Jordan Barnard"
            role="Director @ EY"
            image="/images/avatar-3.webp"
          />
        </Container>
      </section>

      <BrandTicker />
    </>
  );
}
