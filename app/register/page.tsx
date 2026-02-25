"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { BrandTicker } from "@/components/sections/brand-ticker";
import { TestimonialCard } from "@/components/sections/testimonial-card";
import { submitRegistration } from "@/lib/actions/register";
import { useFunnelProgress } from "@/lib/hooks/use-funnel-progress";
import { cn } from "@/lib/utils";

const STEPS = [1, 2, 3, 4, 5, 6];
const CURRENT_STEP = 2;

const GOAL_OPTIONS = [
  "Test market",
  "Attract investors",
  "Get first users",
  "Get first customers",
  "Validate idea",
];

const TIMELINE_OPTIONS = [
  "ASAP",
  "Within a month",
  "Within 3-months",
  "Within 6 months",
];

const COMPLEXITY_OPTIONS = [
  "Simple - lightweight features",
  "Moderate - some complex features",
  "Complex - Advanced features",
];

const BUDGET_OPTIONS = ["$15k or less", "$15 - 25k", "$25 - 50k", "$50k+"];

function RadioGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-pill border px-4 py-2 text-sm transition-all",
              value === option
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-white text-muted-secondary hover:border-primary/50"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { sessionId, setRegistrationId } = useFunnelProgress();
  const [goal, setGoal] = useState("");
  const [timeline, setTimeline] = useState("");
  const [complexity, setComplexity] = useState("");
  const [ideaDescription, setIdeaDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [additionalExpectations, setAdditionalExpectations] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = ideaDescription.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    // Combine structured fields into the registration payload
    const fullDescription = [
      goal && `Goal: ${goal}`,
      timeline && `Timeline: ${timeline}`,
      complexity && `Complexity: ${complexity}`,
      `Idea: ${ideaDescription.trim()}`,
      budget && `Budget: ${budget}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const reg = await submitRegistration(
        sessionId,
        fullDescription,
        additionalExpectations.trim() || null
      );
      setRegistrationId(reg.id);
    } catch {
      // Continue even if Supabase fails — tables may not exist yet
    }
    router.push("/schedule");
  }

  return (
    <>
      <section className="bg-surface-light-purple py-12">
        <Container className="max-w-2xl">
          <div className="text-center">
            <h1 className="font-inter-tight text-3xl font-semibold leading-tight tablet:text-4xl">
              Let&apos;s Build Your Startup In{" "}
              <span className="text-primary">The Next 5 Days!</span>
            </h1>
            <p className="mt-4 text-muted-secondary">
              Complete the form to book in a consultation and elevate your
              business.
            </p>
          </div>

          {/* Progress steps */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {STEPS.map((step) => (
              <div
                key={step}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                  step <= CURRENT_STEP
                    ? "bg-accent-purple text-white"
                    : "bg-white text-muted-secondary"
                }`}
              >
                {step}
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
            <div className="rounded-card bg-white p-6 shadow-card">
              <h2 className="mb-1 font-inter-tight text-lg font-semibold">
                Tell Us About Your Product
              </h2>
              <p className="mb-6 text-sm text-muted-secondary">
                Help us understand your vision so we can build it right.
              </p>

              <div className="flex flex-col gap-5">
                <RadioGroup
                  label="What's your goal?"
                  options={GOAL_OPTIONS}
                  value={goal}
                  onChange={setGoal}
                />

                <RadioGroup
                  label="How quickly do you need it?"
                  options={TIMELINE_OPTIONS}
                  value={timeline}
                  onChange={setTimeline}
                />

                <RadioGroup
                  label="How complex is the product?"
                  options={COMPLEXITY_OPTIONS}
                  value={complexity}
                  onChange={setComplexity}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    What&apos;s Your Idea?
                  </label>
                  <textarea
                    value={ideaDescription}
                    onChange={(e) => setIdeaDescription(e.target.value)}
                    placeholder="Describe your idea"
                    rows={4}
                    required
                    className="w-full resize-none rounded-card border border-border bg-surface-gray p-4 text-sm outline-none focus:border-primary"
                  />
                </div>

                <RadioGroup
                  label="What is your budget?"
                  options={BUDGET_OPTIONS}
                  value={budget}
                  onChange={setBudget}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Anything else we need to know?
                  </label>
                  <textarea
                    value={additionalExpectations}
                    onChange={(e) => setAdditionalExpectations(e.target.value)}
                    placeholder="Additional notes, expectations, or anything else"
                    rows={3}
                    className="w-full resize-none rounded-card border border-border bg-surface-gray p-4 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="w-full rounded-pill bg-primary py-4 text-white shadow-button transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {submitting ? "Submitting..." : "Continue"}
            </button>
          </form>
        </Container>
      </section>

      <BrandTicker />

      {/* Testimonial — Stu French (matches Framer) */}
      <section className="bg-surface-warm py-16">
        <Container className="max-w-2xl">
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-accent-purple">
            Testimonials
          </p>
          <h2 className="mb-8 text-center font-inter-tight text-2xl font-semibold">
            What Our Customers Say
          </h2>
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
