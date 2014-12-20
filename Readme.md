NanikaStorage - Nanika Storage
==========================

Nanika Storage for Ikagaka

Installation
--------------------------

unstable

Usage
--------------------------

unstable

API
--------------------------

unstable

### constructor

    var storage = new NanikaStorage(ghosts={}, balloons={})

### ghost(dirpath, directory)

    var dir = storage.ghost('akos');
    storage.ghost('akos', dir);

get and set directory(NanikaDirectory)

### balloon(dirpath, directory)

    var dir = storage.balloon('origin');
    storage.balloon('origin', dir);

get and set directory(NanikaDirectory)

### ghost_master(dirpath, directory)

    var dir = storage.ghost_master('akos');
    storage.ghost_master('akos', dir);

get and set directory(NanikaDirectory)

### shell(dirpath, shellpath, directory)

    var dir = storage.shell('akos', 'master');
    storage.shell('akos', 'master', dir);

get and set directory(NanikaDirectory)

### ghost_names()

get ghost name(install.txt's) list

### balloon_names()

get balloon name(install.txt's) list

### install_nar(nar, dirpath)

    var results = storage.install_nar(dir, 'akos');
    results = [
      {type: 'ghost', directory: 'raychel_rest'},
      {type: 'balloon', directory: 'raychel_balloon'}
    ];

install nar(NanikaDirectory)

dirpath is target ghost's dirpath

### uninstall_ghost(dirpath)

uninstall ghost

### uninstall_balloon(dirpath)

uninstall balloon

License
--------------------------

This is released under [MIT License](http://narazaka.net/license/MIT?2014).
