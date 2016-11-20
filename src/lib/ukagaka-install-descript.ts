/// <reference types="node" />

/** 伺かのコンテナ情報 */

/** コンテナの種類 */
export type UkagakaContainerType = UkagakaContainerStandaloneType | UkagakaContainerOnlyInstallType;

/** ファイルとして存在するコンテナの種類 */
export type UkagakaContainerStandaloneType = UkagakaContainerParentType | UkagakaContainerChildType;

/** インストール時親コンテナになれるコンテナの種類 */
export type UkagakaContainerParentType = "ghost" | "shell";

/** インストール時子コンテナになれるコンテナの種類 */
export type UkagakaContainerChildType =
  "balloon" | "plugin" | "headline" | "calendar.skin" | "calendar.plugin";

/** インストール時のみ存在するコンテナの種類 */
export type UkagakaContainerOnlyInstallType = "supplement" | "package";

/** インストール時子コンテナになれるコンテナの種類 */
export const UkagakaContainerChildTypes: UkagakaContainerChildType[] =
  ["balloon", "headline", "plugin", "calendar.skin", "calendar.plugin"];

/** 1と0で真偽値を表すパラメーター */
export type NumberBool = 0 | 1;

export type UkagakaInstallInfoChildTypeSettings = {
  directory?: string,
  source: {
    directory?: string,
  },
  refresh: NumberBool,
  refreshundeletemask: string[],
};

/** "install.txt" の内容 */
export class UkagakaInstallInfo {
  static parse(data: string | Buffer) {
    if (data instanceof Buffer) data = UkagakaInstallInfo._bufferToString(data);
    const lines = data.split(/\r\n|\n|\r/).filter((line) => /^\s*$/.test(line));
    const info = new UkagakaInstallInfo();
    for (const line of lines) {
      const match = line.match(/\s*^([^,]+)\s*,\s*(.*?)\s*$/);
      if (match) {
        const key = match[1];
        const value = match[2];
        switch (key) {
          case "refreshundeletemask":
          case "balloon.refreshundeletemask":
          case "headline.refreshundeletemask":
          case "plugin.refreshundeletemask":
            info[key] = value.split(/:/);
            break;
          default:
            info[key] = value;
            break;
        }
      }
    }
    return info;
  }

  private static _bufferToString(data: Buffer) {
    return data.toString(); // TODO encoding
  }

  [property: string]: any;
  charset?: string;
  name: string;
  type: UkagakaContainerType;
  accept?: string;
  directory: string;
  refresh: NumberBool = 0;
  refreshundeletemask: string[] = [];
  balloon: UkagakaInstallInfoChildTypeSettings = {
    refresh: 0,
    refreshundeletemask: [],
    source: {},
  };
  get ["balloon.directory"]() { return this.balloon.directory; }
  set ["balloon.directory"](value: string | undefined) { this.balloon.directory = value; }
  get ["balloon.refresh"]() { return this.balloon.refresh; }
  set ["balloon.refresh"](value: NumberBool) { this.balloon.refresh = value; }
  get ["balloon.refreshundeletemask"]() { return this.balloon.refreshundeletemask; }
  set ["balloon.refreshundeletemask"](value: string[]) { this.balloon.refreshundeletemask = value; }
  get ["balloon.source.directory"]() { return this.balloon.source.directory; }
  set ["balloon.source.directory"](value: string | undefined) { this.balloon.source.directory = value; }
  headline: UkagakaInstallInfoChildTypeSettings = {
    refresh: 0,
    refreshundeletemask: [],
    source: {},
  };
  get ["headline.directory"]() { return this.headline.directory; }
  set ["headline.directory"](value: string | undefined) { this.headline.directory = value; }
  get ["headline.refresh"]() { return this.headline.refresh; }
  set ["headline.refresh"](value: NumberBool) { this.headline.refresh = value; }
  get ["headline.refreshundeletemask"]() { return this.headline.refreshundeletemask; }
  set ["headline.refreshundeletemask"](value: string[]) { this.headline.refreshundeletemask = value; }
  get ["headline.source.directory"]() { return this.headline.source.directory; }
  set ["headline.source.directory"](value: string | undefined) { this.headline.source.directory = value; }
  plugin: UkagakaInstallInfoChildTypeSettings = {
    refresh: 0,
    refreshundeletemask: [],
    source: {},
  };
  get ["plugin.directory"]() { return this.plugin.directory; }
  set ["plugin.directory"](value: string | undefined) { this.plugin.directory = value; }
  get ["plugin.refresh"]() { return this.plugin.refresh; }
  set ["plugin.refresh"](value: NumberBool) { this.plugin.refresh = value; }
  get ["plugin.refreshundeletemask"]() { return this.plugin.refreshundeletemask; }
  set ["plugin.refreshundeletemask"](value: string[]) { this.plugin.refreshundeletemask = value; }
  get ["plugin.source.directory"]() { return this.plugin.source.directory; }
  set ["plugin.source.directory"](value: string | undefined) { this.plugin.source.directory = value; }
  calendar: {
    skin: UkagakaInstallInfoChildTypeSettings;
    plugin: UkagakaInstallInfoChildTypeSettings;
  } = {
    skin: {
      refresh: 0,
      refreshundeletemask: [],
      source: {},
    },
    plugin: {
      refresh: 0,
      refreshundeletemask: [],
      source: {},
    },
  };
  get ["calendar.skin.directory"]() { return this.calendar.skin.directory; }
  set ["calendar.skin.directory"](value: string | undefined) { this.calendar.skin.directory = value; }
  get ["calendar.skin.refresh"]() { return this.calendar.skin.refresh; }
  set ["calendar.skin.refresh"](value: NumberBool) { this.calendar.skin.refresh = value; }
  get ["calendar.skin.refreshundeletemask"]() { return this.calendar.skin.refreshundeletemask; }
  set ["calendar.skin.refreshundeletemask"](value: string[]) { this.calendar.skin.refreshundeletemask = value; }
  get ["calendar.skin.source.directory"]() { return this.calendar.skin.source.directory; }
  set ["calendar.skin.source.directory"](value: string | undefined) { this.calendar.skin.source.directory = value; }
  get ["calendar.plugin.directory"]() { return this.calendar.plugin.directory; }
  set ["calendar.plugin.directory"](value: string | undefined) { this.calendar.plugin.directory = value; }
  get ["calendar.plugin.refresh"]() { return this.calendar.plugin.refresh; }
  set ["calendar.plugin.refresh"](value: NumberBool) { this.calendar.plugin.refresh = value; }
  get ["calendar.plugin.refreshundeletemask"]() { return this.calendar.plugin.refreshundeletemask; }
  set ["calendar.plugin.refreshundeletemask"](value: string[]) { this.calendar.plugin.refreshundeletemask = value; }
  get ["calendar.plugin.source.directory"]() { return this.calendar.plugin.source.directory; }
  set ["calendar.plugin.source.directory"](value: string | undefined) { this.calendar.plugin.source.directory = value; }
  child(type: UkagakaContainerChildType) {
    switch (type) {
      case "balloon": return this.balloon;
      case "headline": return this.headline;
      case "plugin": return this.plugin;
      case "calendar.skin": return this.calendar.skin;
      case "calendar.plugin": return this.calendar.plugin;
      default: throw new Error("unknown type");
    }
  }
}

/** "descript.txt" の内容 */
export class UkagakaDescriptInfo {
  static parse(data: string | Buffer, type: "ghost"): UkagakaDescriptInfo.Ghost;
  static parse(data: string | Buffer, type: "balloon"): UkagakaDescriptInfo.Balloon;
  static parse(data: string | Buffer, type: "shell"): UkagakaDescriptInfo.Shell;
  static parse(data: string | Buffer, type: "plugin"): UkagakaDescriptInfo.Plugin;
  static parse(data: string | Buffer, type: "headline"): UkagakaDescriptInfo.Headline;
  static parse(data: string | Buffer, type: "calendar.skin"): UkagakaDescriptInfo.CalendarSkin;
  static parse(data: string | Buffer, type: "calendar.plugin"): UkagakaDescriptInfo.CalendarPlugin;
  static parse(data: string | Buffer): UkagakaDescriptInfo;
  static parse(data: string | Buffer, type?: UkagakaContainerStandaloneType) {
    if (data instanceof Buffer) data = UkagakaDescriptInfo._bufferToString(data);
    const lines = data.split(/\r\n|\n|\r/).filter((line) => /^\s*$/.test(line));
    let info: UkagakaDescriptInfo;
    switch (type) {
      case "ghost": info = new UkagakaDescriptInfo.Ghost(); break;
      case "shell": info = new UkagakaDescriptInfo.Shell(); break;
      case "balloon": info = new UkagakaDescriptInfo.Balloon(); break;
      case "plugin": info = new UkagakaDescriptInfo.Plugin(); break;
      case "headline": info = new UkagakaDescriptInfo.Headline(); break;
      case "calendar.skin": info = new UkagakaDescriptInfo.CalendarSkin(); break;
      case "calendar.plugin": info = new UkagakaDescriptInfo.CalendarPlugin(); break;
      case undefined: info = new UkagakaDescriptInfo(); break;
      default: throw new Error("unknown type");
    }
    for (const line of lines) {
      const match = line.match(/\s*^([^,]+)\s*,\s*(.*?)\s*$/);
      if (match) {
        const key = match[1];
        const value = match[2];
        switch (key) {
          case "install.accept":
            info[key] = value.split(/,/);
            break;
          case "balloon.dontmove":
            info[key] = value === "true";
            break;
          default:
            info[key] = value;
            break;
        }
      }
    }
    return info;
  }

  static _bufferToString(data: Buffer) {
    return data.toString(); // TODO encoding
  }

  [property: string]: any;
  charset?: string;
  name: string;
  homeurl?: string;
  readme: string = "readme.txt";
}

export namespace UkagakaDescriptInfo {
  /** ベースクラス */
  export class Common extends UkagakaDescriptInfo {
    id: string;
    type: UkagakaContainerType;
    craftman?: string;
    craftmanw?: string;
    craftmanurl?: string;
  }

  export class Ghost extends Common {
    title?: string;
    sakura: GhostCharacterSakura = {
      name: "",
      seriko: {
        defaultsurface: 0,
      },
    };
    get ["sakura.name"]() { return this.sakura.name; }
    set ["sakura.name"](value: string) { this.sakura.name = value; }
    get ["sakura.name2"]() { return this.sakura.name2; }
    set ["sakura.name2"](value: string | undefined) { this.sakura.name2 = value; }
    get ["sakura.seriko.defaultsurface"]() { return this.sakura.seriko.defaultsurface; }
    set ["sakura.seriko.defaultsurface"](value: number | undefined) { this.sakura.seriko.defaultsurface = value; }
    get ["sakura.defaultx"]() { return this.sakura.defaultx; }
    set ["sakura.defaultx"](value: number | undefined) { this.sakura.defaultx = value; }
    get ["sakura.defaulty"]() { return this.sakura.defaulty; }
    set ["sakura.defaulty"](value: number | undefined) { this.sakura.defaulty = value; }
    get ["sakura.defaultleft"]() { return this.sakura.defaultleft; }
    set ["sakura.defaultleft"](value: number | undefined) { this.sakura.defaultleft = value; }
    get ["sakura.defaulttop"]() { return this.sakura.defaulttop; }
    set ["sakura.defaulttop"](value: number | undefined) { this.sakura.defaulttop = value; }
    kero: GhostCharacter = {
      seriko: {
        defaultsurface: 10,
      },
    };
    get ["kero.name"]() { return this.kero.name; }
    set ["kero.name"](value: string | undefined) { this.kero.name = value; }
    get ["kero.seriko.defaultsurface"]() { return this.kero.seriko.defaultsurface; }
    set ["kero.seriko.defaultsurface"](value: number | undefined) { this.kero.seriko.defaultsurface = value; }
    get ["kero.defaultx"]() { return this.kero.defaultx; }
    set ["kero.defaultx"](value: number | undefined) { this.kero.defaultx = value; }
    get ["kero.defaulty"]() { return this.kero.defaulty; }
    set ["kero.defaulty"](value: number | undefined) { this.kero.defaulty = value; }
    get ["kero.defaultleft"]() { return this.kero.defaultleft; }
    set ["kero.defaultleft"](value: number | undefined) { this.kero.defaultleft = value; }
    get ["kero.defaulttop"]() { return this.kero.defaulttop; }
    set ["kero.defaulttop"](value: number | undefined) { this.kero.defaulttop = value; }
    seriko: GhostSerikoSetting = {
      alignmenttodesktop: "bottom",
    };
    get ["seriko.alignmenttodesktop"]() { return this.seriko.alignmenttodesktop; }
    set ["seriko.alignmenttodesktop"](value: SerikoSurfacePosition | undefined) {
      this.seriko.alignmenttodesktop = value;
    }
    sstp: {
      allowunspecifiedsend: NumberBool;
      allowcommunicate: NumberBool;
      alwaystranslate: NumberBool;
    } = {
      allowunspecifiedsend: 1,
      allowcommunicate: 1,
      alwaystranslate: 0,
    };
    get ["sstp.allowunspecifiedsend"]() { return this.sstp.allowunspecifiedsend; }
    set ["sstp.allowunspecifiedsend"](value: NumberBool) { this.sstp.allowunspecifiedsend = value; }
    get ["sstp.allowcommunicate"]() { return this.sstp.allowcommunicate; }
    set ["sstp.allowcommunicate"](value: NumberBool) { this.sstp.allowcommunicate = value; }
    get ["sstp.alwaystranslate"]() { return this.sstp.alwaystranslate; }
    set ["sstp.alwaystranslate"](value: NumberBool) { this.sstp.alwaystranslate = value; }
    _name: {
      allowoverride: NumberBool,
    } = {allowoverride: 1};
    get ["name.allowoverride"]() { return this._name.allowoverride; }
    set ["name.allowoverride"](value: NumberBool) { this._name.allowoverride = value; }
    shiori: string = "shiori.dll";
    _shiori: {
      version?: string;
      cache: NumberBool;
      encoding?: string;
      logo: {
        file?: string;
        x: number;
        y: number;
        align: ShioriLogoAlign;
      }
    } = {
      cache: 1,
      logo: {
        x: 0,
        y: 0,
        align: "lefttop",
      },
    };
    get ["shiori.version"]() { return this._shiori.version; }
    set ["shiori.version"](value: string | undefined) { this._shiori.version = value; }
    get ["shiori.cache"]() { return this._shiori.cache; }
    set ["shiori.cache"](value: NumberBool) { this._shiori.cache = value; }
    get ["shiori.encoding"]() { return this._shiori.encoding; }
    set ["shiori.encoding"](value: string | undefined) { this._shiori.encoding = value; }
    get ["shiori.logo.file"]() { return this._shiori.logo.file; }
    set ["shiori.logo.file"](value: string | undefined) { this._shiori.logo.file = value; }
    get ["shiori.logo.x"]() { return this._shiori.logo.x; }
    set ["shiori.logo.x"](value: number) { this._shiori.logo.x = value; }
    get ["shiori.logo.y"]() { return this._shiori.logo.y; }
    set ["shiori.logo.y"](value: number) { this._shiori.logo.y = value; }
    get ["shiori.logo.align"]() { return this._shiori.logo.align; }
    set ["shiori.logo.align"](value: ShioriLogoAlign) { this._shiori.logo.align = value; }
    ["don't need onmousemove"]: NumberBool = 0;
    ["don't need bind"]: NumberBool = 0;
    ["don't need seriko talk"]: NumberBool = 0;
    balloon?: string;
    _balloon: {
      dontmove: boolean;
    } = {dontmove: false};
    get ["balloon.dontmove"]() { return this._balloon.dontmove; }
    set ["balloon.dontmove"](value: boolean) { this._balloon.dontmove = value; }
    default: {
      balloon: {
        path?: string;
      };
    } = {balloon: {}};
    get ["default.balloon.path"]() { return this.default.balloon.path; }
    set ["default.balloon.path"](value: string | undefined) { this.default.balloon.path = value; }
    icon?: string;
    _icon: {
      minimize?: string;
    } = {};
    get ["icon.minimize"]() { return this._icon.minimize; }
    set ["icon.minimize"](value: string | undefined) { this._icon.minimize = value; }
    cursor: Cursor = "pointer";
    install: {
      accept: string[];
    } = {accept: []};
    get ["install.accept"]() { return this.install.accept; }
    set ["install.accept"](value: string[]) { this.install.accept = value; }
  }

  export class GhostCharacter {
    name?: string;
    seriko: GhostCharacterSerikoSetting;
    defaultx?: number;
    defaulty?: number;
    defaultleft?: number;
    defaulttop?: number;
  };

  export class GhostCharacterSakura extends GhostCharacter {
    name: string;
    name2?: string;
  }

  export class GhostSerikoSetting {
    alignmenttodesktop?: SerikoSurfacePosition;
  };
  export class GhostCharacterSerikoSetting extends GhostSerikoSetting {
    defaultsurface?: number;
  };

  export type SerikoSurfacePosition = "top" | "bottom" | "free";

  export type ShioriLogoAlign = "lefttop" | "leftbottom" | "righttop" | "rightbottom";

  export type Cursor = "pointer";

  export class Shell extends Common {
  }

  export class Balloon extends Common {
  }

  export class Plugin extends Common {
    filename: string;
    secondchangeinterval: number = 1;
  }

  export class Headline extends UkagakaDescriptInfo {
    dllname: string;
    url: string;
    openurl: string;
    alwaysdisplay: NumberBool = 0;
  }

  export class CalendarSkin extends UkagakaDescriptInfo {
  }

  export class CalendarPlugin extends UkagakaDescriptInfo {
    dllname: string;
  }
}
