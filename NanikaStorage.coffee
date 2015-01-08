Promise = @Promise

class NanikaStorage
	@Backend = {}
	constructor: (@backend) ->
	ghost: (dirpath, directory, merge) ->
		new Promise (resolve) -> resolve()
		.then => @backend.ghost(dirpath, directory, merge)
	balloon: (dirpath, directory, merge) ->
		new Promise (resolve) -> resolve()
		.then => @backend.balloon(dirpath, directory, merge)
	ghost_master: (dirpath, directory, merge) ->
		new Promise (resolve) -> resolve()
		.then => @backend.ghost_master(dirpath, directory, merge)
	shell: (dirpath, shellpath, directory, merge) ->
		new Promise (resolve) -> resolve()
		.then => @backend.shell(dirpath, shellpath, directory, merge)
	base_profile: (profile) ->
		new Promise (resolve) -> resolve()
		.then => @backend.base_profile(profile)
	ghost_profile: (dirpath, profile) ->
		new Promise (resolve) -> resolve()
		.then => @backend.ghost_profile(dirpath, profile)
	balloon_profile: (dirpath, profile) ->
		new Promise (resolve) -> resolve()
		.then => @backend.balloon_profile(dirpath, profile)
	shell_profile: (dirpath, shellpath, profile) ->
		new Promise (resolve) -> resolve()
		.then => @backend.shell_profile(dirpath, shellpath, profile)
	ghosts: ->
		new Promise (resolve) -> resolve()
		.then => @backend.ghosts()
	balloons: ->
		new Promise (resolve) -> resolve()
		.then => @backend.balloons()
	shells: (dirpath) ->
		new Promise (resolve) -> resolve()
		.then => @backend.shells(dirpath)
	ghost_names: ->
		new Promise (resolve) -> resolve()
		.then => @backend.ghost_names()
	balloon_names: ->
		new Promise (resolve) -> resolve()
		.then => @backend.balloon_names()
	shell_names: (dirpath) ->
		new Promise (resolve) -> resolve()
		.then => @backend.shell_names(dirpath)
	ghost_name: (dirpath) ->
		new Promise (resolve) -> resolve()
		.then => @backend.ghost_name(dirpath)
	balloon_name: (dirpath) ->
		new Promise (resolve) -> resolve()
		.then => @backend.balloon_name(dirpath)
	shell_name: (dirpath, shellpath) ->
		new Promise (resolve) -> resolve()
		.then => @backend.shell_name(dirpath, shellpath)
	delete_ghost: (dirpath) ->
		new Promise (resolve) -> resolve()
		.then => @backend.delete_ghost(dirpath)
	delete_balloon: (dirpath) ->
		new Promise (resolve) -> resolve()
		.then => @backend.delete_balloon(dirpath)
	filter_ghost: (dirpath, paths) ->
		new Promise (resolve) -> resolve()
		.then => @backend.filter_ghost(dirpath, paths)
	filter_balloon: (dirpath, paths) ->
		new Promise (resolve) -> resolve()
		.then => @backend.filter_balloon(dirpath, paths)
	filter_shell: (dirpath, shellpath, paths) ->
		new Promise (resolve) -> resolve()
		.then => @backend.filter_shell(dirpath, shellpath, paths)
	merge_ghost: (dirpath, directory) ->
		install = directory.install || {}
		if install.refresh
			if install.refreshundeletemask
				undelete_elements = install.refreshundeletemask.split /:/
				@filter_ghost(dirpath, undelete_elements)
				.then =>
					@ghost(dirpath, directory, true)
			else
				@ghost(dirpath, directory, false)
		else
			@ghost(dirpath, directory, true)
	merge_balloon: (dirpath, directory) ->
		install = directory.install || {}
		if install.refresh
			if install.refreshundeletemask
				undelete_elements = install.refreshundeletemask.split /:/
				@filter_balloon(dirpath, undelete_elements)
				.then =>
					@balloon(dirpath, directory, true)
			else
				@balloon(dirpath, directory, false)
		else
			@balloon(dirpath, directory, true)
	merge_shell: (dirpath, shellpath, directory) ->
		install = directory.install || {}
		if install.refresh
			if install.refreshundeletemask
				undelete_elements = install.refreshundeletemask.split /:/
				@filter_shell(dirpath, shellpath, undelete_elements)
				.then =>
					@shell(dirpath, shellpath, directory, true)
			else
				@shell(dirpath, shellpath, directory, false)
		else
			@shell(dirpath, shellpath, directory, true)
	install_nar: (nar, dirpath, sakuraname) ->
		new Promise (resolve) -> resolve()
		.then =>
			install = nar.install || {}
			if install.accept? and install.accept != sakuraname then return null
			switch install.type
				when 'ghost'
					@install_ghost nar, dirpath, sakuraname
				when 'balloon'
					@install_balloon nar, dirpath, sakuraname
				when 'supplement'
					@install_supplement nar, dirpath, sakuraname
				when 'shell'
					@install_shell nar, dirpath, sakuraname
				when 'package'
					@install_package nar, dirpath, sakuraname
				else
					throw new Error 'not supported'
	install_ghost: (nar, dirpath, sakuraname) ->
		new Promise (resolve) -> resolve()
		.then =>
			install = nar.install || {}
			unless install.directory then throw new Error "install.txt directory entry required"
			target_directory = install.directory
			@install_children(nar, dirpath, sakuraname)
			.then ({nar, install_results}) =>
				@merge_ghost(target_directory, nar)
				.then ->
					install_results.push {type: 'ghost', directory: target_directory}
					return install_results
	install_balloon: (nar, dirpath, sakuraname) ->
		new Promise (resolve) -> resolve()
		.then =>
			install = nar.install || {}
			unless install.directory then throw new Error "install.txt directory entry required"
			target_directory = install.directory
			install_results = []
			@merge_balloon(target_directory, nar)
			.then ->
				install_results.push {type: 'balloon', directory: target_directory}
				return install_results
	install_supplement: (nar, dirpath, sakuraname) ->
		new Promise (resolve) -> resolve()
		.then =>
			install = nar.install || {}
			unless dirpath then throw new Error "dirpath required"
			throw 'not implemented'
	install_shell: (nar, dirpath, sakuraname) ->
		new Promise (resolve) -> resolve()
		.then =>
			install = nar.install || {}
			unless dirpath then throw new Error "dirpath required"
			unless install.directory then throw new Error "install.txt directory entry required"
			target_directory = install.directory
			@install_children(nar, dirpath, sakuraname)
			.then ({nar, install_results}) =>
				@ghost(dirpath)
				.then (ghost) =>
					@merge_shell(dirpath, target_directory, nar)
					.then ->
						install_results.push {type: 'shell', directory: target_directory}
						return install_results
	install_package: (nar, dirpath, sakuraname) ->
		install_results = []
		promise = new Promise (resolve) -> resolve()
		for child in nar.listChildren()
			directory = nar.getDirectory(child)
			if Object.keys(directory.files).length
				promise = promise.then =>
					@install_nar directory, dirpath, sakuraname
				.then (child_install_results) ->
					install_results = install_results.concat child_install_results
		promise.then ->
			return install_results
	install_children: (nar, dirpath, sakuraname) ->
		install = nar.install || {}
		install_results = []
		promise = new Promise (resolve) -> resolve()
		for type in ['balloon', 'headline', 'plugin']
			if install[type + '.directory']?
				if install[type + '.source.directory']?
					child_source_directory = install[type + '.source.directory']
				else
					child_source_directory = install[type + '.directory']
				child_nar = nar.getDirectory(child_source_directory)
				unless child_nar.install? then child_nar.install = {}
				child_install = child_nar.install
				child_install.type ?= type
				child_install.directory ?= install[type + '.directory']
				if install[type + '.refresh']? then child_install.refresh ?= install[type + '.refresh']
				if install[type + '.refreshundeletemask']? then child_install.refreshundeletemask ?= install[type + '.refreshundeletemask']
				promise = promise.then =>
					@install_nar child_nar, dirpath, sakuraname
				.then (child_install_results) ->
					install_results = install_results.concat child_install_results
					nar = nar.removeElements(child_source_directory)
		promise.then ->
			nar: nar, install_results: install_results
	uninstall_ghost: (dirpath) ->
		@delete_ghost(dirpath)
	uninstall_balloon: (dirpath) ->
		@delete_balloon(dirpath)

if @NanikaStorage?.Backend?
	for name, value of @NanikaStorage.Backend
		NanikaStorage.Backend[name] = value

if module?.exports?
	module.exports = NanikaStorage
else if @Ikagaka?
	@Ikagaka.NanikaStorage = NanikaStorage
else
	@NanikaStorage = NanikaStorage
