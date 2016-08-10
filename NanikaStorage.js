// Generated by CoffeeScript 1.10.0
(function() {
  var NanikaStorage, Promise, name, ref, ref1, value;

  if (typeof Promise === "undefined" || Promise === null) {
    if (typeof require !== "undefined" && require !== null) {
      Promise = require('bluebird');
    } else if (typeof window !== "undefined" && window !== null) {
      Promise = window.Promise;
    }
  }

  NanikaStorage = (function() {
    NanikaStorage.Backend = {};

    function NanikaStorage(backend) {
      this.backend = backend;
    }

    NanikaStorage.prototype.ghost_base_path = function() {
      return this.backend.ghost_base_path();
    };

    NanikaStorage.prototype.balloon_base_path = function() {
      return this.backend.balloon_base_path();
    };

    NanikaStorage.prototype.shell_base_path = function(dirpath) {
      return this.backend.shell_base_path(dirpath);
    };

    NanikaStorage.prototype.ghost_path = function(dirpath) {
      return this.backend.ghost_path(dirpath);
    };

    NanikaStorage.prototype.balloon_path = function(dirpath) {
      return this.backend.balloon_path(dirpath);
    };

    NanikaStorage.prototype.ghost_master_path = function(dirpath) {
      return this.backend.ghost_master_path(dirpath);
    };

    NanikaStorage.prototype.shell_path = function(dirpath, shellpath) {
      return this.backend.shell_path(dirpath, shellpath);
    };

    NanikaStorage.prototype.base_profile_path = function() {
      return this.backend.base_profile_path();
    };

    NanikaStorage.prototype.ghost_profile_path = function(dirpath) {
      return this.backend.ghost_profile_path(dirpath);
    };

    NanikaStorage.prototype.balloon_profile_path = function(dirpath) {
      return this.backend.balloon_profile_path(dirpath);
    };

    NanikaStorage.prototype.shell_profile_path = function(dirpath, shellpath) {
      return this.backend.shell_profile_path(dirpath, shellpath);
    };

    NanikaStorage.prototype.ghost = function(dirpath, directory, merge) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.ghost(dirpath, directory, merge);
        };
      })(this));
    };

    NanikaStorage.prototype.balloon = function(dirpath, directory, merge) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.balloon(dirpath, directory, merge);
        };
      })(this));
    };

    NanikaStorage.prototype.ghost_master = function(dirpath, directory, merge) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.ghost_master(dirpath, directory, merge);
        };
      })(this));
    };

    NanikaStorage.prototype.shell = function(dirpath, shellpath, directory, merge) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.shell(dirpath, shellpath, directory, merge);
        };
      })(this));
    };

    NanikaStorage.prototype.base_profile = function(profile) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.base_profile(profile);
        };
      })(this));
    };

    NanikaStorage.prototype.ghost_profile = function(dirpath, profile) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.ghost_profile(dirpath, profile);
        };
      })(this));
    };

    NanikaStorage.prototype.balloon_profile = function(dirpath, profile) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.balloon_profile(dirpath, profile);
        };
      })(this));
    };

    NanikaStorage.prototype.shell_profile = function(dirpath, shellpath, profile) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.shell_profile(dirpath, shellpath, profile);
        };
      })(this));
    };

    NanikaStorage.prototype.ghosts = function() {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.ghosts();
        };
      })(this));
    };

    NanikaStorage.prototype.balloons = function() {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.balloons();
        };
      })(this));
    };

    NanikaStorage.prototype.shells = function(dirpath) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.shells(dirpath);
        };
      })(this));
    };

    NanikaStorage.prototype.ghost_names = function() {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.ghost_names();
        };
      })(this));
    };

    NanikaStorage.prototype.balloon_names = function() {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.balloon_names();
        };
      })(this));
    };

    NanikaStorage.prototype.shell_names = function(dirpath) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.shell_names(dirpath);
        };
      })(this));
    };

    NanikaStorage.prototype.ghost_name = function(dirpath) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.ghost_name(dirpath);
        };
      })(this));
    };

    NanikaStorage.prototype.balloon_name = function(dirpath) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.balloon_name(dirpath);
        };
      })(this));
    };

    NanikaStorage.prototype.shell_name = function(dirpath, shellpath) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.shell_name(dirpath, shellpath);
        };
      })(this));
    };

    NanikaStorage.prototype.ghost_install = function(dirpath) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.ghost_install(dirpath);
        };
      })(this));
    };

    NanikaStorage.prototype.balloon_install = function(dirpath) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.balloon_install(dirpath);
        };
      })(this));
    };

    NanikaStorage.prototype.shell_install = function(dirpath, shellpath) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.shell_install(dirpath, shellpath);
        };
      })(this));
    };

    NanikaStorage.prototype.ghost_descript = function(dirpath) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.ghost_descript(dirpath);
        };
      })(this));
    };

    NanikaStorage.prototype.balloon_descript = function(dirpath) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.balloon_descript(dirpath);
        };
      })(this));
    };

    NanikaStorage.prototype.shell_descript = function(dirpath, shellpath) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.shell_descript(dirpath, shellpath);
        };
      })(this));
    };

    NanikaStorage.prototype.delete_ghost = function(dirpath) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.delete_ghost(dirpath);
        };
      })(this));
    };

    NanikaStorage.prototype.delete_balloon = function(dirpath) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.delete_balloon(dirpath);
        };
      })(this));
    };

    NanikaStorage.prototype.filter_ghost = function(dirpath, paths) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.filter_ghost(dirpath, paths);
        };
      })(this));
    };

    NanikaStorage.prototype.filter_balloon = function(dirpath, paths) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.filter_balloon(dirpath, paths);
        };
      })(this));
    };

    NanikaStorage.prototype.filter_shell = function(dirpath, shellpath, paths) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          return _this.backend.filter_shell(dirpath, shellpath, paths);
        };
      })(this));
    };

    NanikaStorage.prototype.merge_ghost = function(dirpath, directory) {
      var install, undelete_elements;
      install = directory.install || {};
      if (install.refresh) {
        if (install.refreshundeletemask) {
          undelete_elements = install.refreshundeletemask.split(/:/);
          return this.filter_ghost(dirpath, undelete_elements).then((function(_this) {
            return function() {
              return _this.ghost(dirpath, directory, true);
            };
          })(this));
        } else {
          return this.ghost(dirpath, directory, false);
        }
      } else {
        return this.ghost(dirpath, directory, true);
      }
    };

    NanikaStorage.prototype.merge_balloon = function(dirpath, directory) {
      var install, undelete_elements;
      install = directory.install || {};
      if (install.refresh) {
        if (install.refreshundeletemask) {
          undelete_elements = install.refreshundeletemask.split(/:/);
          return this.filter_balloon(dirpath, undelete_elements).then((function(_this) {
            return function() {
              return _this.balloon(dirpath, directory, true);
            };
          })(this));
        } else {
          return this.balloon(dirpath, directory, false);
        }
      } else {
        return this.balloon(dirpath, directory, true);
      }
    };

    NanikaStorage.prototype.merge_shell = function(dirpath, shellpath, directory) {
      var install, undelete_elements;
      install = directory.install || {};
      if (install.refresh) {
        if (install.refreshundeletemask) {
          undelete_elements = install.refreshundeletemask.split(/:/);
          return this.filter_shell(dirpath, shellpath, undelete_elements).then((function(_this) {
            return function() {
              return _this.shell(dirpath, shellpath, directory, true);
            };
          })(this));
        } else {
          return this.shell(dirpath, shellpath, directory, false);
        }
      } else {
        return this.shell(dirpath, shellpath, directory, true);
      }
    };

    NanikaStorage.prototype.install_nar = function(nar, dirpath, sakuraname) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          var install;
          install = nar.install || {};
          if ((install.accept != null) && install.accept !== sakuraname) {
            return null;
          }
          switch (install.type) {
            case 'ghost':
              return _this.install_ghost(nar, dirpath, sakuraname);
            case 'balloon':
              return _this.install_balloon(nar, dirpath, sakuraname);
            case 'supplement':
              return _this.install_supplement(nar, dirpath, sakuraname);
            case 'shell':
              return _this.install_shell(nar, dirpath, sakuraname);
            case 'package':
              return _this.install_package(nar, dirpath, sakuraname);
            default:
              throw new Error('not supported');
          }
        };
      })(this));
    };

    NanikaStorage.prototype.install_ghost = function(nar, dirpath, sakuraname) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          var install, target_directory;
          install = nar.install || {};
          if (!install.directory) {
            throw new Error("install.txt directory entry required");
          }
          sakuraname = nar.getDirectory('ghost/master').descript['sakura.name'];
          target_directory = install.directory;
          return _this.install_children(nar, dirpath, sakuraname).then(function(arg) {
            var install_results, nar;
            nar = arg.nar, install_results = arg.install_results;
            return _this.merge_ghost(target_directory, nar).then(function() {
              install_results.push({
                type: 'ghost',
                directory: target_directory
              });
              return install_results;
            });
          });
        };
      })(this));
    };

    NanikaStorage.prototype.install_balloon = function(nar, dirpath, sakuraname) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          var install, install_results, target_directory;
          install = nar.install || {};
          if (!install.directory) {
            throw new Error("install.txt directory entry required");
          }
          target_directory = install.directory;
          install_results = [];
          return _this.merge_balloon(target_directory, nar).then(function() {
            install_results.push({
              type: 'balloon',
              directory: target_directory
            });
            return install_results;
          });
        };
      })(this));
    };

    NanikaStorage.prototype.install_supplement = function(nar, dirpath, sakuraname) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          var install;
          install = nar.install || {};
          if (!dirpath) {
            throw new Error("dirpath required");
          }
          throw 'not implemented';
        };
      })(this));
    };

    NanikaStorage.prototype.install_shell = function(nar, dirpath, sakuraname) {
      return new Promise(function(resolve) {
        return resolve();
      }).then((function(_this) {
        return function() {
          var install, target_directory;
          install = nar.install || {};
          if (!dirpath) {
            throw new Error("dirpath required");
          }
          if (!install.directory) {
            throw new Error("install.txt directory entry required");
          }
          target_directory = install.directory;
          return _this.install_children(nar, dirpath, sakuraname).then(function(arg) {
            var install_results, nar;
            nar = arg.nar, install_results = arg.install_results;
            return _this.ghost(dirpath).then(function(ghost) {
              return _this.merge_shell(dirpath, target_directory, nar).then(function() {
                install_results.push({
                  type: 'shell',
                  directory: target_directory
                });
                return install_results;
              });
            });
          });
        };
      })(this));
    };

    NanikaStorage.prototype.install_package = function(nar, dirpath, sakuraname) {
      var child, directory, i, install_results, len, promise, ref;
      install_results = [];
      promise = new Promise(function(resolve) {
        return resolve();
      });
      ref = nar.listChildren();
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        directory = nar.getDirectory(child);
        if (Object.keys(directory.files).length) {
          promise = promise.then((function(_this) {
            return function() {
              return _this.install_nar(directory, dirpath, sakuraname);
            };
          })(this)).then(function(child_install_results) {
            return install_results = install_results.concat(child_install_results);
          });
        }
      }
      return promise.then(function() {
        return install_results;
      });
    };

    NanikaStorage.prototype.install_children = function(nar, dirpath, sakuraname) {
      var child_install, child_nar, child_source_directory, i, install, install_results, len, promise, ref, type;
      install = nar.install || {};
      install_results = [];
      promise = new Promise(function(resolve) {
        return resolve();
      });
      ref = ['balloon', 'headline', 'plugin'];
      for (i = 0, len = ref.length; i < len; i++) {
        type = ref[i];
        if (install[type + '.directory'] != null) {
          if (install[type + '.source.directory'] != null) {
            child_source_directory = install[type + '.source.directory'];
          } else {
            child_source_directory = install[type + '.directory'];
          }
          child_nar = nar.getDirectory(child_source_directory);
          if (child_nar.install == null) {
            child_nar.install = {};
          }
          child_install = child_nar.install;
          if (child_install.type == null) {
            child_install.type = type;
          }
          if (child_install.directory == null) {
            child_install.directory = install[type + '.directory'];
          }
          if (install[type + '.refresh'] != null) {
            if (child_install.refresh == null) {
              child_install.refresh = install[type + '.refresh'];
            }
          }
          if (install[type + '.refreshundeletemask'] != null) {
            if (child_install.refreshundeletemask == null) {
              child_install.refreshundeletemask = install[type + '.refreshundeletemask'];
            }
          }
          promise = promise.then((function(_this) {
            return function() {
              return _this.install_nar(child_nar, dirpath, sakuraname);
            };
          })(this)).then(function(child_install_results) {
            install_results = install_results.concat(child_install_results);
            return nar = nar.removeElements(child_source_directory);
          });
        }
      }
      return promise.then(function() {
        return {
          nar: nar,
          install_results: install_results
        };
      });
    };

    NanikaStorage.prototype.uninstall_ghost = function(dirpath) {
      return this.delete_ghost(dirpath);
    };

    NanikaStorage.prototype.uninstall_balloon = function(dirpath) {
      return this.delete_balloon(dirpath);
    };

    return NanikaStorage;

  })();

  if ((typeof window !== "undefined" && window !== null ? (ref = window.NanikaStorage) != null ? ref.Backend : void 0 : void 0) != null) {
    ref1 = window.NanikaStorage.Backend;
    for (name in ref1) {
      value = ref1[name];
      NanikaStorage.Backend[name] = value;
    }
  }

  if (typeof require !== "undefined" && require !== null) {
    require('./NanikaStorage.backend.FS');
    require('./NanikaStorage.backend.InMemory');
  }

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = NanikaStorage;
  } else if ((typeof window !== "undefined" && window !== null ? window.Ikagaka : void 0) != null) {
    window.Ikagaka.NanikaStorage = NanikaStorage;
  } else if (typeof window !== "undefined" && window !== null) {
    window.NanikaStorage = NanikaStorage;
  }

}).call(this);
