import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // BASE_PATH=/egitim/ builds the site for a sub-path (plan B); default "/" for its own domain (plan A).
  base: process.env.BASE_PATH || "/",
  plugins: [react()],
  server: { host: "127.0.0.1", port: 5173, strictPort: true },
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
  build: {
    // The lazily loaded 3D lab chunk bundles three.js (~650 kB). It is only fetched on
    // ?view=rov-lab, so the default 500 kB warning does not reflect first-load cost.
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      onwarn(warning, warn) {
        // lucide-react ships "use client" directives; they are meaningless in a client-only SPA.
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
  test: {
    include: ["tests/unit/**/*.test.js"],
    environment: "node",
  },
});
