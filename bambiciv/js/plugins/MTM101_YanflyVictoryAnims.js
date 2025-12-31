// YANFLY WHY DO I HAVE TO IMPLEMENT THE MOST BASIC OF SHIT

var old_Game_Enemy_prototype_idleMotion = Game_Enemy.prototype.idleMotion

// javascript should go kill itself
/*var funcsToReplace = ["idleMotion", "abnormalMotion"]

for (var i = 0; i < funcsToReplace.length; i++)
{
	var original = Game_Enemy.prototype[funcsToReplace[i]]
	Game_Enemy.prototype[funcsToReplace[i]] = function()
	{
		if ($gameParty.isAllDead()) return "victory";
		return original.call(this);
	}
}*/


// this code is ugly this code is shit but javascript is shittier
var originalA = Game_Enemy.prototype["idleMotion"]
Game_Enemy.prototype["idleMotion"] = function()
{
	if ($gameParty.isAllDead()) return "victory";
	return originalA.call(this);
}

var originalB = Game_Enemy.prototype["abnormalMotion"]
Game_Enemy.prototype["abnormalMotion"] = function()
{
	if ($gameParty.isAllDead()) return "victory";
	return originalB.call(this);
}