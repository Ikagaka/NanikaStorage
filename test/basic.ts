/// <reference types="mocha" />
import * as assert from "power-assert";
import {NanikaStorage} from "../src/lib/nanika-storage";

describe("NanikaStorage", () => {
  it("#constructor", () => {
    assert(new NanikaStorage(".") instanceof NanikaStorage);
  });
});
