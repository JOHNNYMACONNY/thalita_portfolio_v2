import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";

import {
  CATEGORY_SLOTS,
  getCategoryApprovalStatus,
  resolveLegacyCategory,
  type CanonicalCategoryId,
  type CategoryResolution,
} from "./work-category-map";

type RawLegacyFrontmatter = {
  title?: unknown;
  slug?: unknown;
  categories?: unknown;
  coverImage?: unknown;
  coverAlt?: unknown;
  gallery?: unknown;
  isFeatured?: unknown;
  featuredOrder?: unknown;
  isHidden?: unknown;
};

type LegacyGalleryEntry = {
  src: string;
  alt?: string;
};

type LegacyProject = {
  title: string;
  slug: string;
  categories: string[];
  coverImage: string;
  coverAlt?: string;
  gallery: LegacyGalleryEntry[];
  isFeatured: boolean;
  featuredOrder?: number;
  isHidden: boolean;
  sourceFile: string;
};

type ResolvedImageSource = {
  projectRelativePath: string;
  absolutePath: string;
  fileUri: string;
};

type ManifestRow = {
  _id: string;
  legacyProjectSlug: string;
  legacyProjectTitle: string;
  legacySourceFile: string;
  legacyImageRole: "cover" | "gallery";
  legacyImageIndex: number;
  categoryId: CanonicalCategoryId;
  categoryResolutionKind: CategoryResolution["resolutionKind"];
  categoryResolutionReason: string;
  categoryNeedsApproval: boolean;
  sourceCategories: string[];
  sourceImage: string;
  resolvedImage: string;
  title: string;
  alt: string;
  altSource: "source" | "derived";
  isVisible: boolean;
  showOnHomePage: boolean;
  homePageOrder?: number;
  importDocument: Record<string, unknown>;
};

type ManifestDocument = {
  generatedAt: string;
  dryRun: boolean;
  strict: boolean;
  summary: {
    projects: number;
    manifestRows: number;
    approvalRequired: boolean;
    categoryCounts: Record<CanonicalCategoryId, number>;
  };
  categorySlots: typeof CATEGORY_SLOTS;
  approval: {
    needsApproval: boolean;
    reasons: string[];
    checklist: string[];
  };
  rows: ManifestRow[];
};

type CliOptions = {
  dryRun: boolean;
  strict: boolean;
  selfTest: boolean;
};

type DeriveManifestOptions = {
  resolveImageSource: (sourcePath: string) => ResolvedImageSource;
};

const repoRoot = path.resolve(__dirname, "../..");
const projectContentDir = path.join(repoRoot, "content/projects");
const outputDir = path.join(repoRoot, "sanity/migrations/out");
const manifestPath = path.join(outputDir, "work-import-manifest.json");
const approvalPath = path.join(outputDir, "work-import-approval.md");
const ndjsonPath = path.join(outputDir, "import.ndjson");

function parseCliArgs(argv: string[]): CliOptions {
  return {
    dryRun: argv.includes("--dry-run"),
    strict: argv.includes("--strict"),
    selfTest: argv.includes("--self-test"),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function ensureString(value: unknown, fieldName: string, sourceFile: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Expected "${fieldName}" to be a non-empty string in ${sourceFile}.`);
  }

  return value.trim();
}

function ensureStringArray(
  value: unknown,
  fieldName: string,
  sourceFile: string,
): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`Expected "${fieldName}" to be an array in ${sourceFile}.`);
  }

  return value.map((entry, index) =>
    ensureString(entry, `${fieldName}[${index}]`, sourceFile),
  );
}

function parseGallery(value: unknown, sourceFile: string): LegacyGalleryEntry[] {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error(`Expected "gallery" to be an array in ${sourceFile}.`);
  }

  return value.map((entry, index) => {
    if (!isRecord(entry)) {
      throw new Error(`Expected "gallery[${index}]" to be an object in ${sourceFile}.`);
    }

    const src = ensureString(entry.src, `gallery[${index}].src`, sourceFile);
    const alt =
      entry.alt === undefined ? undefined : ensureString(entry.alt, `gallery[${index}].alt`, sourceFile);

    return { src, alt };
  });
}

function parseBoolean(value: unknown): boolean {
  return value === true;
}

function parseOptionalPositiveNumber(value: unknown, fieldName: string, sourceFile: string) {
  if (value === undefined) {
    return undefined;
  }

  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim().length > 0
        ? Number(value)
        : Number.NaN;

  if (!Number.isInteger(numericValue) || numericValue < 1) {
    throw new Error(`Expected "${fieldName}" to be a positive integer in ${sourceFile}.`);
  }

  return numericValue;
}

function readLegacyProjects(): LegacyProject[] {
  const entries = fs
    .readdirSync(projectContentDir)
    .filter((entry) => entry.endsWith(".md"))
    .sort();

  return entries.map((entry) => {
    const absoluteSourceFile = path.join(projectContentDir, entry);
    const rawFile = fs.readFileSync(absoluteSourceFile, "utf8");
    const { data } = matter(rawFile);
    const frontmatter = data as RawLegacyFrontmatter;

    return {
      title: ensureString(frontmatter.title, "title", entry),
      slug: ensureString(frontmatter.slug, "slug", entry),
      categories: ensureStringArray(frontmatter.categories, "categories", entry),
      coverImage: ensureString(frontmatter.coverImage, "coverImage", entry),
      coverAlt:
        frontmatter.coverAlt === undefined
          ? undefined
          : ensureString(frontmatter.coverAlt, "coverAlt", entry),
      gallery: parseGallery(frontmatter.gallery, entry),
      isFeatured: parseBoolean(frontmatter.isFeatured),
      featuredOrder: parseOptionalPositiveNumber(frontmatter.featuredOrder, "featuredOrder", entry),
      isHidden: parseBoolean(frontmatter.isHidden),
      sourceFile: path.relative(repoRoot, absoluteSourceFile),
    };
  });
}

function resolveImageSource(sourcePath: string): ResolvedImageSource {
  const trimmedSource = sourcePath.trim();
  const normalizedProjectPath = trimmedSource.startsWith("/")
    ? trimmedSource.slice(1)
    : trimmedSource;

  if (normalizedProjectPath.length === 0) {
    throw new Error(`Encountered an empty image path.`);
  }

  const absolutePath = path.resolve(repoRoot, "public", normalizedProjectPath.replace(/^public\//, ""));
  const publicRoot = path.resolve(repoRoot, "public");

  if (!absolutePath.startsWith(publicRoot + path.sep) && absolutePath !== publicRoot) {
    throw new Error(`Image path "${sourcePath}" resolves outside of ${publicRoot}.`);
  }

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Image path "${sourcePath}" does not exist at ${absolutePath}.`);
  }

  return {
    projectRelativePath: path.relative(repoRoot, absolutePath),
    absolutePath,
    fileUri: pathToFileURL(absolutePath).href,
  };
}

function buildDeterministicId(input: string) {
  const digest = createHash("sha1").update(input).digest("hex").slice(0, 10);
  const sanitized = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);

  return `galleryItem_${sanitized}_${digest}`;
}

function deriveAlt(
  projectTitle: string,
  imageRole: "cover" | "gallery",
  imageIndex: number,
  sourceAlt?: string,
) {
  if (sourceAlt && sourceAlt.trim().length > 0) {
    return {
      alt: sourceAlt.trim(),
      altSource: "source" as const,
    };
  }

  return {
    alt:
      imageRole === "cover"
        ? `${projectTitle} cover image`
        : `${projectTitle} gallery image ${imageIndex + 1}`,
    altSource: "derived" as const,
  };
}

export function deriveManifestRows(
  project: LegacyProject,
  options: DeriveManifestOptions,
): ManifestRow[] {
  const categoryResolution = resolveLegacyCategory({
    slug: project.slug,
    categories: project.categories,
  });

  const imageEntries: Array<{
    sourcePath: string;
    sourceAlt?: string;
    imageRole: "cover" | "gallery";
    imageIndex: number;
  }> = [
    {
      sourcePath: project.coverImage,
      sourceAlt: project.coverAlt,
      imageRole: "cover",
      imageIndex: 0,
    },
    ...project.gallery.map((entry, index) => ({
      sourcePath: entry.src,
      sourceAlt: entry.alt,
      imageRole: "gallery" as const,
      imageIndex: index,
    })),
  ];

  return imageEntries.map(({ sourcePath, sourceAlt, imageRole, imageIndex }) => {
    const resolvedImage = options.resolveImageSource(sourcePath);
    const { alt, altSource } = deriveAlt(
      project.title,
      imageRole,
      imageRole === "cover" ? 0 : imageIndex,
      sourceAlt,
    );
    const showOnHomePage = imageRole === "cover" && project.isFeatured;

    if (showOnHomePage && project.featuredOrder === undefined) {
      throw new Error(
        `Project "${project.slug}" is featured but has no valid featuredOrder for homepage curation.`,
      );
    }

    const _id = buildDeterministicId(
      `${project.slug}_${imageRole}_${imageIndex}_${resolvedImage.projectRelativePath}`,
    );

    const importDocument: Record<string, unknown> = {
      _id,
      _type: "galleryItem",
      title:
        imageRole === "cover"
          ? `${project.title} Cover`
          : `${project.title} Gallery ${imageIndex + 1}`,
      image: {
        _type: "image",
        _sanityAsset: `image@${resolvedImage.fileUri}`,
      },
      alt,
      category: {
        _type: "reference",
        _ref: categoryResolution.canonicalCategoryId,
      },
      isVisible: !project.isHidden,
      showOnHomePage,
      legacyProjectSlug: project.slug,
      legacyProjectTitle: project.title,
      legacySourceFile: project.sourceFile,
      legacyImageRole: imageRole,
    };

    if (showOnHomePage) {
      importDocument.homePageOrder = project.featuredOrder;
    }

    if (project.featuredOrder !== undefined) {
      importDocument.legacyFeaturedOrder = project.featuredOrder;
    }

    return {
      _id,
      legacyProjectSlug: project.slug,
      legacyProjectTitle: project.title,
      legacySourceFile: project.sourceFile,
      legacyImageRole: imageRole,
      legacyImageIndex: imageIndex,
      categoryId: categoryResolution.canonicalCategoryId,
      categoryResolutionKind: categoryResolution.resolutionKind,
      categoryResolutionReason: categoryResolution.reason,
      categoryNeedsApproval: categoryResolution.requiresApproval,
      sourceCategories: project.categories,
      sourceImage: sourcePath,
      resolvedImage: resolvedImage.projectRelativePath,
      title: String(importDocument.title),
      alt,
      altSource,
      isVisible: !project.isHidden,
      showOnHomePage,
      homePageOrder: showOnHomePage ? project.featuredOrder : undefined,
      importDocument,
    };
  });
}

function writeOutputArtifacts(manifest: ManifestDocument) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  const ndjson = manifest.rows
    .map((row) => JSON.stringify(row.importDocument))
    .join("\n");
  fs.writeFileSync(ndjsonPath, ndjson.length > 0 ? `${ndjson}\n` : "", "utf8");

  const approvalLines = [
    "# Work Import Approval",
    "",
    `Generated: ${manifest.generatedAt}`,
    "",
    "## Pending Approval Reasons",
    ...manifest.approval.reasons.map((reason) => `- ${reason}`),
    "",
    "## Checklist",
    ...manifest.approval.checklist.map((item, index) => `${index + 1}. ${item}`),
    "",
    "## Tentative Slot Mapping",
    ...CATEGORY_SLOTS.map(
      (slot) =>
        `- ${slot.id}: proposed title "${slot.proposedTitle}", proposed slug "${slot.proposedSlug}", legacy labels ${slot.legacyLabels.join(
          ", ",
        )}`,
    ),
    "",
    "## Ambiguous Records",
    ...manifest.rows
      .filter((row) => row.categoryNeedsApproval)
      .map(
        (row) =>
          `- ${row.legacyProjectSlug} (${row.legacyImageRole}) -> ${row.categoryId}: ${row.categoryResolutionReason}`,
      ),
  ];
  fs.writeFileSync(approvalPath, `${approvalLines.join("\n")}\n`, "utf8");
}

function buildManifest(projects: LegacyProject[], options: CliOptions): ManifestDocument {
  const rows = projects.flatMap((project) =>
    deriveManifestRows(project, {
      resolveImageSource,
    }),
  );

  const duplicateIds = rows
    .map((row) => row._id)
    .filter((id, index, allIds) => allIds.indexOf(id) !== index);

  if (duplicateIds.length > 0) {
    throw new Error(`Duplicate deterministic IDs detected: ${[...new Set(duplicateIds)].join(", ")}`);
  }

  const approvalStatus = getCategoryApprovalStatus();
  const approvalReasons = [...new Set([
    ...approvalStatus.reasons,
    ...rows
      .filter((row) => row.categoryNeedsApproval)
      .map(
        (row) =>
          `Confirm ${row.legacyProjectSlug} maps to ${row.categoryId}. ${row.categoryResolutionReason}`,
      ),
  ])];

  const categoryCounts = rows.reduce<Record<CanonicalCategoryId, number>>(
    (accumulator, row) => {
      accumulator[row.categoryId] += 1;
      return accumulator;
    },
    {
      "work-category-1": 0,
      "work-category-2": 0,
      "work-category-3": 0,
    },
  );

  return {
    generatedAt: new Date().toISOString(),
    dryRun: options.dryRun,
    strict: options.strict,
    summary: {
      projects: projects.length,
      manifestRows: rows.length,
      approvalRequired: approvalReasons.length > 0,
      categoryCounts,
    },
    categorySlots: CATEGORY_SLOTS,
    approval: {
      needsApproval: approvalReasons.length > 0,
      reasons: approvalReasons,
      checklist: [
        'Open `/studio` and inspect category documents `work-category-1`, `work-category-2`, and `work-category-3`.',
        'Confirm the live title and slug for each slot still match the proposed mapping in `sanity/migrations/work-category-map.ts`.',
        'Confirm that legacy `Lookbook` content belongs in slot 3 rather than another canonical slot.',
        'Confirm the explicit `editorial-noir` override to `work-category-1`, or provide the replacement slot/document ID.',
        `Review ${path.relative(repoRoot, manifestPath)} and confirm each of the 6 image rows is present with the expected category and homepage flag.`,
      ],
    },
    rows,
  };
}

function printManifestSummary(manifest: ManifestDocument) {
  console.log(
    JSON.stringify(
      {
        summary: manifest.summary,
        approval: manifest.approval,
        outputs: {
          manifest: path.relative(repoRoot, manifestPath),
          ndjson: path.relative(repoRoot, ndjsonPath),
          approval: path.relative(repoRoot, approvalPath),
        },
      },
      null,
      2,
    ),
  );
}

function runSelfTests() {
  assert.equal(
    resolveLegacyCategory({
      slug: "urban-decay",
      categories: ["Commercial"],
    }).canonicalCategoryId,
    "work-category-2",
    "approved mapping should resolve to a canonical category",
  );

  assert.throws(
    () =>
      resolveLegacyCategory({
        slug: "unknown-project",
        categories: ["Editorial", "Commercial"],
      }),
    /ambiguous|unmapped/i,
    "ambiguous category inputs must fail instead of falling back",
  );

  const rows = deriveManifestRows(
    {
      slug: "urban-decay",
      title: "Urban Decay",
      categories: ["Commercial"],
      coverImage: "/images/gallery-2.jpg",
      gallery: [{ src: "/images/gallery-1.jpg", alt: "Model 1 solo shot" }],
      isFeatured: true,
      featuredOrder: 2,
      isHidden: false,
      sourceFile: "content/projects/urban-decay.md",
    },
    {
      resolveImageSource: (sourcePath) => ({
        projectRelativePath: sourcePath.replace(/^\//, "public/"),
        absolutePath: path.join(repoRoot, sourcePath.replace(/^\//, "public/")),
        fileUri: `file:///tmp/${sourcePath.replace(/^\//, "")}`,
      }),
    },
  );

  assert.equal(rows.length, 2, "cover and gallery images should both emit rows");
  assert.notEqual(rows[0]?._id, rows[1]?._id, "manifest identifiers must be unique");
  assert.equal(rows[0]?.showOnHomePage, true, "featured covers should preserve homepage curation");
  assert.equal(rows[1]?.showOnHomePage, false, "gallery images should not inherit homepage curation");

  const approvalStatus = getCategoryApprovalStatus();
  assert.equal(
    typeof approvalStatus.needsApproval,
    "boolean",
    "approval status should expose whether editorial sign-off is still required",
  );
}

function main() {
  const options = parseCliArgs(process.argv.slice(2));

  if (options.selfTest) {
    runSelfTests();
    return;
  }

  if (!options.dryRun) {
    throw new Error(
      "Dry-run mode is the only supported execution path before the Task 2 approval checkpoint.",
    );
  }

  const projects = readLegacyProjects();
  const manifest = buildManifest(projects, options);
  writeOutputArtifacts(manifest);
  printManifestSummary(manifest);

  if (options.strict && manifest.approval.needsApproval) {
    throw new Error(
      `Blocking approval required. Review ${path.relative(repoRoot, approvalPath)} before running the real import.`,
    );
  }
}

main();
