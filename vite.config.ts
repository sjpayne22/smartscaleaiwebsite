import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/",                        // ✅ FIXED: This ensures proper asset paths
  root: "client",                   // ✅ Your actual index.html is inside /client
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@assets": path.resolve(__dirname, "client", "public", "assets"),
    },
  },
  build: {
    outDir: "../build",             // ✅ Your build folder at project root
    emptyOutDir: true,
  },
});
