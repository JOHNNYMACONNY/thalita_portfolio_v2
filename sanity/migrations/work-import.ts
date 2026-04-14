import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { CATEGORY_SLOTS } from "./work-category-map";

type CliOptions = {
  dryRun: boolean;
  strict: boolean;
  selfTest: boolean;
  receiptPath: string;
  unsupportedFlags: string[];
};

type FreshStartSnapshot = {
  projectId: string;
  dataset: string;
  categories: {
    id: string;
    title: string;
    slug: string;
    displayOrder: number;
  }[];
  galleryItemCount: number;
};

const repoRoot = path.resolve(__dirname, "../..");
const defaultReceiptPath = path.join(
  repoRoot,
  ".planning/phases/02-data-layer-migration/02-FRESH-START-RECEIPT.md",
);

const legacyImportFlags = new Set([
  "--manifest",
  "--approval",
  "--ndjson",
  "--from-markdown",
  "--import",
  "--write-import",
]);

export function parseCliArgs(argv: string[]): CliOptions {
  const unsupportedFlags = argv.filter((arg) => legacyImportFlags.has(arg));
  const receiptIndex = argv.indexOf("--receipt");
  const receiptPath =
    receiptIndex >= 0 && typeof argv[receiptIndex + 1] === "string"
      ? path.resolve(repoRoot, argv[receiptIndex + 1])
      : defaultReceiptPath;

  return {
    dryRun: argv.includes("--dry-run"),
    strict: argv.includes("--strict"),
    selfTest: argv.includes("--self-test"),
    receiptPath,
    unsupportedFlags,
  };
}

export function validateFreshStartSnapshot(_snapshot: FreshStartSnapshot, options: CliOptions) {
  if (options.unsupportedFlags.length > 0) {
    throw new Error(
      `Legacy import flags are no longer supported: ${options.unsupportedFlags.join(", ")}`,
    );
  }

  throw new Error("Fresh-start bootstrap has not been implemented yet.");
}

export function renderReceipt(_snapshot: FreshStartSnapshot) {
  throw new Error("Fresh-start receipt generation has not been implemented yet.");
}

function ensureParentDirectory(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function buildPlaceholderSnapshot(): FreshStartSnapshot {
  return {
    projectId: "test-project",
    dataset: "test-dataset",
    categories: CATEGORY_SLOTS.map((slot, index) => ({
      id: slot.id,
      title: slot.proposedTitle,
      slug: slot.proposedSlug,
      displayOrder: index + 1,
    })),
    galleryItemCount: 0,
  };
}

function writeReceipt(receiptPath: string, receipt: string) {
  ensureParentDirectory(receiptPath);
  fs.writeFileSync(receiptPath, receipt, "utf8");
}

function hashReceipt(receipt: string) {
  return createHash("sha1").update(receipt).digest("hex");
}

export async function runFreshStartBootstrap(options: CliOptions) {
  const snapshot = buildPlaceholderSnapshot();
  validateFreshStartSnapshot(snapshot, options);
  const receipt = renderReceipt(snapshot);
  writeReceipt(options.receiptPath, receipt);

  return {
    receiptPath: options.receiptPath,
    receiptHash: hashReceipt(receipt),
    snapshot,
  };
}

async function runSelfTest() {
  const options = parseCliArgs(["--dry-run", "--strict"]);
  assert.equal(options.dryRun, true);
  assert.equal(options.strict, true);
  assert.equal(
    options.receiptPath,
    defaultReceiptPath,
    "Receipt path should default to the Phase 2 fresh-start receipt file.",
  );

  assert.throws(
    () =>
      validateFreshStartSnapshot(buildPlaceholderSnapshot(), {
        ...options,
        unsupportedFlags: ["--manifest"],
      }),
    /Legacy import flags are no longer supported/,
  );

  const validSnapshot = buildPlaceholderSnapshot();
  assert.doesNotThrow(() => validateFreshStartSnapshot(validSnapshot, options));

  const receipt = renderReceipt(validSnapshot);
  assert.match(receipt, /Fresh-Start Receipt/);
  assert.match(receipt, /Gallery items: 0/);
  assert.match(receipt, /work-category-1/);

  console.log("Self-test passed.");
}

async function main() {
  const options = parseCliArgs(process.argv.slice(2));

  if (options.selfTest) {
    await runSelfTest();
    return;
  }

  const result = await runFreshStartBootstrap(options);
  console.log(`Receipt written to ${path.relative(repoRoot, result.receiptPath)} (${result.receiptHash})`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
