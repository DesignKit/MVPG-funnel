"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithGoogle,
  getUserRole,
  getReturningUserProgress,
  linkSessionToUser,
  updateProfileName,
} from "@/lib/actions/auth";
import { useFunnelProgress } from "@/lib/hooks/use-funnel-progress";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: (cb?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
          cancel: () => void;
        };
      };
    };
  }
}

interface GoogleOneTapProps {
  /** Called when Google sign-in completes, before routing */
  onAuthStart?: () => void;
  /** Called when One Tap is dismissed or unavailable — show OTP form */
  onDismiss?: () => void;
  /** Called after successful routing */
  onComplete?: () => void;
}

export function GoogleOneTap({ onAuthStart, onDismiss, onComplete }: GoogleOneTapProps) {
  const router = useRouter();
  const {
    sessionId,
    setUserId,
    setRegistrationId,
    setBookingId,
    setSessionId,
  } = useFunnelProgress();
  const initialized = useRef(false);

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      onAuthStart?.();

      try {
        const { user } = await signInWithGoogle(response.credential);

        if (user) {
          setUserId(user.id);

          // Update profile with Google display name
          const meta = user.user_metadata;
          if (meta?.full_name) {
            updateProfileName(user.id, meta.full_name).catch(() => {});
          }

          // Link anonymous session data
          if (sessionId) {
            linkSessionToUser(sessionId).catch(() => {});
          }

          // Admin redirect
          const role = await getUserRole(user.id);
          if (role === "admin" || role === "super_admin") {
            router.push("/admin");
            onComplete?.();
            return;
          }

          // Returning user redirect
          const progress = await getReturningUserProgress(user.id);
          if (progress.step !== "apply") {
            if (progress.registrationId)
              setRegistrationId(progress.registrationId);
            if ("bookingId" in progress && progress.bookingId)
              setBookingId(progress.bookingId);
            if ("sessionId" in progress && progress.sessionId)
              setSessionId(progress.sessionId);
            router.push(`/${progress.step}`);
            onComplete?.();
            return;
          }
        }

        // New user — proceed to Step 2
        onComplete?.();
      } catch (err) {
        console.error("Google One Tap sign-in failed:", err);
        onDismiss?.();
      }
    },
    [sessionId, setUserId, setRegistrationId, setBookingId, setSessionId, router, onAuthStart, onDismiss, onComplete]
  );

  useEffect(() => {
    if (!CLIENT_ID || initialized.current) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (!window.google) return;
      initialized.current = true;

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: true, // auto-sign-in if only one Google session
        cancel_on_tap_outside: false,
      });

      window.google.accounts.id.prompt((notification) => {
        // If One Tap can't display or user dismisses, fall back to OTP
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          onDismiss?.();
        }
      });
    };
    document.head.appendChild(script);

    return () => {
      if (window.google) {
        window.google.accounts.id.cancel();
      }
    };
  }, [handleCredentialResponse, onDismiss]);

  // No visible DOM — Google One Tap renders its own overlay
  return null;
}
