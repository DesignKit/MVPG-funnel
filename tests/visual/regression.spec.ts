import { test, expect } from "@playwright/test";
import { VIEWPORTS, PAGES } from "./helpers";

// Compares rebuilt pages (localhost:3000) against Framer baselines.
// Run with: npm run test:visual

for (const page of PAGES) {
  for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
    test(`${page.name} @ ${viewportName} matches baseline`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        viewport,
      });
      const pw = await context.newPage();

      await pw.goto(page.path, { waitUntil: "networkidle" });
      await pw.waitForTimeout(2000);

      const screenshot = await pw.screenshot({ fullPage: true });

      expect(screenshot).toMatchSnapshot(
        `${page.name}-${viewportName}.png`,
        { maxDiffPixelRatio: 0.05 }
      );

      await context.close();
    });
  }
}
