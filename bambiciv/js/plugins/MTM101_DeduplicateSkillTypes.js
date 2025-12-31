var old_BattlerBaseSkillTypeThingy = Game_BattlerBase.prototype.addedSkillTypes;
Game_BattlerBase.prototype.addedSkillTypes = function() {
    var returnValue = old_BattlerBaseSkillTypeThingy.call(this);
	return [... new Set(returnValue)];
};