NanikaStorage = @NanikaStorage
NanikaStorage ?= Backend: {}

debug = false

class NanikaStorage.Backend.FS
	constructor: (@home, @fs, @path, @Buffer) ->
	_accessor: (target, directory, merge) ->
		promise = new Promise (resolve) -> resolve()
		if directory?
			unless merge
				promise = promise.then => @_rmAll(target)
			promise = promise.then => @_DirectoryToFS(target, directory)
		promise = promise.then => @_FSToDirectory(target)
		promise
	ghost: (dirpath, directory, merge) ->
		target = @path.join(@home, 'ghost', dirpath)
		@_accessor(target, directory, merge)
	balloon: (dirpath, directory, merge) ->
		target = @path.join(@home, 'balloon', dirpath)
		@_accessor(target, directory, merge)
	ghost_master: (dirpath, directory, merge) ->
		target = @path.join(@home, 'ghost', dirpath, 'ghost', 'master')
		@_accessor(target, directory, merge)
	shell: (dirpath, shellpath, directory, merge) ->
		target = @path.join(@home, 'ghost', dirpath, 'shell', shellpath)
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
		target = @path.join(@home, 'profile')
		@_profile(target, profile)
	ghost_profile: (dirpath, profile) ->
		target = @path.join(@home, 'ghost', dirpath, 'ghost', 'master', 'profile')
		@_profile(target, profile)
	balloon_profile: (dirpath, profile) ->
		target = @path.join(@home, 'balloon', dirpath, 'profile')
		@_profile(target, profile)
	shell_profile: (dirpath, shellpath, profile) ->
		target = @path.join(@home, 'ghost', dirpath, 'shell', shellpath, 'profile')
		@_profile(target, profile)
	ghosts: ->
		target = @path.join(@home, 'ghost')
		@_readdir(target)
	balloons: ->
		target = @path.join(@home, 'balloon')
		@_readdir(target)
	shells: (dirpath) ->
		target = @path.join(@home, 'ghost', dirpath, 'shell')
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
		target = @path.join(@home, 'ghost')
		@_elements_name(target, 'install.txt')
	balloon_names: ->
		target = @path.join(@home, 'balloon')
		@_elements_name(target, 'install.txt')
	shell_names: (dirpath) ->
		target = @path.join(@home, 'ghost', dirpath, 'shell')
		@_elements_name(target, 'descript.txt')
	ghost_name: (dirpath) ->
		target = @path.join(@home, 'ghost', dirpath)
		@_FSFileToDirectory(target, 'install.txt').then (directory) -> directory.install.name
	balloon_name: (dirpath) ->
		target = @path.join(@home, 'balloon', dirpath)
		@_FSFileToDirectory(target, 'install.txt').then (directory) -> directory.install.name
	shell_name: (dirpath, shellpath) ->
		target = @path.join(@home, 'ghost', dirpath, 'shell', shellpath)
		@_FSFileToDirectory(target, 'descript.txt').then (directory) -> directory.descript.name
	delete_ghost: (dirpath) ->
		target = @path.join(@home, 'ghost', dirpath)
		@_rmAll(target)
	delete_balloon: (dirpath) ->
		target = @path.join(@home, 'balloon', dirpath)
		@_rmAll(target)
	_filter_elements: (target, paths) ->
		throw new Error 'filel'
		filter_paths = {}
		paths.forEach (item) ->
			filter_paths[item] = true
			while true
				itemdir = @path.dirname(item)
				if itemdir == item
					break
				item = itemdir
				filter_paths[item] = true
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
			.then => Promise.all rmfiles.map (file) => @_unlink(file)
			.then -> Promise.all rmdirs.reverse().map (dir) => @_rmdir(dir)
	filter_ghost: (dirpath, paths) ->
		target = @path.join(@home, 'ghost', dirpath)
		@_filter_elements(target, paths)
	filter_balloon: (dirpath, paths) ->
		target = @path.join(@home, 'balloon', dirpath)
		@_filter_elements(target, paths)
	filter_shell: (dirpath, shellpath, paths) ->
		target = @path.join(@home, 'ghost', dirpath, 'shell', shellpath)
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
									.then (entry_paths) ->
										[(entry_path.replace basedir, ''), entry_paths...]
								else
									[entry_path.replace basedir, '']
						)(@path.join dir, entry)
					Promise.all promises
					.then (entry_paths_list) =>
						entry_paths = []
						for a_entry_paths in entry_paths_list
							entry_paths = entry_paths.concat a_entry_paths
						resolve entry_paths
		basedir = RegExp '^' + target.replace(/(\W)/g, '\\$1') + '[\\\\/]?', 'i'
		readdir target, basedir
	_stat: (target) ->
		new Promise (resolve, reject) =>
			@fs.stat target, (err, stats) -> if err? then reject() else resolve(stats)
	_unlink: (target) ->
		new Promise (resolve, reject) =>
			@fs.unlink target, (err) -> if err? then reject() else resolve()
	_rmdir: (target) ->
		new Promise (resolve, reject) =>
			@fs.rmdir target, (err) -> if err? then reject() else resolve()
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
						Promise.all rmdirs.reverse().map (dir) => @_rmdir(dir)
	_mkpath: (target) ->
		mode = parseInt("0777", 8)
		mkdir = (target) =>
			if !target then target = '/'
			new Promise (resolve, reject) =>
				@fs.stat target, (err, stats) =>
					if err? then resolve(false) else resolve(true)
			.then (exists) =>
				unless exists
					mkdir(@path.dirname(target))
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
							@fs.writeFile itempath, new @Buffer(value.buffer()), {}, (err) ->
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
								@fs.readFile itempath, {}, (err, buffer) -> if err? then reject() else resolve(buffer)
							.then (buffer) =>
								directory[item] = @_toArrayBuffer(buffer)
				)(item)
			Promise.all promises
			.then =>
				new NanikaDirectory directory
	_FSFileToDirectory: (target, item) ->
		itempath = @path.join(target, item)
		new Promise (resolve, reject) =>
			@fs.readFile itempath, {}, (err, buffer) -> if err? then reject() else resolve(buffer)
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

if module?.exports?
	module.exports = NanikaStorage
else if @Ikagaka?
	@Ikagaka.NanikaStorage = NanikaStorage
else
	@NanikaStorage = NanikaStorage
