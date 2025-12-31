//-----------------------------------------------------------------------------
//  Galv's Disable Dash
//-----------------------------------------------------------------------------
//  For: RPGMAKER MV
//  GALV_DisableDash.js
//-----------------------------------------------------------------------------
//  2016-05-24 - Version 1.0 - release
//-----------------------------------------------------------------------------
// Terms can be found at:
// galvs-scripts.com
//-----------------------------------------------------------------------------

var Imported = Imported || {};
Imported.Galv_DisableDash = true;

var Galv = Galv || {};            // Galv's main object
Galv.DASH = Galv.DASH || {};      // Galv's stuff

//-----------------------------------------------------------------------------
/*:
 * @plugindesc Disable dash in your game.
 * 
 * @author Galv - galvs-scripts.com
 *
 * @param Disable Option
 * @desc true or false if the option is disabled in the default 'Options' menu or not.
 * @default true
 *
 * @help
 *   Galv's Disable Dash
 * ----------------------------------------------------------------------------
 * Dashing is disabled by default. This is for games that don't want the
 * player pushing a button to run faster. The 'Disable Option' plugin setting
 * will permanently disable the player being able to turn "Always Dash" on or
 * off in the options menu.
 *
 * You can change this any time during game using a script call:
 *
 *    $gameSystem._dashEnabled = true;       // turn dashing on
 *    $gameSystem._dashEnabled = false;      // turn dashing back off
 *
 * ----------------------------------------------------------------------------
 */

//-----------------------------------------------------------------------------
//  CODE STUFFS
//-----------------------------------------------------------------------------

(function() {


Galv.DASH.disable = PluginManager.parameters('GALV_DisableDash')["Disable Option"].toLowerCase() == 'true' ? true : false;


Game_Map.prototype.isDashDisabled = function() {
    return !$gameSystem._dashEnabled || $dataMap.disableDashing;
};

if (Galv.DASH.disable) {
	Galv.DASH.Window_Command_addCommand = Window_Command.prototype.addCommand;
	Window_Options.prototype.addCommand = function(name, symbol, enabled, ext) {
		if (symbol === 'alwaysDash') return;
		Galv.DASH.Window_Command_addCommand.call(this,name,symbol,enabled,ext);
	};
};

var Old_Game_System_prototype_onAfterLoad = Game_System.prototype.onAfterLoad
Game_System.prototype.onAfterLoad = function()
{
	Old_Game_System_prototype_onAfterLoad.call(this);
	if (typeof this._dashEnabled === "undefined")
	{
		this._dashEnabled = true;
	}
}

var Old_Game_System_prototype_initialize = Game_System.prototype.initialize
Game_System.prototype.initialize = function() {
    Old_Game_System_prototype_initialize.call(this);
	this._dashEnabled = true;
};


})();