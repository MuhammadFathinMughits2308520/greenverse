import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  cacheDir: "/tmp/.vite", // Pindah ke /tmp
  preview: {
    port: parseInt(process.env.PORT) || 8080,
    host: true,
  },
  base: "./",
});