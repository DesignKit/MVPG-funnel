import { cn } from "@/lib/utils";

interface TimelineStep {
  title: string;
  description: string;
  label?: string;
  status: "completed" | "in-progress" | "upcoming";
}

/*
 * Endowed progress effect: inflate completed steps, consolidate future ones.
 *
 * Default variant (on /confirmed — user just booked):
 *   ✓ Application Submitted
 *   ✓ Profile Created
 *   ✓ Call Booked
 *   ✓ Onboarding Video Watched
 *   ● [Now] Requirements Gathering
 *   ○ [Next] Clarification Call & Contract
 *   ○ Build & Launch
 *
 * = 4/7 complete (57%) vs old 0/5 (0%)
 *
 * Post-workshop variant (on /report — user completed workshop):
 *   ✓ ✓ ✓ ✓ ✓ (first 5)
 *   ● [Now] Clarification Call & Contract
 *   ○ Build & Launch
 *
 * = 5/7 complete (71%) vs old 1/5 (20%)
 */

const TIMELINE_STEPS: TimelineStep[] = [
  {
    title: "Application Submitted",
    description: "Your details and product information have been received.",
    status: "completed",
  },
  {
    title: "Profile Created",
    description: "Your founder profile and project brief are on file.",
    status: "completed",
  },
  {
    title: "Call Booked",
    description: "Your strategy call with the MVP Gurus team is confirmed.",
    status: "completed",
  },
  {
    title: "Onboarding Video Watched",
    description: "You're up to speed on our process and what to expect.",
    status: "completed",
  },
  {
    title: "Requirements Gathering",
    description:
      "Complete a short workshop so we can dive into your business goals, progress, and determine the best approach for your MVP.",
    label: "Now",
    status: "in-progress",
  },
  {
    title: "Clarification Call & Contract",
    description:
      "Meet the founders, align on scope, finalize the contract, and get ready to build.",
    label: "Next",
    status: "upcoming",
  },
  {
    title: "Build & Launch",
    description:
      "We build your MVP in 5-10 days, support your first users, and validate market-fit together.",
    status: "upcoming",
  },
];

/** Post-workshop: requirements gathering is done, next up is the call. */
const TIMELINE_STEPS_POST_WORKSHOP: TimelineStep[] = [
  TIMELINE_STEPS[0],
  TIMELINE_STEPS[1],
  TIMELINE_STEPS[2],
  TIMELINE_STEPS[3],
  { ...TIMELINE_STEPS[4], status: "completed", label: undefined },
  { ...TIMELINE_STEPS[5], status: "in-progress", label: "Now" },
  { ...TIMELINE_STEPS[6], label: "Next", status: "upcoming" },
];

interface ProgressTimelineProps {
  /** Use "post-workshop" after the user completes the AI workshop / questionnaire */
  variant?: "default" | "post-workshop";
}

export function ProgressTimeline({ variant = "default" }: ProgressTimelineProps) {
  const steps =
    variant === "post-workshop" ? TIMELINE_STEPS_POST_WORKSHOP : TIMELINE_STEPS;
  const completedCount = steps.filter((s) => s.status === "completed").length;

  return (
    <div className="rounded-card bg-white p-8 shadow-card">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <span className="text-sm font-medium text-foreground">
          Project Progress
        </span>
        <span className="text-xs text-muted-secondary">
          {completedCount}/{steps.length} complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-gray">
        <div
          className="h-full rounded-full bg-accent-purple transition-all"
          style={{ width: `${(completedCount / steps.length) * 100}%` }}
        />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {steps.map((step, index) => (
          <div key={step.title} className="flex items-start gap-4">
            {/* Status indicator */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                  step.status === "completed" && "bg-accent-purple text-white",
                  step.status === "in-progress" && "bg-primary text-white",
                  step.status === "upcoming" &&
                    "bg-surface-gray text-muted-secondary"
                )}
              >
                {step.status === "completed" ? (
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mt-1 h-8 w-0.5",
                    step.status === "completed"
                      ? "bg-accent-purple"
                      : "bg-border"
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-2">
              <h3 className="font-inter-tight text-sm font-semibold">
                {step.label && (
                  <span
                    className={cn(
                      "mr-2 rounded-pill px-2 py-0.5 text-xs font-medium",
                      step.status === "in-progress"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent-purple/10 text-accent-purple"
                    )}
                  >
                    {step.label}
                  </span>
                )}
                {step.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-secondary">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
