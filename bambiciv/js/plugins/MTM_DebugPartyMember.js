//=============================================================================
// MTM_DebugPartyMember.js
//=============================================================================


/*:
 * @plugindesc Allows for debug party members
 * @author MissingTextureMan101
 
*/

Game_Actor.prototype.skills = function() {
    var list = [];
    this._skills.concat(this.addedSkills()).forEach(function(id) {
        if (!list.contains($dataSkills[id])) {
            list.push($dataSkills[id]);
        }
    });
    return list;
};