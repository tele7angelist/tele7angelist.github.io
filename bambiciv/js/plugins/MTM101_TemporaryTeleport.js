//=============================================================================
// MTM101_TemporaryTeleport.js
//=============================================================================


/*:
 * @plugindesc Temporarily teleports the player to a certain position that can be reverted.
 * @author MissingTextureMan101
 * @help
 * There are only two plugin commands
 * ===================
 * TempTeleportPlayer
 * Can either be used like "TempTeleportPlayer x y" for specific cords
 * Or can be used as "TempTeleportPlayer event id" for a specific event, where ID is the event id
 * ===================
 * RevertPlayerFromTempTeleport
 * This function takes no arguments, and sends the player back.
 * ===================
 * Note that this was only made for fixing audio in cutscenes, so none of the temp teleport values save, and can persist throughout a file.
 * I will be surprised if anyone finds as much use in this as I have.
*/


var MTM101 = MTM101 || {}

MTM101.tempTeleport = {}

MTM101.tempTeleport.tempX = 0
MTM101.tempTeleport.tempY = 0
MTM101.tempTeleport.tempDir = 2

var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;

Game_Interpreter.prototype.pluginCommand = function(command, args) 
{
	var com = command.toLowerCase();
	if (com == "tempteleportplayer")
	{
		MTM101.tempTeleport.tempX = $gamePlayer.x;
		MTM101.tempTeleport.tempY = $gamePlayer.y;
		MTM101.tempTeleport.tempDir = $gamePlayer.direction();
		if (String(args[0]).trim().toLowerCase() == "event")
		{
			var evnt = $gameMap.event(Number(args[1]));
			$gamePlayer.locate(evnt.x, evnt.y);
		}
		else
		{
			$gamePlayer.locate(Number(args[0]), Number(args[1]));
		}
	}
	if (com == "revertplayerfromtempteleport")
	{
		$gamePlayer.locate(MTM101.tempTeleport.tempX, MTM101.tempTeleport.tempY);
		$gamePlayer.setDirection(MTM101.tempTeleport.tempDir);
	}
	_Game_Interpreter_pluginCommand.call(this, command, args);
};