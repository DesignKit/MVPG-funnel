"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { BrandTicker } from "@/components/sections/brand-ticker";
import { TestimonialCard } from "@/components/sections/testimonial-card";
import {
  sendOtp,
  verifyOtpAndRoute,
  signInWithOAuth,
  type OAuthProvider,
} from "@/lib/actions/auth";
import { useFunnelProgress } from "@/lib/hooks/use-funnel-progress";
import { GoogleOneTap } from "@/components/auth/google-one-tap";
import { executeRecaptcha } from "@/lib/recaptcha";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

/* ── 6-digit OTP input ── */

function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(OTP_LENGTH, " ").split("").slice(0, OTP_LENGTH);

  // Refocus first input when value is cleared (e.g. after wrong code)
  useEffect(() => {
    if (value === "" && !disabled) {
      inputRefs.current[0]?.focus();
    }
  }, [value, disabled]);

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  }

  function handleInput(i: number, char: string) {
    if (!/^\d$/.test(char)) return;
    const next = digits.map((d, j) => (j === i ? char : d)).join("");
    onChange(next.replace(/\s/g, ""));
    if (i < OTP_LENGTH - 1) inputRefs.current[i + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (pasted) {
      onChange(pasted);
      inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    }
  }

  return (
    <div className="flex justify-center gap-2" onPaste={handlePaste}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit === " " ? "" : digit}
          disabled={disabled}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onChange={(e) => handleInput(i, e.target.value)}
          onFocus={(e) => e.target.select()}
          autoFocus={i === 0}
          className="h-14 w-11 rounded-lg border-2 border-border bg-white text-center text-xl font-semibold outline-none transition-colors focus:border-foreground disabled:opacity-50"
        />
      ))}
    </div>
  );
}

/* ── Social brand icons (inline SVG) ── */

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.07l3.66-2.98z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SOCIAL_PROVIDERS: { id: OAuthProvider; label: string; icon: React.ReactNode }[] = [
  { id: "google", label: "Google", icon: <GoogleIcon /> },
  { id: "facebook", label: "Facebook", icon: <FacebookIcon /> },
  { id: "github", label: "GitHub", icon: <GitHubIcon /> },
  { id: "linkedin_oidc", label: "LinkedIn", icon: <LinkedInIcon /> },
];

/* ── Social login buttons ── */

function SocialButtons() {
  const [loading, setLoading] = useState<OAuthProvider | null>(null);

  async function handleOAuth(provider: OAuthProvider) {
    setLoading(provider);
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { url } = await signInWithOAuth(provider, redirectTo);
      if (url) window.location.href = url;
    } catch (err) {
      console.error("OAuth failed:", err);
      setLoading(null);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {SOCIAL_PROVIDERS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => handleOAuth(p.id)}
          disabled={loading !== null}
          className="flex items-center justify-center gap-2.5 rounded-pill border border-border bg-white py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-gray disabled:opacity-40"
        >
          {p.icon}
          {loading === p.id ? "Redirecting..." : p.label}
        </button>
      ))}
    </div>
  );
}

/* ── Page component ── */

export default function ApplyPage() {
  const router = useRouter();
  const {
    sessionId,
    userId,
    setRegistrationId,
    setBookingId,
    setSessionId,
    setUserId,
  } = useFunnelProgress();

  // Step 1 — email only
  const [email, setEmail] = useState("");
  const [googleAuthInProgress, setGoogleAuthInProgress] = useState(false);

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState("");
  const [otpError, setOtpError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const canContinueStep1 = email.trim().length > 0;

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const doSendOtp = useCallback(async () => {
    setSendingOtp(true);
    setOtpError("");
    try {
      const recaptchaToken = await executeRecaptcha("send_otp");
      await sendOtp(email.trim(), recaptchaToken);
      setOtpSent(true);
      setResendCooldown(RESEND_COOLDOWN);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send code";
      setOtpError(message);
    } finally {
      setSendingOtp(false);
    }
  }, [email]);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!canContinueStep1) return;
    await doSendOtp();
  }

  function handleChangeDetails() {
    setOtpSent(false);
    setOtpDigits("");
    setOtpError("");
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setOtpDigits("");
    setOtpError("");
    await doSendOtp();
  }

  const doVerifyOtp = useCallback(async (code: string) => {
    if (code.length !== OTP_LENGTH || verifyingOtp) return;
    setVerifyingOtp(true);
    setOtpError("");

    try {
      const result = await verifyOtpAndRoute(email.trim(), code, sessionId);

      if (result.userId) setUserId(result.userId);
      if (result.registrationId) setRegistrationId(result.registrationId);
      if ("bookingId" in result && result.bookingId) setBookingId(result.bookingId);
      if ("sessionId" in result && result.sessionId) setSessionId(result.sessionId);

      router.push(result.route);
    } catch {
      setOtpError("Invalid code. Please try again.");
      setOtpDigits("");
    } finally {
      setVerifyingOtp(false);
    }
  }, [email, verifyingOtp, sessionId, setUserId, setRegistrationId, setBookingId, setSessionId, router]);

  // Auto-verify when all 6 digits are entered
  useEffect(() => {
    if (otpSent && otpDigits.length === OTP_LENGTH && !verifyingOtp) {
      doVerifyOtp(otpDigits);
    }
  }, [otpDigits, otpSent, verifyingOtp, doVerifyOtp]);

  return (
    <>
      <section className="bg-surface-light-purple py-12 pb-32 tablet:pb-12">
        <Container className="max-w-2xl">
          <div className="text-center">
            <h1 className="animate-title-entrance font-inter-tight text-3xl font-semibold leading-tight tablet:text-4xl desktop:text-5xl">
              Give Us 5 Days And We&apos;ll Deliver Your Launch-Ready MVP{" "}
              <span className="text-primary">Or You Don&apos;t Pay!</span>
            </h1>
            <p className="animate-spring-pop mt-4 text-muted-secondary">
              Tell us about your idea and we&apos;ll set up your free strategy
              call.
            </p>
          </div>


          {/* Google One Tap — renders on page load, no visible DOM */}
          <GoogleOneTap
            onAuthStart={() => setGoogleAuthInProgress(true)}
            onComplete={() => router.push("/intake")}
          />

          {/* ─── Email + OTP ─── */}
            <div className="mt-10 animate-rise-up">
              {googleAuthInProgress ? (
                <div className="py-12 text-center">
                  <p className="animate-pulse text-muted-secondary">
                    Signing in with Google...
                  </p>
                </div>
              ) : (
              <form
                onSubmit={handleSendOtp}
                className="flex flex-col gap-6"
              >
                <div className="rounded-card bg-white p-6 shadow-card">
                  <h2 className="mb-1 font-inter-tight text-lg font-semibold">
                    Get Started
                  </h2>
                  <p className="mb-6 text-sm text-muted-secondary">
                    Enter your email to verify and continue.
                  </p>

                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-foreground">
                        Email Address <span className="text-primary">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your primary email address"
                        required
                        disabled={otpSent}
                        className="w-full rounded-card border border-border bg-surface-gray px-4 py-3 text-sm outline-none focus:border-primary disabled:opacity-50"
                      />
                    </div>

                    {!otpSent && otpError && (
                      <p className="text-center text-sm text-red-500">
                        {otpError}
                      </p>
                    )}

                    {otpSent && (
                      <button
                        type="button"
                        onClick={handleChangeDetails}
                        className="self-start text-sm text-accent-purple hover:underline"
                      >
                        Change email
                      </button>
                    )}
                  </div>

                  {/* OTP section — slides in/out below fields */}
                  <AnimatePresence>
                    {otpSent && (
                      <motion.div
                        key="otp-section"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 border-t border-border pt-6">
                          <h3 className="mb-1 text-center font-inter-tight text-lg font-semibold">
                            Enter the code
                          </h3>
                          <p className="mb-5 text-center text-sm text-muted-secondary">
                            Enter the 6-digit code sent to your email to complete
                            verification
                          </p>

                          <OtpInput
                            value={otpDigits}
                            onChange={setOtpDigits}
                            disabled={verifyingOtp}
                          />

                          {verifyingOtp && (
                            <p className="mt-3 text-center text-sm text-muted-secondary animate-pulse">
                              Verifying...
                            </p>
                          )}

                          {otpError && (
                            <p className="mt-3 text-center text-sm text-red-500">
                              {otpError}
                            </p>
                          )}

                          <div className="mt-4 text-center">
                            <button
                              type="button"
                              onClick={handleResend}
                              disabled={resendCooldown > 0 || sendingOtp}
                              className="text-sm text-muted-secondary hover:text-foreground disabled:opacity-40"
                            >
                              {resendCooldown > 0
                                ? `Resend code in ${resendCooldown}s`
                                : sendingOtp
                                  ? "Sending..."
                                  : "Resend code"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {!otpSent && (
                  <>
                    <button
                      type="submit"
                      disabled={!canContinueStep1 || sendingOtp}
                      className="w-full rounded-pill bg-foreground py-4 text-white shadow-button transition-opacity hover:opacity-90 disabled:opacity-40"
                    >
                      {sendingOtp ? "Sending code..." : "Continue with Email"}
                    </button>

                    {/* TODO: Re-enable social login buttons once provider redirect URIs are configured */}
                  </>
                )}
              </form>
              )}
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
