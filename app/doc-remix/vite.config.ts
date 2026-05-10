import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [reactRouter(), svgr()],
  resolve: {
    tsconfigPaths: true,
  },
});
