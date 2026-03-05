import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

const TRUST_BADGES = [
  "Enterprise-Grade Security",
  "Clear, Upfront Pricing",
  "Secure by Design",
];

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#0c0a1d] py-24">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(149,99,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(149,99,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Crosshair decorative elements — left side */}
      <div className="pointer-events-none absolute left-[12%] top-[18%] h-10 w-10 opacity-20">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-accent-purple" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-accent-purple" />
      </div>
      <div className="pointer-events-none absolute bottom-[15%] left-[25%] h-8 w-8 opacity-10">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-accent-purple" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-accent-purple" />
      </div>

      {/* Crosshair decorative elements — right side (larger, framing the phone) */}
      <div className="pointer-events-none absolute right-[8%] top-[10%] h-16 w-16 opacity-25">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-accent-lavender" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-accent-lavender" />
      </div>
      <div className="pointer-events-none absolute bottom-[12%] right-[15%] h-14 w-14 opacity-20">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-accent-purple" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-accent-purple" />
      </div>
      <div className="pointer-events-none absolute right-[30%] top-[25%] h-6 w-6 opacity-15">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-accent-lavender" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-accent-lavender" />
      </div>

      <Container>
        <div className="flex flex-col items-center gap-12 tablet:flex-row tablet:items-center tablet:gap-16">
          {/* Left: Text content */}
          <div className="flex-1 text-center tablet:text-left">
            <h2 className="animate-title-entrance font-inter-tight text-[32px] font-extrabold tracking-tight leading-[1.1] text-white tablet:text-[46px]">
              Let&apos;s Build Your Startup In The Next 5 Days!
            </h2>
            <div className="animate-spring-pop">
              <p className="mx-auto mt-6 max-w-lg text-white/60 tablet:mx-0">
                Complete the form below to book a consultation and discover how
                we can help elevate and scale your business.
              </p>

              {/* Gradient CTA button */}
              <Button href="/apply" variant="gradient" size="lg" className="mt-10">
                Get Started Today
                <span className="cta-arrow-flip ml-2">
                  <svg className="cta-arrow-out" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                  <svg className="cta-arrow-in" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </span>
              </Button>

              {/* Trust badges — double checkmarks */}
              <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 tablet:justify-start">
                {TRUST_BADGES.map((badge) => (
                  <div
                    key={badge}
                    className="flex items-center gap-2 text-sm text-white/45"
                  >
                    <svg
                      className="h-4 w-6 shrink-0 text-accent-purple"
                      viewBox="0 0 28 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10 2l-6 6-3-3" />
                      <path d="M24 2l-6 6-3-3" />
                    </svg>
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Phone mockup — aggressively cropped, bleeding out bottom */}
          <div className="animate-rise-up relative flex-1 tablet:mb-[-120px] tablet:mr-[-80px]">
            <Image
              src="/images/phone-mockup.png"
              alt="MVP Gurus platform preview"
              width={1500}
              height={800}
              className="rounded-card"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
