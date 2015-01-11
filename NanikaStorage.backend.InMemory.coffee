NanikaStorage = @NanikaStorage
NanikaStorage ?= Backend: {}

class NanikaStorage.Backend.InMemory
	constructor: (@_ghosts={}, @_balloons={}, @_profiles={ghost: {}, balloon: {}}) ->
	ghost: (dirpath, directory, merge) ->
		if directory?
			if merge and @_ghosts[dirpath]?
				@_ghosts[dirpath] = @_ghosts[dirpath].addDirectory(directory)
			else
				@_ghosts[dirpath] = directory
		unless @_ghosts[dirpath]? then throw new Error "ghost not found at [#{dirpath}]"
		@_ghosts[dirpath]
	balloon: (dirpath, directory, merge) ->
		if directory?
			if merge and @_balloons[dirpath]?
				@_balloons[dirpath] = @_balloons[dirpath].addDirectory(directory)
			else
				@_balloons[dirpath] = directory
		unless @_balloons[dirpath]? then throw new Error "balloon not found at [#{dirpath}]"
		@_balloons[dirpath]
	ghost_master: (dirpath, directory, merge) ->
		if directory?
			if merge
				old_ghost = @ghost(dirpath)
			else
				old_ghost = @ghost(dirpath).removeElements('ghost/master')
			@ghost dirpath, old_ghost.addDirectory(directory.wrapDirectory('ghost/master'))
		ghost = @ghost(dirpath)
		unless ghost.hasElement('ghost/master') then throw new Error "ghost/master not found at [#{dirpath}]"
		ghost.getDirectory('ghost/master')
	shell: (dirpath, shellpath, directory, merge) ->
		if directory?
			if merge
				old_ghost = @ghost(dirpath)
			else
				old_ghost = @ghost(dirpath).removeElements('shell/' + shellpath)
			@ghost dirpath, old_ghost.addDirectory(directory.wrapDirectory('shell/' + shellpath))
		ghost = @ghost(dirpath)
		unless ghost.hasElement('shell/' + shellpath) then throw new Error "shell/#{shellpath} not found at [#{dirpath}]"
		ghost.getDirectory('shell/' + shellpath)
	base_profile: (profile) ->
		if profile?
			@_profiles.base = profile
		@_profiles.base || {}
	ghost_profile: (dirpath, profile) ->
		if profile?
			unless @_profiles.ghost[dirpath]?
				@_profiles.ghost[dirpath] = ghost: {}, shell: {}
			@_profiles.ghost[dirpath].ghost = profile
		@_profiles.ghost[dirpath]?.ghost || {}
	balloon_profile: (dirpath, profile) ->
		if profile?
			@_profiles.balloon[dirpath] = profile
		@_profiles.balloon[dirpath] || {}
	shell_profile: (dirpath, shellpath, profile) ->
		if profile?
			@_profiles.ghost[dirpath].shell[shellpath] = profile
		@_profiles.ghost[dirpath]?.shell[shellpath] || {}
	ghosts: ->
		Object.keys(@_ghosts)
	balloons: ->
		Object.keys(@_balloons)
	shells: (dirpath) ->
		@ghost(dirpath).getDirectory('shell').listChildren()
	ghost_names: ->
		Object.keys(@_ghosts)
		.map (directory) => @_ghosts[directory].install.name
		.sort()
	balloon_names: ->
		Object.keys(@_balloons)
		.map (directory) => @_balloons[directory].descript.name
		.sort()
	shell_names: (dirpath) ->
		shell = @ghost(dirpath).getDirectory('shell')
		shelldirs = shell.listChildren()
		shellnames = []
		for dir in shelldirs
			name = shell.getDirectory(dir).descript?.name
			if name?
				shellnames.push name
		shellnames
	ghost_name: (dirpath) ->
		@ghost(dirpath).install.name
	balloon_name: (dirpath) ->
		@balloon(dirpath).descript.name
	shell_name: (dirpath, shellpath) ->
		@shell(dirpath, shellpath).descript.name
	delete_ghost: (dirpath) ->
		delete @_ghosts[dirpath]
	delete_balloon: (dirpath) ->
		delete @_balloons[dirpath]
	filter_ghost: (dirpath, paths) ->
		@ghost dirpath, @ghost(dirpath).getElements(paths)
	filter_balloon: (dirpath, paths) ->
		@balloon dirpath, @balloon(dirpath).getElements(paths)
	filter_shell: (dirpath, shellpath, paths) ->
		@shell dirpath, shellpath, @shell(dirpath, shellpath).getElements(paths)

if module?.exports?
	module.exports = NanikaStorage
else if @Ikagaka?
	@Ikagaka.NanikaStorage = NanikaStorage
else
	@NanikaStorage = NanikaStorage
