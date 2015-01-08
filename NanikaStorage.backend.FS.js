// Generated by CoffeeScript 1.8.0
(function() {
  var NanikaStorage, debug,
    __slice = [].slice;

  NanikaStorage = this.NanikaStorage;

  if (NanikaStorage == null) {
    NanikaStorage = {
      Backend: {}
    };
  }

  debug = false;

  NanikaStorage.Backend.FS = (function() {
    function FS(home, fs, path, Buffer) {
      this.home = home;
      this.fs = fs;
      this.path = path;
      this.Buffer = Buffer;
    }

    FS.prototype._accessor = function(target, directory, merge) {
      var promise;
      promise = new Promise(function(resolve) {
        return resolve();
      });
      if (directory != null) {
        if (!merge) {
          promise = promise.then((function(_this) {
            return function() {
              return _this._rmAll(target);
            };
          })(this));
        }
        promise = promise.then((function(_this) {
          return function() {
            return _this._DirectoryToFS(target, directory);
          };
        })(this));
      }
      promise = promise.then((function(_this) {
        return function() {
          return _this._FSToDirectory(target);
        };
      })(this));
      return promise;
    };

    FS.prototype.ghost = function(dirpath, directory, merge) {
      var target;
      target = this.path.join(this.home, 'ghost', dirpath);
      return this._accessor(target, directory, merge);
    };

    FS.prototype.balloon = function(dirpath, directory, merge) {
      var target;
      target = this.path.join(this.home, 'balloon', dirpath);
      return this._accessor(target, directory, merge);
    };

    FS.prototype.ghost_master = function(dirpath, directory, merge) {
      var target;
      target = this.path.join(this.home, 'ghost', dirpath, 'ghost', 'master');
      return this._accessor(target, directory, merge);
    };

    FS.prototype.shell = function(dirpath, shellpath, directory, merge) {
      var target;
      target = this.path.join(this.home, 'ghost', dirpath, 'shell', shellpath);
      return this._accessor(target, directory, merge);
    };

    FS.prototype._profile = function(target, profile) {
      var dir;
      if (profile != null) {
        dir = this.path.dirname(target);
        return this._mkpath(dir).then((function(_this) {
          return function() {
            return new Promise(function(resolve, reject) {
              return _this.fs.writeFile(target, JSON.stringify(profile), {
                encoding: 'utf8'
              }, function(err) {
                if (err != null) {
                  return reject(err);
                } else {
                  return resolve(profile);
                }
              });
            });
          };
        })(this));
      } else {
        return new Promise((function(_this) {
          return function(resolve, reject) {
            return _this.fs.readFile(target, {
              encoding: 'utf8'
            }, function(err, data) {
              if (err != null) {
                return resolve({});
              } else {
                return resolve(data.length ? JSON.parse(data) : {});
              }
            });
          };
        })(this));
      }
    };

    FS.prototype.base_profile = function(profile) {
      var target;
      target = this.path.join(this.home, 'profile');
      return this._profile(target, profile);
    };

    FS.prototype.ghost_profile = function(dirpath, profile) {
      var target;
      target = this.path.join(this.home, 'ghost', dirpath, 'ghost', 'master', 'profile');
      return this._profile(target, profile);
    };

    FS.prototype.balloon_profile = function(dirpath, profile) {
      var target;
      target = this.path.join(this.home, 'balloon', dirpath, 'profile');
      return this._profile(target, profile);
    };

    FS.prototype.shell_profile = function(dirpath, shellpath, profile) {
      var target;
      target = this.path.join(this.home, 'ghost', dirpath, 'shell', shellpath, 'profile');
      return this._profile(target, profile);
    };

    FS.prototype.ghosts = function() {
      var target;
      target = this.path.join(this.home, 'ghost');
      return this._readdir(target);
    };

    FS.prototype.balloons = function() {
      var target;
      target = this.path.join(this.home, 'balloon');
      return this._readdir(target);
    };

    FS.prototype.shells = function(dirpath) {
      var target;
      target = this.path.join(this.home, 'ghost', dirpath, 'shell');
      return this._readdir(target);
    };

    FS.prototype._elements_name = function(target, type) {
      return this._readdir(target).then((function(_this) {
        return function(items) {
          var item, itemtarget, promises, _i, _len;
          promises = [];
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            itemtarget = _this.path.join(target, item);
            promises.push(_this._FSFileToDirectory(itemtarget, type));
          }
          return Promise.all(promises).then(function(directories) {
            if (type === 'install.txt') {
              return directories.map(function(directory) {
                return directory.install.name;
              }).sort();
            } else {
              return directories.map(function(directory) {
                return directory.descript.name;
              }).sort();
            }
          });
        };
      })(this));
    };

    FS.prototype.ghost_names = function() {
      var target;
      target = this.path.join(this.home, 'ghost');
      return this._elements_name(target, 'install.txt');
    };

    FS.prototype.balloon_names = function() {
      var target;
      target = this.path.join(this.home, 'balloon');
      return this._elements_name(target, 'install.txt');
    };

    FS.prototype.shell_names = function(dirpath) {
      var target;
      target = this.path.join(this.home, 'ghost', dirpath, 'shell');
      return this._elements_name(target, 'descript.txt');
    };

    FS.prototype.ghost_name = function(dirpath) {
      var target;
      target = this.path.join(this.home, 'ghost', dirpath);
      return this._FSFileToDirectory(target, 'install.txt').then(function(directory) {
        return directory.install.name;
      });
    };

    FS.prototype.balloon_name = function(dirpath) {
      var target;
      target = this.path.join(this.home, 'balloon', dirpath);
      return this._FSFileToDirectory(target, 'install.txt').then(function(directory) {
        return directory.install.name;
      });
    };

    FS.prototype.shell_name = function(dirpath, shellpath) {
      var target;
      target = this.path.join(this.home, 'ghost', dirpath, 'shell', shellpath);
      return this._FSFileToDirectory(target, 'descript.txt').then(function(directory) {
        return directory.descript.name;
      });
    };

    FS.prototype.delete_ghost = function(dirpath) {
      var target;
      target = this.path.join(this.home, 'ghost', dirpath);
      return this._rmAll(target);
    };

    FS.prototype.delete_balloon = function(dirpath) {
      var target;
      target = this.path.join(this.home, 'balloon', dirpath);
      return this._rmAll(target);
    };

    FS.prototype._filter_elements = function(target, paths) {
      var filter_paths;
      filter_paths = {};
      paths.forEach(function(item) {
        var itemdir, _results;
        filter_paths[item] = true;
        _results = [];
        while (true) {
          itemdir = this.path.dirname(item);
          if (itemdir === item) {
            break;
          }
          item = itemdir;
          _results.push(filter_paths[item] = true);
        }
        return _results;
      });
      return this._readdirAll(target).then((function(_this) {
        return function(items) {
          var item, itempath, rmdirs, rmfiles, selects, _i, _len;
          selects = [];
          rmfiles = [];
          rmdirs = [];
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            itempath = _this.path.join(target, item);
            if (!filter_paths[item]) {
              (function(itempath) {
                return selects.push(_this._stat(itempath).then(function(stats) {
                  if (stats.isFile()) {
                    return rmfiles.push(itempath);
                  } else {
                    return rmdirs.push(itempath);
                  }
                }));
              })(itempath);
            }
          }
          return Promise.all(selects).then(function() {
            return Promise.all(rmfiles.map(function(file) {
              return _this._unlink(file);
            }));
          }).then(function() {
            return Promise.all(rmdirs.reverse().map((function(_this) {
              return function(dir) {
                return _this._rmdir(dir);
              };
            })(this)));
          });
        };
      })(this));
    };

    FS.prototype.filter_ghost = function(dirpath, paths) {
      var target;
      target = this.path.join(this.home, 'ghost', dirpath);
      return this._filter_elements(target, paths);
    };

    FS.prototype.filter_balloon = function(dirpath, paths) {
      var target;
      target = this.path.join(this.home, 'balloon', dirpath);
      return this._filter_elements(target, paths);
    };

    FS.prototype.filter_shell = function(dirpath, shellpath, paths) {
      var target;
      target = this.path.join(this.home, 'ghost', dirpath, 'shell', shellpath);
      return this._filter_elements(target, paths);
    };

    FS.prototype._readdir = function(target) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.fs.readdir(target, function(err, items) {
            if (err != null) {
              return reject(err);
            } else {
              return resolve(items);
            }
          });
        };
      })(this));
    };

    FS.prototype._readdirAll = function(target) {
      var basedir, readdir;
      readdir = (function(_this) {
        return function(dir, basedir) {
          return new Promise(function(resolve, reject) {
            return _this.fs.readdir(dir, function(err, entries) {
              var entry, promises, _i, _len;
              if (err != null) {
                return reject(err);
              }
              promises = [];
              for (_i = 0, _len = entries.length; _i < _len; _i++) {
                entry = entries[_i];
                promises.push((function(entry_path) {
                  return _this._stat(entry_path).then(function(stats) {
                    if (stats.isDirectory()) {
                      return readdir(entry_path, basedir).then(function(entry_paths) {
                        return [entry_path.replace(basedir, '')].concat(__slice.call(entry_paths));
                      });
                    } else {
                      return [entry_path.replace(basedir, '')];
                    }
                  });
                })(_this.path.join(dir, entry)));
              }
              return Promise.all(promises).then(function(entry_paths_list) {
                var a_entry_paths, entry_paths, _j, _len1;
                entry_paths = [];
                for (_j = 0, _len1 = entry_paths_list.length; _j < _len1; _j++) {
                  a_entry_paths = entry_paths_list[_j];
                  entry_paths = entry_paths.concat(a_entry_paths);
                }
                return resolve(entry_paths);
              });
            });
          });
        };
      })(this);
      basedir = RegExp('^' + target.replace(/(\W)/g, '\\$1') + '[\\\\/]?', 'i');
      return readdir(target, basedir);
    };

    FS.prototype._stat = function(target) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.fs.stat(target, function(err, stats) {
            if (err != null) {
              return reject();
            } else {
              return resolve(stats);
            }
          });
        };
      })(this));
    };

    FS.prototype._unlink = function(target) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.fs.unlink(target, function(err) {
            if (err != null) {
              return reject();
            } else {
              return resolve();
            }
          });
        };
      })(this));
    };

    FS.prototype._rmdir = function(target) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.fs.rmdir(target, function(err) {
            if (err != null) {
              return reject();
            } else {
              return resolve();
            }
          });
        };
      })(this));
    };

    FS.prototype._rmAll = function(target) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.fs.stat(target, function(err, stats) {
            if (err != null) {
              return resolve(false);
            } else {
              return resolve(true);
            }
          });
        };
      })(this)).then((function(_this) {
        return function(exists) {
          if (exists) {
            return _this._readdirAll(target).then(function(items) {
              var item, itempath, rmdirs, rmfiles, selects, _fn, _i, _len;
              selects = [];
              rmfiles = [];
              rmdirs = [];
              items.unshift('');
              _fn = function(itempath) {
                return selects.push(_this._stat(itempath).then(function(stats) {
                  if (stats.isFile()) {
                    return rmfiles.push(itempath);
                  } else {
                    return rmdirs.push(itempath);
                  }
                }));
              };
              for (_i = 0, _len = items.length; _i < _len; _i++) {
                item = items[_i];
                itempath = _this.path.join(target, item);
                _fn(itempath);
              }
              return Promise.all(selects).then(function() {
                return Promise.all(rmfiles.map(function(file) {
                  return _this._unlink(file);
                }));
              }).then(function() {
                return Promise.all(rmdirs.reverse().map(function(dir) {
                  return _this._rmdir(dir);
                }));
              });
            });
          }
        };
      })(this));
    };

    FS.prototype._mkpath = function(target) {
      var mkdir, mode;
      mode = parseInt("0777", 8);
      mkdir = (function(_this) {
        return function(target) {
          if (!target) {
            target = '/';
          }
          return new Promise(function(resolve, reject) {
            return _this.fs.stat(target, function(err, stats) {
              if (err != null) {
                return resolve(false);
              } else {
                return resolve(true);
              }
            });
          }).then(function(exists) {
            if (!exists) {
              return mkdir(_this.path.dirname(target)).then(function() {
                return new Promise(function(resolve, reject) {
                  return _this.fs.mkdir(target, mode, function(err) {
                    return resolve();
                  });
                });
              });
            }
          });
        };
      })(this);
      return mkdir(target);
    };

    FS.prototype._DirectoryToFS = function(target, directory) {
      var item, promises, _fn;
      promises = [];
      _fn = (function(_this) {
        return function(item) {
          var dir, itempath, value;
          value = directory.files[item];
          itempath = _this.path.join(target, item);
          if (value.isFile()) {
            dir = _this.path.dirname(itempath);
            return promises.push(_this._mkpath(dir).then(function() {
              return new Promise(function(resolve, reject) {
                return _this.fs.writeFile(itempath, new _this.Buffer(value.buffer()), {}, function(err) {
                  if (err != null) {
                    return reject(err);
                  } else {
                    return resolve();
                  }
                });
              });
            }));
          } else {
            return promises.push(_this._mkpath(itempath).then(function() {}));
          }
        };
      })(this);
      for (item in directory.files) {
        _fn(item);
      }
      return Promise.all(promises).then((function(_this) {
        return function() {};
      })(this));
    };

    FS.prototype._FSToDirectory = function(target) {
      var directory;
      directory = {};
      return this._readdirAll(target).then((function(_this) {
        return function(items) {
          var item, promises, _fn, _i, _len;
          promises = [];
          _fn = function(item) {
            var itempath;
            itempath = _this.path.join(target, item);
            return promises.push(_this._stat(itempath).then(function(stats) {
              if (stats.isFile()) {
                return new Promise(function(resolve, reject) {
                  return _this.fs.readFile(itempath, {}, function(err, buffer) {
                    if (err != null) {
                      return reject();
                    } else {
                      return resolve(buffer);
                    }
                  });
                }).then(function(buffer) {
                  return directory[item] = _this._toArrayBuffer(buffer);
                });
              }
            }));
          };
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            _fn(item);
          }
          return Promise.all(promises).then(function() {
            return new NanikaDirectory(directory);
          });
        };
      })(this));
    };

    FS.prototype._FSFileToDirectory = function(target, item) {
      var itempath;
      itempath = this.path.join(target, item);
      return new Promise((function(_this) {
        return function(resolve, reject) {
          return _this.fs.readFile(itempath, {}, function(err, buffer) {
            if (err != null) {
              return reject();
            } else {
              return resolve(buffer);
            }
          });
        };
      })(this)).then((function(_this) {
        return function(buffer) {
          var directory;
          directory = {};
          directory[item] = _this._toArrayBuffer(buffer);
          return new NanikaDirectory(directory);
        };
      })(this));
    };

    FS.prototype._toArrayBuffer = function(buffer) {
      var abuffer, i, view;
      abuffer = new ArrayBuffer(buffer.length);
      view = new Uint8Array(abuffer);
      i = 0;
      while (i < buffer.length) {
        view[i] = buffer.readUInt8(i);
        i++;
      }
      return abuffer;
    };

    return FS;

  })();

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = NanikaStorage;
  } else if (this.Ikagaka != null) {
    this.Ikagaka.NanikaStorage = NanikaStorage;
  } else {
    this.NanikaStorage = NanikaStorage;
  }

}).call(this);
