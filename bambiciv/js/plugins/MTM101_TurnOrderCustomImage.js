/*:
 * @author MissingTextureMan101
 * @plugindesc Allows use for pictures for Yanfly's Turn Order Display
 * @help
 * Use the notetag <Turn Order Picture: [PICTURENAME]>
*/


MTM101 = MTM101 || {}

DataManager_processTODNotetags1 = DataManager.processTODNotetags1

DataManager.processTODNotetags1 = function(group, isActor) 
{
	for (var n = 1; n < group.length; n++) {
		var obj = group[n];
		var notedata = obj.note.split(/[\r\n]+/);

		for (var i = 0; i < notedata.length; i++) {
			var line = notedata[i];
			if (line.match(/<(?:TURN ORDER PICTURE):[ ](.+)>/i)) 
			{
				obj.turnOrderPicture = RegExp.$1;
			}
		}
	}
	DataManager_processTODNotetags1(group,isActor)
};

//turn order picture

Game_Actor.prototype.turnOrderPicture = function() {
  return ImageManager.loadPicture(this.actor().turnOrderPicture);
};

Game_Enemy.prototype.turnOrderPicture = function() {
  return ImageManager.loadPicture(this.enemy().turnOrderPicture);
};

Game_Battler.prototype.turnOrderPicture = function() 
{
  return undefined;
}


//sv battler
Window_TurnOrderIcon_prototype_isUsingSVBattler = Window_TurnOrderIcon.prototype.isUsingSVBattler
Window_TurnOrderIcon.prototype.isUsingSVBattler = function()
{
	if (typeof this.battler().hasSVBattler === "undefined")
	{
		return false;
	}
	if (this.battler().isActor())
	{
		return false;
	}
	if (this.battler().isEnemy())
	{
		return false;
	}
	return Window_TurnOrderIcon_prototype_isUsingSVBattler.call(this);
}




//turn order picture

Game_Enemy_prototype_turnOrderDisplayBitmap_orig = Game_Enemy.prototype.turnOrderDisplayBitmap
Game_Enemy.prototype.turnOrderDisplayBitmap = function() 
{
	if (typeof this.enemy().turnOrderPicture !== "undefined")
	{
	  return this.turnOrderPicture()
	}
	return Game_Enemy_prototype_turnOrderDisplayBitmap_orig.call(this)
};

Game_Actor_prototype_turnOrderDisplayBitmap_orig = Game_Actor.prototype.turnOrderDisplayBitmap
Game_Actor.prototype.turnOrderDisplayBitmap = function() 
{
	if (typeof this.actor().turnOrderPicture !== "undefined")
	{
	  return this.turnOrderPicture()
	}
	return Game_Actor_prototype_turnOrderDisplayBitmap_orig.call(this)
};


// draw battler icon

Window_TurnOrderIcon_prototype_drawBattler = Window_TurnOrderIcon.prototype.drawBattler
Window_TurnOrderIcon.prototype.drawBattler = function() 
{
	var battler = this.battler()
	if (battler.isActor())
	{
		if (typeof battler.actor().turnOrderPicture !== "undefined")
		{
		  this.drawEnemy()
		  return
		}
	}
	if (battler.isEnemy())
	{
		if (typeof battler.enemy().turnOrderPicture !== "undefined")
		{
		  this.drawEnemy()
		  return
		}
	}
	Window_TurnOrderIcon_prototype_drawBattler.call(this)
};


