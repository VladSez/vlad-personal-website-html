import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "www",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "www/index.html"),
        links: resolve(__dirname, "www/links.html"),
        videos: resolve(__dirname, "www/videos.html"),
      },
    },
  },
});
