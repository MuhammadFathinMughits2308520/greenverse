import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  preview: {
    port: process.env.PORT || 8080, // penting untuk Railway
  },
  base: "./" // biar asset bisa di-load dari semua path
});
