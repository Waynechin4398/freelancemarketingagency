import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || "https://wayneomni.com",
  output: "static",
  build: {
    assets: "assets",
  },
  compressHTML: true,
});
