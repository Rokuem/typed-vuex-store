import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  external: ["vuex", "vue"],
  input: "./src/index.ts",
  output: [
    {
      file: "dist/index.js",
      sourcemap: true,
      format: "cjs",
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
    {
      file: "dist/index.jsnext.js",
      format: "module",
      sourcemap: true,
    },
  ],
  plugins: [typescript()],
});
