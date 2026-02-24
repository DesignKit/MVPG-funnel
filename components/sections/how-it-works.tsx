import { Container } from "@/components/layout/container";

const STEPS = [
  {
    number: "01",
    title: "60-90 Min Call",
    description:
      "Tell us about your idea and we'll map out the core features for your MVP.",
  },
  {
    number: "02",
    title: "Real Users",
    description:
      "We build your MVP in 5 days and put it in front of real users for feedback.",
  },
  {
    number: "03",
    title: "Validation",
    description:
      "Get data-driven insights to validate your idea before investing further.",
  },
];

export function HowItWorks() {
  return (
    <section id="howitwork" className="bg-surface-light-purple py-20">
      <Container>
        <h2 className="mb-12 text-center font-inter-tight text-4xl font-semibold">
          How it work
        </h2>
        <div className="grid gap-8 tablet:grid-cols-3 desktop:grid-cols-3">
          {STEPS.map((step) => (
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
  );
}
