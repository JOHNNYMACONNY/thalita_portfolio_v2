import { ImagesIcon } from "@sanity/icons";
import type { Tool } from "sanity";

import { PhotoOrganizerTool } from "./components/PhotoOrganizerTool";

export function organizePhotosTool(): Tool {
  return {
    name: "organize-photos",
    title: "Organize Photos",
    icon: ImagesIcon,
    component: PhotoOrganizerTool,
  };
}
