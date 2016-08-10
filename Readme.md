NanikaStorage - Nanika Storage
==========================

NanikaStorageは伺かに必要なストレージを抽象化するモジュールです。

Installation
--------------------------

unstable

Usage
--------------------------

`NanikaStorage`は`NanikaStorage.Backend.*`のフロントエンドです。

まずバックエンドを初期化し、NanikaStorageに渡して初期化します。

Backends
--------------------------

### NanikaStorage.Backend.InMemory

メモリ上に状態を保存します。高速ですが、状態を保存するにはそのための仕組みを別に用意する必要があります。

#### constructor(ghosts={}, balloons={}, profiles={})

    var ghosts = {"ghost_name": g_directory};
    var balloons = {"balloon_name": b_directory};
    var profiles = {
      base: {},
      ghost: {},
      balloon: {}
    };
    var backend = new NanikaStorage.Backend.InMemory(ghosts, balloons, profiles);

全ての引数はオプションです。別に保存していた状態を復元するときなどに使えます。

`backend._ghosts`、`backend._balloons`、`backend._profiles`を保存することで状態を保存できます。

### NanikaStorage.Backend.FS

node.jsのFileSystemの非同期APIと互換のファイルシステムを扱います。他にnode.js互換のPath、Bufferが必要です。

#### constructor(home, fs, path, Buffer)

    var home = "ikagaka";
    var fs = require('fs');
    var path = require('path');
    var Buffer = require('buffer').Buffer;
    var backend = new NanikaStorage.Backend.FS(home, fs, path, Buffer);

homeはファイルシステムの中で扱うルートフォルダを指定します。

現状node.jsと[browserfs](https://github.com/jvilk/BrowserFS)をサポートしています。これらでBufferの実装に違いがある部分は吸収しています。

NanikaStorage API
--------------------------

NanikaStorageは[NanikaDirectory](https://github.com/Ikagaka/NarLoader)を利用します。

### constructor(backend)

    var storage = new NanikaStorage(backend)

バックエンドのインスタンスを渡してnewします。

### ghost(dirpath, directory=undefined, merge=false)

    storage.ghost('akos').then(function(dir){...});
    storage.ghost('akos', dir).then(function(dir){...});

dirpathで指定されたゴーストディレクトリ`baseware/ghost/dirpath/`を読み出し、書き込みします。

引数directoryはNanikaDirectoryです。

引数directoryが指定されれば内容をファイルシステムに書き込みます。
mergeがtrueなら上書き、そうでないなら以前の内容を削除してから書き込みます。

返り値はファイルシステムから読み出したNanikaDirectoryを解決値とするPromiseです。

### balloon(dirpath, directory=undefined, merge=false)

    storage.balloon('origin').then(function(dir){...});
    storage.balloon('origin', dir).then(function(dir){...});

dirpathで指定されたバルーンディレクトリ`baseware/balloon/dirpath/`を読み出し、書き込みします。

他はghost()と同じです。

### ghost_master(dirpath, directory=undefined, merge=false)

    storage.ghost_master('akos').then(function(dir){...});
    storage.ghost_master('akos', dir).then(function(dir){...});

dirpathで指定されたゴーストmasterディレクトリ`baseware/ghost/dirpath/ghost/master/`を読み出し、書き込みします。

他はghost()と同じです。

### shell(dirpath, shellpath, directory=undefined, merge=false)

    var dir = storage.shell('akos', 'master');
    storage.shell('akos', 'master', dir);

    storage.shell('akos', 'master').then(function(dir){...});
    storage.shell('akos', 'master', dir).then(function(dir){...});

dirpathとshellpathで指定されたシェルディレクトリ`baseware/ghost/dirpath/shell/shellpath/`を読み出し、書き込みします。

他はghost()と同じです。

### base_profile(profile=undefined)

ベースウェアのプロファイルを読み出し、書き込みします。

オブジェクトprofileが指定されれば書き込みします。

返り値はオブジェクトを解決値とするPromiseです。

### ghost_profile(dirpath, profile=undefined)

dirpathのゴーストのプロファイルを読み出し、書き込みします。

オブジェクトprofileが指定されれば書き込みします。

返り値はオブジェクトを解決値とするPromiseです。

### balloon_profile(dirpath, profile=undefined)

dirpathのバルーンのプロファイルを読み出し、書き込みします。

オブジェクトprofileが指定されれば書き込みします。

返り値はオブジェクトを解決値とするPromiseです。

### shell_profile(dirpath, shellpath, profile=undefined)

dirpathのゴーストのshellpathのシェルのプロファイルを読み出し、書き込みします。

オブジェクトprofileが指定されれば書き込みします。

返り値はオブジェクトを解決値とするPromiseです。

### ghosts()

ゴーストの全ディレクトリ名(`baseware/ghost/*/`)をリストにして返します。

返り値は`Array`を解決値とするPromiseです。

### balloons()

バルーンの全ディレクトリ名(`baseware/balloon/*/`)をリストにして返します。

返り値は`Array`を解決値とするPromiseです。

### shells(dirpath)

dirpathのゴーストのシェルの全ディレクトリ名(`baseware/ghost/dirpath/shell/*/`)をリストにして返します。

返り値は`Array`を解決値とするPromiseです。

### ghost_names()

全ゴーストのinstall.txtにあるゴースト名をリストにして返します。

返り値は`Array`を解決値とするPromiseです。

### balloon_names()

全バルーンのinstall.txtにあるバルーン名をリストにして返します。

返り値は`Array`を解決値とするPromiseです。

### shell_names(dirpath)

dirpathのゴーストの全シェルのdescript.txtにあるシェル名をリストにして返します。

返り値は`Array`を解決値とするPromiseです。

### ghost_name(dirpath)

dirpathのゴーストのinstall.txtにあるゴースト名を返します。

返り値は文字列を解決値とするPromiseです。

### balloon_name(dirpath)

dirpathのバルーンのinstall.txtにあるバルーン名を返します。

返り値は文字列を解決値とするPromiseです。

### shell_name(dirpath, shellpath)

dirpathのゴーストのshellpathのシェルのdescript.txtにあるシェル名を返します。

返り値は文字列を解決値とするPromiseです。

### ghost_install(dirpath)

dirpathのゴーストのinstall.txtの内容を返します。

返り値はハッシュを解決値とするPromiseです。

### balloon_install(dirpath)

dirpathのバルーンのinstall.txtの内容を返します。

返り値はハッシュを解決値とするPromiseです。

### shell_install(dirpath, shellpath)

dirpathのゴーストのshellpathのシェルのinstall.txtの内容を返します。

返り値はハッシュを解決値とするPromiseです。ただしinstall.txtが存在しない場合は解決値としてundefinedが返ります。

### ghost_descript(dirpath)

dirpathのゴーストのdescript.txtの内容を返します。

返り値はハッシュを解決値とするPromiseです。

### balloon_descript(dirpath)

dirpathのバルーンのdescript.txtの内容を返します。

返り値はハッシュを解決値とするPromiseです。

### shell_descript(dirpath, shellpath)

dirpathのゴーストのshellpathのシェルのdescript.txtの内容を返します。

返り値はハッシュを解決値とするPromiseです。

### install_nar(nar, dirpath, sakuraname)

    storage.install_nar(dir, 'akos', 'アコ').then(function(results){...});
    
    results = [
      {type: 'ghost', directory: 'raychel_rest'},
      {type: 'balloon', directory: 'raychel_balloon'}
    ];

narをインストールします。

narはNanikaDirectoryです。

dirpathはインストール対象のゴーストのディレクトリ名、sakuranameはインストール対象のゴーストのsakura.nameです。

戻り値はインストール結果を解決値とするPromiseです。

インストールエラーがあればPromiseがfailします。

narのaccept値が適合しなかった場合、結果はnullが帰ります。

インストールに成功すれば結果は結果の情報が含まれた配列になります。

現在対応しているnarタイプはghost,balloon,shell,packageです。supplementは未対応です。

### delete_ghost(dirpath), uninstall_ghost(dirpath)

dirpathのゴーストを削除します。

返り値はPromiseです。

### delete_balloon(dirpath), uninstall_balloon(dirpath)

dirpathのバルーンを削除します。

返り値はPromiseです。

### filter_ghost(dirpath, paths)

dirpathにあるゴースト配下のpathsに指定された以外のファイル、ディレクトリを削除します。

返り値はPromiseです。

### filter_balloon(dirpath, paths)

dirpathにあるバルーン配下のpathsに指定された以外のファイル、ディレクトリを削除します。

返り値はPromiseです。

### filter_shell(dirpath, shellpath, paths)

dirpath, shellpathにあるシェル配下のpathsに指定された以外のファイル、ディレクトリを削除します。

返り値はPromiseです。

NanikaStorage FS API
--------------------------

NanikaStorage.Backend.FSバックエンドを利用した場合のみ利用できるAPIです。

### home

ベースウェアのホームディレトクリのパス

### ghost_base_path()

ghostディレクトリのパス

### balloon_base_path()

balloonディレクトリのパス

### shell_base_path(dirpath)

dirpathのゴーストのshellディレクトリのパス

### ghost_path(dirpath)

dirpathのゴーストのルートディレクトリパス

### balloon_path(dirpath)

dirpathのバルーンのルートディレクトリパス

### ghost_master_path(dirpath)

dirpathのゴーストのghost/masterディレクトリのパス

### shell_path(dirpath, shellpath)

dirpathのゴーストのshellpathのシェルディレクトリのパス

### base_profile_path()

ベースウェアのプロファイルのパス

### ghost_profile_path(dirpath)

dirpathのゴーストのプロファイルパス

### balloon_profile_path(dirpath)

dirpathのバルーンのプロファイルパス

### shell_profile_path(dirpath, shellpath)

dirpathのゴーストのshellpathのシェルのプロファイルのパス

License
--------------------------

This is released under [MIT License](http://narazaka.net/license/MIT?2014).
