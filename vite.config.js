import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: [
      "../tests/**/*.test.{js,jsx}",
      "../tests/**/*.spec.{js,jsx}",
    ],
    server: {
      deps: {
        inline: ["react-markdown", "remark-math", "rehype-katex"],
      },
    },
  }
});