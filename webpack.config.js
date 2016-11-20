const config = require("webpack-config-narazaka-ts-js").node;

config.entry["nanika-storage"] = "./src/lib/nanika-storage.ts";
config.output.library = "nanikaStorage";

module.exports = config;
