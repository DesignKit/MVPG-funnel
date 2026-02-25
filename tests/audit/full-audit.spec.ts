/**
 * Full UI / Functionality / User-journey audit
 *
 * Covers:
 *   1. Page loading (all 6 funnel routes + 404)
 *   2. Image integrity (presence, src, no broken loads)
 *   3. Navigation links
 *   4. Chat-room interaction (4 questions, Continue gate)
 *   5. Register form (validation, submit)
 *   6. Schedule calendar (month nav, date select, confirm button)
 *   7. Project-outline page (content, download button, CTA link)
 *   8. Booked page (FAQ accordion, next-step links)
 *   9. Full end-to-end funnel flow
 *  10. Screenshots of every page at desktop width
 */

import { test, expect, Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const BASE = "http://localhost:3000";

// ─── helpers ────────────────────────────────────────────────────────────────

async function goto(page: Page, route: string) {
  await page.goto(`${BASE}${route}`, {
    waitUntil: "domcontentloaded",
    timeout: 45_000,
  });
  // Wait for React hydration. In dev mode, JS bundles take variable time to load.
  await page.waitForTimeout(2500);
}

/** Collect all <img> elements: src, naturalWidth (0 = broken) */
async function auditImages(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll("img")).map((img) => ({
      src: img.src || img.getAttribute("src") || "",
      alt: img.alt,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
    }))
  );
}

/** Screenshot helper — saves to tests/audit/screenshots/ */
async function screenshot(page: Page, name: string) {
  const dir = path.join(__dirname, "screenshots");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({
    path: path.join(dir, `${name}.png`),
    fullPage: true,
  });
}

// ════════════════════════════════════════════════════════════════════════════
// 1. PAGE LOADING
// ════════════════════════════════════════════════════════════════════════════

test.describe("1 · Page Loading", () => {
  const ROUTES = [
    { name: "Landing", path: "/" },
    { name: "Chat Room", path: "/chat-room" },
    { name: "Register", path: "/register" },
    { name: "Schedule", path: "/schedule" },
    { name: "Project Outline", path: "/project-outline-2" },
    { name: "Booked", path: "/booked" },
  ];

  for (const route of ROUTES) {
    test(`${route.name} (${route.path}) loads with HTTP 200`, async ({ page }) => {
      const response = await page.goto(`${BASE}${route.path}`, {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status(), `${route.path} returned non-200`).toBe(200);
    });
  }

  test("404 page renders for unknown route", async ({ page }) => {
    await page.goto(`${BASE}/this-does-not-exist`, {
      waitUntil: "domcontentloaded",
    });
    // Next.js renders its own 404 — just check it doesn't crash
    const body = await page.textContent("body");
    expect(body).toBeTruthy();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2. IMAGE INTEGRITY
// ════════════════════════════════════════════════════════════════════════════

test.describe("2 · Image Integrity", () => {
  test("Landing page — all images load (non-zero dimensions)", async ({ page }) => {
    await goto(page, "/");
    // Give images time to load
    await page.waitForTimeout(2000);
    const images = await auditImages(page);
    expect(images.length, "No images found on landing page").toBeGreaterThan(0);
    const broken = images.filter((img) => img.complete && img.naturalWidth === 0);
    expect(
      broken,
      `Broken images on landing page:\n${broken.map((i) => i.src).join("\n")}`
    ).toHaveLength(0);
  });

  test("Landing page — correct images for their contexts", async ({ page }) => {
    await goto(page, "/");
    await page.waitForTimeout(2000);
    const images = await auditImages(page);
    const srcs = images.map((i) => i.src);

    // Hero mockup
    expect(srcs.some((s) => s.includes("hero-mockup")), "hero-mockup.png missing").toBe(true);
    // Avatar images (social proof + team)
    expect(srcs.some((s) => s.includes("avatar-1")), "avatar-1 missing").toBe(true);
    expect(srcs.some((s) => s.includes("avatar-2")), "avatar-2 missing").toBe(true);
    // Case study images
    expect(srcs.some((s) => s.includes("case-study-1")), "case-study-1 missing").toBe(true);
    expect(srcs.some((s) => s.includes("case-study-2")), "case-study-2 missing").toBe(true);
    expect(srcs.some((s) => s.includes("case-study-3")), "case-study-3 missing").toBe(true);
    // Testimonial photo
    expect(srcs.some((s) => s.includes("testimonial-photo")), "testimonial-photo missing").toBe(true);
  });

  test("Chat Room page — no broken images", async ({ page }) => {
    await goto(page, "/chat-room");
    await page.waitForTimeout(1500);
    const images = await auditImages(page);
    const broken = images.filter((img) => img.complete && img.naturalWidth === 0);
    expect(broken).toHaveLength(0);
  });

  test("Register page — testimonial image loads", async ({ page }) => {
    await goto(page, "/register");
    await page.waitForTimeout(1500);
    const images = await auditImages(page);
    // Uses avatar-3 for Stu French testimonial
    const testimonial = images.find((i) => i.src.includes("avatar-3"));
    expect(testimonial, "Testimonial image not found on register page").toBeTruthy();
    expect(testimonial!.naturalWidth, "Testimonial image is broken").toBeGreaterThan(0);
  });

  test("Schedule page — testimonial image loads", async ({ page }) => {
    await goto(page, "/schedule");
    await page.waitForTimeout(1500);
    const images = await auditImages(page);
    const broken = images.filter((img) => img.complete && img.naturalWidth === 0);
    expect(broken).toHaveLength(0);
  });

  test("Project Outline page — testimonial image loads", async ({ page }) => {
    await goto(page, "/project-outline-2");
    await page.waitForTimeout(1500);
    const images = await auditImages(page);
    // Uses avatar-3 for Stu French testimonial
    const testimonial = images.find((i) => i.src.includes("avatar-3"));
    expect(testimonial, "Testimonial image missing on project-outline-2").toBeTruthy();
    expect(testimonial!.naturalWidth).toBeGreaterThan(0);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 3. NAVIGATION
// ════════════════════════════════════════════════════════════════════════════

test.describe("3 · Navigation", () => {
  test("Navbar is visible on the landing page", async ({ page }) => {
    await goto(page, "/");
    const navbar = page.locator("nav");
    await expect(navbar).toBeVisible();
  });

  test("Navbar 'Get Started' CTA navigates to /register", async ({ page }) => {
    test.setTimeout(60_000);
    await goto(page, "/");
    // Find the Get Started link in the navbar
    const getStarted = page.locator("nav a", { hasText: "Get Started" });
    await expect(getStarted).toBeVisible();
    await getStarted.click();
    await page.waitForURL("**/register", { timeout: 30_000 });
    expect(page.url()).toContain("/register");
  });

  test("Navbar logo links back to /", async ({ page }) => {
    test.setTimeout(60_000);
    await goto(page, "/chat-room");
    const logo = page.locator("nav a[href='/']").first();
    await expect(logo).toBeVisible();
    await logo.click();
    // Next.js may navigate to / with or without trailing slash
    await page.waitForURL(/localhost:3000\/?$/, { timeout: 30_000 });
    expect(page.url()).toMatch(/localhost:3000\/?$/);
  });

  test("Landing hero CTA links to /register", async ({ page }) => {
    await goto(page, "/");
    // The hero "Get Started Today" button
    const heroCta = page
      .locator("section")
      .first()
      .locator("a", { hasText: "Get Started Today" });
    await expect(heroCta).toBeVisible();
    const href = await heroCta.getAttribute("href");
    expect(href).toBe("/register");
  });

  test("Booked page — 'View Project Outline' links to /project-outline-2", async ({ page }) => {
    await goto(page, "/booked");
    const link = page.locator("a", { hasText: "View Project Outline" });
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    expect(href).toBe("/project-outline-2");
  });

  test("Booked page — 'Start New Chat' links to /chat-room", async ({ page }) => {
    await goto(page, "/booked");
    const link = page.locator("a", { hasText: "Start New Chat" });
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    expect(href).toBe("/chat-room");
  });

  test("Project Outline — 'Continue to Booking' links to /booked", async ({ page }) => {
    await goto(page, "/project-outline-2");
    const link = page.locator("a", { hasText: "Continue to Booking" });
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    expect(href).toBe("/booked");
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 4. CHAT ROOM FUNCTIONALITY
// ════════════════════════════════════════════════════════════════════════════

test.describe("4 · Chat Room", () => {
  test("Renders all 4 question buttons", async ({ page }) => {
    await goto(page, "/chat-room");
    const questions = [
      "What problem are you solving?",
      "Who is your target user?",
      "What features are essential for MVP?",
      "What is your launch timeline?",
    ];
    for (const q of questions) {
      await expect(page.locator("button", { hasText: q })).toBeVisible();
    }
  });

  test("Continue button is disabled until all questions answered", async ({ page }) => {
    await goto(page, "/chat-room");
    const continueBtn = page.locator("button", { hasText: "Continue" });
    // Should be disabled / visually suppressed (pointer-events-none + opacity)
    const classes = await continueBtn.getAttribute("class");
    expect(classes).toContain("pointer-events-none");
    expect(classes).toContain("opacity-35");
  });

  test("Answering a question shows the answer in a chat bubble", async ({ page }) => {
    await goto(page, "/chat-room");

    // Click first question button
    const firstQ = page.locator("button", { hasText: "What problem are you solving?" });
    await expect(firstQ).toBeVisible({ timeout: 10_000 });
    await firstQ.click();

    // Input appears (conditional render driven by React state)
    const input = page.locator('input[placeholder="Type your answer..."]');
    await expect(input).toBeVisible({ timeout: 8_000 });

    // Type an answer and submit
    await input.fill("We solve scheduling chaos for small teams.");
    await input.press("Enter");

    // Answer text is now shown in a chat bubble
    await expect(
      page.locator("text=We solve scheduling chaos").first()
    ).toBeVisible({ timeout: 8_000 });

    // Counter shows 1/4
    await expect(page.getByText("1/4 answered")).toBeVisible();
  });

  /** Re-usable helper: answer all 4 chat questions */
  async function answerAllQuestions(page: Page) {
    const pairs = [
      { q: "What problem are you solving?", a: "Scheduling chaos" },
      { q: "Who is your target user?", a: "Small businesses" },
      { q: "What features are essential for MVP?", a: "Booking + calendar" },
      { q: "What is your launch timeline?", a: "2 weeks" },
    ];

    for (const { q, a } of pairs) {
      const btn = page.locator("button", { hasText: q });
      await expect(btn).toBeVisible({ timeout: 10_000 });
      await btn.click();
      // Input appears via React state
      const input = page.locator('input[placeholder="Type your answer..."]');
      await expect(input).toBeVisible({ timeout: 8_000 });
      await input.fill(a);
      await input.press("Enter");
      // Wait for React state update to settle
      await page.waitForTimeout(500);
    }
  }

  test("Answering all 4 enables Continue and removes opacity", async ({ page }) => {
    await goto(page, "/chat-room");
    await answerAllQuestions(page);

    // Continue should now be fully enabled (no pointer-events-none)
    const continueBtn = page.locator("button", { hasText: "Continue" });
    const classes = await continueBtn.getAttribute("class");
    expect(classes).not.toContain("pointer-events-none");
    expect(classes).not.toContain("opacity-35");
  });

  test("Continue navigates to /register after all questions answered", async ({ page }) => {
    await goto(page, "/chat-room");
    await answerAllQuestions(page);

    await page.locator("button", { hasText: "Continue" }).click();
    await page.waitForURL("**/register", { timeout: 15_000 });
    expect(page.url()).toContain("/register");
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 5. REGISTER FORM
// ════════════════════════════════════════════════════════════════════════════

test.describe("5 · Register Form", () => {
  test("Submit button is disabled when idea textarea is empty", async ({ page }) => {
    await goto(page, "/register");
    const submitBtn = page.locator("button[type='submit']");
    await expect(submitBtn).toBeDisabled();
  });

  test("Form has all 6 structured fields", async ({ page }) => {
    await goto(page, "/register");
    // Goal options
    await expect(page.locator("button", { hasText: "Test market" })).toBeVisible();
    await expect(page.locator("button", { hasText: "Validate idea" })).toBeVisible();
    // Timeline options
    await expect(page.locator("button", { hasText: "ASAP" })).toBeVisible();
    await expect(page.locator("button", { hasText: "Within a month" })).toBeVisible();
    // Complexity options
    await expect(page.locator("button", { hasText: "Simple - lightweight features" })).toBeVisible();
    // Budget options
    await expect(page.locator("button", { hasText: "$15k or less" })).toBeVisible();
    // Textareas
    await expect(page.locator('textarea[placeholder="Describe your idea"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Additional add, expectation, or etc"]')).toBeVisible();
  });

  test("Form title and subtitle are visible", async ({ page }) => {
    await goto(page, "/register");
    await expect(page.locator("h2", { hasText: "Tell Us About Your Product" })).toBeVisible();
    await expect(page.locator("text=Help us understand your vision")).toBeVisible();
  });

  /** Fill a React-controlled textarea by setting the native value and dispatching input event */
  async function fillControlledTextarea(page: Page, placeholder: string, value: string) {
    await page.evaluate(
      ({ ph, val }) => {
        const textarea = document.querySelector(`textarea[placeholder="${ph}"]`) as HTMLTextAreaElement;
        if (!textarea) return;
        const setter = Object.getOwnPropertyDescriptor(
          HTMLTextAreaElement.prototype,
          "value"
        )?.set;
        setter?.call(textarea, val);
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        textarea.dispatchEvent(new Event("change", { bubbles: true }));
      },
      { ph: placeholder, val: value }
    );
    await page.waitForTimeout(300);
  }

  test("Submit button enables when idea textarea has text", async ({ page }) => {
    await goto(page, "/register");
    await fillControlledTextarea(page, "Describe your idea", "A marketplace for local artisans.");
    const submitBtn = page.locator("button[type='submit']");
    await expect(submitBtn).not.toBeDisabled();
  });

  test("Submitting form navigates to /schedule", async ({ page }) => {
    await goto(page, "/register");
    await fillControlledTextarea(page, "Describe your idea", "A marketplace for local artisans.");
    await page.locator("button[type='submit']").click();
    // Supabase call may take 20–30 s to time out when tables don't exist yet
    await page.waitForURL("**/schedule", { timeout: 45_000 });
    expect(page.url()).toContain("/schedule");
  });

  test("6-step progress indicator is visible", async ({ page }) => {
    await goto(page, "/register");
    // 6 numbered step indicators
    for (let i = 1; i <= 6; i++) {
      await expect(page.locator(`div:text-is("${i}")`)).toBeVisible();
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 6. SCHEDULE PAGE — Google Calendar Embed
// ════════════════════════════════════════════════════════════════════════════

test.describe("6 · Schedule Page (Google Calendar Embed)", () => {
  test("Page loads with correct heading", async ({ page }) => {
    await goto(page, "/schedule");
    await expect(page.locator("h1", { hasText: "approved!" })).toBeVisible();
  });

  test("Google Calendar iframe is present with correct src", async ({ page }) => {
    await goto(page, "/schedule");
    const iframe = page.locator('iframe[title="Book a consultation with MVP Gurus"]');
    await expect(iframe).toBeVisible();
    const src = await iframe.getAttribute("src");
    expect(src).toContain("calendar.google.com");
    expect(src).toContain("AcZssZ17rVD9cfTC9XtrSU0MecoWLyhNC_RlYDpdHG");
    expect(src).toContain("gv=1");
  });

  test("Fallback 'Open booking page' link is present", async ({ page }) => {
    await goto(page, "/schedule");
    const link = page.locator("a", { hasText: "Open booking page" });
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    expect(href).toContain("calendar.google.com");
    const target = await link.getAttribute("target");
    expect(target).toBe("_blank");
  });

  test("'I've booked — Continue' link navigates to /project-outline-2", async ({ page }) => {
    await goto(page, "/schedule");
    const continueLink = page.locator("a", { hasText: "I've booked" });
    await expect(continueLink).toBeVisible();
    const href = await continueLink.getAttribute("href");
    expect(href).toBe("/project-outline-2");
  });

  test("Testimonial section is present (Stu French)", async ({ page }) => {
    await goto(page, "/schedule");
    await expect(page.locator("text=Stu French")).toBeVisible();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 7. PROJECT OUTLINE PAGE
// ════════════════════════════════════════════════════════════════════════════

test.describe("7 · Project Outline Page", () => {
  test("Renders 'Well done!' heading with document access text", async ({ page }) => {
    await goto(page, "/project-outline-2");
    await expect(page.locator("h1", { hasText: "Well done!" })).toBeVisible();
    await expect(page.locator("h1", { hasText: "requirements document" })).toBeVisible();
  });

  test("Progress tracker has 5 steps", async ({ page }) => {
    await goto(page, "/project-outline-2");
    await expect(page.locator("text=Contract Awarded")).toBeVisible();
    await expect(page.locator("text=Requirements Gathering")).toBeVisible();
    await expect(page.locator("text=Clarification Call")).toBeVisible();
    await expect(page.locator("text=Development Setup")).toBeVisible();
    await expect(page.locator("text=Launch, Test & Scale")).toBeVisible();
  });

  test("Outline content card is visible", async ({ page }) => {
    await goto(page, "/project-outline-2");
    await expect(page.getByText("Project Outline", { exact: true })).toBeVisible();
    await expect(page.getByText("21 lines", { exact: true })).toBeVisible();
  });

  test("Download button is present", async ({ page }) => {
    await goto(page, "/project-outline-2");
    await expect(page.locator("button", { hasText: "Download File" })).toBeVisible();
  });

  test("'Continue to Booking' link is present and points to /booked", async ({ page }) => {
    await goto(page, "/project-outline-2");
    const link = page.locator("a", { hasText: "Continue to Booking" });
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    expect(href).toBe("/booked");
  });

  test("Stu French testimonial is present", async ({ page }) => {
    await goto(page, "/project-outline-2");
    await expect(page.locator("text=Stu French")).toBeVisible();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 8. BOOKED PAGE
// ════════════════════════════════════════════════════════════════════════════

test.describe("8 · Booked Page", () => {
  test("Renders 'You're booked!' heading", async ({ page }) => {
    await goto(page, "/booked");
    await expect(page.locator("h1", { hasText: "booked!" })).toBeVisible();
  });

  test("Video placeholder is visible", async ({ page }) => {
    await goto(page, "/booked");
    await expect(page.locator("text=Onboarding video will be embedded here")).toBeVisible();
  });

  test("Pricing section has 3 tiers", async ({ page }) => {
    await goto(page, "/booked");
    await expect(page.locator("h3", { hasText: "Questionnaire" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "AI Workshop" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "Comprehensive Product Workshop" })).toBeVisible();
  });

  test("Pricing shows correct prices", async ({ page }) => {
    await goto(page, "/booked");
    await expect(page.locator("text=FREE")).toBeVisible();
    await expect(page.locator("text=$1,200")).toBeVisible();
  });

  test("MVP Roadmap section has 5 steps", async ({ page }) => {
    await goto(page, "/booked");
    await expect(page.locator("h2", { hasText: "MVP Roadmap" })).toBeVisible();
    await expect(page.locator("text=Complete Your Profile")).toBeVisible();
    await expect(page.locator("text=Submit Your Project Brief")).toBeVisible();
    await expect(page.locator("text=Schedule a Discovery Call")).toBeVisible();
    await expect(page.locator("text=Confirm Project Setup")).toBeVisible();
    await expect(page.locator("text=Launch & Validate")).toBeVisible();
  });

  test("All 5 FAQ items are present", async ({ page }) => {
    await goto(page, "/booked");
    const faqQuestions = [
      "What services does MVP Gurus provide?",
      "Who is MVP Gurus best suited for?",
      "How long does it take to develop an MVP?",
      "How does the collaboration process work?",
      "How is pricing determined?",
    ];
    for (const q of faqQuestions) {
      await expect(page.locator("summary", { hasText: q })).toBeVisible();
    }
  });

  test("FAQ accordion opens and shows answer", async ({ page }) => {
    await goto(page, "/booked");
    const firstDetails = page.locator("details").first();
    const firstSummary = firstDetails.locator("summary");
    await firstSummary.click();
    // The first FAQ's answer paragraph is inside the first <details> element
    await expect(firstDetails.locator("p").first()).toBeVisible();
  });

  test("'What's Next?' section has both action links", async ({ page }) => {
    await goto(page, "/booked");
    await expect(page.locator("h2", { hasText: "What's Next?" })).toBeVisible();
    await expect(page.locator("a", { hasText: "View Project Outline" })).toBeVisible();
    await expect(page.locator("a", { hasText: "Start New Chat" })).toBeVisible();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 9. CONTENT CORRECTNESS
// ════════════════════════════════════════════════════════════════════════════

test.describe("9 · Content Correctness", () => {
  test("Landing — hero headline mentions '5 Days'", async ({ page }) => {
    await goto(page, "/");
    await expect(page.locator("h1", { hasText: "5 Days" })).toBeVisible();
  });

  test("Landing — social proof stats visible (80+, 4.5+, 1,000+)", async ({ page }) => {
    await goto(page, "/");
    await expect(page.locator("strong", { hasText: "80+" })).toBeVisible();
    await expect(page.locator("strong", { hasText: "4.5+" })).toBeVisible();
    await expect(page.locator("strong", { hasText: "1,000+" })).toBeVisible();
  });

  test("Landing — 3 case studies visible (Homely Place, Med Clear, Method Loop)", async ({ page }) => {
    await goto(page, "/");
    await expect(page.locator("text=Homely Place")).toBeVisible();
    await expect(page.locator("text=Med Clear")).toBeVisible();
    await expect(page.locator("text=Method Loop")).toBeVisible();
  });

  test("Landing — How It Works section has 3 numbered steps", async ({ page }) => {
    await goto(page, "/");
    // Step numbers are in large accent-purple spans — use exact matching
    await expect(page.getByText("01", { exact: true })).toBeVisible();
    await expect(page.getByText("02", { exact: true })).toBeVisible();
    await expect(page.getByText("03", { exact: true })).toBeVisible();
  });

  test("Landing — team members Anton and Tanuj are listed", async ({ page }) => {
    await goto(page, "/");
    await expect(page.locator("h3", { hasText: "Meet Anton" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "Meet Tanuj" })).toBeVisible();
  });

  test("Landing — Jordan Barnard testimonial is present", async ({ page }) => {
    await goto(page, "/");
    await expect(page.locator("text=Jordan Barnard")).toBeVisible();
    await expect(page.locator("text=Director @ EY")).toBeVisible();
  });

  test("Landing — Louis W. testimonial is present", async ({ page }) => {
    await goto(page, "/");
    await expect(page.locator("text=Louis W.")).toBeVisible();
    await expect(page.locator("text=fencing lead-gen software")).toBeVisible();
  });

  test("Landing — CTA matches Framer text", async ({ page }) => {
    await goto(page, "/");
    await expect(page.locator("text=Complete the form below to book a consultation")).toBeVisible();
  });

  test("Schedule — 'You're approved!' heading shown", async ({ page }) => {
    await goto(page, "/schedule");
    await expect(page.locator("h1", { hasText: "approved!" })).toBeVisible();
  });

  test("Register — 'Next 5 Days' heading shown", async ({ page }) => {
    await goto(page, "/register");
    await expect(page.locator("h1", { hasText: "5 Days" })).toBeVisible();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 10. SCREENSHOTS (visual reference, not diff-based)
// ════════════════════════════════════════════════════════════════════════════

test.describe("10 · Page Screenshots", () => {
  const ROUTES = [
    { name: "landing", path: "/" },
    { name: "chat-room", path: "/chat-room" },
    { name: "register", path: "/register" },
    { name: "schedule", path: "/schedule" },
    { name: "project-outline", path: "/project-outline-2" },
    { name: "booked", path: "/booked" },
  ];

  for (const route of ROUTES) {
    test(`Screenshot: ${route.name}`, async ({ page }) => {
      test.setTimeout(60_000);
      await page.setViewportSize({ width: 1440, height: 900 });
      await goto(page, route.path);
      await page.waitForTimeout(2000); // allow images/fonts to settle
      await screenshot(page, route.name);
      // Test always passes — screenshots are for manual review
    });
  }
});
