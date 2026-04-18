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
  PublishIcon,
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

type RawPhotoRecord = {
  _id: string;
  title?: string;
  alt?: string;
  imageUrl?: string;
  isVisible?: boolean;
  showOnHomePage?: boolean;
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

type PublishState = "draft-only" | "draft-changes" | "published";
type ReadinessState = "ready" | "blocked" | "live";
type FilterMode =
  | "all"
  | "needs-organization"
  | "featured"
  | "hidden"
  | "draft-changes"
  | "ready-to-publish";

type PublishReadiness = {
  canPublish: boolean;
  state: ReadinessState;
  label: string;
  message: string;
  tone: "positive" | "critical" | "transparent";
};

type StudioPhoto = {
  id: string;
  draftId?: string;
  publishedId?: string;
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
  publishState: PublishState;
  publishStateLabel: string;
  publishStateTone: "caution" | "positive" | "primary";
  publishReadiness: PublishReadiness;
};

type FeedbackState = {
  message: string;
  tone: "positive" | "critical" | "caution";
};

type PublishResult = {
  name: string;
  status: "published" | "blocked" | "failed" | "skipped";
  message: string;
};

type ActionPatch = {
  set?: Record<string, unknown>;
  unset?: string[];
};

type DocumentEditAction = {
  actionType: "sanity.action.document.edit";
  draftId: string;
  publishedId: string;
  patch: ActionPatch;
};

type DocumentPublishAction = {
  actionType: "sanity.action.document.publish";
  draftId: string;
  publishedId: string;
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

const DRAFT_PREFIX = "drafts.";

function isDraftDocumentId(id: string) {
  return id.startsWith(DRAFT_PREFIX);
}

function getPublishedId(id: string) {
  return isDraftDocumentId(id) ? id.slice(DRAFT_PREFIX.length) : id;
}

function getDraftId(id: string) {
  return isDraftDocumentId(id) ? id : `${DRAFT_PREFIX}${id}`;
}

function formatCategoryLabel(category: CategoryOption | NonNullable<StudioPhoto["category"]>) {
  if (category.displayOrder) {
    return `Slot ${category.displayOrder}: ${category.title}`;
  }

  return category.title;
}

function formatPhotoLabel(photo: Pick<StudioPhoto, "title" | "alt">) {
  return photo.title || photo.alt || "Untitled photo";
}

function formatPhotoDescription(photo: Pick<StudioPhoto, "alt">) {
  return photo.alt || "No description yet";
}

function sortByUpdatedAtDesc(left: StudioPhoto, right: StudioPhoto) {
  return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
}

function sortCategoryPhotos(left: StudioPhoto, right: StudioPhoto) {
  const leftOrder = left.categoryOrder ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = right.categoryOrder ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return sortByUpdatedAtDesc(left, right);
}

function sortHomePhotos(left: StudioPhoto, right: StudioPhoto) {
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

function getPlacementSummary(photo: StudioPhoto) {
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

function getPublishReadiness(photo: Omit<StudioPhoto, "publishReadiness">): PublishReadiness {
  if (!photo.draftId) {
    return {
      canPublish: false,
      state: "live",
      label: "Live",
      message: "Already published. There are no draft changes waiting to go live.",
      tone: "transparent",
    };
  }

  if (!photo.imageUrl) {
    return {
      canPublish: false,
      state: "blocked",
      label: "Publish blocked",
      message: "Add an image before publishing this photo.",
      tone: "critical",
    };
  }

  if (!photo.alt?.trim()) {
    return {
      canPublish: false,
      state: "blocked",
      label: "Publish blocked",
      message: "Add a description before publishing so the photo meets the current content requirements.",
      tone: "critical",
    };
  }

  if (!photo.category) {
    return {
      canPublish: false,
      state: "blocked",
      label: "Publish blocked",
      message: "Choose a category slot before publishing so the photo has a public destination.",
      tone: "critical",
    };
  }

  if (!photo.isVisible) {
    return {
      canPublish: true,
      state: "ready",
      label: "Ready to publish",
      message:
        "Ready to publish. It will stay hidden on the public site until you turn visibility back on.",
      tone: "positive",
    };
  }

  if (photo.showOnHomePage && photo.homePageOrder) {
    return {
      canPublish: true,
      state: "ready",
      label: "Ready to publish",
      message: `Ready to publish. It will update ${formatCategoryLabel(photo.category)} and the home page rail.`,
      tone: "positive",
    };
  }

  return {
    canPublish: true,
    state: "ready",
    label: "Ready to publish",
    message: `Ready to publish. It will appear in ${formatCategoryLabel(photo.category)} on /work/${photo.category.slug}.`,
    tone: "positive",
  };
}

function mergePhotoRecords(records: RawPhotoRecord[]): StudioPhoto[] {
  const grouped = new Map<string, { draft?: RawPhotoRecord; published?: RawPhotoRecord }>();

  records.forEach((record) => {
    const baseId = getPublishedId(record._id);
    const current = grouped.get(baseId) ?? {};

    if (isDraftDocumentId(record._id)) {
      current.draft = record;
    } else {
      current.published = record;
    }

    grouped.set(baseId, current);
  });

  return Array.from(grouped.entries())
    .map(([id, pair]) => {
      const source = pair.draft ?? pair.published;
      if (!source) {
        return null;
      }

      const publishState: PublishState = pair.draft
        ? pair.published
          ? "draft-changes"
          : "draft-only"
        : "published";

      const photoBase: Omit<StudioPhoto, "publishReadiness"> = {
        id,
        draftId: pair.draft?._id,
        publishedId: pair.published?._id,
        title: source.title,
        alt: source.alt,
        imageUrl: source.imageUrl,
        isVisible: source.isVisible ?? true,
        showOnHomePage: source.showOnHomePage ?? false,
        homePageOrder: source.homePageOrder,
        categoryOrder: source.categoryOrder,
        category: source.category,
        updatedAt: source.updatedAt,
        publishState,
        publishStateLabel:
          publishState === "draft-only"
            ? "Draft only"
            : publishState === "draft-changes"
              ? "Draft changes"
              : "Published",
        publishStateTone:
          publishState === "draft-only"
            ? "caution"
            : publishState === "draft-changes"
              ? "primary"
              : "positive",
      };

      return {
        ...photoBase,
        publishReadiness: getPublishReadiness(photoBase),
      };
    })
    .filter((photo): photo is StudioPhoto => photo !== null)
    .sort(sortByUpdatedAtDesc);
}

function patchHasChanges(patch: ActionPatch) {
  return Boolean(
    (patch.set && Object.keys(patch.set).length > 0) || (patch.unset && patch.unset.length > 0),
  );
}

export function PhotoOrganizerTool() {
  const client = useClient({ apiVersion });
  const rawClient = useMemo(() => client.withConfig({ perspective: "raw" }), [client]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [photos, setPhotos] = useState<StudioPhoto[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [publishResults, setPublishResults] = useState<PublishResult[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const [nextCategories, nextPhotos] = await Promise.all([
        client.fetch<CategoryOption[]>(CATEGORY_QUERY),
        rawClient.fetch<RawPhotoRecord[]>(ORGANIZER_PHOTOS_QUERY),
      ]);

      const mergedPhotos = mergePhotoRecords(Array.isArray(nextPhotos) ? nextPhotos : []);

      setCategories(Array.isArray(nextCategories) ? nextCategories : []);
      setPhotos(mergedPhotos);
      setSelectedPhotoIds((currentIds) =>
        currentIds.filter((photoId) => mergedPhotos.some((photo) => photo.id === photoId)),
      );
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load photos right now.");
    } finally {
      setIsLoading(false);
    }
  }, [client, rawClient]);

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

      if (filterMode === "draft-changes" && !photo.draftId) {
        return false;
      }

      if (filterMode === "ready-to-publish" && !photo.publishReadiness.canPublish) {
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
        photo.publishStateLabel,
        photo.publishReadiness.label,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchHaystack.includes(normalizedSearch);
    });
  }, [filterMode, normalizedSearch, photos]);

  const filteredPhotoIds = useMemo(() => filteredPhotos.map((photo) => photo.id), [filteredPhotos]);
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
    () => photos.filter((photo) => selectedPhotoIds.includes(photo.id)),
    [photos, selectedPhotoIds],
  );

  const selectedAssignedVisiblePhotos = useMemo(
    () => selectedPhotos.filter((photo) => Boolean(photo.category) && photo.isVisible),
    [selectedPhotos],
  );

  const selectedReadyToPublishPhotos = useMemo(
    () => selectedPhotos.filter((photo) => photo.draftId && photo.publishReadiness.canPublish),
    [selectedPhotos],
  );

  const selectedBlockedDraftPhotos = useMemo(
    () => selectedPhotos.filter((photo) => photo.draftId && !photo.publishReadiness.canPublish),
    [selectedPhotos],
  );

  const selectedLivePhotos = useMemo(
    () => selectedPhotos.filter((photo) => !photo.draftId),
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

  async function runDocumentEdits(options: {
    targetPhotos: StudioPhoto[];
    confirmMessage?: string;
    successMessage: string;
    emptyMessage: string;
    buildPatch: (photo: StudioPhoto, index: number) => ActionPatch;
  }) {
    if (options.targetPhotos.length === 0) {
      setFeedback({ message: options.emptyMessage, tone: "caution" });
      return;
    }

    if (options.confirmMessage && !window.confirm(options.confirmMessage)) {
      return;
    }

    setIsWorking(true);
    setFeedback(null);
    setPublishResults([]);

    try {
      const actions = options.targetPhotos
        .map((photo, index) => {
          const patch = options.buildPatch(photo, index);
          if (!patchHasChanges(patch)) {
            return null;
          }

          return {
            actionType: "sanity.action.document.edit",
            draftId: getDraftId(photo.id),
            publishedId: photo.id,
            patch,
          } satisfies DocumentEditAction;
        })
        .filter((action): action is DocumentEditAction => action !== null);

      if (actions.length === 0) {
        setFeedback({ message: options.emptyMessage, tone: "caution" });
        return;
      }

      await client.action(actions);
      setFeedback({ message: options.successMessage, tone: "positive" });
      setSelectedPhotoIds([]);
      await loadData();
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : "The update could not be completed.",
        tone: "critical",
      });
    } finally {
      setIsWorking(false);
    }
  }

  async function assignSelectedPhotos() {
    if (!selectedCategory) {
      setFeedback({
        message: "Choose a category slot before moving selected photos.",
        tone: "caution",
      });
      return;
    }

    const photosInTargetCategory = photos
      .filter(
        (photo) =>
          photo.category?._id === selectedCategory._id && !selectedPhotoIds.includes(photo.id),
      )
      .sort(sortCategoryPhotos);

    let nextCategoryOrder =
      photosInTargetCategory.reduce(
        (maxOrder, photo) => Math.max(maxOrder, photo.categoryOrder ?? 0),
        0,
      ) + 1;

    await runDocumentEdits({
      targetPhotos: selectedPhotos,
      successMessage: `${selectedPhotos.length} photo${
        selectedPhotos.length === 1 ? "" : "s"
      } moved to ${formatCategoryLabel(selectedCategory)}.`,
      emptyMessage: "Select one or more photos to move.",
      buildPatch: () => {
        const patch: ActionPatch = {
          set: {
            category: {
              _type: "reference",
              _ref: selectedCategory._id,
            },
            categoryOrder: nextCategoryOrder,
          },
        };
        nextCategoryOrder += 1;
        return patch;
      },
    });
  }

  async function featureSelectedPhotos() {
    const existingMaxOrder = photos
      .filter((photo) => !selectedPhotoIds.includes(photo.id))
      .reduce((maxOrder, photo) => Math.max(maxOrder, photo.homePageOrder ?? 0), 0);

    await runDocumentEdits({
      targetPhotos: selectedAssignedVisiblePhotos,
      successMessage: `Added ${selectedAssignedVisiblePhotos.length} photo${
        selectedAssignedVisiblePhotos.length === 1 ? "" : "s"
      } to the home page rail.`,
      emptyMessage: "Select visible, assigned photos before adding them to the home page.",
      buildPatch: (photo, index) => ({
        set: {
          showOnHomePage: true,
          homePageOrder: photo.homePageOrder ?? existingMaxOrder + index + 1,
        },
      }),
    });
  }

  async function removeSelectedFromHomePage() {
    await runDocumentEdits({
      targetPhotos: selectedPhotos,
      successMessage: `Removed ${selectedPhotos.length} photo${
        selectedPhotos.length === 1 ? "" : "s"
      } from the home page rail.`,
      emptyMessage: "Select photos before removing them from the home page.",
      buildPatch: () => ({
        set: {
          showOnHomePage: false,
        },
        unset: ["homePageOrder"],
      }),
    });
  }

  async function moveSelectedToUnassigned() {
    await runDocumentEdits({
      targetPhotos: selectedPhotos,
      confirmMessage:
        "Remove the selected photos from their category slots? They will stay in Studio but disappear from the public site until you place and publish them again.",
      successMessage: `Moved ${selectedPhotos.length} photo${
        selectedPhotos.length === 1 ? "" : "s"
      } back to Unassigned.`,
      emptyMessage: "Select photos before moving them back to Unassigned.",
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

    await runDocumentEdits({
      targetPhotos: selectedPhotos,
      confirmMessage: nextVisible
        ? undefined
        : "Hide the selected photos from the public site? Featured-home placement will also be turned off in the draft.",
      successMessage: hiddenMessage,
      emptyMessage: "Select photos before changing visibility.",
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
    const currentPhoto = photos.find((photo) => photo.id === photoId);
    if (!currentPhoto?.category) {
      return;
    }

    const orderedPhotos = photos
      .filter((photo) => photo.category?._id === currentPhoto.category?._id)
      .sort(sortCategoryPhotos);
    const currentIndex = orderedPhotos.findIndex((photo) => photo.id === photoId);
    const targetIndex = direction === "earlier" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= orderedPhotos.length) {
      return;
    }

    const reordered = [...orderedPhotos];
    const [movedPhoto] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, movedPhoto);

    await runDocumentEdits({
      targetPhotos: reordered,
      successMessage: `Updated the order for ${formatCategoryLabel(currentPhoto.category)}.`,
      emptyMessage: "No category photos were available to reorder.",
      buildPatch: (_photo, index) => ({
        set: {
          categoryOrder: index + 1,
        },
      }),
    });
  }

  async function reorderHomePhoto(photoId: string, direction: "earlier" | "later") {
    const orderedPhotos = photos.filter((photo) => photo.showOnHomePage).sort(sortHomePhotos);
    const currentIndex = orderedPhotos.findIndex((photo) => photo.id === photoId);
    const targetIndex = direction === "earlier" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= orderedPhotos.length) {
      return;
    }

    const reordered = [...orderedPhotos];
    const [movedPhoto] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, movedPhoto);

    await runDocumentEdits({
      targetPhotos: reordered,
      successMessage: "Updated the home page order.",
      emptyMessage: "No home page photos were available to reorder.",
      buildPatch: (_photo, index) => ({
        set: {
          showOnHomePage: true,
          homePageOrder: index + 1,
        },
      }),
    });
  }

  async function publishSelectedPhotos() {
    if (selectedReadyToPublishPhotos.length === 0) {
      setFeedback({
        message: "Select draft photos that are ready before publishing.",
        tone: "caution",
      });
      return;
    }

    setIsWorking(true);
    setFeedback(null);
    setPublishResults([]);

    const nextResults: PublishResult[] = [];

    try {
      for (const photo of selectedReadyToPublishPhotos) {
        if (!photo.draftId) {
          nextResults.push({
            name: formatPhotoLabel(photo),
            status: "skipped",
            message: "Already live. No draft changes were waiting to publish.",
          });
          continue;
        }

        const action: DocumentPublishAction = {
          actionType: "sanity.action.document.publish",
          draftId: photo.draftId,
          publishedId: photo.id,
        };

        try {
          await client.action(action);
          nextResults.push({
            name: formatPhotoLabel(photo),
            status: "published",
            message: photo.isVisible
              ? "Published to the live site."
              : "Published as hidden. It stays off the live site until visibility is turned back on.",
          });
        } catch (error) {
          nextResults.push({
            name: formatPhotoLabel(photo),
            status: "failed",
            message: error instanceof Error ? error.message : "Publish failed.",
          });
        }
      }

      selectedBlockedDraftPhotos.forEach((photo) => {
        nextResults.push({
          name: formatPhotoLabel(photo),
          status: "blocked",
          message: photo.publishReadiness.message,
        });
      });

      selectedLivePhotos.forEach((photo) => {
        nextResults.push({
          name: formatPhotoLabel(photo),
          status: "skipped",
          message: "Already live. There are no draft changes to publish.",
        });
      });

      setPublishResults(nextResults);

      const publishedCount = nextResults.filter((result) => result.status === "published").length;
      const failedCount = nextResults.filter((result) => result.status === "failed").length;
      const blockedCount = nextResults.filter((result) => result.status === "blocked").length;

      if (failedCount > 0) {
        setFeedback({
          message: `Published ${publishedCount} photo${
            publishedCount === 1 ? "" : "s"
          }, with ${failedCount} failure${failedCount === 1 ? "" : "s"} and ${blockedCount} blocked draft${
            blockedCount === 1 ? "" : "s"
          }.`,
          tone: "caution",
        });
      } else {
        setFeedback({
          message: `Published ${publishedCount} ready photo${
            publishedCount === 1 ? "" : "s"
          }.${blockedCount > 0 ? ` ${blockedCount} blocked draft${blockedCount === 1 ? "" : "s"} still need attention.` : ""}`,
          tone: "positive",
        });
      }

      setSelectedPhotoIds([]);
      await loadData();
    } finally {
      setIsWorking(false);
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
      label: "Draft changes",
      value: "draft-changes",
      count: photos.filter((photo) => Boolean(photo.draftId)).length,
      icon: PublishIcon,
      description: "Photos with draft work that is not fully live yet",
    },
    {
      label: "Ready to publish",
      value: "ready-to-publish",
      count: photos.filter((photo) => photo.publishReadiness.canPublish).length,
      icon: CheckmarkCircleIcon,
      description: "Draft photos that can go live right now",
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

  function renderPhotoCard(
    photo: StudioPhoto,
    options?: { showCategoryOrderControls?: boolean; showHomeOrderControls?: boolean },
  ) {
    const isSelected = selectedPhotoIds.includes(photo.id);

    return (
      <Card
        key={photo.id}
        border
        onClick={() => togglePhotoSelection(photo.id)}
        padding={3}
        radius={3}
        shadow={isSelected ? 1 : 0}
        tone={isSelected ? "primary" : "transparent"}
      >
        <Stack space={3}>
          {photo.imageUrl ? (
            <>
              {/* The organizer stays photo-first so editors can make placement and publishing decisions visually. */}
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
              onChange={() => togglePhotoSelection(photo.id)}
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
                <Card padding={2} radius={2} tone={photo.publishStateTone}>
                  <Text size={1}>{photo.publishStateLabel}</Text>
                </Card>
                <Card padding={2} radius={2} tone={photo.publishReadiness.tone}>
                  <Text size={1}>{photo.publishReadiness.label}</Text>
                </Card>
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
                {photo.publishReadiness.message}
              </Text>
              <Text muted size={1}>
                {getPlacementSummary(photo)}
              </Text>
              <Text muted size={1}>
                Updated {formatUpdatedAt(photo.updatedAt)}
              </Text>

              {options?.showCategoryOrderControls && photo.category ? (
                <Inline space={2}>
                  <Button
                    disabled={isWorking}
                    icon={ArrowLeftIcon}
                    mode="ghost"
                    onClick={(event) => {
                      event.stopPropagation();
                      void reorderCategoryPhoto(photo.id, "earlier");
                    }}
                    text="Earlier in category"
                  />
                  <Button
                    disabled={isWorking}
                    icon={ArrowRightIcon}
                    mode="ghost"
                    onClick={(event) => {
                      event.stopPropagation();
                      void reorderCategoryPhoto(photo.id, "later");
                    }}
                    text="Later in category"
                  />
                </Inline>
              ) : null}

              {options?.showHomeOrderControls && photo.showOnHomePage ? (
                <Inline space={2}>
                  <Button
                    disabled={isWorking}
                    icon={ArrowLeftIcon}
                    mode="ghost"
                    onClick={(event) => {
                      event.stopPropagation();
                      void reorderHomePhoto(photo.id, "earlier");
                    }}
                    text="Earlier on home"
                  />
                  <Button
                    disabled={isWorking}
                    icon={ArrowRightIcon}
                    mode="ghost"
                    onClick={(event) => {
                      event.stopPropagation();
                      void reorderHomePhoto(photo.id, "later");
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
              Sort uploads visually, review what is still draft-only versus already live, and publish ready changes without opening every photo document.
            </Text>
            <Text muted size={1}>
              Think of this workspace as the final handoff before the live site: organize photos, check readiness, then publish the draft changes that are actually ready.
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
                  Search the whole library, focus on a subset, and review draft readiness before you publish.
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
              placeholder="Search by photo label, description, category, or publish state"
              value={searchTerm}
            />

            <Grid columns={[1, 2, 3]} gap={3}>
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
                    {selectedPhotoIds.length > 0 ? (
                      <Text muted size={1}>
                        {selectedReadyToPublishPhotos.length} ready to publish, {selectedBlockedDraftPhotos.length} blocked draft
                        {selectedBlockedDraftPhotos.length === 1 ? "" : "s"}, {selectedLivePhotos.length} already live
                      </Text>
                    ) : null}
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
                    disabled={!selectedCategory || selectedPhotoIds.length === 0 || isWorking}
                    icon={ImagesIcon}
                    onClick={() => void assignSelectedPhotos()}
                    text={isWorking ? "Saving draft changes..." : "Move to selected category"}
                    tone="positive"
                  />
                  <Button
                    disabled={selectedPhotoIds.length === 0 || isWorking}
                    icon={RemoveCircleIcon}
                    mode="ghost"
                    onClick={() => void moveSelectedToUnassigned()}
                    text="Move back to Unassigned"
                  />
                  <Button
                    disabled={selectedAssignedVisiblePhotos.length === 0 || isWorking}
                    icon={HomeIcon}
                    mode="ghost"
                    onClick={() => void featureSelectedPhotos()}
                    text="Add to home page"
                  />
                  <Button
                    disabled={selectedPhotoIds.length === 0 || isWorking}
                    icon={HomeIcon}
                    mode="ghost"
                    onClick={() => void removeSelectedFromHomePage()}
                    text="Remove from home page"
                  />
                  <Button
                    disabled={selectedPhotoIds.length === 0 || isWorking}
                    icon={EyeOpenIcon}
                    mode="ghost"
                    onClick={() => void updateVisibility(true)}
                    text="Show on site"
                  />
                  <Button
                    disabled={selectedPhotoIds.length === 0 || isWorking}
                    icon={EyeClosedIcon}
                    mode="ghost"
                    onClick={() => void updateVisibility(false)}
                    text="Hide from site"
                  />
                  <Button
                    disabled={selectedReadyToPublishPhotos.length === 0 || isWorking}
                    icon={PublishIcon}
                    mode="default"
                    onClick={() => void publishSelectedPhotos()}
                    text="Publish selected ready photos"
                    tone="primary"
                  />
                </Flex>
              </Stack>
            </Card>

            {feedback ? (
              <Card padding={3} radius={2} tone={feedback.tone}>
                <Inline space={2}>
                  {feedback.tone === "positive" ? <CheckmarkCircleIcon /> : <WarningOutlineIcon />}
                  <Text size={1}>{feedback.message}</Text>
                </Inline>
              </Card>
            ) : null}

            {publishResults.length > 0 ? (
              <Card border padding={3} radius={3}>
                <Stack space={3}>
                  <Text size={2} weight="semibold">
                    Publish results
                  </Text>
                  <Stack space={2}>
                    {publishResults.map((result) => (
                      <Flex key={`${result.name}-${result.status}`} align="flex-start" gap={3}>
                        {result.status === "published" ? <CheckmarkCircleIcon /> : <WarningOutlineIcon />}
                        <Stack space={1}>
                          <Text size={1} weight="semibold">
                            {result.name}
                          </Text>
                          <Text muted size={1}>
                            {result.message}
                          </Text>
                        </Stack>
                      </Flex>
                    ))}
                  </Stack>
                </Stack>
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
                    Start in Upload Photos, then return here to sort everything visually and publish ready changes.
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
