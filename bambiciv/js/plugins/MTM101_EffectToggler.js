//=============================================================================
// MTM101_EffectToggler.js
//=============================================================================


/*:
 * @plugindesc Allows certain effects to be disabled via a script call.
 * @author MissingTextureMan101
 * @help
 * List of variables, use a script call to set these to true or false
 * MTM101.EffectToggler.ScreenFlash
 * MTM101.EffectToggler.ForceLowercase
*/


var MTM101 = MTM101 || {};

MTM101.EffectToggler = {};

MTM101.EffectToggler.ScreenFlash = true;

MTM101.EffectToggler.ForceLowercase = true;

MTM101.EffectToggler.SlursEnabled = false;

var original_screenflash = Game_Screen.prototype.startFlash;

Game_Screen.prototype.startFlash = function(color, duration)
{
	if (MTM101.EffectToggler.ScreenFlash)
	{
		original_screenflash.call(this,color, duration);
	};
}

var original_addText = Game_Message.prototype.addText; //save the original function so it can be called later
Game_Message.prototype.addText = function(txt) //override the original function
{
	if (MTM101.EffectToggler.ForceLowercase)
	{
		txt = txt.toLowerCase(); //this is literally it lol
	}
	original_addText.call(this,txt);
}