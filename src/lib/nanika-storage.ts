/** 伺かに必要なストレージ操作を扱うディレクトリオブジェクト */

/** -- */ // doc comment が後にないとtypedocによってmoduleの情報が出力されないので

import {FileSystemObject} from "fso";

import {
  NanikaBaseDirectory,
  NanikaContainerDirectory,
  HasNanikaContainerInfoDirectory,
} from "./nanika-container-directory";
import {
  UkagakaInstallInfo,
  UkagakaDescriptInfo,
  UkagakaContainerType,
  UkagakaContainerChildType,
  UkagakaContainerChildTypes,
  UkagakaContainerStandaloneType,
} from "./ukagaka-install-descript";

/** インストール結果 */
export type NanikaStorageInstallResult = {
  /** インストール先のディレクトリ名 */
  directory: string,
  /** 種類 */
  type: UkagakaContainerType
};

/** 伺かベースウェアのルートディレクトリオブジェクト */
export class NanikaStorage extends NanikaBaseDirectory {
  private static async _filterRemove(target: FileSystemObject, exceptPaths: string[]) {
    const toRemoveChildren = await target.filteredChildrenAll(exceptPaths);
    for (const child of toRemoveChildren.reverse()) {
      if (await child.isDirectory()) {
        await (<FileSystemObject> child).rmdir();
      } else {
        await (<FileSystemObject> child).unlink();
      }
    }
  }

  private static async _mergeInstallDirectory( // sourceをFileSystemObjectに変換するための苦肉の策
    source: HasNanikaContainerInfoDirectory | FileSystemObject, target: FileSystemObject, install: UkagakaInstallInfo
  ) {
    if (install.refresh) {
      if (install.refreshundeletemask) {
        await NanikaStorage._filterRemove(target, install.refreshundeletemask);
      } else {
        await target.rmAll();
      }
    }
    const childSourceDirectories: string[] = [];
    if (install.type === "ghost" || install.type === "shell") {
      for (const type of UkagakaContainerChildTypes) {
        const childDirectory = install.child(type).directory;
        if (childDirectory) {
          childSourceDirectories.push(install.child(type).source.directory || childDirectory);
        }
      }
    }
    await target.filteredMergeDirectory(<FileSystemObject> source, childSourceDirectories);
  }

  /**
   * @param paths ベースウェアのホームディレクトリ
   */
  constructor(...paths: string[]) {
    super(...paths);
  }

  /** profile のファイルパス */
  profile() {
    return this.new("profile/base.profile.json");
  }

  /**
   * "/ghost" ディレクトリ
   */
  ghostBase() { return this.new("ghost"); }

  /**
   * "/balloon" ディレクトリ
   */
  balloonBase() { return this.new("balloon"); }

  /**
   * "/ghost/(ghostId)/shell" ディレクトリ
   * @param dirpath ghost ディレクトリ名
   */
  shellBase(dirpath: string) { return this.ghost(dirpath).new("shell"); }

  /**
   * "/plugin" ディレクトリ
   */
  pluginBase() { return this.new("plugin"); }

  /**
   * "/headline" ディレクトリ
   */
  headlineBase() { return this.new("headline"); }

  /**
   * "/calendar/skin" ディレクトリ
   */
  calendarSkinBase() { return this.new("calendar/skin"); }

  /**
   * "/calendar/plugin" ディレクトリ
   */
  calendarPluginBase() { return this.new("calendar/plugin"); }

  /**
   * "/ghost/(ghostId)" ディレクトリ
   * @param dirpath ghost ディレクトリ名
   */
  ghost(dirpath: string) { return new NanikaGhostDirectory(this.ghostBase().toString(), dirpath); }

  /**
   * "/balloon/(balloonId)" ディレクトリ
   * @param dirpath balloon ディレクトリ名
   */
  balloon(dirpath: string) { return new NanikaBalloonDirectory(this.balloonBase().toString(), dirpath); }

  /**
   * "/ghost/(ghostId)/ghost/master" ディレクトリ
   * @param dirpath ghost ディレクトリ名
   */
  ghostMaster(dirpath: string) {
    return new NanikaGhostMasterDirectory(this.ghost(dirpath).toString(), "ghost/master");
  }

  /**
   * "/ghost/(ghostId)/shell/(shellId)" ディレクトリ
   * @param dirpath ghost ディレクトリ名
   * @param shellpath shell ディレクトリ名
   */
  shell(dirpath: string, shellpath: string) {
    return new NanikaShellDirectory(this.ghost(dirpath).toString(), "shell", shellpath);
  }

  /**
   * "/plugin/(pluginId)" ディレクトリ
   * @param dirpath plugin ディレクトリ名
   */
  plugin(dirpath: string) { return new NanikaPluginDirectory(this.pluginBase().toString(), dirpath); }

  /**
   * "/headline/(headlineId)" ディレクトリ
   * @param dirpath headline ディレクトリ名
   */
  headline(dirpath: string) { return new NanikaHeadlineDirectory(this.headlineBase().toString(), dirpath); }

  /**
   * "/calendar/skin/(calendarSkinId)" ディレクトリ
   * @param dirpath calendar skin ディレクトリ名
   */
  calendarSkin(dirpath: string) { return new NanikaCalendarSkinDirectory(this.calendarSkinBase().toString(), dirpath); }

  /**
   * "/calendar/plugin/(calendarPluginId)" ディレクトリ
   * @param dirpath calendar plugin ディレクトリ名
   */
  calendarPlugin(dirpath: string) {
    return new NanikaCalendarPluginDirectory(this.calendarPluginBase().toString(), dirpath);
  }

  /**
   * ghost ディレクトリ全部
   */
  async ghosts() {
    return (await this.ghostBase().filteredChildren(async (child) => await child.isDirectory()))
      .map((child) => new NanikaGhostDirectory(child.toString()));
  }

  /**
   * balloon ディレクトリ全部
   */
  async balloons() {
    return (await this.balloonBase().filteredChildren(async (child) => await child.isDirectory()))
      .map((child) => new NanikaBalloonDirectory(child.toString()));
  }

  /**
   * shell ディレクトリ全部
   * @param dirpath ghost ディレクトリ名
   */
  async shells(dirpath: string) {
    return (await this.shellBase(dirpath).filteredChildren(async (child) => await child.isDirectory()))
      .map((child) => new NanikaShellDirectory(child.toString()));
  }

  /**
   * plugin ディレクトリ全部
   */
  async plugins() {
    return (await this.pluginBase().filteredChildren(async (child) => await child.isDirectory()))
      .map((child) => new NanikaPluginDirectory(child.toString()));
  }

  /**
   * headline ディレクトリ全部
   */
  async headlines() {
    return (await this.headlineBase().filteredChildren(async (child) => await child.isDirectory()))
      .map((child) => new NanikaHeadlineDirectory(child.toString()));
  }

  /**
   * calendar skin ディレクトリ全部
   */
  async calendarSkins() {
    return (await this.calendarSkinBase().filteredChildren(async (child) => await child.isDirectory()))
      .map((child) => new NanikaCalendarSkinDirectory(child.toString()));
  }

  /**
   * calendar plugin ディレクトリ全部
   */
  async calendarPlugins() {
    return (await this.calendarPluginBase().filteredChildren(async (child) => await child.isDirectory()))
      .map((child) => new NanikaCalendarPluginDirectory(child.toString()));
  }

  /** ゴースト名全部 */
  async ghostNames() {
    return Promise.all((await this.ghosts()).map((child) => child.name()));
  }

  /** バルーン名全部 */
  async balloonNames() {
    return Promise.all((await this.balloons()).map((child) => child.name()));
  }

  /**
   * シェル名全部
   * @param dirpath ghost ディレクトリ名
   */
  async shellNames(dirpath: string) {
    return Promise.all((await this.shells(dirpath)).map((child) => child.name()));
  }

  /** プラグイン名全部 */
  async pluginNames() {
    return Promise.all((await this.plugins()).map((child) => child.name()));
  }

  /** ヘッドライン名全部 */
  async headlineNames() {
    return Promise.all((await this.headlines()).map((child) => child.name()));
  }

  /** カレンダースキン名全部 */
  async calendarSkinNames() {
    return Promise.all((await this.calendarSkins()).map((child) => child.name()));
  }

  /** カレンダープラグイン名全部 */
  async calendarPluginNames() {
    return Promise.all((await this.calendarPlugins()).map((child) => child.name()));
  }

  /**
   * ゴースト名
   * @param dirpath ghost ディレクトリ名
   */
  async ghostName(dirpath: string) {
    return (await this.ghost(dirpath)).name();
  }

  /**
   * バルーン名
   * @param dirpath balloon ディレクトリ名
   */
  async balloonName(dirpath: string) {
    return (await this.balloon(dirpath)).name();
  }

  /**
   * シェル名
   * @param dirpath ghost ディレクトリ名
   * @param shellpath shell ディレクトリ名
   */
  async shellName(dirpath: string, shellpath: string) {
    return (await this.shell(dirpath, shellpath)).name();
  }

  /**
   * プラグイン名
   * @param dirpath plugin ディレクトリ名
   */
  async pluginName(dirpath: string) {
    return (await this.plugin(dirpath)).name();
  }

  /**
   * ヘッドライン名
   * @param dirpath headline ディレクトリ名
   */
  async headlineName(dirpath: string) {
    return (await this.headline(dirpath)).name();
  }

  /**
   * カレンダースキン名
   * @param dirpath calendar skin ディレクトリ名
   */
  async calendarSkinName(dirpath: string) {
    return (await this.calendarSkin(dirpath)).name();
  }

  /**
   * カレンダープラグイン名
   * @param dirpath calendar plugin ディレクトリ名
   */
  async calendarPluginName(dirpath: string) {
    return (await this.calendarPlugin(dirpath)).name();
  }

  /**
   * アンインストールします
   * @param type 種類
   * @param dirpath ゴーストのディレクトリ名
   */
  async uninstall(type: "ghost", dirpath: string): Promise<void>;
  /**
   * アンインストールします
   * @param type 種類
   * @param dirpath バルーンのディレクトリ名
   */
  async uninstall(type: "balloon", dirpath: string): Promise<void>;
  /**
   * アンインストールします
   * @param type 種類
   * @param dirpath ゴーストのディレクトリ名
   * @param shellpath シェルのディレクトリ名
   */
  async uninstall(type: "shell", dirpath: string, shellpath: string): Promise<void>;
  /**
   * アンインストールします
   * @param type 種類
   * @param dirpath プラグインのディレクトリ名
   */
  async uninstall(type: "plugin", dirpath: string): Promise<void>;
  /**
   * アンインストールします
   * @param type 種類
   * @param dirpath ヘッドラインのディレクトリ名
   */
  async uninstall(type: "headline", dirpath: string): Promise<void>;
  /**
   * アンインストールします
   * @param type 種類
   * @param dirpath カレンダースキンのディレクトリ名
   */
  async uninstall(type: "calendar.skin", dirpath: string): Promise<void>;
  /**
   * アンインストールします
   * @param type 種類
   * @param dirpath カレンダープラグインのディレクトリ名
   */
  async uninstall(type: "calendar.plugin", dirpath: string): Promise<void>;
  async uninstall(type: UkagakaContainerStandaloneType, dirpath: string, shellpath?: string) {
    switch (type) {
      case "ghost": await this.ghost(dirpath).rmAll(); break;
      case "balloon": await this.balloon(dirpath).rmAll(); break;
      case "shell": await this.shell(dirpath, <string> shellpath).rmAll(); break;
      case "plugin": await this.plugin(dirpath).rmAll(); break;
      case "headline": await this.headline(dirpath).rmAll(); break;
      case "calendar.skin": await this.calendarSkin(dirpath).rmAll(); break;
      case "calendar.plugin": await this.calendarPlugin(dirpath).rmAll(); break;
    }
  }

  /**
   * インストールします
   * @param nar インストール元
   * @param dirpath ゴーストのディレクトリ名
   * @param sakuraname インストールを受け付けたゴーストのさくら側名
   */
  async install(nar: HasNanikaContainerInfoDirectory, dirpath: string | undefined, sakuraname: string | undefined) {
    const install = await nar.installInfo();
    if (install.accept != null && install.accept !== sakuraname) return [];
    switch (install.type) {
      case "ghost":
        return await this._installGhost(nar, install);
      case "shell":
        if (!dirpath) throw new Error("dirpath required");
        return await this._installShell(nar, install, dirpath);
      case "balloon":
        return await this._installBalloon(nar, install);
      case "plugin":
        return await this._installPlugin(nar, install);
      case "headline":
        return await this._installHeadline(nar, install);
      case "calendar.skin":
        return await this._installCalendarSkin(nar, install);
      case "calendar.plugin":
        return await this._installCalendarPlugin(nar, install);
      case "supplement":
        return await this._installSupplement(nar, install);
      case "package":
        return await this._installPackage(nar, dirpath, sakuraname);
      default:
        throw new Error("unknown type");
    }
  }

  private async _installChild(nar: HasNanikaContainerInfoDirectory, install: UkagakaInstallInfo) {
    switch (<UkagakaContainerChildType> install.type) {
      case "balloon":
        return await this._installBalloon(nar, install);
      case "plugin":
        return await this._installPlugin(nar, install);
      case "headline":
        return await this._installHeadline(nar, install);
      case "calendar.skin":
        return await this._installCalendarSkin(nar, install);
      case "calendar.plugin":
        return await this._installCalendarPlugin(nar, install);
      default:
        throw new Error("unknown type");
    }
  }

  private async _installGhost(nar: HasNanikaContainerInfoDirectory, install: UkagakaInstallInfo) {
    if (!install.directory) throw new Error("install.txt directory entry required");
    const targetDirectory = install.directory;
    const target = this.ghost(targetDirectory);
    await NanikaStorage._mergeInstallDirectory(nar, target, install);
    const childInstallResults = await this._installChildren(nar, install);
    return <NanikaStorageInstallResult[]> [{directory: targetDirectory, type: "ghost"}].concat(childInstallResults);
  }

  private async _installShell(nar: HasNanikaContainerInfoDirectory, install: UkagakaInstallInfo, dirpath: string) {
    if (!install.directory) throw new Error("install.txt directory entry required");
    const targetDirectory = install.directory;
    const target = this.shell(dirpath, targetDirectory);
    await NanikaStorage._mergeInstallDirectory(nar, target, install);
    const childInstallResults = await this._installChildren(nar, install);
    return <NanikaStorageInstallResult[]> [{directory: targetDirectory, type: "shell"}].concat(childInstallResults);
  }

  private async _installBalloon(nar: HasNanikaContainerInfoDirectory, install: UkagakaInstallInfo) {
    return await this._installSingleContainer(nar, install, "balloon", this.balloon(install.directory));
  }

  private async _installPlugin(nar: HasNanikaContainerInfoDirectory, install: UkagakaInstallInfo) {
    return await this._installSingleContainer(nar, install, "plugin", this.plugin(install.directory));
  }

  private async _installHeadline(nar: HasNanikaContainerInfoDirectory, install: UkagakaInstallInfo) {
    return await this._installSingleContainer(nar, install, "headline", this.headline(install.directory));
  }

  private async _installCalendarSkin(nar: HasNanikaContainerInfoDirectory, install: UkagakaInstallInfo) {
    return await this._installSingleContainer(nar, install, "calendar.skin", this.calendarSkin(install.directory));
  }

  private async _installCalendarPlugin(nar: HasNanikaContainerInfoDirectory, install: UkagakaInstallInfo) {
    return await this._installSingleContainer(nar, install, "calendar.plugin", this.calendarPlugin(install.directory));
  }

  private async _installSupplement(nar: HasNanikaContainerInfoDirectory, install: UkagakaInstallInfo) {
    return await this._installSingleContainer(nar, install, "supplement", this.ghost(install.directory));
  }

  private async _installSingleContainer(
    nar: HasNanikaContainerInfoDirectory,
    install: UkagakaInstallInfo,
    type: UkagakaContainerChildType | "supplement",
    target: FileSystemObject,
  ) {
    if (!install.directory) throw new Error("install.txt directory entry required");
    const targetDirectory = install.directory;
    await NanikaStorage._mergeInstallDirectory(nar, target, install);
    return <NanikaStorageInstallResult[]> [{directory: targetDirectory, type}];
  }

  private async _installPackage(
    nar: HasNanikaContainerInfoDirectory,
    dirpath: string | undefined,
    sakuraname: string | undefined,
  ) {
    let installResults: NanikaStorageInstallResult[] = [];
    for (const child of await nar.children()) {
      if (child.isDirectory()) {
        installResults = installResults.concat(
          await this.install(<HasNanikaContainerInfoDirectory> child, dirpath, sakuraname)
        );
      }
    }
    return installResults;
  }

  private async _installChildren(nar: HasNanikaContainerInfoDirectory, install: UkagakaInstallInfo) {
    let installResults: NanikaStorageInstallResult[] = [];
    for (const type of UkagakaContainerChildTypes) {
      const childDirectory = install.child(type).directory;
      // *.directory,dir がある場合は同時に別の種類の物をインストールする
      if (childDirectory) {
        // 同時インストール物のソースディレクトリが展開後ディレクトリと別名の場合
        // *.source.directory,dirを使う
        // そうでなければソースディレクトリは展開後ディレクトリ*.directory,dirと同名として扱う
        const childSourceDirectory = install.child(type).source.directory || childDirectory;
        const childNar = <HasNanikaContainerInfoDirectory> nar.new(childSourceDirectory);
        const childInstall = new UkagakaInstallInfo();
        childInstall.type = type;
        childInstall.directory = childDirectory;
        childInstall.refresh = install.child(type).refresh;
        childInstall.refreshundeletemask = install.child(type).refreshundeletemask;
        const childInstallResults = await this._installChild(childNar, childInstall);
        installResults = installResults.concat(childInstallResults);
      }
    }
    return installResults;
  }
}

export class NanikaGhostDirectory extends NanikaContainerDirectory {
  /** "/ghost/master" ディレクトリ */
  master() {
    return new NanikaGhostMasterDirectory(this.toString(), "ghost/master");
  }

  /** profile のファイルパス */
  profile() {
    return this.master().profile();
  }

  /** "descript.txt" の内容 */
  descriptInfo(): Promise<UkagakaDescriptInfo.Ghost> { // UkagakaDescriptInfoをimportしないとエラーかつ書かないとエラーなので
    return super.descriptInfoByType("ghost");
  }
}

export class NanikaGhostMasterDirectory extends NanikaContainerDirectory {
  /** profile のファイルパス */
  profile() {
    return this.new("profile/ghost.profile.json");
  }

  /** "descript.txt" の内容 */
  descriptInfo() {
    return super.descriptInfoByType("ghost");
  }
}

export class NanikaBalloonDirectory extends NanikaContainerDirectory {
  /** profile のファイルパス */
  profile() {
    return this.new("profile/balloon.profile.json");
  }

  /** "descript.txt" の内容 */
  descriptInfo() {
    return super.descriptInfoByType("balloon");
  }
}

export class NanikaShellDirectory extends NanikaContainerDirectory {
  /** profile のファイルパス */
  profile() {
    return this.new("profile/shell.profile.json");
  }

  /** "descript.txt" の内容 */
  descriptInfo() {
    return super.descriptInfoByType("shell");
  }
}

export class NanikaPluginDirectory extends NanikaContainerDirectory {
  /** profile のファイルパス */
  profile() {
    return this.new("profile/plugin.profile.json");
  }

  /** "descript.txt" の内容 */
  descriptInfo() {
    return super.descriptInfoByType("plugin");
  }
}

export class NanikaHeadlineDirectory extends NanikaContainerDirectory {
  /** profile のファイルパス */
  profile() {
    return this.new("profile/headline.profile.json");
  }

  /** "descript.txt" の内容 */
  descriptInfo() {
    return super.descriptInfoByType("headline");
  }
}

export class NanikaCalendarSkinDirectory extends NanikaContainerDirectory {
  /** profile のファイルパス */
  profile() {
    return this.new("profile/calendar.skin.profile.json");
  }

  /** "descript.txt" の内容 */
  descriptInfo() {
    return super.descriptInfoByType("calendar.skin");
  }
}

export class NanikaCalendarPluginDirectory extends NanikaContainerDirectory {
  /** profile のファイルパス */
  profile() {
    return this.new("profile/calendar.plugin.profile.json");
  }

  /** "descript.txt" の内容 */
  descriptInfo() {
    return super.descriptInfoByType("calendar.plugin");
  }
}
