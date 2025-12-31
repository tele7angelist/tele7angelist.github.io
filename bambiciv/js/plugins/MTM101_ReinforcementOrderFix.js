//=============================================================================
// MTM101_ReinforcementOrderFix.js
//=============================================================================


/*:
 * @plugindesc Fixes compatability between HIME_EnemyReinforcements.js and YEP_X_TurnOrderDisplay.js
 * @author MissingTextureMan101
 * @help
 * Plug and play
*/


var Old_Game_Troop_prototype_addEnemyReinforcement = Game_Troop.prototype.addEnemyReinforcement;

Game_Troop.prototype.addEnemyReinforcement = function(troopId, memberId)
{
	Old_Game_Troop_prototype_addEnemyReinforcement.call(this, troopId, memberId);
	var newIcon = new Window_TurnOrderIcon(this, this._enemies.length - 1)
	SceneManager._scene._turnOrderDisplay.push(newIcon);
	SceneManager._scene.setupTurnOrderDisplayWindow(newIcon);
}