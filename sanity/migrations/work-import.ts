import assert from "node:assert/strict";

import {
  getCategoryApprovalStatus,
  resolveLegacyCategory,
  type CanonicalCategoryId,
} from "./work-category-map";

type LegacyProject = {
  slug: string;
  title: string;
  categories: string[];
  coverImage: string;
  gallery: Array<{ src: string; alt?: string }>;
};

type ManifestRow = {
  id: string;
  categoryId: CanonicalCategoryId;
};

export function deriveManifestRows(_project: LegacyProject): ManifestRow[] {
  throw new Error("Not implemented");
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

  const rows = deriveManifestRows({
    slug: "urban-decay",
    title: "Urban Decay",
    categories: ["Commercial"],
    coverImage: "/images/gallery-2.jpg",
    gallery: [{ src: "/images/gallery-1.jpg", alt: "Model 1 solo shot" }],
  });

  assert.equal(rows.length, 2, "cover and gallery images should both emit rows");
  assert.notEqual(rows[0]?.id, rows[1]?.id, "manifest identifiers must be unique");

  const approvalStatus = getCategoryApprovalStatus();
  assert.equal(
    typeof approvalStatus.needsApproval,
    "boolean",
    "approval status should expose whether editorial sign-off is still required",
  );
}

if (process.argv.includes("--self-test")) {
  runSelfTests();
  process.exit(0);
}

throw new Error("Not implemented");
