"use client";

import { useEffect, useRef, useState } from "react";
import { CheckmarkCircleIcon, ImagesIcon, UploadIcon, WarningOutlineIcon } from "@sanity/icons";
import { Box, Button, Card, Flex, Grid, Inline, Spinner, Stack, Text } from "@sanity/ui";
import { useClient } from "sanity";

import { apiVersion } from "../env";

type CategoryOption = {
  _id: string;
  title: string;
  slug: string;
  displayOrder: number;
  coverImageUrl?: string;
};

type SelectedPreview = {
  id: string;
  name: string;
  url: string;
};

type UploadResult = {
  name: string;
  status: "created" | "failed";
  destination: string;
  message?: string;
};

type DraftGalleryItem = {
  _id: string;
  _type: "galleryItem";
  title: string;
  alt: string;
  image: {
    _type: "image";
    asset: {
      _type: "reference";
      _ref: string;
    };
  };
  isVisible: boolean;
  showOnHomePage: boolean;
  category?: {
    _type: "reference";
    _ref: string;
  };
};

const CATEGORY_QUERY = `*[_type == "category"] | order(displayOrder asc) {
  _id,
  title,
  "slug": slug.current,
  displayOrder,
  "coverImageUrl": coverImage.asset->url
}`;

const UNASSIGNED_DESTINATION = "__unassigned__";

function humanizeFilename(filename: string) {
  const withoutExtension = filename.replace(/\.[^.]+$/, "");
  const normalized = withoutExtension.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

  if (!normalized) {
    return "Untitled photo";
  }

  return normalized.replace(/\b\w/g, (character) => character.toUpperCase());
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Upload failed. Please try again.";
}

export function PhotoUploadTool() {
  const client = useClient({ apiVersion });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<SelectedPreview[]>([]);
  const [destination, setDestination] = useState(UNASSIGNED_DESTINATION);
  const [uploading, setUploading] = useState(false);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [results, setResults] = useState<UploadResult[]>([]);

  useEffect(() => {
    let isActive = true;

    async function loadCategories() {
      try {
        const nextCategories = await client.fetch<CategoryOption[]>(CATEGORY_QUERY);
        if (isActive) {
          setCategories(Array.isArray(nextCategories) ? nextCategories : []);
        }
      } finally {
        if (isActive) {
          setCategoriesLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      isActive = false;
    };
  }, [client]);

  useEffect(() => {
    const nextPreviews = selectedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${file.size}`,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [selectedFiles]);

  async function handleUpload() {
    if (selectedFiles.length === 0) {
      return;
    }

    setUploading(true);
    setCompletedCount(0);
    setCurrentFileName(null);
    setResults([]);

    const nextResults: UploadResult[] = [];
    const selectedCategory = categories.find((category) => category._id === destination);
    const destinationLabel = selectedCategory?.title ?? "Unassigned";

    for (const file of selectedFiles) {
      setCurrentFileName(file.name);

      try {
        const asset = await client.assets.upload("image", file, {
          filename: file.name,
        });

        const title = humanizeFilename(file.name);
        const documentId = `drafts.galleryItem.${crypto.randomUUID()}`;
        const galleryItem: DraftGalleryItem = {
          _id: documentId,
          _type: "galleryItem",
          title,
          alt: title,
          image: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
          },
          isVisible: true,
          showOnHomePage: false,
        };

        if (selectedCategory) {
          galleryItem.category = {
            _type: "reference",
            _ref: selectedCategory._id,
          };
        }

        await client.create(galleryItem);

        nextResults.push({
          name: file.name,
          status: "created",
          destination: destinationLabel,
        });
      } catch (error) {
        nextResults.push({
          name: file.name,
          status: "failed",
          destination: destinationLabel,
          message: getErrorMessage(error),
        });
      } finally {
        setCompletedCount((count) => count + 1);
        setResults([...nextResults]);
      }
    }

    setCurrentFileName(null);
    setUploading(false);

    const failedUploads = nextResults.filter((result) => result.status === "failed").length;
    if (failedUploads === 0) {
      setSelectedFiles([]);
    }
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    setSelectedFiles(files);
    setResults([]);
  }

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Card border padding={4} radius={3} tone="transparent">
          <Stack space={4}>
            <Inline space={3}>
              <UploadIcon />
              <Text size={4} weight="semibold">
                Upload Photos
              </Text>
            </Inline>
            <Text muted size={2}>
              Upload several photos at once, keep them safely in drafts, and sort them later. New
              uploads default to <strong>Unassigned</strong> so nothing appears on the public site
              until you organize and publish it.
            </Text>
            <Text muted size={1}>
              The upload tool automatically creates draft photo records with a starter label and alt
              description based on the file name, so you can refine details after the upload finishes.
            </Text>
          </Stack>
        </Card>

        <Card border padding={4} radius={3} tone="transparent">
          <Stack space={4}>
            <Text size={2} weight="semibold">
              Choose where these uploads should land
            </Text>

            {categoriesLoading ? (
              <Flex align="center" gap={3}>
                <Spinner muted />
                <Text muted size={2}>
                  Loading category slots…
                </Text>
              </Flex>
            ) : (
              <Grid columns={[1, 2, 2]} gap={3}>
                <Card
                  as="button"
                  border
                  onClick={() => setDestination(UNASSIGNED_DESTINATION)}
                  padding={3}
                  radius={3}
                  tone={destination === UNASSIGNED_DESTINATION ? "primary" : "transparent"}
                >
                  <Stack space={2}>
                    <Inline space={2}>
                      <ImagesIcon />
                      <Text size={2} weight="semibold">
                        Unassigned
                      </Text>
                    </Inline>
                    <Text muted size={1}>
                      Recommended for bulk intake. Upload now, sort later.
                    </Text>
                  </Stack>
                </Card>

                {categories.map((category) => (
                  <Card
                    key={category._id}
                    as="button"
                    border
                    onClick={() => setDestination(category._id)}
                    padding={3}
                    radius={3}
                    tone={destination === category._id ? "primary" : "transparent"}
                  >
                    <Stack space={2}>
                      {category.coverImageUrl ? (
                        <>
                          {/* Visual destination cards make category choice easier for non-technical editors. */}
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
                      <Text size={2} weight="semibold">
                        Slot {category.displayOrder}: {category.title}
                      </Text>
                      <Text muted size={1}>
                        /work/{category.slug}
                      </Text>
                    </Stack>
                  </Card>
                ))}
              </Grid>
            )}
          </Stack>
        </Card>

        <Card border padding={4} radius={3} tone="transparent">
          <Stack space={4}>
            <Inline space={3}>
              <Button
                fontSize={2}
                icon={UploadIcon}
                mode="default"
                onClick={openFilePicker}
                text={selectedFiles.length > 0 ? "Choose different photos" : "Choose photos"}
                tone="primary"
              />
              <Text muted size={2}>
                {selectedFiles.length === 0
                  ? "Select one or many image files."
                  : `${selectedFiles.length} photo${selectedFiles.length === 1 ? "" : "s"} selected`}
              </Text>
            </Inline>

            <input
              accept="image/*"
              hidden
              multiple
              onChange={handleFileSelection}
              ref={fileInputRef}
              type="file"
            />

            {previews.length > 0 ? (
              <Grid columns={[2, 3, 5]} gap={3}>
                {previews.map((preview) => (
                  <Card key={preview.id} border overflow="hidden" radius={3}>
                    <Stack space={2}>
                      {/* A small selection thumbnail keeps the upload flow image-first. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={preview.name}
                        src={preview.url}
                        style={{
                          aspectRatio: "1 / 1",
                          display: "block",
                          height: "100%",
                          objectFit: "cover",
                          width: "100%",
                        }}
                      />
                      <Box padding={2}>
                        <Text size={1} style={{ wordBreak: "break-word" }}>
                          {preview.name}
                        </Text>
                      </Box>
                    </Stack>
                  </Card>
                ))}
              </Grid>
            ) : null}

            <Card padding={3} radius={2} tone="caution">
              <Text size={1}>
                Uploads created here stay as drafts. If you leave the destination on Unassigned,
                they will not show on the homepage or Work pages until you place them later.
              </Text>
            </Card>

            <Button
              disabled={selectedFiles.length === 0 || uploading}
              fontSize={2}
              onClick={handleUpload}
              text={
                uploading
                  ? `Uploading ${completedCount}/${selectedFiles.length}`
                  : `Upload ${selectedFiles.length || ""} photo${selectedFiles.length === 1 ? "" : "s"}`
              }
              tone="positive"
            />

            {uploading ? (
              <Card padding={3} radius={2} tone="primary">
                <Stack space={2}>
                  <Text size={2} weight="semibold">
                    Uploading…
                  </Text>
                  <Text size={1}>
                    {currentFileName
                      ? `Working on ${currentFileName}`
                      : "Preparing your photo batch…"}
                  </Text>
                </Stack>
              </Card>
            ) : null}

            {results.length > 0 ? (
              <Card border padding={3} radius={3}>
                <Stack space={3}>
                  <Text size={2} weight="semibold">
                    Upload results
                  </Text>
                  <Stack space={2}>
                    {results.map((result) => (
                      <Flex
                        align="flex-start"
                        gap={3}
                        justify="space-between"
                        key={`${result.name}-${result.status}`}
                      >
                        <Inline space={2}>
                          {result.status === "created" ? (
                            <CheckmarkCircleIcon />
                          ) : (
                            <WarningOutlineIcon />
                          )}
                          <Stack space={1}>
                            <Text size={1} weight="medium">
                              {result.name}
                            </Text>
                            <Text muted size={1}>
                              {result.status === "created"
                                ? `Saved to ${result.destination}`
                                : result.message}
                            </Text>
                          </Stack>
                        </Inline>
                      </Flex>
                    ))}
                  </Stack>
                </Stack>
              </Card>
            ) : null}
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
