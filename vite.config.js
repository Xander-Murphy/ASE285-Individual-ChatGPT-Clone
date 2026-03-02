import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    include: [
      "../tests/**/*.{test,spec}.js",
      "**/*.{test,spec}.js"
    ]
  }
});