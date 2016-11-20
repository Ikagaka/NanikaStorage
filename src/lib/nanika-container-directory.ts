/** 伺かのコンテナを扱うディレクトリオブジェクト */

/** -- */ // doc comment が後にないとtypedocによってmoduleの情報が出力されないので

import * as fs from "fs";
import {FileSystemObject} from "fso";
import * as path from "path";
import {UkagakaInstallInfo, UkagakaDescriptInfo, UkagakaContainerStandaloneType} from "./ukagaka-install-descript";

/** the profile */
export type Profile = {[key: string]: any};
/** directory object which provides -Sync APIs */
export type NanikaStorageSyncEntry = NanikaContainerSyncFile | NanikaContainerSyncDirectory;

/** コンテナ(ghost, balloon等)の情報を取得できるディレクトリオブジェクト */
export interface HasNanikaContainerInfoDirectory {
  toString(): string;
  ["new"](...paths: string[]): FileSystemObject | NanikaStorageSyncEntry;
  children(): Promise<(FileSystemObject | NanikaStorageSyncEntry)[]>;
  childrenAll(): Promise<(FileSystemObject | NanikaStorageSyncEntry)[]>;
  /** "install.txt" の内容 */
  installInfo(): Promise<UkagakaInstallInfo>;
  /**
   * "descript.txt" の内容
   * @param type コンテナの種類
   */
  descriptInfoByType(type: "ghost"): Promise<UkagakaDescriptInfo.Ghost>;
  /**
   * "descript.txt" の内容
   * @param type コンテナの種類
   */
  descriptInfoByType(type: "shell"): Promise<UkagakaDescriptInfo.Shell>;
  /**
   * "descript.txt" の内容
   * @param type コンテナの種類
   */
  descriptInfoByType(type: "balloon"): Promise<UkagakaDescriptInfo.Balloon>;
  /**
   * "descript.txt" の内容
   * @param type コンテナの種類
   */
  descriptInfoByType(type: "plugin"): Promise<UkagakaDescriptInfo.Plugin>;
  /**
   * "descript.txt" の内容
   * @param type コンテナの種類
   */
  descriptInfoByType(type: "headline"): Promise<UkagakaDescriptInfo.Headline>;
  /**
   * "descript.txt" の内容
   * @param type コンテナの種類
   */
  descriptInfoByType(type: "calendar.skin"): Promise<UkagakaDescriptInfo.CalendarSkin>;
  /**
   * "descript.txt" の内容
   * @param type コンテナの種類
   */
  descriptInfoByType(type: "calendar.plugin"): Promise<UkagakaDescriptInfo.CalendarPlugin>;
  /**
   * "descript.txt" の内容
   */
  descriptInfo(): Promise<UkagakaDescriptInfo>;
  relative(to: string | FileSystemObject): FileSystemObject;
  /**
   * 全ての子要素のstatsと内容をキャッシュした -Sync API を提供する新しいオブジェクトを生成する。
   * make new directory object which provides -Sync APIs by cache all children's stats and contents.
   */
  toCached(): Promise<NanikaContainerSyncDirectory>;
}

/** profile を読み込めるディレクトリオブジェクトのベースクラス */
export abstract class NanikaBaseDirectory extends FileSystemObject {
  /** profile のファイルパス */
  abstract profile(): FileSystemObject;

  /**
   * profile を書き込む
   * @param profile profile
   */
  async writeProfile(profile: Profile) {
    const target = this.profile();
    await target.parent().mkdirAll();
    await target.writeFile(JSON.stringify(profile), {encoding: "utf8"});
  }

  /**
   * profile を読み込む
   */
  async readProfile() {
    let data: string;
    try {
      data = await this.profile().readFile({encoding: "utf8"});
    } catch (error) {
      return {};
    }
    return data.length ? <Profile> JSON.parse(data) : <Profile> {};
  }

  /**
   * 全ての子要素のstatsと内容をキャッシュした -Sync API を提供する新しいオブジェクトを生成する。
   * make new directory object which provides -Sync APIs by cache all children's stats and contents.
   */
  async toCached() {
    const children = await this.childrenAll();
    const contents =
      await Promise.all(children.map(async (child) =>
        child.isDirectory() ? undefined : child.readFile()
      ));
    const stats = await Promise.all(children.map((child) => child.stat()));
    return new NanikaContainerSyncDirectory(
      this.path,
      children.map((child, index) =>
        new NanikaContainerSyncFile(child.path, contents[index], stats[index])
      )
    );
  }
}

/**
 * コンテナ(ghost, balloon等)のルートディレクトリオブジェクト
 *
 * some container(like ghost, balloon or some)'s root directory object
 */
export abstract class NanikaContainerDirectory extends NanikaBaseDirectory implements HasNanikaContainerInfoDirectory {
  /** "install.txt" のファイルパス */
  installTxt() { return this.new("install.txt"); }

  /** "descript.txt" のファイルパス */
  descriptTxt() { return this.new("descript.txt"); }

  /** "install.txt" の内容 */
  async installInfo() {
    return UkagakaInstallInfo.parse(
      await this.installTxt().readFile()
    );
  }

  /**
   * "descript.txt" の内容
   * @param type コンテナの種類
   */
  async descriptInfoByType(type: "ghost"): Promise<UkagakaDescriptInfo.Ghost>;
  /**
   * "descript.txt" の内容
   * @param type コンテナの種類
   */
  async descriptInfoByType(type: "balloon"): Promise<UkagakaDescriptInfo.Balloon>;
  /**
   * "descript.txt" の内容
   * @param type コンテナの種類
   */
  async descriptInfoByType(type: "shell"): Promise<UkagakaDescriptInfo.Shell>;
  /**
   * "descript.txt" の内容
   * @param type コンテナの種類
   */
  async descriptInfoByType(type: "plugin"): Promise<UkagakaDescriptInfo.Plugin>;
  /**
   * "descript.txt" の内容
   * @param type コンテナの種類
   */
  async descriptInfoByType(type: "headline"): Promise<UkagakaDescriptInfo.Headline>;
  /**
   * "descript.txt" の内容
   * @param type コンテナの種類
   */
  async descriptInfoByType(type: "calendar.skin"): Promise<UkagakaDescriptInfo.CalendarSkin>;
  /**
   * "descript.txt" の内容
   * @param type コンテナの種類
   */
  async descriptInfoByType(type: "calendar.plugin"): Promise<UkagakaDescriptInfo.CalendarPlugin>;
  async descriptInfoByType(type: UkagakaContainerStandaloneType) {
    return <UkagakaDescriptInfo> UkagakaDescriptInfo.parse(
      await this.descriptTxt().readFile(),
      <"ghost"> type // TODO: Narazaka: 他に方法あるかな？
    );
  }

  /** "descript.txt" の内容 */
  async descriptInfo() {
    return UkagakaDescriptInfo.parse(
      await this.descriptTxt().readFile()
    );
  }

  /** コンテナ名 */
  async name() {
    return (await this.descriptInfo()).name;
  }
}

const childRe = new RegExp(`^\\.\\.(?:\\${path.sep}\\.\\.)*$`);

/**
 * 全ての子要素のstatsと内容をキャッシュした -Sync API を提供するコンテナ(ghost, balloon等)のルートディレクトリオブジェクト。
 *
 * container root directory object which provides -Sync APIs by cache all children's stats and contents.
 */
export class NanikaContainerSyncDirectory implements HasNanikaContainerInfoDirectory {
  path: string;

  private _childrenCache: NanikaStorageSyncEntry[];
  private _childrenAllCache: NanikaContainerSyncFile[];
  private _indexes: {[path: string]: number} = {};

  /**
   * @param path パス
   * @param childrenAllCache 子要素全てのstatsと内容のキャッシュ
   */
  constructor(path: string, childrenAllCache: NanikaContainerSyncFile[]) {
    this.path = path;
    this._childrenAllCache = childrenAllCache;
    this._makeIndexes();
  }

  toString() {
    return this.path;
  }

  installTxt() {
    return this.new("install.txt");
  }

  descriptTxt() {
    return this.new("descript.txt");
  }

  async isDirectory() { return true; }

  new(...paths: string[]): NanikaStorageSyncEntry {
    const newPath = path.join(this.path, ...paths);
    const index = this._indexes[newPath];
    if (index == null) {
      return new NanikaContainerSyncFile(newPath);
    } else {
      const child = this._childrenAllCache[index];
      if (child.isDirectorySync()) {
        const childChildren = this._childrenAllCache
          .filter((childCache) => childCache.isChildOf(child.toString()));
        return new NanikaContainerSyncDirectory(child.path, childChildren);
      } else {
        return child;
      }
    }
  }

  childrenSync() {
    if (this._childrenCache) return this._childrenCache;
    this._childrenCache = this._childrenAllCache
      .filter((child) => !/[\/\\]/.test(child.toString()))
      .map((child) => child.isDirectorySync() ? this.new(child.basename()) : child);
    return this._childrenCache;
  }

  async children() {
    return this.childrenSync();
  }

  childrenAllSync() {
    return this._childrenAllCache;
  }

  async childrenAll() {
    return this.childrenAllSync();
  }

  async filteredChildrenAll(excepts: string[] | ((child: NanikaContainerSyncFile) => boolean)) {
    return this.filteredChildrenAllSync(excepts);
  }

  filteredChildrenAllSync(excepts: string[] | ((child: NanikaContainerSyncFile) => boolean)) {
    if (!excepts || !excepts.length) return this.childrenAllSync();
    if (excepts instanceof Array) {
      const exceptTargets = excepts.map((exceptPath) => path.join(this.path, exceptPath));
      return (this.childrenAllSync())
        .filter(
          // 子パスは全ての除外パスと(無関係か除外パスの親)=!(子パスはいずれかの除外パス(そのものか除外パスの子))
          // child path is (unrelated to || parent of) all of the except paths
          //   = !(child path is (same as || child of) at least one of the except paths)
          (child) => !exceptTargets.find(
            (exceptTarget) => exceptTarget === child.path || child.isChildOf(exceptTarget)
          )
        );
    } else {
      return (this.childrenAllSync()).filter(excepts);
    }
  }

  relative(to: string | FileSystemObject) {
    return new FileSystemObject(path.relative(this.path, to.toString()));
  }

  isChildOf(to: string | FileSystemObject) {
    return childRe.test(path.relative(this.path, to.toString()));
  }

  async toCached() {
    return this;
  }

  async installInfo() {
    return UkagakaInstallInfo.parse(
      (<NanikaContainerSyncFile> this.installTxt()).readFileSync()
    );
  }

  async descriptInfoByType(type: "ghost"): Promise<UkagakaDescriptInfo.Ghost>;
  async descriptInfoByType(type: "balloon"): Promise<UkagakaDescriptInfo.Balloon>;
  async descriptInfoByType(type: "shell"): Promise<UkagakaDescriptInfo.Shell>;
  async descriptInfoByType(type: "plugin"): Promise<UkagakaDescriptInfo.Plugin>;
  async descriptInfoByType(type: "headline"): Promise<UkagakaDescriptInfo.Headline>;
  async descriptInfoByType(type: "calendar.skin"): Promise<UkagakaDescriptInfo.CalendarSkin>;
  async descriptInfoByType(type: "calendar.plugin"): Promise<UkagakaDescriptInfo.CalendarPlugin>;
  async descriptInfoByType(type: UkagakaContainerStandaloneType) {
    return <UkagakaDescriptInfo> UkagakaDescriptInfo.parse(
      (<NanikaContainerSyncFile> this.descriptTxt()).readFileSync(),
      <"ghost"> type // TODO: Narazaka: 他に方法あるかな？
    );
  }

  async descriptInfo() {
    return <UkagakaDescriptInfo> UkagakaDescriptInfo.parse(
      (<NanikaContainerSyncFile> this.descriptTxt()).readFileSync()
    );
  }

  async name() {
    return (await this.descriptInfo()).name;
  }

  private _makeIndexes() {
    for (let i = 0; i < this._childrenAllCache.length; ++i) {
      this._indexes[this._childrenAllCache[i].path] = i;
    }
  }
}

/**
 * statsと内容をキャッシュした -Sync API を提供するオブジェクト。
 *
 * entry object which provides -Sync APIs by cache all children's stats and contents.
 */
export class NanikaContainerSyncFile {
  path: string;
  private _content: Buffer | null;
  private _stats: fs.Stats | null;

  /**
   * @param path パス
   * @param content 内容のキャッシュ
   * @param stats statsのキャッシュ
   */
  constructor(path: string, content: Buffer | null = null, stats: fs.Stats | null = null) {
    this.path = path;
    this._content = content;
    this._stats = stats;
  }

  toString() {
    return this.path;
  }

  lstatSync() {
    if (this._stats == null) throw new Error("not found");
    return this._stats;
  }
  isFileSync() { return this.lstatSync().isFile(); }
  isDirectorySync() { return this.lstatSync().isDirectory(); }
  isBlockDeviceSync() { return this.lstatSync().isBlockDevice(); }
  isCharacterDeviceSync() { return this.lstatSync().isCharacterDevice(); }
  isSymbolicLinkSync() { return this.lstatSync().isSymbolicLink(); }
  isFIFOSync() { return this.lstatSync().isFIFO(); }
  isSocketSync() { return this.lstatSync().isSocket(); }
  async lstat() {
    return this.lstatSync();
  }
  async isFile() { return this.isFileSync(); }
  async isDirectory() { return this.isDirectorySync(); }
  async isBlockDevice() { return this.isBlockDeviceSync(); }
  async isCharacterDevice() { return this.isCharacterDeviceSync(); }
  async isSymbolicLink() { return this.isSymbolicLinkSync(); }
  async isFIFO() { return this.isFIFOSync(); }
  async isSocket() { return this.isSocketSync(); }

  readFileSync(encoding: string): string;
  readFileSync(options: { encoding: string; flag?: string; }): string;
  readFileSync(options?: { flag?: string; }): Buffer;
  readFileSync(options?: any): string | Buffer {
    if (this._content == null) throw new Error("not found");
    const encoding = options == null ? undefined :
      typeof options === "string" ? options :
      <string | undefined> options.encoding;
    if (encoding) {
      return (<Buffer> this._content).toString(encoding);
    } else {
      return <Buffer> this._content;
    }
  }

  readFile(encoding: string): Promise<string>;
  readFile(options: { encoding: string; flag?: string; }): Promise<string>;
  readFile(options?: { flag?: string; }): Promise<Buffer>;
  async readFile(
    arg: undefined | string | { encoding: string; flag?: string; } | { flag?: string; }
  ): Promise<string | Buffer> {
    return this.readFileSync(arg);
  }

  basename() {
    return path.basename(this.path);
  }

  relative(to: string | {toString(): string}) {
    return new FileSystemObject(path.relative(this.path, to.toString()));
  }

  isChildOf(to: string | FileSystemObject) {
    return childRe.test(path.relative(this.path, to.toString()));
  }
}
