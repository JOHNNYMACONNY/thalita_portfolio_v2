"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckmarkCircleIcon,
  ImagesIcon,
  WarningOutlineIcon,
} from "@sanity/icons";
import { Box, Button, Card, Flex, Grid, Inline, Spinner, Stack, Text } from "@sanity/ui";
import { useClient } from "sanity";

import { apiVersion } from "../env";

type CategoryOption = {
  _id: string;
  title: string;
  slug: string;
  displayOrder?: number;
  coverImageUrl?: string;
};

type UnassignedPhoto = {
  _id: string;
  title?: string;
  alt?: string;
  imageUrl?: string;
  updatedAt: string;
};

const CATEGORY_QUERY = `*[_type == "category"] | order(displayOrder asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  displayOrder,
  "coverImageUrl": coverImage.asset->url
}`;

const UNASSIGNED_PHOTOS_QUERY = `*[_type == "galleryItem" && !defined(category)] | order(_updatedAt desc) {
  _id,
  title,
  alt,
  "imageUrl": image.asset->url,
  "updatedAt": _updatedAt
}`;

function formatCategoryLabel(category: CategoryOption) {
  if (category.displayOrder) {
    return `Slot ${category.displayOrder}: ${category.title}`;
  }

  return category.title;
}

function formatPhotoLabel(photo: UnassignedPhoto) {
  return photo.title || photo.alt || "Untitled photo";
}

function formatPhotoDescription(photo: UnassignedPhoto) {
  return photo.alt || "No description yet";
}

export function PhotoOrganizerTool() {
  const client = useClient({ apiVersion });
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [photos, setPhotos] = useState<UnassignedPhoto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const [nextCategories, nextPhotos] = await Promise.all([
        client.fetch<CategoryOption[]>(CATEGORY_QUERY),
        client.fetch<UnassignedPhoto[]>(UNASSIGNED_PHOTOS_QUERY),
      ]);

      setCategories(Array.isArray(nextCategories) ? nextCategories : []);
      setPhotos(Array.isArray(nextPhotos) ? nextPhotos : []);
      setSelectedPhotoIds((currentIds) =>
        currentIds.filter((photoId) => nextPhotos.some((photo) => photo._id === photoId)),
      );
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load photos right now.");
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category._id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  );

  const hasPhotos = photos.length > 0;
  const allSelected = hasPhotos && selectedPhotoIds.length === photos.length;

  function togglePhotoSelection(photoId: string) {
    setSelectedPhotoIds((currentIds) =>
      currentIds.includes(photoId)
        ? currentIds.filter((currentId) => currentId !== photoId)
        : [...currentIds, photoId],
    );
  }

  function selectAllPhotos() {
    setSelectedPhotoIds(photos.map((photo) => photo._id));
  }

  function clearSelection() {
    setSelectedPhotoIds([]);
  }

  async function assignSelectedPhotos() {
    if (!selectedCategory || selectedPhotoIds.length === 0) {
      return;
    }

    setIsAssigning(true);
    setFeedback(null);

    try {
      const transaction = client.transaction();

      selectedPhotoIds.forEach((photoId) => {
        transaction.patch(photoId, {
          set: {
            category: {
              _type: "reference",
              _ref: selectedCategory._id,
            },
          },
        });
      });

      await transaction.commit();

      const movedCount = selectedPhotoIds.length;
      setFeedback(
        `${movedCount} photo${movedCount === 1 ? "" : "s"} moved to ${formatCategoryLabel(
          selectedCategory,
        )}.`,
      );
      setSelectedPhotoIds([]);
      await loadData();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Could not move the selected photos.");
    } finally {
      setIsAssigning(false);
    }
  }

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Card border padding={4} radius={3}>
          <Stack space={3}>
            <Inline space={3}>
              <ImagesIcon />
              <Text size={4} weight="semibold">
                Organize Photos
              </Text>
            </Inline>
            <Text muted size={2}>
              Select several unassigned photos, pick a category slot, and move them all at once.
            </Text>
            <Text muted size={1}>
              This is the fastest way to sort a fresh upload batch without opening each photo one by one.
            </Text>
          </Stack>
        </Card>

        <Card border padding={4} radius={3}>
          <Stack space={4}>
            <Text size={2} weight="semibold">
              Choose a category slot
            </Text>

            {isLoading ? (
              <Flex align="center" gap={3}>
                <Spinner muted />
                <Text muted size={2}>
                  Loading category slots...
                </Text>
              </Flex>
            ) : (
              <Grid columns={[1, 1, 3]} gap={3}>
                {categories.map((category) => (
                  <Card
                    key={category._id}
                    as="button"
                    border
                    onClick={() => setSelectedCategoryId(category._id)}
                    padding={3}
                    radius={3}
                    tone={selectedCategoryId === category._id ? "primary" : "transparent"}
                  >
                    <Stack space={3}>
                      {category.coverImageUrl ? (
                        <>
                          {/* A visual category card helps non-technical editors choose the right slot quickly. */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            alt={category.title}
                            src={category.coverImageUrl}
                            style={{
                              aspectRatio: "4 / 3",
                              borderRadius: "8px",
                              display: "block",
                              objectFit: "cover",
                              width: "100%",
                            }}
                          />
                        </>
                      ) : null}
                      <Stack space={2}>
                        <Text size={2} weight="semibold">
                          {formatCategoryLabel(category)}
                        </Text>
                        <Text muted size={1}>
                          /work/{category.slug}
                        </Text>
                      </Stack>
                    </Stack>
                  </Card>
                ))}
              </Grid>
            )}
          </Stack>
        </Card>

        <Card border padding={4} radius={3}>
          <Stack space={4}>
            <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
              <Stack space={1}>
                <Text size={2} weight="semibold">
                  Unassigned photos
                </Text>
                <Text muted size={1}>
                  {photos.length} photo{photos.length === 1 ? "" : "s"} waiting to be organized
                </Text>
              </Stack>

              <Inline space={2}>
                <Button
                  disabled={!hasPhotos || allSelected}
                  mode="ghost"
                  onClick={selectAllPhotos}
                  text="Select all"
                />
                <Button
                  disabled={selectedPhotoIds.length === 0}
                  mode="ghost"
                  onClick={clearSelection}
                  text="Clear selection"
                />
              </Inline>
            </Flex>

            <Button
              disabled={!selectedCategory || selectedPhotoIds.length === 0 || isAssigning}
              onClick={assignSelectedPhotos}
              text={
                isAssigning
                  ? "Moving photos..."
                  : `Move ${selectedPhotoIds.length || ""} selected photo${
                      selectedPhotoIds.length === 1 ? "" : "s"
                    }`
              }
              tone="positive"
            />

            {feedback ? (
              <Card
                padding={3}
                radius={2}
                tone={feedback.includes("moved to") ? "positive" : "critical"}
              >
                <Inline space={2}>
                  {feedback.includes("moved to") ? <CheckmarkCircleIcon /> : <WarningOutlineIcon />}
                  <Text size={1}>{feedback}</Text>
                </Inline>
              </Card>
            ) : null}

            {loadError ? (
              <Card padding={3} radius={2} tone="critical">
                <Text size={1}>{loadError}</Text>
              </Card>
            ) : null}

            {!isLoading && !loadError && photos.length === 0 ? (
              <Card padding={4} radius={3} tone="transparent">
                <Stack space={2}>
                  <Text size={2} weight="semibold">
                    No unassigned photos right now
                  </Text>
                  <Text muted size={1}>
                    Fresh uploads will appear here until you place them into a category slot.
                  </Text>
                </Stack>
              </Card>
            ) : null}

            {photos.length > 0 ? (
              <Grid columns={[1, 2, 3]} gap={3}>
                {photos.map((photo) => {
                  const isSelected = selectedPhotoIds.includes(photo._id);

                  return (
                    <Card
                      key={photo._id}
                      border
                      onClick={() => togglePhotoSelection(photo._id)}
                      padding={3}
                      radius={3}
                      shadow={isSelected ? 1 : 0}
                      tone={isSelected ? "primary" : "transparent"}
                    >
                      <Stack space={3}>
                        {photo.imageUrl ? (
                          <>
                            {/* A visual grid keeps organization photo-first instead of form-first. */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              alt={formatPhotoLabel(photo)}
                              src={photo.imageUrl}
                              style={{
                                aspectRatio: "1 / 1",
                                borderRadius: "8px",
                                display: "block",
                                objectFit: "cover",
                                width: "100%",
                              }}
                            />
                          </>
                        ) : null}

                        <Flex align="flex-start" gap={3}>
                          <input
                            checked={isSelected}
                            onChange={() => togglePhotoSelection(photo._id)}
                            onClick={(event) => event.stopPropagation()}
                            type="checkbox"
                          />
                          <Stack space={1}>
                            <Text size={2} weight="semibold">
                              {formatPhotoLabel(photo)}
                            </Text>
                            <Text muted size={1}>
                              {formatPhotoDescription(photo)}
                            </Text>
                          </Stack>
                        </Flex>
                      </Stack>
                    </Card>
                  );
                })}
              </Grid>
            ) : null}
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
