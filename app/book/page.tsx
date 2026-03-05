import { Container } from "@/components/layout/container";
import { BrandTicker } from "@/components/sections/brand-ticker";
import { TestimonialCarousel } from "@/components/sections/testimonial-carousel";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { Button } from "@/components/ui/button";

const BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ17rVD9cfTC9XtrSU0MecoWLyhNC_RlYDpdHG-aJkk4g1v1teplEXYeiQ9GFdTckvJVRu5rB1e6";

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
    title: "Med Clear",
    description:
      "We delivered a compliant medical certificate marketplace connecting businesses through consent-based workflows, enabling instant vetting and real transactions within 72 hours.",
    vimeoId: "1109587785",
    href: "#",
    deliveryTime: "72 hours",
  },
];

export default function SchedulePage() {
  return (
    <>
      <section className="bg-surface-light-purple py-12">
        <Container className="w-[80vw] max-w-6xl">
          <div className="text-center">
            <h1 className="animate-title-entrance font-inter-tight text-3xl font-semibold leading-tight tablet:text-4xl desktop:text-5xl">
              <span className="text-primary">You&apos;re approved!</span> Book a
              time with us below.
            </h1>
            <p className="animate-spring-pop mt-4 max-w-2xl mx-auto text-muted-secondary">
              This call is for founders ready to move fast — please only book
              if you&apos;ll show up.
            </p>
          </div>

          {/* Google Calendar scheduling embed */}
          <div className="animate-rise-up mt-10 overflow-hidden rounded-card bg-white shadow-card">
            <iframe
              src={`${BOOKING_URL}?gv=1`}
              style={{ border: 0 }}
              width="100%"
              height="820"
              title="Book a consultation with MVP Gurus"
              frameBorder="0"
            />
          </div>

          {/* Fallback link in case embed is blocked */}
          <p className="mt-4 text-center text-sm text-muted-secondary">
            Can&apos;t see the scheduler?{" "}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Open booking page
            </a>
          </p>

          {/* Continue once booked */}
          <div className="mt-8 text-center">
            <Button href="/confirmed" variant="primary" size="lg" className="w-full">
              I&apos;ve booked — Continue
            </Button>
            <p className="mt-2 text-xs text-muted-secondary">
              Click after selecting your time slot above.
            </p>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16">
        <Container>
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-accent-purple">
            Testimonials
          </p>
          <h2 className="mb-8 text-center font-inter-tight text-2xl font-semibold tablet:text-3xl">
            Don&apos;t Just Take Our Word For It
          </h2>
          <TestimonialCarousel />
        </Container>
      </section>

      {/* Case Studies */}
      <section className="bg-surface-light-purple py-16">
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
