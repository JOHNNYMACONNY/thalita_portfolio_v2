export type CanonicalCategoryId =
  | "work-category-1"
  | "work-category-2"
  | "work-category-3";

export type CategoryResolution = {
  canonicalCategoryId: CanonicalCategoryId;
};

export type CategoryApprovalStatus = {
  needsApproval: boolean;
  reasons: string[];
};

export function resolveLegacyCategory(): CategoryResolution {
  throw new Error("Not implemented");
}

export function getCategoryApprovalStatus(): CategoryApprovalStatus {
  throw new Error("Not implemented");
}
