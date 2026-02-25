import { Container } from "@/components/layout/container";
import { BrandTicker } from "@/components/sections/brand-ticker";
import { TestimonialCard } from "@/components/sections/testimonial-card";

const FAQ_ITEMS = [
  {
    question: "What services does MVP Gurus provide?",
    answer:
      "We provide end-to-end MVP development — from requirements gathering and UX design to full-stack development and deployment. We turn your idea into a launch-ready product in just 5 days.",
  },
  {
    question: "Who is MVP Gurus best suited for?",
    answer:
      "We work with startup founders, entrepreneurs, and businesses who want to validate an idea quickly without spending months and tens of thousands on traditional development.",
  },
  {
    question: "How long does it take to develop an MVP?",
    answer:
      "Most MVPs are delivered within 5 working days. Complex projects may take up to 10 days. We'll give you a clear timeline during the requirements call.",
  },
  {
    question: "How does the collaboration process work?",
    answer:
      "It starts with a 60-90 minute requirements call, then we handle design and development while keeping you updated. You'll have real users on your product within days.",
  },
  {
    question: "How is pricing determined?",
    answer:
      "Pricing depends on the scope and complexity of your MVP. We offer three workshop tiers, and the Comprehensive Workshop fee is deducted from the MVP build cost if you proceed.",
  },
];

const PRICING_TIERS = [
  {
    name: "AI Workshop",
    badge: "Recommended for you",
    duration: "8-10 minutes",
    price: "Included",
    features: [
      "Detailed requirements gathering at a rapid pace",
      "AI driven insights",
      "Detailed sprint planning",
      "For serious users who want it all",
    ],
    recommended: true,
  },
  {
    name: "Comprehensive Product Workshop",
    badge: null,
    duration: "4-5 hours",
    price: "$1,200",
    features: [
      "Deducted from MVP build",
      "Complete stakeholder alignment",
      "Comprehensive tech architecture",
      "Built for large organizations' needs",
    ],
    recommended: false,
  },
  {
    name: "Questionnaire",
    badge: "Get started",
    duration: "60-90 minutes",
    price: "FREE",
    features: [
      "Detailed requirements gathering at your own pace",
      "Comprehensive context",
      "For individuals who want the basics",
    ],
    recommended: false,
  },
];

const ROADMAP_STEPS = [
  {
    number: 1,
    title: "Complete Your Profile",
    description: "Add your basic project information",
    status: "Completed",
  },
  {
    number: 2,
    title: "Submit Your Project Brief",
    description: "Tell us about your product idea and goals",
    status: "Completed",
  },
  {
    number: 3,
    title: "Schedule a Discovery Call",
    description: "Book a session with the MVP Gurus team",
    status: "New",
  },
  {
    number: 4,
    title: "Confirm Project Setup",
    description: "Review and approve the project plan",
    status: "Upcoming",
  },
  {
    number: 5,
    title: "Launch & Validate",
    description: "Test and validate your MVP",
    status: "Upcoming",
  },
];

export default function BookedPage() {
  return (
    <>
      {/* Hero / Video */}
      <section className="bg-surface-light-purple py-12">
        <Container className="max-w-2xl">
          <div className="text-center">
            <h1 className="font-inter-tight text-4xl font-semibold">
              You&apos;re <span className="text-primary">booked!</span>
            </h1>
            <p className="mt-2 text-lg text-foreground">
              Watch to confirm your call!
            </p>
            <p className="mt-4 text-sm text-muted-secondary">
              Important:
              <br />
              Please watch the video below to understand the process before we
              meet.
            </p>
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
        </Container>
      </section>

      {/* Pricing / Next Steps */}
      <section className="bg-white py-16">
        <Container>
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-accent-purple">
            Steps
          </p>
          <h2 className="text-center font-inter-tight text-3xl font-semibold tablet:text-4xl">
            Next Steps
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-muted-secondary">
            Choose the approach that best aligns with your product maturity and
            organizational needs.
          </p>

          <div className="mt-12 grid gap-6 tablet:grid-cols-3">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-card border p-6 ${
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
                  {tier.price}
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
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* MVP Roadmap */}
      <section className="bg-surface-gray py-16">
        <Container className="max-w-2xl">
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-accent-purple">
            Timeline
          </p>
          <h2 className="text-center font-inter-tight text-3xl font-semibold">
            MVP Roadmap
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-muted-secondary">
            A structured overview of each project phase, showing progress, key
            milestones, and the current stage to ensure transparency and clear
            expectations throughout the process.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {ROADMAP_STEPS.map((step) => (
              <div
                key={step.number}
                className="flex items-start gap-4 rounded-card bg-white p-5 shadow-card"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-purple text-sm font-medium text-white">
                  {step.number}
                </span>
                <div className="flex-1">
                  <h3 className="font-inter-tight font-semibold">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-secondary">
                    {step.description}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-pill px-3 py-1 text-xs font-medium ${
                    step.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : step.status === "New"
                        ? "bg-primary/10 text-primary"
                        : "bg-surface-gray text-muted-secondary"
                  }`}
                >
                  {step.status}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16">
        <Container className="max-w-2xl">
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-accent-purple">
            FAQ
          </p>
          <h2 className="mb-2 text-center font-inter-tight text-3xl font-semibold">
            Common Questions
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-center text-muted-secondary">
            Find clear answers to the most frequently asked questions about our
            services, process, and collaboration.
          </p>
          <div className="flex flex-col gap-4">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group rounded-card border border-border bg-white p-6"
              >
                <summary className="flex cursor-pointer items-center justify-between font-medium">
                  {item.question}
                  <span className="ml-4 text-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-secondary">
                  {item.answer}
                </p>
              </details>
            ))}
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
