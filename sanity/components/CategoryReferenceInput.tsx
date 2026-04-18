"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Flex, Select, Spinner, Stack, Text } from "@sanity/ui";
import { set, unset, useClient, type ReferenceInputProps } from "sanity";

import { apiVersion } from "../env";

type CategoryOption = {
  _id: string;
  title: string;
  slug?: string;
  displayOrder?: number;
};

function formatCategoryLabel(category: CategoryOption) {
  if (category.displayOrder) {
    return `Slot ${category.displayOrder}: ${category.title}`;
  }

  return category.title;
}

const CATEGORY_OPTIONS_QUERY = `*[_type == "category"] | order(displayOrder asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  displayOrder
}`;

export function CategoryReferenceInput(props: ReferenceInputProps) {
  const { onChange, value, elementProps } = props;
  const client = useClient({ apiVersion });
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadCategories() {
      try {
        const results = await client.fetch<CategoryOption[]>(CATEGORY_OPTIONS_QUERY);
        if (!isActive) {
          return;
        }

        setCategories(results);
        setLoadError(null);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setLoadError(error instanceof Error ? error.message : "Unable to load categories.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      isActive = false;
    };
  }, [client]);

  const selectedValue = typeof value?._ref === "string" ? value._ref : "";
  const selectedCategory = useMemo(
    () => categories.find((category) => category._id === selectedValue),
    [categories, selectedValue],
  );

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextValue = event.currentTarget.value;

    if (!nextValue) {
      onChange(unset());
      return;
    }

    onChange(
      set({
        _type: "reference",
        _ref: nextValue,
      }),
    );
  }

  return (
    <Stack space={3}>
      <Select
        {...elementProps}
        value={selectedValue}
        onChange={handleChange}
        disabled={isLoading || Boolean(loadError)}
      >
        <option value="">Unassigned</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {formatCategoryLabel(category)}
          </option>
        ))}
      </Select>

      {isLoading ? (
        <Card padding={3} radius={2} tone="transparent">
          <Flex align="center" gap={2}>
            <Spinner muted size={2} />
            <Text size={1}>Loading available categories...</Text>
          </Flex>
        </Card>
      ) : null}

      {loadError ? (
        <Card padding={3} radius={2} tone="critical">
          <Text size={1}>Could not load categories right now. You can try again after refreshing Studio.</Text>
        </Card>
      ) : null}

      {!isLoading && !loadError && selectedCategory ? (
        <Text muted size={1}>
          This photo will be assigned to {formatCategoryLabel(selectedCategory)}
          {selectedCategory.slug ? ` (${selectedCategory.slug})` : ""}.
        </Text>
      ) : null}
    </Stack>
  );
}
