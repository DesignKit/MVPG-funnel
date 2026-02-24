"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { BrandTicker } from "@/components/sections/brand-ticker";
import { TestimonialCard } from "@/components/sections/testimonial-card";
import { submitRegistration } from "@/lib/actions/register";
import { useFunnelProgress } from "@/lib/hooks/use-funnel-progress";

const STEPS = [1, 2, 3, 4, 5, 6];
const CURRENT_STEP = 2;

export default function RegisterPage() {
  const router = useRouter();
  const { sessionId, setRegistrationId } = useFunnelProgress();
  const [ideaDescription, setIdeaDescription] = useState("");
  const [additionalExpectations, setAdditionalExpectations] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ideaDescription.trim() || submitting) return;
    setSubmitting(true);
    try {
      const reg = await submitRegistration(
        sessionId,
        ideaDescription.trim(),
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
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4">
            <textarea
              value={ideaDescription}
              onChange={(e) => setIdeaDescription(e.target.value)}
              placeholder="Describe your idea ..."
              rows={5}
              required
              className="w-full resize-none rounded-card border border-border bg-white p-4 text-sm outline-none focus:border-primary"
            />
            <textarea
              value={additionalExpectations}
              onChange={(e) => setAdditionalExpectations(e.target.value)}
              placeholder="Additional add, expectation, or etc"
              rows={3}
              className="w-full resize-none rounded-card border border-border bg-white p-4 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={!ideaDescription.trim() || submitting}
              className="mt-2 w-full rounded-pill bg-black py-4 text-white shadow-button transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {submitting ? "Submitting..." : "Submit & Continue"}
            </button>
          </form>
        </Container>
      </section>

      <BrandTicker />

      {/* Testimonial */}
      <section className="bg-surface-warm py-16">
        <Container className="max-w-2xl">
          <TestimonialCard
            quote="My business partner and I approached MVP Guru for literally the quickest turnaround of a fencing lead-gen software. We got 3 customers in a week and the first covered the MVP costs (and then some). Thank you for taking us on."
            name="Louis W."
            role="Founder"
            image="/images/testimonial-photo.webp"
          />
        </Container>
      </section>
    </>
  );
}
