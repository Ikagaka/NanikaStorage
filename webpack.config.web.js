const config = require("webpack-config-narazaka-ts-js").web;

config.entry["nanika-storage"] = "./src/lib/nanika-storage.ts";
config.output.library = "nanikaStorage";

module.exports = config;
