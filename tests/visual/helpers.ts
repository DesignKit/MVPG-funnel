import path from "path";
import fs from "fs";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

export const FRAMER_BASE_URL = "https://mvpgurus.framer.website";

export const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 810, height: 1080 },
  mobile: { width: 390, height: 844 },
} as const;

export const PAGES = [
  { name: "landing", path: "/" },
  { name: "chat-room", path: "/chat-room" },
  { name: "register", path: "/register" },
  { name: "schedule", path: "/schedule" },
  { name: "project-outline", path: "/project-outline-2" },
  { name: "booked", path: "/booked" },
  { name: "404", path: "/404" },
] as const;

// Per-page threshold overrides.
// Pages with embedded Vimeo videos get a higher threshold because the
// Vimeo player renders non-deterministically (different thumbnail frame,
// different control states) between the baseline capture and test run.
export const PAGE_THRESHOLDS: Record<string, number> = {
  "project-outline": 15,
  booked: 15,
};

// --- Directory constants ---
const ROOT = path.resolve(__dirname, "../..");
export const BASELINE_DIR = path.join(ROOT, "screenshots/baseline");
export const ACTUAL_DIR = path.join(ROOT, "screenshots/actual");
export const DIFF_DIR = path.join(ROOT, "screenshots/diff");

// Default max allowed diff percentage
export const MAX_DIFF_PERCENT = 8;

// --- Helpers ---

/** Ensure a directory exists */
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Pad a PNG to target dimensions by adding transparent pixels.
 * Returns a new PNG with the target size.
 */
function padImage(img: PNG, targetWidth: number, targetHeight: number): PNG {
  if (img.width === targetWidth && img.height === targetHeight) return img;

  const padded = new PNG({ width: targetWidth, height: targetHeight });
  // Fill with transparent black (all zeroes) — already the default for Buffer.alloc
  padded.data.fill(0);

  // Copy original pixels into top-left corner
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const srcIdx = (y * img.width + x) * 4;
      const dstIdx = (y * targetWidth + x) * 4;
      padded.data[srcIdx] !== undefined &&
        img.data.copy(padded.data, dstIdx, srcIdx, srcIdx + 4);
    }
  }

  return padded;
}

export interface CompareResult {
  diffCount: number;
  totalPixels: number;
  diffPercent: number;
  diffImagePath: string;
  actualImagePath: string;
}

/**
 * Compare a screenshot buffer against a baseline PNG on disk.
 * Writes the actual screenshot and a visual diff image to their respective dirs.
 * Returns diff statistics.
 */
export function compareImages(
  screenshotBuffer: Buffer,
  baselineName: string
): CompareResult {
  ensureDir(ACTUAL_DIR);
  ensureDir(DIFF_DIR);

  const baselinePath = path.join(BASELINE_DIR, `${baselineName}.png`);
  if (!fs.existsSync(baselinePath)) {
    throw new Error(`Baseline not found: ${baselinePath}`);
  }

  // Write actual screenshot
  const actualPath = path.join(ACTUAL_DIR, `${baselineName}.png`);
  fs.writeFileSync(actualPath, screenshotBuffer);

  // Decode both images (typed as PNG so padImage() can reassign them)
  let baseline: PNG = PNG.sync.read(fs.readFileSync(baselinePath));
  let actual: PNG = PNG.sync.read(screenshotBuffer);

  // Pad to common dimensions if sizes differ
  const width = Math.max(baseline.width, actual.width);
  const height = Math.max(baseline.height, actual.height);

  if (baseline.width !== width || baseline.height !== height) {
    baseline = padImage(baseline, width, height);
  }
  if (actual.width !== width || actual.height !== height) {
    actual = padImage(actual, width, height);
  }

  // Create diff image
  const diff = new PNG({ width, height });

  const diffCount = pixelmatch(
    baseline.data,
    actual.data,
    diff.data,
    width,
    height,
    {
      threshold: 0.3, // Absorbs font hinting differences
      includeAA: false, // Skip anti-aliasing noise
    }
  );

  // Write diff image
  const diffPath = path.join(DIFF_DIR, `${baselineName}.png`);
  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  const totalPixels = width * height;
  const diffPercent = (diffCount / totalPixels) * 100;

  return {
    diffCount,
    totalPixels,
    diffPercent,
    diffImagePath: diffPath,
    actualImagePath: actualPath,
  };
}

export interface SummaryEntry {
  page: string;
  viewport: string;
  diffPercent: number;
  diffCount: number;
  totalPixels: number;
  passed: boolean;
}

/** Write a summary JSON sorted by worst diff first */
export function writeSummary(entries: SummaryEntry[]) {
  ensureDir(DIFF_DIR);
  const sorted = [...entries].sort((a, b) => b.diffPercent - a.diffPercent);
  const summaryPath = path.join(DIFF_DIR, "_summary.json");
  fs.writeFileSync(summaryPath, JSON.stringify(sorted, null, 2));
  return summaryPath;
}
