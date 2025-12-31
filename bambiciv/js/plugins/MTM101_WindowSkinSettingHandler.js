/*:
 * @author MissingTextureMan101
 * @plugindesc Stores window skins that can be used to create a window skin option
 * @help
 * TODO: put scriptcalls here
 * @param WindowSkins
 * @type struct<WindowSkin>[]
 * @default []
*/

/*~struct~WindowSkin:
 * @param Graphic
 * @type text
 * @default "Window"
 * @desc The Graphic that the window will use
 *
 * @param Name
 * @type text
 * @default "Standard"
 * @desc The name of the window skin
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