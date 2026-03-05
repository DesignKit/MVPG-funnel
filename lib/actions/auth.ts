"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyRecaptcha } from "@/lib/recaptcha";

export async function sendOtp(email: string, recaptchaToken?: string | null) {
  // Verify reCAPTCHA if configured
  if (recaptchaToken) {
    const valid = await verifyRecaptcha(recaptchaToken);
    if (!valid) throw new Error("reCAPTCHA verification failed");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ email });
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function signInWithGoogle(idToken: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: idToken,
  });
  if (error) throw new Error(error.message);
  return { user: data.user };
}

export type OAuthProvider = "google" | "facebook" | "github" | "linkedin_oidc";

export async function signInWithOAuth(provider: OAuthProvider, redirectTo: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
  if (error) throw new Error(error.message);
  return { url: data.url };
}

export async function verifyOtp(email: string, token: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (error) throw new Error(error.message);
  return { user: data.user };
}

/** Verify OTP and determine where to route the user — single server action call */
export async function verifyOtpAndRoute(email: string, token: string, sessionId?: string) {
  const supabase = await createClient();

  // 1. Verify OTP
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (error) throw new Error(error.message);

  const user = data.user;
  if (!user) return { userId: null, route: "/intake" as string };

  // 2. Link anonymous session data (fire-and-forget)
  if (sessionId) {
    supabase
      .from("chat_sessions")
      .update({ user_id: user.id })
      .eq("id", sessionId)
      .is("user_id", null)
      .then(() => {});
    supabase
      .from("registrations")
      .update({ user_id: user.id })
      .eq("session_id", sessionId)
      .is("user_id", null)
      .then(() => {});
  }

  // 3. Check role + progress in parallel (single Supabase client, reuses connection)
  const [profileResult, bookingResult, regResult] = await Promise.all([
    supabase.from("profiles").select("role").eq("user_id", user.id).maybeSingle(),
    supabase.from("bookings").select("id, registration_id").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("registrations").select("id").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  const role = (profileResult.data?.role as string) ?? "user";

  // Admin redirect
  if (role === "admin" || role === "super_admin") {
    return { userId: user.id, route: "/admin" };
  }

  // Returning user — check furthest progress
  if (bookingResult.data) {
    const { data: session } = await supabase
      .from("chat_sessions")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("status", "completed")
      .limit(1)
      .maybeSingle();

    if (session) {
      return {
        userId: user.id,
        route: "/report",
        registrationId: bookingResult.data.registration_id,
        bookingId: bookingResult.data.id,
        sessionId: session.id,
      };
    }

    return {
      userId: user.id,
      route: "/workshop",
      registrationId: bookingResult.data.registration_id,
      bookingId: bookingResult.data.id,
    };
  }

  if (regResult.data) {
    return {
      userId: user.id,
      route: "/confirmed",
      registrationId: regResult.data.id,
    };
  }

  // New user
  return { userId: user.id, route: "/intake" };
}

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function getUserRole(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return "user";

  return (data.role as string) ?? "user";
}

export async function getReturningUserProgress(userId: string) {
  const supabase = await createClient();

  // Check for existing bookings (furthest step)
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, registration_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (booking) {
    // Check if they completed the workshop (chat session)
    const { data: session } = await supabase
      .from("chat_sessions")
      .select("id, status")
      .eq("user_id", userId)
      .eq("status", "completed")
      .limit(1)
      .single();

    if (session) {
      return {
        step: "report" as const,
        registrationId: booking.registration_id,
        bookingId: booking.id,
        sessionId: session.id,
      };
    }

    return {
      step: "workshop" as const,
      registrationId: booking.registration_id,
      bookingId: booking.id,
    };
  }

  // Check for existing registration
  const { data: registration } = await supabase
    .from("registrations")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (registration) {
    return {
      step: "confirmed" as const,
      registrationId: registration.id,
    };
  }

  // No progress found
  return { step: "apply" as const };
}

export async function updateProfileName(userId: string, displayName: string) {
  const supabase = await createClient();
  // Only set display_name if it's currently null (preserve name set by blog or earlier funnel visit)
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("user_id", userId)
    .maybeSingle();

  if (profile && !profile.display_name) {
    await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("user_id", userId);
  }
}

export async function linkSessionToUser(sessionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Link anonymous chat sessions
  await supabase
    .from("chat_sessions")
    .update({ user_id: user.id })
    .eq("id", sessionId)
    .is("user_id", null);

  // Link registrations tied to this chat session
  await supabase
    .from("registrations")
    .update({ user_id: user.id })
    .eq("session_id", sessionId)
    .is("user_id", null);
}
