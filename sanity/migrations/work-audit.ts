import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { createClient } from "next-sanity";

type CliOptions = {
  reportPath: string;
  strict: boolean;
  selfTest: boolean;
};

type ReceiptSnapshot = {
  dataset: string | null;
  projectId: string | null;
  galleryItems: number | null;
  categoryIds: string[];
};

type SanityCategoryRecord = {
  _id: string;
  title: string;
  slug: string;
  displayOrder: number;
};

type AuditSnapshot = {
  projectId: string;
  dataset: string;
  receipt: ReceiptSnapshot;
  directCategories: SanityCategoryRecord[];
  directGalleryItemCount: number;
  helperCategories: HelperCategoryRecord[];
  homeGalleryItems: HelperGalleryItemRecord[];
  galleryItemsByKnownCategory: HelperGalleryItemRecord[];
  legacyProjects: HelperLegacyProjectRecord[];
  legacyProjectSlugs: string[];
  legacyProjectLookup: HelperLegacyProjectRecord | null;
};

const repoRoot = path.resolve(__dirname, "../..");
const defaultReportPath = path.join(
  repoRoot,
  ".planning/phases/02-data-layer-migration/02-FRESH-START-AUDIT.md",
);
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
const galleryCountQuery = `count(*[_type == "galleryItem"])`;
const defaultApiVersion = "2026-03-01";

type HelperCategoryRecord = {
  id: string;
  title: string;
  slug: string;
  displayOrder: number;
};

type HelperGalleryItemRecord = {
  id: string;
};

type HelperLegacyProjectRecord = {
  slug: string;
};

type HelperSnapshot = {
  categories: HelperCategoryRecord[];
  homeGalleryItems: HelperGalleryItemRecord[];
  galleryItemsByKnownCategory: HelperGalleryItemRecord[];
  legacyProjects: HelperLegacyProjectRecord[];
  legacyProjectSlugs: string[];
  legacyProjectLookup: HelperLegacyProjectRecord | null;
};

function parseCliArgs(argv: string[]): CliOptions {
  const reportIndex = argv.indexOf("--report");
  const reportPath =
    reportIndex >= 0 && typeof argv[reportIndex + 1] === "string"
      ? path.resolve(repoRoot, argv[reportIndex + 1])
      : defaultReportPath;

  return {
    reportPath,
    strict: argv.includes("--strict"),
    selfTest: argv.includes("--self-test"),
  };
}

function readDotEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function loadRepoEnv() {
  readDotEnvFile(path.join(repoRoot, ".env.local"));
  readDotEnvFile(path.join(repoRoot, ".env"));
}

function getRuntimeProjectId(receipt: ReceiptSnapshot) {
  return process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || receipt.projectId;
}

function getRuntimeDataset(receipt: ReceiptSnapshot) {
  return process.env.NEXT_PUBLIC_SANITY_DATASET || receipt.dataset;
}

function requireRuntimeValue(value: string | null | undefined, errorMessage: string) {
  if (!value) {
    throw new Error(errorMessage);
  }

  return value;
}

function getClient(receipt: ReceiptSnapshot) {
  const projectId = requireRuntimeValue(
    getRuntimeProjectId(receipt),
    "Missing Sanity project id. Set NEXT_PUBLIC_SANITY_PROJECT_ID or keep project_id in the fresh-start receipt.",
  );
  const dataset = requireRuntimeValue(
    getRuntimeDataset(receipt),
    "Missing Sanity dataset. Set NEXT_PUBLIC_SANITY_DATASET or keep dataset in the fresh-start receipt.",
  );
  const token = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN;

  return createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || defaultApiVersion,
    useCdn: false,
    perspective: token ? "drafts" : "published",
    token,
  });
}

function parseFrontmatterValue(markdown: string, key: string) {
  const match = markdown.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match ? match[1].trim() : null;
}

function parseReceiptCategoryIds(markdown: string) {
  return Array.from(markdown.matchAll(/\|\s*\d+\s*\|\s*([^|]+?)\s*\|/g)).map((match) => match[1].trim());
}

function readReceiptSnapshot(receiptPath: string): ReceiptSnapshot {
  const markdown = fs.readFileSync(receiptPath, "utf8");
  const galleryItemsValue = parseFrontmatterValue(markdown, "gallery_items");

  return {
    dataset: parseFrontmatterValue(markdown, "dataset"),
    projectId: parseFrontmatterValue(markdown, "project_id"),
    galleryItems: galleryItemsValue ? Number(galleryItemsValue) : null,
    categoryIds: parseReceiptCategoryIds(markdown).filter((value) => value !== "-"),
  };
}

function ensureParentDirectory(filePath: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function toSortedIdList(values: { id: string }[]) {
  return values.map((value) => value.id).sort();
}

function runHelperSnapshot(categorySlug: string): HelperSnapshot {
  const script = `
    const imported = await import(${JSON.stringify(path.join(repoRoot, "sanity/lib/work.ts"))});
    const work = imported.default ?? imported;
    const { getWorkCategories, getHomeGalleryItems, getGalleryItemsByCategorySlug, getLegacyProjectsFromSanity, getLegacyProjectSlugsFromSanity, getLegacyProjectBySlugFromSanity } = work;
    const [categories, homeGalleryItems, galleryItemsByKnownCategory, legacyProjects, legacyProjectSlugs, legacyProjectLookup] = await Promise.all([
      getWorkCategories(),
      getHomeGalleryItems(),
      getGalleryItemsByCategorySlug(${JSON.stringify(categorySlug)}),
      getLegacyProjectsFromSanity(),
      getLegacyProjectSlugsFromSanity(),
      getLegacyProjectBySlugFromSanity("non-existent-legacy-project")
    ]);
    process.stdout.write(JSON.stringify({
      categories,
      homeGalleryItems,
      galleryItemsByKnownCategory,
      legacyProjects,
      legacyProjectSlugs,
      legacyProjectLookup
    }));
  `;

  const output = execFileSync(
    process.execPath,
    ["--conditions=react-server", "--import", "tsx", "--eval", script],
    {
      cwd: repoRoot,
      env: process.env,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  return JSON.parse(output) as HelperSnapshot;
}

function renderAuditReport(snapshot: AuditSnapshot, options: CliOptions) {
  const helperCategoryLines =
    snapshot.helperCategories.length > 0
      ? snapshot.helperCategories
          .map(
            (category) =>
              `| ${category.displayOrder} | ${category.id} | ${category.title} | ${category.slug} |`,
          )
          .join("\n")
      : "| - | - | No helper-visible categories yet | - |";

  const directCategoryLines =
    snapshot.directCategories.length > 0
      ? snapshot.directCategories
          .map(
            (category) =>
              `| ${category.displayOrder} | ${category._id} | ${category.title} | ${category.slug} |`,
          )
          .join("\n")
      : "| - | - | No category documents found | - |";

  const categoryAssessment =
    snapshot.directCategories.length === 0
      ? "The live dataset still has zero seeded category documents. This is the approved Phase 2 state and should be carried forward as an audit finding, not treated as a failed migration."
      : `The live dataset exposes ${snapshot.directCategories.length} category documents and the helper layer returns the same count.`;

  return [
    "---",
    "phase: 02-data-layer-migration",
    "plan: 03",
    `generated_at: ${new Date().toISOString()}`,
    `dataset: ${snapshot.dataset}`,
    `project_id: ${snapshot.projectId}`,
    `strict: ${options.strict}`,
    "---",
    "",
    "# Phase 02 Fresh-Start Audit",
    "",
    "This audit verifies Phase 2 fresh start behavior through the app-facing Sanity helper layer.",
    "",
    "## Result",
    "",
    "- Status: PASS",
    "- Audit mode: `work-audit`",
    "- Verified state: `work:fresh-start`",
    `- Receipt file: \`${path.relative(repoRoot, defaultReceiptPath)}\``,
    `- Report file: \`${path.relative(repoRoot, options.reportPath)}\``,
    "",
    "## Snapshot",
    "",
    `- Project ID: \`${snapshot.projectId}\``,
    `- Dataset: \`${snapshot.dataset}\``,
    `- Receipt gallery items: ${snapshot.receipt.galleryItems ?? "unknown"}`,
    `- Direct gallery items: ${snapshot.directGalleryItemCount}`,
    `- Direct categories: ${snapshot.directCategories.length}`,
    `- Helper categories: ${snapshot.helperCategories.length}`,
    `- Helper home gallery items: ${snapshot.homeGalleryItems.length}`,
    `- Helper legacy projects: ${snapshot.legacyProjects.length}`,
    "",
    "## Findings",
    "",
    "- The checked-in receipt matches the live dataset count for gallery items.",
    "- Empty-state-safe helper reads return arrays or `null` instead of throwing when Work has no photos.",
    "- Legacy-project bridge helpers do not require imported markdown-derived Sanity records to remain stable.",
    `- ${categoryAssessment}`,
    "",
    "## Category Snapshot",
    "",
    "### Direct Sanity query",
    "",
    "| Order | Document ID | Title | Slug |",
    "| --- | --- | --- | --- |",
    directCategoryLines,
    "",
    "### Helper output",
    "",
    "| Order | Document ID | Title | Slug |",
    "| --- | --- | --- | --- |",
    helperCategoryLines,
    "",
    "## Empty-State Helper Checks",
    "",
    `- \`getHomeGalleryItems()\` returned ${snapshot.homeGalleryItems.length} items.`,
    `- \`getLegacyProjectsFromSanity()\` returned ${snapshot.legacyProjects.length} projects.`,
    `- \`getLegacyProjectSlugsFromSanity()\` returned ${snapshot.legacyProjectSlugs.length} slugs.`,
    `- \`getLegacyProjectBySlugFromSanity(\"non-existent-legacy-project\")\` returned ${snapshot.legacyProjectLookup === null ? "`null`" : "`data`"}.`,
    `- \`getGalleryItemsByCategorySlug(\"editorial\")\` returned ${snapshot.galleryItemsByKnownCategory.length} items.`,
    "",
    "## Manual Editorial Workflow",
    "",
    "1. Open `/studio` and verify whether the three Work categories are still unseeded or have since been created.",
    "2. Keep the gallery empty for the approved Phase 2 fresh start; do not import legacy markdown photos.",
    "3. Add future Work images manually as `galleryItem` documents in Studio when editorially ready.",
    "4. Handle the About/profile image in a later About or site-settings CMS phase instead of forcing it into the Work taxonomy.",
    "",
  ].join("\n");
}

export function validateAuditSnapshot(snapshot: AuditSnapshot, options: CliOptions) {
  if (snapshot.receipt.projectId && snapshot.receipt.projectId !== snapshot.projectId) {
    throw new Error(
      `Fresh-start receipt project id ${snapshot.receipt.projectId} does not match runtime project id ${snapshot.projectId}.`,
    );
  }

  if (snapshot.receipt.dataset && snapshot.receipt.dataset !== snapshot.dataset) {
    throw new Error(
      `Fresh-start receipt dataset ${snapshot.receipt.dataset} does not match runtime dataset ${snapshot.dataset}.`,
    );
  }

  if (
    typeof snapshot.receipt.galleryItems === "number" &&
    snapshot.receipt.galleryItems !== snapshot.directGalleryItemCount
  ) {
    throw new Error(
      `Fresh-start receipt gallery item count ${snapshot.receipt.galleryItems} does not match direct gallery count ${snapshot.directGalleryItemCount}.`,
    );
  }

  if (snapshot.directCategories.length !== snapshot.helperCategories.length) {
    throw new Error(
      `Direct category count ${snapshot.directCategories.length} does not match helper category count ${snapshot.helperCategories.length}.`,
    );
  }

  const directCategoryIds = snapshot.directCategories.map((category) => category._id).sort();
  const helperCategoryIds = toSortedIdList(snapshot.helperCategories);

  if (JSON.stringify(directCategoryIds) !== JSON.stringify(helperCategoryIds)) {
    throw new Error("Direct category ids do not match helper-visible category ids.");
  }

  if (!Array.isArray(snapshot.homeGalleryItems)) {
    throw new Error("getHomeGalleryItems() did not return an array.");
  }

  if (!Array.isArray(snapshot.galleryItemsByKnownCategory)) {
    throw new Error("getGalleryItemsByCategorySlug() did not return an array.");
  }

  if (!Array.isArray(snapshot.legacyProjects)) {
    throw new Error("getLegacyProjectsFromSanity() did not return an array.");
  }

  if (!Array.isArray(snapshot.legacyProjectSlugs)) {
    throw new Error("getLegacyProjectSlugsFromSanity() did not return an array.");
  }

  if (snapshot.legacyProjectLookup !== null) {
    throw new Error("getLegacyProjectBySlugFromSanity() should return null for a missing legacy slug.");
  }

  if (options.strict) {
    if (snapshot.directGalleryItemCount !== 0) {
      throw new Error(
        `Strict fresh-start audit requires zero gallery items, found ${snapshot.directGalleryItemCount}.`,
      );
    }

    if (snapshot.legacyProjects.length !== 0 || snapshot.legacyProjectSlugs.length !== 0) {
      throw new Error("Strict fresh-start audit found legacy-project bridge data in a fresh-start dataset.");
    }
  }
}

async function buildAuditSnapshot(): Promise<AuditSnapshot> {
  loadRepoEnv();
  const receipt = readReceiptSnapshot(defaultReceiptPath);
  const projectId = requireRuntimeValue(
    getRuntimeProjectId(receipt),
    "Missing Sanity project id. Set NEXT_PUBLIC_SANITY_PROJECT_ID or keep project_id in the fresh-start receipt.",
  );
  const dataset = requireRuntimeValue(
    getRuntimeDataset(receipt),
    "Missing Sanity dataset. Set NEXT_PUBLIC_SANITY_DATASET or keep dataset in the fresh-start receipt.",
  );
  const client = getClient(receipt);
  const directCategories = await client.fetch<SanityCategoryRecord[]>(categoryQuery);
  const directGalleryItemCount = await client.fetch<number>(galleryCountQuery);
  const categorySlug = directCategories[0]?.slug ?? "editorial";
  const helperSnapshot = runHelperSnapshot(categorySlug);

  if (typeof receipt.galleryItems === "number" && typeof directGalleryItemCount === "number") {
    if (receipt.galleryItems !== directGalleryItemCount) {
      throw new Error(
        `Fresh-start receipt gallery item count ${receipt.galleryItems} does not match direct Sanity count ${directGalleryItemCount}.`,
      );
    }
  }

  return {
    projectId,
    dataset,
    receipt,
    directCategories: Array.isArray(directCategories) ? directCategories : [],
    directGalleryItemCount,
    helperCategories: helperSnapshot.categories,
    homeGalleryItems: helperSnapshot.homeGalleryItems,
    galleryItemsByKnownCategory: helperSnapshot.galleryItemsByKnownCategory,
    legacyProjects: helperSnapshot.legacyProjects,
    legacyProjectSlugs: helperSnapshot.legacyProjectSlugs,
    legacyProjectLookup: helperSnapshot.legacyProjectLookup,
  };
}

function writeReport(reportPath: string, markdown: string) {
  ensureParentDirectory(reportPath);
  fs.writeFileSync(reportPath, markdown, "utf8");
}

async function runSelfTest() {
  const options = parseCliArgs(["--report", ".planning/phases/02-data-layer-migration/02-FRESH-START-AUDIT.md", "--strict"]);
  assert.equal(options.strict, true);
  assert.equal(options.reportPath, defaultReportPath);

  const report = renderAuditReport(
    {
      projectId: "test-project",
      dataset: "production",
      receipt: {
        dataset: "production",
        projectId: "test-project",
        galleryItems: 0,
        categoryIds: [],
      },
      directCategories: [],
      directGalleryItemCount: 0,
      helperCategories: [],
      homeGalleryItems: [],
      galleryItemsByKnownCategory: [],
      legacyProjects: [],
      legacyProjectSlugs: [],
      legacyProjectLookup: null,
    },
    options,
  );

  assert.match(report, /Phase 02 Fresh-Start Audit/);
  assert.match(report, /work-audit/);
  assert.match(report, /work:fresh-start/);
  assert.doesNotThrow(() =>
    validateAuditSnapshot(
      {
        projectId: "test-project",
        dataset: "production",
        receipt: {
          dataset: "production",
          projectId: "test-project",
          galleryItems: 0,
          categoryIds: [],
        },
        directCategories: [],
        directGalleryItemCount: 0,
        helperCategories: [],
        homeGalleryItems: [],
        galleryItemsByKnownCategory: [],
        legacyProjects: [],
        legacyProjectSlugs: [],
        legacyProjectLookup: null,
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

  const snapshot = await buildAuditSnapshot();
  validateAuditSnapshot(snapshot, options);
  const report = renderAuditReport(snapshot, options);
  writeReport(options.reportPath, report);

  console.log(`Audit written to ${path.relative(repoRoot, options.reportPath)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
