var MTM101 = MTM101 || {}

var Game_Map_prototype_initialize = Game_Map.prototype.initialize
Game_Map.prototype.initialize = function()
{
	Game_Map_prototype_initialize.call(this);
	$gameMap = this;
	this._parallelinterpreter_initialized = true;
	this._parallelinterpreter = new Game_Interpreter(); // a second interpreter to run any stray functions
	this._parallelinterpreter.setup([],0);
}

var Game_Map_prototype_updateEvents = Game_Map.prototype.updateEvents
Game_Map.prototype.updateEvents = function()
{
	if (!this._parallelinterpreter_initialized)
	{
		this._parallelinterpreter = new Game_Interpreter(); // a second interpreter to run any stray functions
		this._parallelinterpreter.setup([],0);
		this._parallelinterpreter_initialized = true;
	}
	if (this._parallelinterpreter._subinterpreters.length == 0)
	{
		Game_Map_prototype_updateEvents.call(this);
		return;
	}
	this._parallelinterpreter.updateChild();
	Game_Map_prototype_updateEvents.call(this);
}

var Game_Interpreter_prototype_initialize = Game_Interpreter.prototype.initialize

Game_Interpreter.prototype.initialize = function(depth)
{
	Game_Interpreter_prototype_initialize.call(this,depth);
	//this._subinterpreters = new Map();
	//breakOn(this, "_subinterpreters")
}

var Game_Interpreter_prototype_setup = Game_Interpreter.prototype.setup
Game_Interpreter.prototype.setup = function(list, eventId) 
{
	Game_Interpreter_prototype_setup.call(this, list, eventId);
	var finalList = [];
	this._functions = {};
	this._functionslist = [];
	this._subinterpreters = new Map();
	this._yieldinterpreter = "";
	this._yielding = false;
	var doneProcessing = {};
	var processingKeys = [];
	for (var i = 0; i < this._list.length; i++)
	{
		var cmd = this._list[i]
		if ((cmd.code === 108))
		{
			if (cmd.parameters[0].match(/<(?:FUNCTION):[ ](.+)>/i))
			{
				var id = RegExp.$1;
				if (doneProcessing[id]) continue;
				doneProcessing[id] = false;
				processingKeys.push(id); // add the processing key
				this._functions[id] = [];
				this._functionslist.push(id);
				continue;
			}
			else if ((cmd.code === 108) && cmd.parameters[0].match(/<(?:END FUNCTION):[ ](.+)>/i))
			{
				var id = RegExp.$1;
				doneProcessing[id] = true;
				continue;
			}
		}
		var processed = false;
		for (var k = 0; k < processingKeys.length; k++)
		{
			var key = processingKeys[k];
			if (!doneProcessing[key])
			{
				this._functions[key].push(cmd);
				processed = true;
			}
		}
		if (!processed)
		{
			finalList.push(cmd);
		}
	}
	this._list = finalList
}

Game_Interpreter.prototype.createSubInterpreter = function(name, function_name)
{
	var interp = new Game_Interpreter();
	interp.setup(JsonEx.makeDeepCopy(this._functions[function_name]), this._eventId);
	interp.mergeFunctionsWith(this);
	this._subinterpreters.set(name, {
		"_interp":interp,
		"_paused":false
	});
	return this._subinterpreters.get(name);
}

Game_Interpreter.prototype.mergeFunctionsWith = function(inter)
{
	for (var i = 0; i < inter._functionslist.length; i++)
	{
		var key = inter._functionslist[i];
		if (this._functions[key] === undefined)
		{
			this._functions[key] = JsonEx.makeDeepCopy(inter._functions[key]); //make a copy
			this._functionslist.push(key)
		}
	}
}

Game_Interpreter.prototype.runForEachSubInterpreter = function(tocall)
{
	if (typeof this._subinterpreters["entries"] === "undefined")
	{
		console.warn("TODO: fix bug");
		this._subinterpreters = new Map();
		return;
	}
	for (var [k, v] of this._subinterpreters.entries()) 
	{
		if (v === undefined) return;
		tocall.call(this, k, v);
	}
}

Game_Interpreter.prototype.getSubInterpreter = function(name)
{
	var interp = this._subinterpreters.get(name)
	if (interp === undefined) return undefined;
	return interp._interp;
}

Game_Interpreter.prototype.subInterpreterExists = function(name)
{
	return !(this.getSubInterpreter(name) === undefined)
}


Game_Interpreter.prototype.isWaitingNoUpdate = function()
{
	return (this._waitMode != '') || (this._waitCount > 0);
}

Game_Interpreter.prototype.updateSubInterpreter = function(name)
{
	var interp = this.getSubInterpreter(name);
	if (!(interp === undefined))
	{
		interp.update();
		if (!interp.isRunning())
		{
			this._subinterpreters.delete(name);
		}
	}
}

var Game_Interpreter_prototype_updateChild = Game_Interpreter.prototype.updateChild
Game_Interpreter.prototype.updateChild = function()
{
	this.runForEachSubInterpreter(function(key, val)
	{
		var me = val._interp;
		if (val._paused) return;
		this.updateSubInterpreter(key);
	});
	return Game_Interpreter_prototype_updateChild.call(this);
}


var Game_Interpreter_prototype_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
Game_Interpreter.prototype.updateWaitMode = function()
{
	if (this._waitMode == "interpreter_done")
	{
		var interp = this.getSubInterpreter(this._yieldinterpreter);
		if (interp === undefined)
		{
			this._waitMode = '';
			return false;
		}
		return true;
	}
	else if (this._waitMode == "interpreter_yield")
	{
		var interp = this.getSubInterpreter(this._yieldinterpreter);
		if (interp === undefined)
		{
			this._waitMode = '';
			return false;
		}
		if (interp._yielding)
		{
			this._subinterpreters.get(this._yieldinterpreter)._paused = true;
			interp._yielding = false;
			this._waitMode = '';
			return false;
		}
		return true;
	}
	else if (this._waitMode == "interpreter_nomoreyield")
	{
		if (!this._yielding)
		{
			this._waitMode = '';
			return false;
		}
		return true;
	}
	else if (this._waitMode == "interpreter_step")
	{
		var interp = this.getSubInterpreter(this._yieldinterpreter);
		if (interp === undefined)
		{
			this._waitMode = '';
			return false;
		}
		if (!interp.updateWait())
		{
			this._waitMode = '';
			return false;
		}
		return true;
	}
	return Game_Interpreter_prototype_updateWaitMode.call(this);
}

var Game_Interpreter_prototype_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) 
{
	
	if (command.toLowerCase() === "changeeventcontext")
	{
		this._eventId = eval(args[0]);
	}
	else if (command.toLowerCase() === "changefunctioncontext")
	{
		var interp = this.getSubInterpreter(args[0]);
		if (!(interp === undefined))
		{
			interp._eventId = eval(args[1]);
		}
	}
	else if (command.toLowerCase() === "makefunctionpersist")
	{
		var interp = this._subinterpreters.get(args[0]);
		if (interp === undefined) return;
		$gameMap._parallelinterpreter._subinterpreters.set(args[0],interp);
		this._subinterpreters.delete(args[0]);
		/*for (var [k, v] of this._subinterpreters.entries()) 
		{
			
		}*/
	}
	else if (command.toLowerCase() === "yield")
	{
		this._yielding = true;
		if (args[0].toLowerCase() == "wait")
		{
			this.setWaitMode('interpreter_nomoreyield');
		}
	}
	else if (command.toLowerCase() === "waitforfunction")
	{
		this._yieldinterpreter = args[1];
		if (args[0].toLowerCase() == "yield")
		{
			this.setWaitMode('interpreter_yield');
		}
		else if (args[0].toLowerCase() == "step")
		{
			this.setWaitMode('interpreter_step');
		}
		else if (args[0].toLowerCase() == "complete")
		{
			this.setWaitMode('interpreter_done');
		}
	}
	else if (command.toLowerCase() === "callfunction")
	{
		this.createSubInterpreter("_" + args[1], args[1]);
		if (args[0].toLowerCase() == "sync")
		{
			this._yieldinterpreter = "_" + args[1];
			this.setWaitMode('interpreter_done');
		}
	}
	else if (command.toLowerCase() === "spawnfunction")
	{
		var name = args[1] || ("_" + args[0]);
		this.createSubInterpreter(name, args[0]);
		this._subinterpreters.get(name)._paused = true;
	}
	else if (command.toLowerCase() === "setnameeval")
	{
		var name = eval(args[1])
		var old_name = args[0]
		var old = this._subinterpreters.get(old_name)
		if ((args[2] || "").toLowerCase() == "persist")
		{
			var interp = this._subinterpreters.get(old_name);
			if (interp === undefined) return;
			$gameMap._parallelinterpreter._subinterpreters.set(name,interp);
			this._subinterpreters.delete(old_name);
		}
		else
		{
			this._subinterpreters.set(name, old)
			this._subinterpreters.delete(old_name)
		}
	}
	else if (command.toLowerCase() === "pausefunction")
	{
		this._subinterpreters.get(args[0])._paused = true;
	}
	else if (command.toLowerCase() === "resumefunction")
	{
		this._subinterpreters.get(args[0])._paused = false;
	}
	else if (command.toLowerCase() === "killfunction")
	{
		if (this.subInterpreterExists(args[0]))
		{
			this._subinterpreters.delete(args[0]);
		}
	}
	else if (command.toLowerCase() === "stepfunction")
	{
		if (!this.subInterpreterExists(args[1]))
		{
			return;
		}
		this.updateSubInterpreter(args[1]);
		if (args[0].toLowerCase() == "sync")
		{
			this._yieldinterpreter = args[1];
			this.setWaitMode('interpreter_step');
		}
	}
	else
	{
		Game_Interpreter_prototype_pluginCommand.call(this,command,args);
	}
}