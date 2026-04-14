import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "next-sanity";

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
const readToken = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN;
const runtimeApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-01";
const defaultReceiptPath = path.join(
  repoRoot,
  ".planning/phases/02-data-layer-migration/02-FRESH-START-RECEIPT.md",
);
const categoryQuery = `*[_type == "category"] | order(displayOrder asc) {
  _id,
  title,
  "slug": slug.current,
  displayOrder
}`;
const galleryItemCountQuery = `count(*[_type == "galleryItem"])`;

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

  const expectedCategoryIds = CATEGORY_SLOTS.map((slot) => slot.id);
  if (_snapshot.categories.length === 0) {
    if (_snapshot.galleryItemCount > 0) {
      throw new Error(
        "Fresh-start bootstrap found gallery items before any category slots were seeded. Resolve the dataset manually before continuing.",
      );
    }

    return;
  }

  if (_snapshot.categories.length !== expectedCategoryIds.length) {
    throw new Error(
      `Fresh-start bootstrap requires ${expectedCategoryIds.length} category documents, found ${_snapshot.categories.length}.`,
    );
  }

  const problems: string[] = [];
  _snapshot.categories.forEach((category, index) => {
    const expectedSlot = CATEGORY_SLOTS[index];
    const normalizedId = category.id.replace(/^drafts\./, "");

    if (normalizedId !== expectedSlot.id) {
      problems.push(`slot ${index + 1} should use document id "${expectedSlot.id}", found "${category.id}"`);
    }

    if (category.displayOrder !== index + 1) {
      problems.push(
        `slot ${index + 1} should use display order ${index + 1}, found ${category.displayOrder}`,
      );
    }

    if (category.slug !== expectedSlot.proposedSlug) {
      problems.push(
        `slot ${index + 1} should use slug "${expectedSlot.proposedSlug}", found "${category.slug}"`,
      );
    }
  });

  if (problems.length > 0) {
    throw new Error(`Fresh-start category validation failed:\n- ${problems.join("\n- ")}`);
  }

  if (options.strict && _snapshot.galleryItemCount !== 0) {
    throw new Error(
      `Fresh-start strict mode requires zero gallery items, found ${_snapshot.galleryItemCount}.`,
    );
  }
}

export function renderReceipt(snapshot: FreshStartSnapshot) {
  const categoryLines =
    snapshot.categories.length > 0
      ? snapshot.categories
          .map(
            (category) =>
              `| ${category.displayOrder} | ${category.id} | ${category.title} | ${category.slug} |`,
          )
          .join("\n")
      : "| - | - | No category documents found yet | - |";

  const categoryStatus =
    snapshot.categories.length === CATEGORY_SLOTS.length
      ? "All three Phase 1 category slots are present."
      : snapshot.categories.length === 0
        ? "No category documents are seeded yet; editors will need to create or publish the three category slots in Studio."
        : `Category seeding is incomplete: found ${snapshot.categories.length} of ${CATEGORY_SLOTS.length} expected slots.`;

  return [
    "---",
    "phase: 02-data-layer-migration",
    "plan: 02",
    `generated_at: ${new Date().toISOString()}`,
    `dataset: ${snapshot.dataset}`,
    `project_id: ${snapshot.projectId}`,
    `gallery_items: ${snapshot.galleryItemCount}`,
    "---",
    "",
    "# Phase 02 Fresh-Start Receipt",
    "",
    "This dataset is intentionally starting fresh. Legacy markdown portfolio photos were not imported into Sanity for Phase 2.",
    "",
    "## Decision",
    "",
    "- Approved path: fresh start with no legacy photo import",
    "- Future Work images will be added manually in Sanity Studio",
    "- This command only inspects dataset state and writes this receipt",
    "",
    "## Dataset Snapshot",
    "",
    `- Project ID: \`${snapshot.projectId}\``,
    `- Dataset: \`${snapshot.dataset}\``,
    `- Gallery items: ${snapshot.galleryItemCount}`,
    `- Phase 1 category slots present: ${snapshot.categories.length} of ${CATEGORY_SLOTS.length}`,
    "",
    "## Category State",
    "",
    categoryStatus,
    "",
    "| Order | Document ID | Title | Slug |",
    "| --- | --- | --- | --- |",
    categoryLines,
    "",
    "## Intentional Fresh Start",
    "",
    "The Work dataset is confirmed as a fresh-start editorial system. New gallery items must be created manually in Studio rather than derived from legacy markdown content.",
    "",
  ].join("\n");
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

function requireEnvValue(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

function getClient() {
  const runtimeProjectId = requireEnvValue("NEXT_PUBLIC_SANITY_PROJECT_ID");
  const runtimeDataset = requireEnvValue("NEXT_PUBLIC_SANITY_DATASET");

  return createClient({
    projectId: runtimeProjectId,
    dataset: runtimeDataset,
    apiVersion: runtimeApiVersion,
    useCdn: false,
    perspective: readToken ? "drafts" : "published",
    token: readToken,
  });
}

async function fetchFreshStartSnapshot(): Promise<FreshStartSnapshot> {
  const runtimeProjectId = requireEnvValue("NEXT_PUBLIC_SANITY_PROJECT_ID");
  const runtimeDataset = requireEnvValue("NEXT_PUBLIC_SANITY_DATASET");
  const client = getClient();
  const [categories, galleryItemCount] = await Promise.all([
    client.fetch<
      {
        _id: string;
        title: string;
        slug: string;
        displayOrder: number;
      }[]
    >(categoryQuery),
    client.fetch<number>(galleryItemCountQuery),
  ]);

  return {
    projectId: runtimeProjectId,
    dataset: runtimeDataset,
    categories: Array.isArray(categories)
      ? categories.map((category) => ({
          id: category._id,
          title: category.title,
          slug: category.slug,
          displayOrder: category.displayOrder,
        }))
      : [],
    galleryItemCount: typeof galleryItemCount === "number" ? galleryItemCount : 0,
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
  const snapshot = await fetchFreshStartSnapshot();
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
  assert.match(receipt, /Phase 02 Fresh-Start Receipt/);
  assert.match(receipt, /Gallery items: 0/);
  assert.match(receipt, /work-category-1/);
  assert.match(receipt, /Legacy markdown portfolio photos were not imported/);
  assert.doesNotThrow(() =>
    validateFreshStartSnapshot(
      {
        ...validSnapshot,
        categories: [],
      },
      options,
    ),
  );

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
