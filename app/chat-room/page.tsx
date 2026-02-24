"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";
import { createChatSession, submitChatAnswer, completeChatSession } from "@/lib/actions/chat";
import { useFunnelProgress } from "@/lib/hooks/use-funnel-progress";

const QUESTIONS = [
  { key: "problem", text: "What problem are you solving?" },
  { key: "target_user", text: "Who is your target user?" },
  { key: "mvp_features", text: "What features are essential for MVP?" },
  { key: "timeline", text: "What is your launch timeline?" },
] as const;

type QuestionKey = (typeof QUESTIONS)[number]["key"];

export default function ChatRoomPage() {
  const router = useRouter();
  const { sessionId, setSessionId } = useFunnelProgress();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeQuestion, setActiveQuestion] = useState<QuestionKey | null>(
    null
  );
  const [inputValue, setInputValue] = useState("");

  // Create a session on first visit
  useEffect(() => {
    if (!sessionId) {
      createChatSession().then((session) => {
        setSessionId(session.id);
      }).catch(() => {
        // Supabase tables may not exist yet — continue without persistence
      });
    }
  }, [sessionId, setSessionId]);

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  function handleQuestionClick(key: QuestionKey) {
    setActiveQuestion(key);
    setInputValue(answers[key] ?? "");
  }

  function handleSubmit() {
    if (!activeQuestion || !inputValue.trim()) return;
    const answer = inputValue.trim();
    const questionText = QUESTIONS.find((q) => q.key === activeQuestion)!.text;
    setAnswers((prev) => ({ ...prev, [activeQuestion]: answer }));
    setInputValue("");

    // Persist to Supabase
    if (sessionId) {
      submitChatAnswer(sessionId, activeQuestion, questionText, answer).catch(() => {});
    }

    // Auto-advance to next unanswered question
    const nextUnanswered = QUESTIONS.find(
      (q) => q.key !== activeQuestion && !answers[q.key]
    );
    setActiveQuestion(nextUnanswered?.key ?? null);
  }

  return (
    <section className="min-h-screen bg-surface-light-purple py-12">
      <Container className="max-w-2xl">
        <div className="text-center">
          <h1 className="font-inter-tight text-4xl font-semibold">
            AI Workshop
          </h1>
          <p className="mt-2 text-muted-secondary">
            Answer 4 quick questions to help us understand your project.
          </p>
          <p className="mt-1 text-sm text-accent-purple">
            {answeredCount}/{QUESTIONS.length} answered
          </p>
        </div>

        {/* Question buttons */}
        <div className="mt-10 flex flex-col gap-3">
          {QUESTIONS.map((q) => {
            const isAnswered = q.key in answers;
            const isActive = activeQuestion === q.key;
            return (
              <button
                key={q.key}
                onClick={() => handleQuestionClick(q.key)}
                className={cn(
                  "rounded-pill border px-6 py-3 text-left text-sm transition-all",
                  isActive
                    ? "border-primary bg-primary/10 text-foreground"
                    : isAnswered
                      ? "border-accent-purple/30 bg-accent-purple/5 text-foreground"
                      : "border-primary bg-white text-foreground hover:bg-surface-warm"
                )}
              >
                <span className="flex items-center justify-between">
                  {q.text}
                  {isAnswered && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9563ff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </span>
                {isAnswered && (
                  <span className="mt-1 block text-xs text-muted-secondary">
                    {answers[q.key]}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Input area */}
        {activeQuestion && (
          <div className="mt-6 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Type your answer..."
              className="flex-1 rounded-pill border border-border bg-white px-5 py-3 text-sm outline-none focus:border-primary"
              autoFocus
            />
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Continue button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => {
              if (sessionId) completeChatSession(sessionId).catch(() => {});
              router.push("/register");
            }}
            disabled={!allAnswered}
            className={cn(
              "inline-block rounded-pill bg-black px-10 py-4 text-white shadow-button transition-opacity",
              allAnswered
                ? "hover:opacity-90"
                : "pointer-events-none opacity-35"
            )}
          >
            Continue
          </button>
          {!allAnswered && (
            <p className="mt-2 text-xs text-muted-secondary">
              Answer all questions to continue
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
