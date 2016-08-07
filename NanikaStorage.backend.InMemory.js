// Generated by CoffeeScript 1.10.0
(function() {
  var NanikaStorage;

  if (typeof require !== "undefined" && require !== null) {
    NanikaStorage = require('./NanikaStorage');
  } else if (typeof window !== "undefined" && window !== null) {
    NanikaStorage = window.NanikaStorage;
  }

  if (NanikaStorage == null) {
    NanikaStorage = {
      Backend: {}
    };
  }

  NanikaStorage.Backend.InMemory = (function() {
    function InMemory(_ghosts, _balloons, _profiles) {
      this._ghosts = _ghosts != null ? _ghosts : {};
      this._balloons = _balloons != null ? _balloons : {};
      this._profiles = _profiles != null ? _profiles : {
        ghost: {},
        balloon: {}
      };
    }

    InMemory.prototype.ghost = function(dirpath, directory, merge) {
      if (directory != null) {
        if (merge && (this._ghosts[dirpath] != null)) {
          this._ghosts[dirpath] = this._ghosts[dirpath].addDirectory(directory);
        } else {
          this._ghosts[dirpath] = directory;
        }
      }
      if (this._ghosts[dirpath] == null) {
        throw new Error("ghost not found at [" + dirpath + "]");
      }
      return this._ghosts[dirpath];
    };

    InMemory.prototype.balloon = function(dirpath, directory, merge) {
      if (directory != null) {
        if (merge && (this._balloons[dirpath] != null)) {
          this._balloons[dirpath] = this._balloons[dirpath].addDirectory(directory);
        } else {
          this._balloons[dirpath] = directory;
        }
      }
      if (this._balloons[dirpath] == null) {
        throw new Error("balloon not found at [" + dirpath + "]");
      }
      return this._balloons[dirpath];
    };

    InMemory.prototype.ghost_master = function(dirpath, directory, merge) {
      var ghost, old_ghost;
      if (directory != null) {
        if (merge) {
          old_ghost = this.ghost(dirpath);
        } else {
          old_ghost = this.ghost(dirpath).removeElements('ghost/master');
        }
        this.ghost(dirpath, old_ghost.addDirectory(directory.wrapDirectory('ghost/master')));
      }
      ghost = this.ghost(dirpath);
      if (!ghost.hasElement('ghost/master')) {
        throw new Error("ghost/master not found at [" + dirpath + "]");
      }
      return ghost.getDirectory('ghost/master');
    };

    InMemory.prototype.shell = function(dirpath, shellpath, directory, merge) {
      var ghost, old_ghost;
      if (directory != null) {
        if (merge) {
          old_ghost = this.ghost(dirpath);
        } else {
          old_ghost = this.ghost(dirpath).removeElements('shell/' + shellpath);
        }
        this.ghost(dirpath, old_ghost.addDirectory(directory.wrapDirectory('shell/' + shellpath)));
      }
      ghost = this.ghost(dirpath);
      if (!ghost.hasElement('shell/' + shellpath)) {
        throw new Error("shell/" + shellpath + " not found at [" + dirpath + "]");
      }
      return ghost.getDirectory('shell/' + shellpath);
    };

    InMemory.prototype.base_profile = function(profile) {
      if (profile != null) {
        this._profiles.base = profile;
      }
      return this._profiles.base || {};
    };

    InMemory.prototype.ghost_profile = function(dirpath, profile) {
      var ref;
      if (profile != null) {
        if (this._profiles.ghost[dirpath] == null) {
          this._profiles.ghost[dirpath] = {
            ghost: {},
            shell: {}
          };
        }
        this._profiles.ghost[dirpath].ghost = profile;
      }
      return ((ref = this._profiles.ghost[dirpath]) != null ? ref.ghost : void 0) || {};
    };

    InMemory.prototype.balloon_profile = function(dirpath, profile) {
      if (profile != null) {
        this._profiles.balloon[dirpath] = profile;
      }
      return this._profiles.balloon[dirpath] || {};
    };

    InMemory.prototype.shell_profile = function(dirpath, shellpath, profile) {
      var ref;
      if (profile != null) {
        this._profiles.ghost[dirpath].shell[shellpath] = profile;
      }
      return ((ref = this._profiles.ghost[dirpath]) != null ? ref.shell[shellpath] : void 0) || {};
    };

    InMemory.prototype.ghosts = function() {
      return Object.keys(this._ghosts);
    };

    InMemory.prototype.balloons = function() {
      return Object.keys(this._balloons);
    };

    InMemory.prototype.shells = function(dirpath) {
      return this.ghost(dirpath).getDirectory('shell').listChildren();
    };

    InMemory.prototype.ghost_names = function() {
      return Object.keys(this._ghosts).map((function(_this) {
        return function(directory) {
          return _this._ghosts[directory].install.name;
        };
      })(this)).sort();
    };

    InMemory.prototype.balloon_names = function() {
      return Object.keys(this._balloons).map((function(_this) {
        return function(directory) {
          return _this._balloons[directory].descript.name;
        };
      })(this)).sort();
    };

    InMemory.prototype.shell_names = function(dirpath) {
      var dir, i, len, name, ref, shell, shelldirs, shellnames;
      shell = this.ghost(dirpath).getDirectory('shell');
      shelldirs = shell.listChildren();
      shellnames = [];
      for (i = 0, len = shelldirs.length; i < len; i++) {
        dir = shelldirs[i];
        name = (ref = shell.getDirectory(dir).descript) != null ? ref.name : void 0;
        if (name != null) {
          shellnames.push(name);
        }
      }
      return shellnames;
    };

    InMemory.prototype.ghost_name = function(dirpath) {
      return this.ghost(dirpath).install.name;
    };

    InMemory.prototype.balloon_name = function(dirpath) {
      return this.balloon(dirpath).descript.name;
    };

    InMemory.prototype.shell_name = function(dirpath, shellpath) {
      return this.shell(dirpath, shellpath).descript.name;
    };

    InMemory.prototype.delete_ghost = function(dirpath) {
      return delete this._ghosts[dirpath];
    };

    InMemory.prototype.delete_balloon = function(dirpath) {
      return delete this._balloons[dirpath];
    };

    InMemory.prototype.filter_ghost = function(dirpath, paths) {
      return this.ghost(dirpath, this.ghost(dirpath).getElements(paths));
    };

    InMemory.prototype.filter_balloon = function(dirpath, paths) {
      return this.balloon(dirpath, this.balloon(dirpath).getElements(paths));
    };

    InMemory.prototype.filter_shell = function(dirpath, shellpath, paths) {
      return this.shell(dirpath, shellpath, this.shell(dirpath, shellpath).getElements(paths));
    };

    return InMemory;

  })();

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = NanikaStorage;
  } else if ((typeof window !== "undefined" && window !== null ? window.Ikagaka : void 0) != null) {
    window.Ikagaka.NanikaStorage = NanikaStorage;
  } else if (typeof window !== "undefined" && window !== null) {
    window.NanikaStorage = NanikaStorage;
  }

}).call(this);
