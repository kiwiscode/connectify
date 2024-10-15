import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
  build: {
    manifest: true,
    rollupOptions: {
      external: [],
    },
  },
});
