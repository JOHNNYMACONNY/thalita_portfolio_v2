import type { Tool } from "sanity";
import { UploadIcon } from "@sanity/icons";

import { PhotoUploadTool } from "./components/PhotoUploadTool";

export function photoUploadTool(): Tool {
  return {
    name: "photo-upload",
    title: "Upload Photos",
    icon: UploadIcon,
    component: PhotoUploadTool,
  };
}
