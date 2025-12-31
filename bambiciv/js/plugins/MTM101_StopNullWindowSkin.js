/*:
 * @author MissingTextureMan101
 * @plugindesc Defaults the windowskin to "Window" if it ever becomes undefined. For use with HIME_WindowskinChange
 * @help
 * 
*/

Game_System_prototype_windowskin = Game_System.prototype.windowskin

Game_System.prototype.windowskin = function()
{
	if (typeof this._windowskin === "undefined")
	{
		this._windowskin = "Window"
	}
	return Game_System_prototype_windowskin.call(this)
}