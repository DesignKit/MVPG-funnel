/* ── reCAPTCHA v3 helpers ── */

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

// ─── Client-side: execute reCAPTCHA and get token ───

let scriptLoaded = false;

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

function loadScript(): Promise<void> {
  if (scriptLoaded || typeof window === "undefined") return Promise.resolve();
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    document.head.appendChild(script);
  });
}

export async function executeRecaptcha(action: string): Promise<string | null> {
  if (!SITE_KEY) return null; // gracefully skip if not configured
  await loadScript();
  return new Promise((resolve) => {
    window.grecaptcha.ready(async () => {
      const token = await window.grecaptcha.execute(SITE_KEY, { action });
      resolve(token);
    });
  });
}

// ─── Server-side: verify reCAPTCHA token ───

export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true; // skip verification if not configured

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secret}&response=${token}`,
  });

  const data = await res.json();
  return data.success && (data.score ?? 1) >= 0.5;
}
