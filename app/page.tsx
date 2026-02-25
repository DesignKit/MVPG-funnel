import Image from "next/image";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { BrandTicker } from "@/components/sections/brand-ticker";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { TestimonialCarousel } from "@/components/sections/testimonial-carousel";
import { CtaSection } from "@/components/sections/cta-section";

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
  {
    title: "Method Loop",
    description:
      "We created a phygital platform where physical card decks unlock premium digital resources, allowing users to access tools and templates within 80 hours of concept to launch.",
    vimeoId: "1108982548",
    href: "https://methodloop.com/",
    deliveryTime: "80 hours",
  },
];

const HOW_IT_WORKS = [
  {
    number: "01",
    title: "Build What Your Users Actually Want",
    description:
      '60-90 minutes requirements call to strip away the fluff and nail your vision, users, solution and process. No endless meetings. Just a bulletproof plan that gets real users saying "finally!"',
  },
  {
    number: "02",
    title: "Have Real Users On Your App In Days Not Weeks Or Months",
    description:
      "While your competitors are still wireframing, you'll have real users clicking, testing, and giving feedback. We handle the tech. You get the validation.",
  },
  {
    number: "03",
    title: "Turn Real User Feedback Into Real Growth",
    description:
      'Know exactly what delights your users instead of guessing. Real feedback from real people using your real product. No more "will they love it?" - they\'ll show you. That\'s real validation.',
  },
];

const TEAM = [
  {
    name: "Anton",
    role: "Sr. User Experience Designer",
    bio: "With over 12-years experience as a UX designer and Product Manager, Anton loves building fast, user-centric, AI-powered MVPs. His focus is startups, product-market-fit and building and scaling products with speed and precision. Clients include Myer, Telstra, Versent, flybuys, Origin Energy and a host of large enterprise and startups in the healthcare, education and retail industries.",
    image: "/images/team-anton.png",
  },
  {
    name: "Tanuj",
    role: "Full-Stack Developer, AI Engineer",
    bio: "Tanuj is a founder and a detail oriented techie! He started his career 8 years ago where he worked with Fortune 500 and National brands in innovation, technology, strategy, and new venture. In 2025, he took his passion for software into his own hands, where he built multiple platforms in various industries in rapid succession.",
    image: "/images/team-tanuj.png",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white pb-20 pt-12">
        <Container className="text-center">
          <h1 className="mx-auto max-w-4xl font-inter-tight text-4xl font-semibold leading-tight tablet:text-5xl desktop:text-6xl">
            Give Us 5 Days And We&apos;ll Deliver Your Launch-Ready MVP Or{" "}
            <span className="text-primary">You Don&apos;t Pay!</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-secondary">
            AI may get you started but we&apos;re here for step 2 and beyond.
          </p>
          <Button href="/register" variant="primary" size="lg" className="mt-8">
            Get Started Today
          </Button>

          {/* Social proof */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <Image
                  src="/images/avatar-1.webp"
                  alt=""
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-white"
                />
                <Image
                  src="/images/avatar-2.webp"
                  alt=""
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-white"
                />
                <Image
                  src="/images/avatar-3.webp"
                  alt=""
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-white"
                />
              </div>
              <span className="text-sm font-medium">
                <strong className="text-2xl">80+</strong>
              </span>
            </div>
            <div className="text-sm font-medium">
              <strong className="text-2xl">4.5+</strong>
              <span className="ml-1 text-primary-gold">★</span>
            </div>
            <div className="text-sm text-muted-secondary">
              <strong className="text-lg font-medium text-foreground">
                1,000+
              </strong>{" "}
              Customers joined
            </div>
          </div>

          {/* Hero image — 3 phone composite */}
          <div className="relative mx-auto mt-12 max-w-4xl">
            <Image
              src="/images/hero-mockup.png"
              alt="MVP Gurus platform preview"
              width={1500}
              height={1140}
              className="rounded-card"
              priority
            />
          </div>
        </Container>
      </section>

      {/* ── Brand Ticker ── */}
      <BrandTicker />

      {/* ── About ── */}
      <section id="about" className="bg-surface-light-purple py-20">
        <Container>
          <div className="mb-4 flex justify-center">
            <span className="rounded-pill border border-border bg-white px-4 py-1.5 text-sm text-muted">
              About
            </span>
          </div>
          <h2 className="mx-auto max-w-3xl text-center font-inter-tight text-3xl font-semibold leading-tight tablet:text-4xl desktop:text-5xl">
            We Rapidly Build MVP Software For Your Business
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-muted-secondary">
            Tired of wrangling with AI or vibe code or dealing with developers;
            endless delays, overpromises, and &ldquo;we&apos;ll update you
            soon&rdquo; excuses? Here&apos;s the brutal truth: Every day you
            wait, someone else is building YOUR idea.
          </p>

          {/* Promo video */}
          <div className="mx-auto mt-12 max-w-3xl">
            <div
              className="relative overflow-hidden rounded-card"
              style={{ paddingTop: "56.09%" }}
            >
              <iframe
                src="https://player.vimeo.com/video/1125765201?autopause=0&app_id=122963"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                title="MVPgurus.com | 5 Day MVP Software"
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Case Studies ── */}
      <section id="our-project" className="bg-white py-20">
        <Container>
          <div className="mb-4 flex justify-center">
            <span className="rounded-pill border border-border bg-white px-4 py-1.5 text-sm text-muted">
              Our Work
            </span>
          </div>
          <h2 className="text-center font-inter-tight text-3xl font-semibold tablet:text-4xl">
            Our Projects
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-muted-secondary">
            A collection of projects we&apos;ve delivered with purpose and
            precision.
          </p>
          <div className="mt-12 flex flex-col gap-16 overflow-visible">
            {CASE_STUDIES.map((study, i) => (
              <div
                key={study.title}
                className="sticky z-[1]"
                style={{ top: `${120 + i * 60}px` }}
              >
                <CaseStudyCard index={i} {...study} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="bg-white py-20">
        <Container>
          <div className="mb-4 flex justify-center">
            <span className="rounded-pill border border-border bg-white px-4 py-1.5 text-sm text-muted">
              Testimonials
            </span>
          </div>
          <h2 className="text-center font-inter-tight text-3xl font-semibold tablet:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-muted-secondary">
            Real feedback from our customers.
          </p>
          <div className="mt-12">
            <TestimonialCarousel />
          </div>
        </Container>
      </section>

      {/* ── How It Works ── */}
      <section id="howitwork" className="bg-surface-light-purple py-20">
        <Container>
          <div className="mb-4 flex justify-center">
            <span className="rounded-pill border border-border bg-white px-4 py-1.5 text-sm text-muted">
              How it works
            </span>
          </div>
          <h2 className="mx-auto max-w-3xl text-center font-inter-tight text-3xl font-semibold leading-tight tablet:text-4xl">
            You Don&apos;t Need 3 Months And $50K+ To Validate Your Ideas
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-muted-secondary">
            Launch fast, get real users, and validate your product in days not
            months.
          </p>
          <div className="mt-12 grid gap-8 tablet:grid-cols-3 desktop:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.number}
                className="flex flex-col gap-4 rounded-card bg-white p-8"
              >
                <span className="font-inter-tight text-5xl font-semibold text-accent-purple">
                  {step.number}
                </span>
                <h3 className="font-inter-tight text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-secondary">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Team ── */}
      <section className="bg-white py-20">
        <Container>
          <div className="mb-4 flex justify-center">
            <span className="rounded-pill border border-border bg-white px-4 py-1.5 text-sm text-muted">
              Meet our team
            </span>
          </div>
          <h2 className="text-center font-inter-tight text-3xl font-semibold tablet:text-4xl">
            The Team Delivering Your MVP...
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-center text-muted-secondary">
            A proven team of product, design, and engineering experts focused on
            speed and validation.
          </p>
          <div className="mt-12 grid gap-8 tablet:grid-cols-2 desktop:grid-cols-2">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="flex flex-col gap-6 rounded-card bg-surface-gray p-8"
              >
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 scale-110 rounded-full bg-surface-light-purple" />
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={280}
                      height={280}
                      className="relative rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-inter-tight text-2xl font-semibold">
                    Meet {member.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {member.role}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-secondary">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <CtaSection />
    </>
  );
}
