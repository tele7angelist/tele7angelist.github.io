//=============================================================================
// Save Screen Tint (Shaz_SaveScreenTint.js)
// by Shaz
// Last Updated: 2018.01.28
//=============================================================================

/*:
 * @plugindesc Allows you to save and later restore the screen tint
 * @author Shaz
 *
 * @help
 * This plugin allows you to save the current screen tint and later restore it.
 * Useful if you call a common event that changes the tint from a number of 
 * maps that could have different tints, and need to be able to change it back
 * again afterwards.
 *
 * 
 * Plugin Commands:
 * ----------------
 *
 * SaveScreenTint - will save the current screen tint
 *
 * RestoreScreenTint seconds wait - will restore the last-saved screen tint
 *                   seconds can be a formula to be evaluated - do not include
 *                   any spaces.  If omitted, defaults to immediate.
 *                   wait must be true or false.  If omitted, defaults to false.
 *
 */

var Imported = Imported || {};
Imported.Shaz_SaveScreenTint = true;

var Shaz = Shaz || {};
Shaz.SST = Shaz.SST || {};
Shaz.SST.Version = 1.00;

(function() {
	var _Shaz_Game_System_initialize = Game_System.prototype.initialize;
	Game_System.prototype.initialize = function() {
		_Shaz_Game_System_initialize.call(this);
		this._savedScreenTint = null;
	};

	Game_System.prototype.saveScreenTint = function(tint) {
		this._savedScreenTint = tint.clone();
	};

	Game_System.prototype.savedScreenTint = function() {
		return this._savedScreenTint;
	};

	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		switch(command.toUpperCase()) {
			case 'SAVESCREENTINT':
				$gameSystem.saveScreenTint($gameScreen.tone());
				break;
			case 'RESTORESCREENTINT':
				var duration = (args[0] ? eval(args[0]) : 0) * 60;
				var wait = args[1] ? eval(args[1]) : false;
				if ($gameSystem.savedScreenTint()) {
					$gameScreen.startTint($gameSystem.savedScreenTint(), duration);
					if (wait) {
						this.wait(duration);
					}
				}
				break;
			default:
				_Game_Interpreter_pluginCommand.call(this, command, args);
		}
	};
})();