import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import {
  VIEWPORTS,
  PAGES,
  MAX_DIFF_PERCENT,
  PAGE_THRESHOLDS,
  DIFF_DIR,
  compareImages,
  writeSummary,
  type SummaryEntry,
} from "./helpers";

// Compares rebuilt pages (localhost:3000) against Framer baseline PNGs.
// Run with: npm run test:visual

// Each test writes its result to a JSON file so parallel workers can share data.
const RESULTS_DIR = path.join(DIFF_DIR, "_results");

function writeResult(entry: SummaryEntry) {
  if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
  }
  const filePath = path.join(
    RESULTS_DIR,
    `${entry.page}-${entry.viewport}.json`
  );
  fs.writeFileSync(filePath, JSON.stringify(entry));
}

function readAllResults(): SummaryEntry[] {
  if (!fs.existsSync(RESULTS_DIR)) return [];
  return fs
    .readdirSync(RESULTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(RESULTS_DIR, f), "utf-8")));
}

for (const page of PAGES) {
  for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
    const testName = `${page.name}-${viewportName}`;
    const maxDiff = PAGE_THRESHOLDS[page.name] ?? MAX_DIFF_PERCENT;

    test(`${page.name} @ ${viewportName} matches Framer baseline`, async ({
      browser,
    }) => {
      const context = await browser.newContext({ viewport });
      const pw = await context.newPage();

      // Navigate and wait for initial load
      await pw.goto(page.path, { waitUntil: "networkidle" });

      // Wait for fonts to settle
      await pw.evaluate(() => document.fonts.ready);

      // Scroll to bottom incrementally to trigger lazy content / animations
      await pw.evaluate(async () => {
        const delay = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));
        const scrollHeight = document.body.scrollHeight;
        const step = window.innerHeight;
        for (let y = 0; y < scrollHeight; y += step) {
          window.scrollTo(0, y);
          await delay(200);
        }
        // Scroll to absolute bottom
        window.scrollTo(0, document.body.scrollHeight);
        await delay(500);
        // Scroll back to top for consistent screenshot start
        window.scrollTo(0, 0);
        await delay(300);
      });

      // Wait for iframes (e.g. Vimeo embed) to load their content
      const iframes = pw.locator("iframe");
      const iframeCount = await iframes.count();
      for (let i = 0; i < iframeCount; i++) {
        try {
          const frame = iframes.nth(i);
          await frame.waitFor({ state: "attached", timeout: 10000 });
          const frameElement = await frame.elementHandle();
          if (frameElement) {
            await frameElement.waitForElementState("stable", { timeout: 10000 }).catch(() => {});
          }
        } catch {
          // Iframe may not load in test environment — continue
        }
      }

      // Extra wait for any remaining image loads / transitions
      await pw.waitForTimeout(2000);

      // Take full-page screenshot
      const screenshot = await pw.screenshot({ fullPage: true });

      // Compare against baseline
      const result = compareImages(screenshot, testName);

      const entry: SummaryEntry = {
        page: page.name,
        viewport: viewportName,
        diffPercent: parseFloat(result.diffPercent.toFixed(2)),
        diffCount: result.diffCount,
        totalPixels: result.totalPixels,
        passed: result.diffPercent <= maxDiff,
      };

      // Persist result to disk for cross-worker aggregation
      writeResult(entry);

      // Log diff info
      console.log(
        `  ${testName}: ${result.diffPercent.toFixed(2)}% diff (${result.diffCount.toLocaleString()} pixels)`
      );

      // Assert within threshold (per-page overrides for pages with video embeds)
      expect(
        result.diffPercent,
        `${testName} diff ${result.diffPercent.toFixed(2)}% exceeds ${maxDiff}% threshold. Check: ${result.diffImagePath}`
      ).toBeLessThanOrEqual(maxDiff);

      await context.close();
    });
  }
}

test.afterAll(() => {
  const allResults = readAllResults();
  if (allResults.length > 0) {
    const summaryPath = writeSummary(allResults);
    const passed = allResults.filter((r) => r.passed).length;
    console.log(`\nSummary written to: ${summaryPath}`);
    console.log(`Passed: ${passed}/${allResults.length}`);
  }
});
