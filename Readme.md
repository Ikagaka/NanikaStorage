[NanikaStorage - Nanika Storage](https://github.com/Ikagaka/NanikaStorage)
==========================

[![npm](https://img.shields.io/npm/v/nanika-storage.svg)](https://www.npmjs.com/package/nanika-storage)
[![npm license](https://img.shields.io/npm/l/nanika-storage.svg)](https://www.npmjs.com/package/nanika-storage)
[![npm download total](https://img.shields.io/npm/dt/nanika-storage.svg)](https://www.npmjs.com/package/nanika-storage)
[![npm download by month](https://img.shields.io/npm/dm/nanika-storage.svg)](https://www.npmjs.com/package/nanika-storage)

[![Dependency Status](https://david-dm.org/Ikagaka/NanikaStorage/status.svg)](https://david-dm.org/Ikagaka/NanikaStorage)
[![devDependency Status](https://david-dm.org/Ikagaka/NanikaStorage/dev-status.svg)](https://david-dm.org/Ikagaka/NanikaStorage?type=dev)
[![Travis Build Status](https://travis-ci.org/Ikagaka/NanikaStorage.svg?branch=master)](https://travis-ci.org/Ikagaka/NanikaStorage)
[![AppVeyor Build Status](https://ci.appveyor.com/api/projects/status/github/Ikagaka/NanikaStorage?svg=true&branch=master)](https://ci.appveyor.com/project/Narazaka/nanikastorage)
[![codecov.io](https://codecov.io/github/Ikagaka/NanikaStorage/coverage.svg?branch=master)](https://codecov.io/github/Ikagaka/NanikaStorage?branch=master)
[![Code Climate](https://codeclimate.com/github/Ikagaka/NanikaStorage/badges/gpa.svg)](https://codeclimate.com/github/Ikagaka/NanikaStorage)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3a0ffd374b07429c94b0792ce66c6d57)](https://www.codacy.com/app/narazaka/NanikaStorage?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Ikagaka/NanikaStorage&amp;utm_campaign=Badge_Grade)
[![Greenkeeper badge](https://badges.greenkeeper.io/Ikagaka/NanikaStorage.svg)](https://greenkeeper.io/)

NanikaStorageは伺かに必要なストレージを抽象化するモジュールです。

Installation
--------------------------

```
npm install nanika-storage
```

Usage
--------------------------

```javascript
import {NanikaStorage} from "nanika-storage";

const nanikaStorage = new NanikaStorage("./ssp");
```

ファイルシステムのバックエンドとして現状node.jsのFileSystem APIのほかに[browserfs](https://github.com/jvilk/BrowserFS)をサポートしています。

API Documents
--------------------------

[API Documents (with type annotations)](https://ikagaka.github.io/NanikaStorage/index.html)

License
--------------------------

This is released under [MIT License](http://narazaka.net/license/MIT?2016).
