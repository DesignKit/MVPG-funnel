import { Container } from "@/components/layout/container";
import { BrandTicker } from "@/components/sections/brand-ticker";
import { TestimonialCard } from "@/components/sections/testimonial-card";
import { Button } from "@/components/ui/button";

const BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ17rVD9cfTC9XtrSU0MecoWLyhNC_RlYDpdHG-aJkk4g1v1teplEXYeiQ9GFdTckvJVRu5rB1e6";

export default function SchedulePage() {
  return (
    <>
      <section className="bg-surface-light-purple py-12">
        <Container className="max-w-3xl">
          <div className="text-center">
            <h1 className="font-inter-tight text-3xl font-semibold leading-tight tablet:text-4xl">
              <span className="text-primary">You&apos;re approved!</span> Book a
              time with us below.
            </h1>
            <p className="mt-4 text-muted-secondary">
              The call is for those serious about getting their MVP out quickly
              and efficiently.
            </p>
          </div>

          {/* Google Calendar scheduling embed */}
          <div className="mt-10 overflow-hidden rounded-card bg-white shadow-card">
            <iframe
              src={`${BOOKING_URL}?gv=1`}
              style={{ border: 0 }}
              width="100%"
              height="650"
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
            <Button href="/project-outline-2" variant="primary" size="lg" className="w-full">
              I&apos;ve booked — Continue
            </Button>
            <p className="mt-2 text-xs text-muted-secondary">
              Click after selecting your time slot above.
            </p>
          </div>
        </Container>
      </section>

      <BrandTicker />

      <section className="bg-surface-warm py-16">
        <Container className="max-w-2xl">
          <TestimonialCard
            quote="Anton's a high-class design leader who has worked in very challenging environments. He thrives when faced with challenges. User experience is his bread and butter, and he works tirelessly to champion that mindset. Put all this aside, and you're still graced with an A-grade charismatic person. I am better off having worked closely with him."
            name="Stu French"
            role="Chief Digital Officer @ AGL"
            image="/images/avatar-3.webp"
          />
        </Container>
      </section>
    </>
  );
}
