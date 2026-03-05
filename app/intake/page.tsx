"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { BrandTicker } from "@/components/sections/brand-ticker";
import { TestimonialCard } from "@/components/sections/testimonial-card";
import { submitRegistration } from "@/lib/actions/register";
import { updateProfileName } from "@/lib/actions/auth";
import { useFunnelProgress } from "@/lib/hooks/use-funnel-progress";
import { cn } from "@/lib/utils";

const GOAL_OPTIONS = [
  "Validate idea",
  "Test market",
  "Attract investors",
  "Get first users/customers",
];

const SPEED_OPTIONS = [
  "ASAP",
  "Within a month",
  "Within 3-months",
  "Within 6 months",
];

const COMPLEXITY_OPTIONS = [
  { label: "Simple", description: "Lightweight front and back-end features" },
  {
    label: "Moderate",
    description: "Lightweight front and back-end with some complex features",
  },
  {
    label: "Complex",
    description: "Mostly complex front and back-end features",
  },
];

const BUDGET_OPTIONS = [
  { label: "$15k or less", tier: "Starter" },
  { label: "$15 - 25k", tier: "Growth" },
  { label: "$25 - 50k", tier: "Scale" },
  { label: "$50k+", tier: "Enterprise" },
];

const IDEA_MAX_CHARS = 500;
const EXTRAS_MAX_CHARS = 300;

/* ── Pill-style radio group ── */

function PillGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-pill border px-4 py-2 text-sm transition-all",
            value === option
              ? "border-primary bg-primary/10 font-medium text-foreground"
              : "border-border bg-white text-muted-secondary hover:border-primary/50"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

/* ── Card-style selector (Complexity) ── */

function ComplexitySelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-3 tablet:grid-cols-3">
      {COMPLEXITY_OPTIONS.map((opt) => (
        <button
          key={opt.label}
          type="button"
          onClick={() => onChange(opt.label)}
          className={cn(
            "rounded-card border p-4 text-left transition-all",
            value === opt.label
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border bg-white hover:border-primary/50"
          )}
        >
          <span className="text-sm font-semibold text-foreground">
            {opt.label}
          </span>
          <p className="mt-1 text-xs leading-relaxed text-muted-secondary">
            {opt.description}
          </p>
        </button>
      ))}
    </div>
  );
}

/* ── Budget selector ── */

function BudgetSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {BUDGET_OPTIONS.map((opt) => (
        <button
          key={opt.label}
          type="button"
          onClick={() => onChange(opt.label)}
          className={cn(
            "rounded-pill border px-4 py-2 text-sm transition-all",
            value === opt.label
              ? "border-primary bg-primary/10 font-medium text-foreground"
              : "border-border bg-white text-muted-secondary hover:border-primary/50"
          )}
        >
          {opt.label}
          <span className="ml-1.5 text-xs opacity-50">({opt.tier})</span>
        </button>
      ))}
    </div>
  );
}

/* ── Textarea with character counter ── */

function CountedTextarea({
  value,
  onChange,
  placeholder,
  rows,
  maxChars,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  rows: number;
  maxChars: number;
  required?: boolean;
}) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxChars))}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full resize-none rounded-card border border-border bg-surface-gray p-4 text-sm outline-none focus:border-primary"
      />
      <p className="mt-1 text-right text-xs text-muted-secondary">
        {value.length}/{maxChars}
      </p>
    </div>
  );
}

/* ── Section label with number ── */

function SectionLabel({
  number,
  label,
  required,
}: {
  number: number;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-purple/10 text-[10px] font-semibold text-accent-purple">
        {number}
      </span>
      {label}
      {required && <span className="text-primary">*</span>}
    </label>
  );
}

/* ── Page component ── */

export default function IntakePage() {
  const router = useRouter();
  const { sessionId, userId, setRegistrationId } = useFunnelProgress();

  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [speed, setSpeed] = useState("");
  const [complexity, setComplexity] = useState("");
  const [ideaDescription, setIdeaDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 0 && ideaDescription.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    const fullDescription = [
      goal && `Goal: ${goal}`,
      speed && `Speed: ${speed}`,
      complexity && `Complexity: ${complexity}`,
      `Idea: ${ideaDescription.trim()}`,
      budget && `Budget: ${budget}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      // Save name to profile
      if (userId) {
        updateProfileName(userId, name.trim()).catch(() => {});
      }

      const reg = await submitRegistration(
        sessionId,
        name.trim(),
        "", // email already captured in /apply
        fullDescription,
        specialRequirements.trim() || null
      );
      setRegistrationId(reg.id);
    } catch {
      // Continue even if Supabase fails
    }
    router.push("/book");
  }

  return (
    <>
      <section className="bg-surface-light-purple py-12 pb-32 tablet:pb-12">
        <Container className="max-w-2xl">
          <div className="text-center">
            <h1 className="animate-title-entrance font-inter-tight text-3xl font-semibold leading-tight tablet:text-4xl desktop:text-5xl">
              Tell Us About Your Product
            </h1>
            <p className="animate-spring-pop mt-4 text-muted-secondary">
              Help us understand your vision so we can build it right.
            </p>
          </div>

          <div className="mt-10 animate-rise-up">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="rounded-card bg-white p-6 shadow-card tablet:p-8">
                <div className="flex flex-col gap-6">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Your Name <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                      className="w-full rounded-card border border-border bg-surface-gray px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div className="border-t border-border" />

                  {/* Goal + Speed */}
                  <div className="grid gap-6 tablet:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <SectionLabel number={1} label="Goal" />
                      <PillGroup
                        options={GOAL_OPTIONS}
                        value={goal}
                        onChange={setGoal}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <SectionLabel number={2} label="Timeline" />
                      <PillGroup
                        options={SPEED_OPTIONS}
                        value={speed}
                        onChange={setSpeed}
                      />
                    </div>
                  </div>

                  <div className="border-t border-border" />

                  {/* Complexity */}
                  <div className="flex flex-col gap-2">
                    <SectionLabel number={3} label="Complexity" />
                    <ComplexitySelector
                      value={complexity}
                      onChange={setComplexity}
                    />
                  </div>

                  <div className="border-t border-border" />

                  {/* Idea */}
                  <div className="flex flex-col gap-2">
                    <SectionLabel
                      number={4}
                      label="What's your idea?"
                      required
                    />
                    <CountedTextarea
                      value={ideaDescription}
                      onChange={setIdeaDescription}
                      placeholder="Briefly describe your product idea, the problem it solves, and who it's for"
                      rows={4}
                      maxChars={IDEA_MAX_CHARS}
                      required
                    />
                  </div>

                  <div className="border-t border-border" />

                  {/* Budget */}
                  <div className="flex flex-col gap-2">
                    <SectionLabel number={5} label="Budget" />
                    <BudgetSelector value={budget} onChange={setBudget} />
                  </div>

                  <div className="border-t border-border" />

                  {/* Special requirements */}
                  <div className="flex flex-col gap-2">
                    <SectionLabel
                      number={6}
                      label="Special requirements or constraints?"
                    />
                    <CountedTextarea
                      value={specialRequirements}
                      onChange={setSpecialRequirements}
                      placeholder="e.g. integrations, compliance needs, tight deadlines, specific tech stack"
                      rows={3}
                      maxChars={EXTRAS_MAX_CHARS}
                    />
                  </div>
                </div>
              </div>

              {/* Sticky CTA bar on mobile */}
              <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 p-4 backdrop-blur-sm tablet:static tablet:border-0 tablet:bg-transparent tablet:p-0">
                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="w-full rounded-pill bg-primary py-3.5 text-white shadow-button transition-opacity hover:opacity-90 disabled:opacity-40 tablet:py-4"
                >
                  {submitting ? "Submitting..." : "Continue"}
                </button>
              </div>
            </form>
          </div>
        </Container>
      </section>

      <BrandTicker />

      <section className="bg-surface-warm py-16">
        <Container className="max-w-2xl">
          <p className="mb-4 text-center text-sm font-medium uppercase tracking-widest text-accent-purple">
            Testimonials
          </p>
          <h2 className="mb-8 text-center font-inter-tight text-2xl font-semibold tablet:text-3xl">
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
