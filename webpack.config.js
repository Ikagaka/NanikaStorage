const webpack = require("webpack");
const path = require("path");

module.exports = {
  module: {
    preLoaders: [
      {
        test: /\.ts$/,
        loader: "tslint",
      }
    ],
    loaders: [
      {
        test: /\.ts$/,
        loader: "babel!ts",
        exclude: /node_modules/,
      },
    ],
  },
  target: "node",
  entry: {
    "nanika-storage": "./src/lib/nanika-storage.ts",
  },
  ts: {
    compilerOptions: {
      rootDir: "src",
      outDir: "dist",
      declarationDir: "dist",
    },
  },
  output: {
    path: path.join(__dirname),
    filename: "dist/lib/[name].js",
    library: "nanikaStorage",
    libraryTarget: "commonjs2",
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
  devtool: "source-map",
  resolve: {
    extensions: ["", ".ts", ".js"],
  },
};
