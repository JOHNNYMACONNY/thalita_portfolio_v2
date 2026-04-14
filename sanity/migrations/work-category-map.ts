export type CanonicalCategoryId =
  | "work-category-1"
  | "work-category-2"
  | "work-category-3";

export type CategorySlotDefinition = {
  id: CanonicalCategoryId;
  proposedTitle: string;
  proposedSlug: string;
  legacyLabels: string[];
  approvalReason: string;
};

export type LegacyCategoryResolutionInput = {
  slug: string;
  categories: string[];
};

export type CategoryResolution = {
  canonicalCategoryId: CanonicalCategoryId;
  resolutionKind: "legacy-label" | "slug-override";
  matchedLegacyLabels: string[];
  requiresApproval: boolean;
  reason: string;
};

export type CategoryApprovalStatus = {
  needsApproval: boolean;
  reasons: string[];
};

type SlugOverride = {
  canonicalCategoryId: CanonicalCategoryId;
  requiresApproval: boolean;
  reason: string;
};

export const CATEGORY_SLOTS: CategorySlotDefinition[] = [
  {
    id: "work-category-1",
    proposedTitle: "Editorial",
    proposedSlug: "editorial",
    legacyLabels: ["Editorial"],
    approvalReason:
      "Phase 1 left slot 1 title/slug editor-authored, so the live Studio document still needs confirmation.",
  },
  {
    id: "work-category-2",
    proposedTitle: "Commercial",
    proposedSlug: "commercial",
    legacyLabels: ["Commercial"],
    approvalReason:
      "Phase 1 left slot 2 title/slug editor-authored, so the live Studio document still needs confirmation.",
  },
  {
    id: "work-category-3",
    proposedTitle: "Personal Styling",
    proposedSlug: "personal-styling",
    legacyLabels: ["Lookbook", "Personal Styling"],
    approvalReason:
      "The legacy taxonomy includes `Lookbook`, but the fixed three-slot model does not; the collapse into slot 3 needs editorial confirmation.",
  },
];

const legacyCategoryToSlot = new Map<string, CanonicalCategoryId>();

for (const slot of CATEGORY_SLOTS) {
  for (const label of slot.legacyLabels) {
    legacyCategoryToSlot.set(normalizeLabel(label), slot.id);
  }
}

const slugOverrides = new Map<string, SlugOverride>([
  [
    "editorial-noir",
    {
      canonicalCategoryId: "work-category-1",
      requiresApproval: true,
      reason:
        "Legacy categories `Editorial` + `Lookbook` span two canonical slots. This slug is tentatively assigned to slot 1 because the project is editorial-first, but that assignment must be approved before import.",
    },
  ],
]);

function normalizeLabel(value: string) {
  return value.trim().toLowerCase();
}

export function resolveLegacyCategory(
  input: LegacyCategoryResolutionInput,
): CategoryResolution {
  const normalizedSlug = input.slug.trim().toLowerCase();
  const normalizedLabels = [...new Set(input.categories.map(normalizeLabel).filter(Boolean))];

  if (normalizedLabels.length === 0) {
    throw new Error(`Project "${input.slug}" has no legacy categories to map.`);
  }

  const override = slugOverrides.get(normalizedSlug);
  if (override) {
    const unmatched = normalizedLabels.filter((label) => !legacyCategoryToSlot.has(label));
    if (unmatched.length > 0) {
      throw new Error(
        `Project "${input.slug}" includes unmapped legacy categories: ${unmatched.join(", ")}`,
      );
    }

    return {
      canonicalCategoryId: override.canonicalCategoryId,
      resolutionKind: "slug-override",
      matchedLegacyLabels: normalizedLabels,
      requiresApproval: override.requiresApproval,
      reason: override.reason,
    };
  }

  if (normalizedLabels.length > 1) {
    throw new Error(
      `Project "${input.slug}" is ambiguous across multiple legacy categories (${normalizedLabels.join(
        ", ",
      )}). Add an explicit slug override before importing.`,
    );
  }

  const [singleLabel] = normalizedLabels;
  const canonicalCategoryId = singleLabel
    ? legacyCategoryToSlot.get(singleLabel)
    : undefined;

  if (!canonicalCategoryId) {
    throw new Error(
      `Project "${input.slug}" uses unmapped legacy category "${input.categories[0]}".`,
    );
  }

  return {
    canonicalCategoryId,
    resolutionKind: "legacy-label",
    matchedLegacyLabels: normalizedLabels,
    requiresApproval: false,
    reason: `Mapped legacy category "${input.categories[0]}" to ${canonicalCategoryId}.`,
  };
}

export function getCategoryApprovalStatus(): CategoryApprovalStatus {
  const reasons = [
    ...CATEGORY_SLOTS.map(
      (slot) =>
        `Confirm ${slot.id} in Studio still represents "${slot.proposedTitle}" with slug "${slot.proposedSlug}". ${slot.approvalReason}`,
    ),
    `Confirm the explicit slug override for "editorial-noir" to "work-category-1" before import.`,
  ];

  return {
    needsApproval: reasons.length > 0,
    reasons,
  };
}
