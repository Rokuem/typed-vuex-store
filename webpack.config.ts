import { Configuration } from "webpack";
import path from "path";

export const webpackConfig: Configuration = {
  entry: {
    main: path.resolve(__dirname, "./src/index.ts"),
  },
  externals: ["vue", "vuex"],
  mode: "production",
  output: {
    libraryTarget: "commonjs2",
    library: "typed-vuex-store",
    path: path.resolve(__dirname, "./dist"),
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
      },
    ],
  },
};

export default webpackConfig;
