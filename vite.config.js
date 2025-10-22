import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  cacheDir: "/tmp/vite-cache",
  preview: {
    port: process.env.PORT || 8080,
    host: true,
  },
  base: "./",
});
