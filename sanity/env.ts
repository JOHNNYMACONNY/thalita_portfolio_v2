function assertValue(value: string | undefined, errorMessage: string): string {
  if (!value) {
    throw new Error(errorMessage);
  }

  return value;
}

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-01";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
);

export const studioUrl = "/studio";

export const useCdn = true;
