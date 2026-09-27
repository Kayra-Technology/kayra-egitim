import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BASE_PATH=/egitim/ builds the site for a sub-path: kayra.technology/egitim proxies to this deployment.
// The output then goes to dist/egitim/ so the deployment serves the same path. Default: "/" and dist/.
const base = process.env.BASE_PATH || "/";
const outDir = base === "/" ? "dist" : `dist${base.replace(/\/$/, "")}`;

export default defineConfig({
  base,
  plugins: [react()],
  server: { host: "127.0.0.1", port: 5173, strictPort: true },
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
  build: {
    outDir,
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
