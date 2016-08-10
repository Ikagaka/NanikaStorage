if require?
	NanikaStorage = require('./NanikaStorage')
else if window?
	NanikaStorage = window.NanikaStorage
NanikaStorage ?= Backend: {}

debug = false

class NanikaStorage.Backend.FS
	constructor: (@home, @fs, @path, @Buffer) ->
	ghost_base_path: -> @path.join(@home, 'ghost')
	balloon_base_path: -> @path.join(@home, 'balloon')
	shell_base_path: (dirpath) -> @path.join(@ghost_path(dirpath), 'shell')
	ghost_path: (dirpath) -> @path.join(@home, 'ghost', dirpath)
	balloon_path: (dirpath) -> @path.join(@home, 'balloon', dirpath)
	ghost_master_path: (dirpath) -> @path.join(@ghost_path(dirpath), 'ghost', 'master')
	shell_path: (dirpath, shellpath) -> @path.join(@ghost_path(dirpath), 'shell', shellpath)
	base_profile_path: -> @path.join(@home, 'profile', 'base.profile.json')
	ghost_profile_path: (dirpath) -> @path.join(@ghost_master_path(dirpath), 'profile', 'ghost.profile.json')
	balloon_profile_path: (dirpath) -> @path.join(@balloon_path(dirpath), 'profile', 'balloon.profile.json')
	shell_profile_path: (dirpath, shellpath) -> @path.join(@shell_path(dirpath, shellpath), 'profile', 'shell.profile.json')
	_accessor: (target, directory, merge) ->
		promise = new Promise (resolve) -> resolve()
		if directory?
			unless merge
				promise = promise.then => @_rmAll(target)
			promise = promise.then => @_DirectoryToFS(target, directory)
		promise = promise.then => @_FSToDirectory(target)
		promise
	ghost: (dirpath, directory, merge) ->
		target = @ghost_path(dirpath)
		@_accessor(target, directory, merge)
	balloon: (dirpath, directory, merge) ->
		target = @balloon_path(dirpath)
		@_accessor(target, directory, merge)
	ghost_master: (dirpath, directory, merge) ->
		target = @ghost_master_path(dirpath)
		@_accessor(target, directory, merge)
	shell: (dirpath, shellpath, directory, merge) ->
		target = @shell_path(dirpath, shellpath)
		@_accessor(target, directory, merge)
	_profile: (target, profile) ->
		if profile?
			dir = @path.dirname(target)
			@_mkpath(dir).then =>
				new Promise (resolve, reject) =>
					@fs.writeFile target, JSON.stringify(profile), {encoding: 'utf8'}, (err) ->
						if err? then reject(err) else resolve(profile)
		else
			new Promise (resolve, reject) =>
				@fs.readFile target, {encoding: 'utf8'}, (err, data) ->
					if err? then resolve({}) else resolve(if data.length then JSON.parse(data) else {})
	base_profile: (profile) ->
		target = @base_profile_path()
		@_profile(target, profile)
	ghost_profile: (dirpath, profile) ->
		target = @ghost_profile_path(dirpath)
		@_profile(target, profile)
	balloon_profile: (dirpath, profile) ->
		target = @balloon_profile_path(dirpath)
		@_profile(target, profile)
	shell_profile: (dirpath, shellpath, profile) ->
		target = @shell_profile_path(dirpath, shellpath)
		@_profile(target, profile)
	ghosts: ->
		target = @ghost_base_path()
		@_readdir(target)
	balloons: ->
		target = @balloon_base_path()
		@_readdir(target)
	shells: (dirpath) ->
		target = @shell_base_path(dirpath)
		@_readdir(target)
	_elements_name: (target, type) ->
		@_readdir(target)
		.then (items) =>
			promises = []
			for item in items
				itemtarget = @path.join(target, item)
				promises.push @_FSFileToDirectory(itemtarget, type)
			Promise.all promises
			.then (directories) ->
				if type == 'install.txt'
					directories.map (directory) -> directory.install.name
					.sort()
				else
					directories.map (directory) -> directory.descript.name
					.sort()
	ghost_names: ->
		target = @ghost_base_path()
		@_elements_name(target, 'install.txt')
	balloon_names: ->
		target = @balloon_base_path()
		@_elements_name(target, 'install.txt')
	shell_names: (dirpath) ->
		target = @shell_base_path(dirpath)
		@_elements_name(target, 'descript.txt')
	ghost_name: (dirpath) ->
		@ghost_install(dirpath).then (install) -> install.name
	balloon_name: (dirpath) ->
		@balloon_install(dirpath).then (install) -> install.name
	shell_name: (dirpath, shellpath) ->
		@shell_descript(dirpath. shellpath).then (descript) -> descript.name
	ghost_install: (dirpath) ->
		target = @ghost_path(dirpath)
		@_FSFileToDirectory(target, 'install.txt').then (directory) -> directory.install
	balloon_install: (dirpath) ->
		target = @balloon_path(dirpath)
		@_FSFileToDirectory(target, 'install.txt').then (directory) -> directory.install
	shell_install: (dirpath, shellpath) ->
		target = @shell_path(dirpath, shellpath)
		itempath = @path.join(target, 'install.txt')
		new Promise (resolve, reject) =>
			@fs.stat itempath, (err, stats) =>
				if err? then resolve(false) else resolve(true)
		.then (exists) =>
			if exists
				@_FSFileToDirectory(target, 'install.txt').then (directory) -> directory.install
	ghost_descript: (dirpath) ->
		target = @ghost_master_path(dirpath)
		@_FSFileToDirectory(target, 'descript.txt').then (directory) -> directory.descript
	balloon_descript: (dirpath) ->
		target = @balloon_path(dirpath)
		@_FSFileToDirectory(target, 'descript.txt').then (directory) -> directory.descript
	shell_descript: (dirpath, shellpath) ->
		target = @shell_path(dirpath, shellpath)
		@_FSFileToDirectory(target, 'descript.txt').then (directory) -> directory.descript
	delete_ghost: (dirpath) ->
		target = @ghost_path(dirpath)
		@_rmAll(target)
	delete_balloon: (dirpath) ->
		target = @balloon_path(dirpath)
		@_rmAll(target)
	_filter_elements: (target, paths) ->
		filter_paths = {}
		paths.forEach (item) =>
			filter_paths[item] = true
			while true
				itemdir = @path.dirname(item)
				if itemdir == item
					break
				item = itemdir
				filter_paths[item] = true
		new Promise (resolve, reject) =>
			@fs.stat target, (err, stats) =>
				if err? then resolve(false) else resolve(true)
		.then (exists) =>
			if exists
				@_readdirAll target
				.then (items) =>
					selects = []
					rmfiles = []
					rmdirs = []
					for item in items
						itempath = @path.join(target, item)
						if not filter_paths[item]
							((itempath) =>
								selects.push @_stat(itempath).then (stats) =>
									if stats.isFile()
										rmfiles.push itempath
									else
										rmdirs.push itempath
							)(itempath)
					Promise.all selects
					.then =>
						Promise.all rmfiles.map (file) => @_unlink(file)
					.then =>
						@_rmdirs(rmdirs)
	filter_ghost: (dirpath, paths) ->
		target = @ghost_path(dirpath)
		@_filter_elements(target, paths)
	filter_balloon: (dirpath, paths) ->
		target = @balloon_path(dirpath)
		@_filter_elements(target, paths)
	filter_shell: (dirpath, shellpath, paths) ->
		target = @shell_path(dirpath, shellpath)
		@_filter_elements(target, paths)
	_readdir: (target) ->
		new Promise (resolve, reject) =>
			@fs.readdir target, (err, items) -> if err? then reject err else resolve items
	_readdirAll: (target) ->
		readdir = (dir, basedir) =>
			new Promise (resolve, reject) =>
				@fs.readdir dir, (err, entries) =>
					if err? then return reject err
					promises = []
					for entry in entries
						promises.push ((entry_path) =>
							@_stat entry_path
							.then (stats) =>
								if stats.isDirectory()
									readdir entry_path, basedir
									.then (entry_paths) =>
										[(@path.relative basedir, entry_path), entry_paths...]
								else
									[@path.relative basedir, entry_path]
						)(@path.join dir, entry)
					Promise.all promises
					.then (entry_paths_list) =>
						entry_paths = []
						for a_entry_paths in entry_paths_list
							entry_paths = entry_paths.concat a_entry_paths
						resolve entry_paths
		readdir target, target
	_stat: (target) ->
		new Promise (resolve, reject) =>
			@fs.stat target, (err, stats) -> if err? then reject(err) else resolve(stats)
	_unlink: (target) ->
		new Promise (resolve, reject) =>
			@fs.unlink target, (err) -> if err? then reject(err) else resolve()
	_rmdir: (target) ->
		new Promise (resolve, reject) =>
			@fs.rmdir target, (err) -> if err? then reject(err) else resolve()
	_rmdirs: (targets) ->
		hierarchy = children: {}
		# build tree
		for target in targets
			target_path = @path.resolve(target)
			target_path_tokens = []
			while true
				token = @path.basename(target_path)
				new_target_path = @path.dirname(target_path)
				if new_target_path == target_path
					break
				target_path_tokens.unshift(token)
				target_path = new_target_path
			current_hierarchy = hierarchy
			for target_path_token in target_path_tokens
				unless current_hierarchy.children[target_path_token]?
					current_hierarchy.children[target_path_token] = children: {}
				current_hierarchy = current_hierarchy.children[target_path_token]
			current_hierarchy.remove = true
		rmdirs = []
		walk = (current_hierarchy, hierarchy_path) =>
			if current_hierarchy.remove
				rmdirs.push hierarchy_path
			else
				for child in Object.keys(current_hierarchy.children)
					walk current_hierarchy.children[child], @path.join(hierarchy_path, child)
		walk hierarchy, '/'
		Promise.all rmdirs.map (dir) => @_rmdirAll(dir)
	_rmdirAll: (target) ->
		@_readdirAll target
		.then (dirs) =>
			dirs.unshift ''
			promise = new Promise (resolve) -> resolve()
			for dir in dirs.reverse()
				((dir) =>
					promise = promise.then => @_rmdir(@path.join(target, dir))
				)(dir)
			promise
	_rmAll: (target) ->
		new Promise (resolve, reject) =>
			@fs.stat target, (err, stats) =>
				if err? then resolve(false) else resolve(true)
		.then (exists) =>
			if exists
				@_readdirAll target
				.then (items) =>
					selects = []
					rmfiles = []
					rmdirs = []
					items.unshift ''
					for item in items
						itempath = @path.join(target, item)
						((itempath) =>
							selects.push @_stat(itempath).then (stats) =>
								if stats.isFile()
									rmfiles.push itempath
								else
									rmdirs.push itempath
						)(itempath)
					Promise.all selects
					.then =>
						Promise.all rmfiles.map (file) => @_unlink(file)
					.then =>
						@_rmdirs(rmdirs)
	_mkpath: (target) ->
		mode = parseInt("0777", 8)
		mkdir = (target) =>
			new Promise (resolve, reject) =>
				@fs.stat target, (err, stats) =>
					if err? then resolve(false) else resolve(true)
			.then (exists) =>
				unless exists
					deep = @path.dirname(target)
					unless deep == target
						mkdir(deep)
						.then =>
							new Promise (resolve, reject) =>
								@fs.mkdir target, mode, (err) -> resolve()
		mkdir(target)
	_DirectoryToFS: (target, directory) ->
		promises = []
		for item of directory.files
			((item) =>
				value = directory.files[item]
				itempath = @path.join(target, item)
				if value.isFile()
					dir = @path.dirname(itempath)
					promises.push @_mkpath(dir).then =>
						new Promise (resolve, reject) =>
							@fs.writeFile itempath, @_fromArrayBuffer(value.buffer()), {}, (err) ->
								if err? then reject(err) else resolve()
				else
					promises.push @_mkpath(itempath).then ->
			)(item)
		Promise.all promises
		.then =>
	_FSToDirectory: (target) ->
		directory = {}
		@_readdirAll target
		.then (items) =>
			promises = []
			for item in items
				((item) =>
					itempath = @path.join(target, item)
					promises.push @_stat(itempath).then (stats) =>
						if stats.isFile()
							new Promise (resolve, reject) =>
								@fs.readFile itempath, {}, (err, buffer) -> if err? then reject(err) else resolve(buffer)
							.then (buffer) =>
								directory[item] = @_toArrayBuffer(buffer)
				)(item)
			Promise.all promises
			.then =>
				new NanikaDirectory directory
	_FSFileToDirectory: (target, item) ->
		itempath = @path.join(target, item)
		new Promise (resolve, reject) =>
			@fs.readFile itempath, {}, (err, buffer) -> if err? then reject(err) else resolve(buffer)
		.then (buffer) =>
			directory = {}
			directory[item] = @_toArrayBuffer(buffer)
			new NanikaDirectory directory
	_toArrayBuffer: (buffer) ->
		abuffer = new ArrayBuffer(buffer.length)
		view = new Uint8Array(abuffer)
		i = 0
		while i < buffer.length
			view[i] = buffer.readUInt8(i)
			i++
		return abuffer
	_fromArrayBuffer: (abuffer) ->
		try
			new @Buffer(new Uint8Array(abuffer))
		catch
			new @Buffer(abuffer)

if module?.exports?
	module.exports = NanikaStorage
else if window?.Ikagaka?
	window.Ikagaka.NanikaStorage = NanikaStorage
else if window?
	window.NanikaStorage = NanikaStorage
