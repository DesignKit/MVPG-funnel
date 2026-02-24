import Link from "next/link";
import { Container } from "@/components/layout/container";
import { BrandTicker } from "@/components/sections/brand-ticker";
import { Button } from "@/components/ui/button";

const FAQ_ITEMS = [
  {
    question: "What happens after I book?",
    answer:
      "You'll receive a confirmation email with a link to your consultation. Please watch the onboarding video to prepare for the call.",
  },
  {
    question: "How long is the consultation?",
    answer:
      "The initial call is 60-90 minutes. We'll cover your idea, target users, core features, and map out your MVP plan.",
  },
  {
    question: "What if I need to reschedule?",
    answer:
      "No problem! You can reschedule through the link in your confirmation email up to 24 hours before your scheduled time.",
  },
  {
    question: "What's included in the MVP build?",
    answer:
      "A fully functional product with core features, deployed and ready for real users. We handle design, development, and deployment.",
  },
  {
    question: "What if I'm not satisfied?",
    answer:
      "We stand by our promise — if we don't deliver your launch-ready MVP, you don't pay. Simple as that.",
  },
];

export default function BookedPage() {
  return (
    <>
      <section className="bg-surface-light-purple py-12">
        <Container className="max-w-2xl">
          <div className="text-center">
            <h1 className="font-inter-tight text-4xl font-semibold">
              You&apos;re <span className="text-primary">booked!</span>
            </h1>
            <p className="mt-4 text-muted-secondary">
              Watch the video below to understand the process before your call.
            </p>
            <p className="mt-2 text-sm font-medium text-primary">
              Important: Please watch the video below to understand the process.
            </p>
          </div>

          {/* Video embed placeholder */}
          <div className="mt-8 aspect-video overflow-hidden rounded-card bg-black">
            <div className="flex h-full items-center justify-center text-white/60">
              <p className="text-sm">Onboarding video will be embedded here</p>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16">
        <Container className="max-w-2xl">
          <h2 className="mb-8 text-center font-inter-tight text-3xl font-semibold">
            Frequently Asked Questions
          </h2>
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

      <BrandTicker />

      {/* Next steps */}
      <section className="bg-surface-warm py-16">
        <Container className="max-w-2xl text-center">
          <h2 className="font-inter-tight text-2xl font-semibold">
            What&apos;s Next?
          </h2>
          <p className="mt-4 text-muted-secondary">
            While you wait for your consultation, explore your project details
            or start a new conversation.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/project-outline-2" variant="outline">
              View Project Outline
            </Button>
            <Button href="/chat-room" variant="primary">
              Start New Chat
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
