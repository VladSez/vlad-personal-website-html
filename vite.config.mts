import { resolve } from "path";
import { defineConfig } from "vite";

const BASE_URL =
  process.env.VERCEL_ENV === "production"
    ? "https://vladsazon.com/"
    : `https://${process.env.VERCEL_URL}`;

export default defineConfig({
  root: "www",
  base: BASE_URL,
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
