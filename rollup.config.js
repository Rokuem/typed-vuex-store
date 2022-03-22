import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const externals = ["vue", "vuex"];

const dtsOptions = {
  input: "./src/index.ts",
  output: [{ file: "dist/index.d.ts", format: "es" }],
  plugins: [dts()],
  external: externals,
};

const options = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs",
      format: "esm",
    },
    {
      file: "dist/index.mjs",
      format: "esm",
    },
  ],
  external: externals,
  plugins: [
    typescript({
      declaration: true,
    }),
  ],
};

export default [dtsOptions, options];
