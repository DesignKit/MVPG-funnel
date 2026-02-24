import { test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { FRAMER_BASE_URL, VIEWPORTS, PAGES } from "./helpers";

const BASELINE_DIR = path.join(__dirname, "../../screenshots/baseline");

// One-time script: captures baseline screenshots from the live Framer site.
// Run with: npm run test:visual:baseline

test.beforeAll(() => {
  if (!fs.existsSync(BASELINE_DIR)) {
    fs.mkdirSync(BASELINE_DIR, { recursive: true });
  }
});

for (const page of PAGES) {
  for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
    test(`capture baseline: ${page.name} @ ${viewportName}`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        viewport,
      });
      const pw = await context.newPage();

      await pw.goto(`${FRAMER_BASE_URL}${page.path}`, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });

      // Wait for Framer animations and lazy-loaded content to settle
      await pw.waitForTimeout(5000);

      const screenshot = await pw.screenshot({ fullPage: true });

      const filename = `${page.name}-${viewportName}.png`;
      fs.writeFileSync(path.join(BASELINE_DIR, filename), screenshot);

      await context.close();
    });
  }
}
