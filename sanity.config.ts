import { defineConfig } from "sanity";

import { dataset, projectId } from "./sanity/env";

export default defineConfig({
  name: "default",
  title: "Thalita Portfolio Studio",
  projectId,
  dataset,
  basePath: "/studio",
  schema: {
    types: [],
  },
});
