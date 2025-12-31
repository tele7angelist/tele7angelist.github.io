//=============================================================================
// MTM101_BonusPartyFollowers.js
//=============================================================================


/*:
 * @plugindesc Inactive party members don't disappear on the map. You will need a different plugin to increase follower count.
 * @author MissingTextureMan101
 
*/

Game_Follower.prototype.actor = function() {
	//$gameParty.members()
	var actorreal = $gameParty.members()[this._memberIndex];
	return actorreal;
};