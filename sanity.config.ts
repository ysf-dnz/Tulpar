"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { projectId, dataset } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";
import { documentActions } from "./sanity/actions";

export default defineConfig({
  name: "tulpar",
  title: "Tulpar Carpet Paneli",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    presentationTool({ previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } } }),
  ],
  schema: { types: schemaTypes },
  document: { actions: documentActions },
});
