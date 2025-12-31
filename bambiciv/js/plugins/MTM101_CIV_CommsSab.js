


var old_Game_SystemInitialize = Game_System.prototype.initialize;


Game_System.prototype.initialize = function()
{
	old_Game_SystemInitialize.call(this);
	this._commsSabotageActive = false;
}

var old_Window_Base_prototype_drawItemName = Window_Base.prototype.drawItemName;
var fakeItem = {
	name:"???",
	iconIndex:16,
	description:"You can't quite discern what this is...",
};
Window_Base.prototype.drawItemName = function(item, x, y, width) 
{
	if (!$gameSystem._commsSabotageActive)
	{
		old_Window_Base_prototype_drawItemName.call(this, item, x, y, width);
		return;
	}
    if (DataManager.isSkill(item))
	{
		old_Window_Base_prototype_drawItemName.call(this, fakeItem, x, y, width);
    }
	else
	{
		old_Window_Base_prototype_drawItemName.call(this, item, x, y, width);
	}
};

var old_Window_Help_prototype_setItem = Window_Help.prototype.setItem;
Window_Help.prototype.setItem = function(item)
{
	if (!$gameSystem._commsSabotageActive)
	{
		old_Window_Help_prototype_setItem.call(this, item);
		return;
	}
	old_Window_Help_prototype_setItem.call(this, DataManager.isSkill(item) ? fakeItem : item);
    //this.setText(item ? item.description : '');
};