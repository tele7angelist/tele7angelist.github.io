/*:
 * @plugindesc Adds the ability for music overrides
 * @author MissingTextureMan101

 * @help
 * todo
 
*/


var Game_MapOldAutoplay = Game_Map.prototype.autoplay;

var Game_SystemOldinitialize = Game_System.prototype.initialize;

Game_Map.prototype.autoplay = function() 
{
	var override = $gameSystem.currentMusicOverride();
	if (override != null)
	{
		AudioManager.playBgm(override);
		if ($dataMap.autoplayBgs) 
		{
			AudioManager.playBgs($dataMap.bgs);
		}
		return;
	}
	Game_MapOldAutoplay.call(this);
}

Game_System.prototype.initialize = function()
{
	Game_SystemOldinitialize.call(this);
	this._currentMusicOverride = null;
}

Game_System.prototype.currentMusicOverride = function()
{
	if (typeof(this._currentMusicOverride) === "undefined")
	{
		this._currentMusicOverride = null;
	}
	return this._currentMusicOverride;
}

Game_System.prototype.switchCurrentMusicOverride = function(override)
{
	this._currentMusicOverride = override;
}

var oldPluginCommandGT = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) 
{
	if (command.toLowerCase() == "settemporarymusic")
	{
		var tempMusicName = eval(args[0]);
		var tempMusicVolume = eval(args[1]);
		$gameSystem.switchCurrentMusicOverride({
			name:tempMusicName,
			volume:tempMusicVolume,
			pitch:100,
			pan:0
		});
		$gameMap.autoplay(); //restart the music
	}
	else if (command.toLowerCase() == "cleartemporarymusic")
	{
		$gameSystem.switchCurrentMusicOverride(null);
		$gameMap.autoplay(); //restart the music
	}
	else if (command.toLowerCase() == "cleartemporarymusicnoreset")
	{
		$gameSystem.switchCurrentMusicOverride(null);
	}
	else
	{
		oldPluginCommandGT.call(this, command, args);
	}
}