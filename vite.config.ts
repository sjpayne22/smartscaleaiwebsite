import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/",               // ✅ Required to fix asset paths
  root: "client",           // ✅ Point to where your index.html and src folder live
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
    },
  },
  build: {
    outDir: "../build",     // ✅ Because "client" is now the root, so output outside of it
    emptyOutDir: true,
  },
});
