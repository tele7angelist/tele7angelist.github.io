MTM101 = MTM101 || {}

/*:
 * @author MissingTextureMan101
 * @plugindesc Adds the ability to YEP_X_AnimatedSVEnemies to eval battler sprites, depends on TurnOrderCustomImage temporarily
 * @help
 * Yeah.
 * 
*/

MTM101.SVEnemiesEval = []

var evalFunc = function(strng)
{
	if (!strng.startsWith("eval ")) return strng;
	return eval(strng.replace("eval ",""));
}

var Game_Enemy_prototype_svBattlerName = Game_Enemy.prototype.svBattlerName;

Game_Enemy.prototype.svBattlerName = function()
{
	if (this._svBattlerName) return this._svBattlerName;
	var array = this.enemy().sideviewBattler;
    this._svBattlerName = Yanfly.Util.getRandomElement(array);
	if (typeof this._svBattlerName === "undefined")
	{
		return Game_Enemy_prototype_svBattlerName.call(this);
	}
	this._svBattlerName = evalFunc(this._svBattlerName);
	return this._svBattlerName;
}

Game_Enemy.prototype.turnOrderPicture = function()
{
	return ImageManager.loadPicture(evalFunc(this.enemy().turnOrderPicture));
}