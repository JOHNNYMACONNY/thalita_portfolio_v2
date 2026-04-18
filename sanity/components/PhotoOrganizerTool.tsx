"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckmarkCircleIcon,
  EyeClosedIcon,
  EyeOpenIcon,
  FilterIcon,
  HomeIcon,
  ImagesIcon,
  RemoveCircleIcon,
  SearchIcon,
  SortIcon,
  WarningOutlineIcon,
} from "@sanity/icons";
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Inline,
  Spinner,
  Stack,
  Text,
  TextInput,
} from "@sanity/ui";
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
  isVisible: boolean;
  showOnHomePage: boolean;
  homePageOrder?: number;
  categoryOrder?: number;
  category?: {
    _id: string;
    title: string;
    slug: string;
    displayOrder?: number;
  };
  updatedAt: string;
};

const CATEGORY_QUERY = `*[_type == "category"] | order(displayOrder asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  displayOrder,
  "coverImageUrl": coverImage.asset->url
}`;

const ORGANIZER_PHOTOS_QUERY = `*[_type == "galleryItem"] | order(_updatedAt desc) {
  _id,
  title,
  alt,
  isVisible,
  showOnHomePage,
  homePageOrder,
  categoryOrder,
  "category": category->{
    _id,
    title,
    "slug": slug.current,
    displayOrder
  },
  "imageUrl": image.asset->url,
  "updatedAt": _updatedAt
}`;

type FilterMode = "all" | "needs-organization" | "featured" | "hidden";

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

function sortByUpdatedAtDesc(left: UnassignedPhoto, right: UnassignedPhoto) {
  return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
}

function sortCategoryPhotos(left: UnassignedPhoto, right: UnassignedPhoto) {
  const leftOrder = left.categoryOrder ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.categoryOrder ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return sortByUpdatedAtDesc(left, right);
}

function sortHomePhotos(left: UnassignedPhoto, right: UnassignedPhoto) {
  const leftOrder = left.homePageOrder ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.homePageOrder ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return sortCategoryPhotos(left, right);
}

function formatUpdatedAt(updatedAt: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(updatedAt));
}

function getPlacementSummary(photo: UnassignedPhoto) {
  if (!photo.category) {
    return "Not on the public site until you choose a category and publish.";
  }

  if (!photo.isVisible) {
    return `Hidden from the site. Category slot is saved as ${formatCategoryLabel(photo.category)}.`;
  }

  if (photo.showOnHomePage && photo.homePageOrder) {
    return `Visible in ${formatCategoryLabel(photo.category)} and featured on the home page at position ${photo.homePageOrder}.`;
  }

  return `Visible on /work/${photo.category.slug} in ${formatCategoryLabel(photo.category)}.`;
}

export function PhotoOrganizerTool() {
  const client = useClient({ apiVersion });
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [photos, setPhotos] = useState<UnassignedPhoto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
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
        client.fetch<UnassignedPhoto[]>(ORGANIZER_PHOTOS_QUERY),
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

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      if (filterMode === "needs-organization" && photo.category) {
        return false;
      }

      if (filterMode === "featured" && !photo.showOnHomePage) {
        return false;
      }

      if (filterMode === "hidden" && photo.isVisible) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchHaystack = [
        photo.title,
        photo.alt,
        photo.category?.title,
        photo.category?.slug,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchHaystack.includes(normalizedSearch);
    });
  }, [filterMode, normalizedSearch, photos]);

  const filteredPhotoIds = useMemo(() => filteredPhotos.map((photo) => photo._id), [filteredPhotos]);
  const hasPhotos = filteredPhotos.length > 0;
  const allSelected =
    filteredPhotoIds.length > 0 &&
    filteredPhotoIds.every((photoId) => selectedPhotoIds.includes(photoId));

  const unassignedPhotos = useMemo(
    () => filteredPhotos.filter((photo) => !photo.category).sort(sortByUpdatedAtDesc),
    [filteredPhotos],
  );

  const homePhotos = useMemo(
    () => filteredPhotos.filter((photo) => photo.showOnHomePage).sort(sortHomePhotos),
    [filteredPhotos],
  );

  const photosByCategory = useMemo(() => {
    return categories.map((category) => ({
      category,
      photos: filteredPhotos
        .filter((photo) => photo.category?._id === category._id)
        .sort(sortCategoryPhotos),
    }));
  }, [categories, filteredPhotos]);

  const selectedPhotos = useMemo(
    () => photos.filter((photo) => selectedPhotoIds.includes(photo._id)),
    [photos, selectedPhotoIds],
  );

  const selectedAssignedVisiblePhotos = useMemo(
    () => selectedPhotos.filter((photo) => Boolean(photo.category) && photo.isVisible),
    [selectedPhotos],
  );

  function togglePhotoSelection(photoId: string) {
    setSelectedPhotoIds((currentIds) =>
      currentIds.includes(photoId)
        ? currentIds.filter((currentId) => currentId !== photoId)
        : [...currentIds, photoId],
    );
  }

  function selectAllPhotos() {
    setSelectedPhotoIds((currentIds) => {
      const nextIds = new Set(currentIds);
      filteredPhotoIds.forEach((photoId) => nextIds.add(photoId));
      return Array.from(nextIds);
    });
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
      const photosInTargetCategory = photos
        .filter((photo) => photo.category?._id === selectedCategory._id)
        .sort(sortCategoryPhotos);
      let nextCategoryOrder =
        photosInTargetCategory.reduce(
          (maxOrder, photo) => Math.max(maxOrder, photo.categoryOrder ?? 0),
          0,
        ) + 1;

      const transaction = client.transaction();

      selectedPhotoIds.forEach((photoId) => {
        transaction.patch(photoId, {
          set: {
            category: {
              _type: "reference",
              _ref: selectedCategory._id,
            },
            categoryOrder: nextCategoryOrder,
          },
        });
        nextCategoryOrder += 1;
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

  async function applyBulkPatch(options: {
    confirmMessage?: string;
    successMessage: string;
    buildPatch: (photo: UnassignedPhoto, index: number) => {
      set?: Record<string, unknown>;
      unset?: string[];
    };
  }) {
    if (selectedPhotos.length === 0) {
      return;
    }

    if (options.confirmMessage && !window.confirm(options.confirmMessage)) {
      return;
    }

    setIsAssigning(true);
    setFeedback(null);

    try {
      const transaction = client.transaction();

      selectedPhotos.forEach((photo, index) => {
        transaction.patch(photo._id, options.buildPatch(photo, index));
      });

      await transaction.commit();
      setFeedback(options.successMessage);
      setSelectedPhotoIds([]);
      await loadData();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "The bulk update could not be completed.");
    } finally {
      setIsAssigning(false);
    }
  }

  async function featureSelectedPhotos() {
    if (selectedAssignedVisiblePhotos.length === 0) {
      return;
    }

    const existingMaxOrder = photos.reduce(
      (maxOrder, photo) => Math.max(maxOrder, photo.homePageOrder ?? 0),
      0,
    );

    await applyBulkPatch({
      successMessage: `Added ${selectedAssignedVisiblePhotos.length} photo${
        selectedAssignedVisiblePhotos.length === 1 ? "" : "s"
      } to the home page rail.`,
      buildPatch: (photo, index) => ({
        set: photo.category && photo.isVisible
          ? {
              showOnHomePage: true,
              homePageOrder: photo.homePageOrder ?? existingMaxOrder + index + 1,
            }
          : {},
      }),
    });
  }

  async function removeSelectedFromHomePage() {
    await applyBulkPatch({
      successMessage: `Removed ${selectedPhotos.length} photo${
        selectedPhotos.length === 1 ? "" : "s"
      } from the home page rail.`,
      buildPatch: () => ({
        set: {
          showOnHomePage: false,
        },
        unset: ["homePageOrder"],
      }),
    });
  }

  async function moveSelectedToUnassigned() {
    await applyBulkPatch({
      confirmMessage:
        "Remove the selected photos from their category slots? They will stay in Studio but disappear from the public site until you place them again.",
      successMessage: `Moved ${selectedPhotos.length} photo${
        selectedPhotos.length === 1 ? "" : "s"
      } back to Unassigned.`,
      buildPatch: () => ({
        set: {
          showOnHomePage: false,
        },
        unset: ["category", "categoryOrder", "homePageOrder"],
      }),
    });
  }

  async function updateVisibility(nextVisible: boolean) {
    const hiddenMessage = nextVisible
      ? `Marked ${selectedPhotos.length} photo${selectedPhotos.length === 1 ? "" : "s"} visible on the site.`
      : `Hidden ${selectedPhotos.length} photo${selectedPhotos.length === 1 ? "" : "s"} from the site.`;

    await applyBulkPatch({
      confirmMessage: nextVisible
        ? undefined
        : "Hide the selected photos from the public site? Featured-home placement will also be turned off.",
      successMessage: hiddenMessage,
      buildPatch: () => ({
        set: {
          isVisible: nextVisible,
          ...(nextVisible ? {} : { showOnHomePage: false }),
        },
        unset: nextVisible ? [] : ["homePageOrder"],
      }),
    });
  }

  async function reorderCategoryPhoto(photoId: string, direction: "earlier" | "later") {
    const currentPhoto = photos.find((photo) => photo._id === photoId);
    if (!currentPhoto?.category) {
      return;
    }

    const orderedPhotos = photos
      .filter((photo) => photo.category?._id === currentPhoto.category?._id)
      .sort(sortCategoryPhotos);
    const currentIndex = orderedPhotos.findIndex((photo) => photo._id === photoId);
    const targetIndex = direction === "earlier" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= orderedPhotos.length) {
      return;
    }

    const reordered = [...orderedPhotos];
    const [movedPhoto] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, movedPhoto);

    setIsAssigning(true);
    setFeedback(null);

    try {
      const transaction = client.transaction();
      reordered.forEach((photo, index) => {
        transaction.patch(photo._id, {
          set: {
            categoryOrder: index + 1,
          },
        });
      });

      await transaction.commit();
      setFeedback(`Updated the order for ${formatCategoryLabel(currentPhoto.category)}.`);
      await loadData();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Could not update the category order.");
    } finally {
      setIsAssigning(false);
    }
  }

  async function reorderHomePhoto(photoId: string, direction: "earlier" | "later") {
    const orderedPhotos = photos.filter((photo) => photo.showOnHomePage).sort(sortHomePhotos);
    const currentIndex = orderedPhotos.findIndex((photo) => photo._id === photoId);
    const targetIndex = direction === "earlier" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= orderedPhotos.length) {
      return;
    }

    const reordered = [...orderedPhotos];
    const [movedPhoto] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, movedPhoto);

    setIsAssigning(true);
    setFeedback(null);

    try {
      const transaction = client.transaction();
      reordered.forEach((photo, index) => {
        transaction.patch(photo._id, {
          set: {
            showOnHomePage: true,
            homePageOrder: index + 1,
          },
        });
      });

      await transaction.commit();
      setFeedback("Updated the home page order.");
      await loadData();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Could not update the home page order.");
    } finally {
      setIsAssigning(false);
    }
  }

  const filterCards: Array<{
    label: string;
    value: FilterMode;
    count: number;
    icon: React.ComponentType;
    description: string;
  }> = [
    {
      label: "All photos",
      value: "all",
      count: photos.length,
      icon: ImagesIcon,
      description: "Everything in the Work library",
    },
    {
      label: "Needs organization",
      value: "needs-organization",
      count: photos.filter((photo) => !photo.category).length,
      icon: FilterIcon,
      description: "Fresh uploads without a category slot yet",
    },
    {
      label: "Home page",
      value: "featured",
      count: photos.filter((photo) => photo.showOnHomePage).length,
      icon: HomeIcon,
      description: "Photos currently featured on the homepage",
    },
    {
      label: "Hidden",
      value: "hidden",
      count: photos.filter((photo) => !photo.isVisible).length,
      icon: EyeClosedIcon,
      description: "Saved in Studio but hidden from the public site",
    },
  ];

  function renderPhotoCard(photo: UnassignedPhoto, options?: { showCategoryOrderControls?: boolean; showHomeOrderControls?: boolean }) {
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
              {/* The organizer stays photo-first so editors can make placement decisions visually. */}
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
            <Stack space={2} flex={1}>
              <Stack space={1}>
                <Text size={2} weight="semibold">
                  {formatPhotoLabel(photo)}
                </Text>
                <Text muted size={1}>
                  {formatPhotoDescription(photo)}
                </Text>
              </Stack>

              <Inline space={2}>
                <Card padding={2} radius={2} tone={photo.category ? "primary" : "caution"}>
                  <Text size={1}>{photo.category ? formatCategoryLabel(photo.category) : "Unassigned"}</Text>
                </Card>
                <Card padding={2} radius={2} tone={photo.isVisible ? "positive" : "critical"}>
                  <Text size={1}>{photo.isVisible ? "Visible on site" : "Hidden from site"}</Text>
                </Card>
                {photo.showOnHomePage ? (
                  <Card padding={2} radius={2} tone="positive">
                    <Text size={1}>Home page #{photo.homePageOrder ?? "?"}</Text>
                  </Card>
                ) : null}
              </Inline>

              <Text muted size={1}>
                {getPlacementSummary(photo)}
              </Text>
              <Text muted size={1}>
                Updated {formatUpdatedAt(photo.updatedAt)}
              </Text>

              {options?.showCategoryOrderControls && photo.category ? (
                <Inline space={2}>
                  <Button
                    disabled={isAssigning}
                    icon={ArrowLeftIcon}
                    mode="ghost"
                    onClick={(event) => {
                      event.stopPropagation();
                      void reorderCategoryPhoto(photo._id, "earlier");
                    }}
                    text="Earlier in category"
                  />
                  <Button
                    disabled={isAssigning}
                    icon={ArrowRightIcon}
                    mode="ghost"
                    onClick={(event) => {
                      event.stopPropagation();
                      void reorderCategoryPhoto(photo._id, "later");
                    }}
                    text="Later in category"
                  />
                </Inline>
              ) : null}

              {options?.showHomeOrderControls && photo.showOnHomePage ? (
                <Inline space={2}>
                  <Button
                    disabled={isAssigning}
                    icon={ArrowLeftIcon}
                    mode="ghost"
                    onClick={(event) => {
                      event.stopPropagation();
                      void reorderHomePhoto(photo._id, "earlier");
                    }}
                    text="Earlier on home"
                  />
                  <Button
                    disabled={isAssigning}
                    icon={ArrowRightIcon}
                    mode="ghost"
                    onClick={(event) => {
                      event.stopPropagation();
                      void reorderHomePhoto(photo._id, "later");
                    }}
                    text="Later on home"
                  />
                </Inline>
              ) : null}
            </Stack>
          </Flex>
        </Stack>
      </Card>
    );
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
              Sort uploads visually, move many photos at once, and review exactly where each image will appear before you publish.
            </Text>
            <Text muted size={1}>
              Think of the three category slots like albums: select photos, choose the destination, and keep home-page placement separate from category organization.
            </Text>
          </Stack>
        </Card>

        <Card border padding={4} radius={3}>
          <Stack space={4}>
            <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
              <Stack space={1}>
                <Text size={2} weight="semibold">
                  Filters and selection
                </Text>
                <Text muted size={1}>
                  Search the whole library, focus on a subset, then apply bulk actions without opening each image.
                </Text>
              </Stack>
              <Inline space={2}>
                <Button
                  disabled={!hasPhotos || allSelected}
                  mode="ghost"
                  onClick={selectAllPhotos}
                  text="Select visible results"
                />
                <Button
                  disabled={selectedPhotoIds.length === 0}
                  mode="ghost"
                  onClick={clearSelection}
                  text="Clear selection"
                />
              </Inline>
            </Flex>

            <TextInput
              fontSize={2}
              icon={SearchIcon}
              onChange={(event) => setSearchTerm(event.currentTarget.value)}
              placeholder="Search by photo label, description, or category"
              value={searchTerm}
            />

            <Grid columns={[1, 2, 4]} gap={3}>
              {filterCards.map((filterCard) => {
                const Icon = filterCard.icon;

                return (
                  <Card
                    key={filterCard.value}
                    as="button"
                    border
                    onClick={() => setFilterMode(filterCard.value)}
                    padding={3}
                    radius={3}
                    tone={filterMode === filterCard.value ? "primary" : "transparent"}
                  >
                    <Stack space={2}>
                      <Inline space={2}>
                        <Icon />
                        <Text size={2} weight="semibold">
                          {filterCard.label}
                        </Text>
                      </Inline>
                      <Text size={3} weight="semibold">
                        {filterCard.count}
                      </Text>
                      <Text muted size={1}>
                        {filterCard.description}
                      </Text>
                    </Stack>
                  </Card>
                );
              })}
            </Grid>

            <Card border padding={3} radius={3} tone="transparent">
              <Stack space={3}>
                <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
                  <Stack space={1}>
                    <Text size={2} weight="semibold">
                      Bulk actions
                    </Text>
                    <Text muted size={1}>
                      {selectedPhotoIds.length} photo{selectedPhotoIds.length === 1 ? "" : "s"} selected
                    </Text>
                  </Stack>
                  {selectedCategory ? (
                    <Text muted size={1}>
                      Destination: {formatCategoryLabel(selectedCategory)}
                    </Text>
                  ) : null}
                </Flex>

                <Text size={1} weight="semibold">
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
                              {/* Visual category cards keep the organizer closer to an album workflow than a CMS form. */}
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

                <Flex wrap="wrap" gap={2}>
                  <Button
                    disabled={!selectedCategory || selectedPhotoIds.length === 0 || isAssigning}
                    icon={ImagesIcon}
                    onClick={() => void assignSelectedPhotos()}
                    text={isAssigning ? "Moving photos..." : "Move to selected category"}
                    tone="positive"
                  />
                  <Button
                    disabled={selectedPhotoIds.length === 0 || isAssigning}
                    icon={RemoveCircleIcon}
                    mode="ghost"
                    onClick={() => void moveSelectedToUnassigned()}
                    text="Move back to Unassigned"
                  />
                  <Button
                    disabled={selectedAssignedVisiblePhotos.length === 0 || isAssigning}
                    icon={HomeIcon}
                    mode="ghost"
                    onClick={() => void featureSelectedPhotos()}
                    text="Add to home page"
                  />
                  <Button
                    disabled={selectedPhotoIds.length === 0 || isAssigning}
                    icon={HomeIcon}
                    mode="ghost"
                    onClick={() => void removeSelectedFromHomePage()}
                    text="Remove from home page"
                  />
                  <Button
                    disabled={selectedPhotoIds.length === 0 || isAssigning}
                    icon={EyeOpenIcon}
                    mode="ghost"
                    onClick={() => void updateVisibility(true)}
                    text="Show on site"
                  />
                  <Button
                    disabled={selectedPhotoIds.length === 0 || isAssigning}
                    icon={EyeClosedIcon}
                    mode="ghost"
                    onClick={() => void updateVisibility(false)}
                    text="Hide from site"
                  />
                </Flex>
              </Stack>
            </Card>

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
                    No photos in the library yet
                  </Text>
                  <Text muted size={1}>
                    Start in Upload Photos, then return here to sort everything visually.
                  </Text>
                </Stack>
              </Card>
            ) : null}

            {photos.length > 0 ? (
              <Stack space={4}>
                <Card border padding={3} radius={3}>
                  <Stack space={3}>
                    <Inline space={2}>
                      <HomeIcon />
                      <Text size={2} weight="semibold">
                        Home page rail
                      </Text>
                    </Inline>
                    <Text muted size={1}>
                      Reorder this strip visually to control the homepage sequence without touching order numbers.
                    </Text>
                    {homePhotos.length > 0 ? (
                      <Grid columns={[1, 2, 3]} gap={3}>
                        {homePhotos.map((photo) =>
                          renderPhotoCard(photo, {
                            showHomeOrderControls: true,
                          }),
                        )}
                      </Grid>
                    ) : (
                      <Text muted size={1}>
                        No photos are featured on the homepage inside the current filter.
                      </Text>
                    )}
                  </Stack>
                </Card>

                <Grid columns={[1, 1, 2, 4]} gap={3}>
                  <Card border padding={3} radius={3}>
                    <Stack space={3}>
                      <Inline space={2}>
                        <FilterIcon />
                        <Text size={2} weight="semibold">
                          Unassigned tray
                        </Text>
                      </Inline>
                      <Text muted size={1}>
                        {unassignedPhotos.length} photo{unassignedPhotos.length === 1 ? "" : "s"} still need a category slot
                      </Text>
                      {unassignedPhotos.length > 0 ? (
                        <Stack space={3}>{unassignedPhotos.map((photo) => renderPhotoCard(photo))}</Stack>
                      ) : (
                        <Text muted size={1}>
                          Nothing is waiting for organization in the current filter.
                        </Text>
                      )}
                    </Stack>
                  </Card>

                  {photosByCategory.map(({ category, photos: categoryPhotos }) => (
                    <Card key={category._id} border padding={3} radius={3}>
                      <Stack space={3}>
                        <Inline space={2}>
                          <SortIcon />
                          <Text size={2} weight="semibold">
                            {formatCategoryLabel(category)}
                          </Text>
                        </Inline>
                        <Text muted size={1}>
                          {categoryPhotos.length} photo{categoryPhotos.length === 1 ? "" : "s"} in /work/{category.slug}
                        </Text>
                        {categoryPhotos.length > 0 ? (
                          <Stack space={3}>
                            {categoryPhotos.map((photo) =>
                              renderPhotoCard(photo, {
                                showCategoryOrderControls: true,
                              }),
                            )}
                          </Stack>
                        ) : (
                          <Text muted size={1}>
                            No photos in this slot for the current filter.
                          </Text>
                        )}
                      </Stack>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            ) : null}
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
