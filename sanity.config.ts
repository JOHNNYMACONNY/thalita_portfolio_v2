'use client';

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "default",
  title: "Thalita Portfolio Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool({ structure })],
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter((templateItem) => templateItem.templateId !== "category");
      }

      return prev;
    },
  },
  schema: {
    types: schemaTypes,
  },
});
