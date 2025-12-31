/*:
 * @plugindesc Adds some extra functionality to Yanfly's Footsteps Plugin
 * @author MissingTextureMan101

 * @help
 * Notetags:
 * <Footstep Override: SOUNDNAME>
 * Replace SOUNDNAME with the name of the sound effect you want to replace the footstep sound with.
 * <Footstep Override Volume: VOLUME>
 * Replace VOLUME with the volume of the new footstep sound.
 * <Footstep Override Pitch: PITCH>
 * Replace PITCH with the pitch of the new footstep sound.
 * 
 * @param Positive Pitch Variance
 * @type Number
 * @desc The positive pitch variance for footsteps. This is divided by 1000 and added to the pitch multiplier.
 * @min 0
 * @max 1000
 * @param Negative Pitch Variance
 * @type Number
 * @desc The negative pitch variance for footsteps. This is divided by 1000 and added to the pitch multiplier.
 * @min 0
 * @max 1000
 
*/
var MTM101 = MTM101 || {};
MTM101.FootstepExtensions = MTM101.FootstepExtensions || {};
var Yanfly = Yanfly || {};
Yanfly.Footsteps = Yanfly.Footsteps || {};

MTM101.FootstepExtensions.Parameters = PluginManager.parameters("MTM101_YanflyFootstepSoundsExtensions");


MTM101.FootstepExtensions.PosPitchVariance = Number(MTM101.FootstepExtensions.Parameters["Positive Pitch Variance"])
MTM101.FootstepExtensions.NegPitchVariance = Number(MTM101.FootstepExtensions.Parameters["Negative Pitch Variance"])

MTM101.FootstepExtensions.GetSoundListener = function()
{
	return $gameMap.camTarget
}

var old_Game_CharacterBaseprototypeplayFootstepSound = Game_CharacterBase.prototype.playFootstepSound;
Game_CharacterBase.prototype.playFootstepSound = function(volume, pitch, pan, override) //override is footstepData
{
	pitch += ((Math.randomInt(MTM101.FootstepExtensions.PosPitchVariance + 1) - Math.randomInt(MTM101.FootstepExtensions.NegPitchVariance + 1)) / 1000)
	if (override == undefined)
	{
		old_Game_CharacterBaseprototypeplayFootstepSound.call(this,volume,pitch,pan); //no reason to change the behavior if there is no override
		return;
	}
	if (override == null)
	{
		old_Game_CharacterBaseprototypeplayFootstepSound.call(this,volume,pitch,pan); //no reason to change the behavior if there is no override
		return;
	}
	if (volume <= 0) return;
	if (pitch <= 0) return;
	if (!$dataMap) return;
	var se = {
		name:   override[0],
		volume: override[1] * volume,
		pitch:  override[2] * pitch,
		pan:    pan.clamp(-100, 100)
	};
	AudioManager.playSe(se);
}

MTM101.FootstepExtensions.returnOverrideForArmor = function(armors)
{
	for (var i = 0; i < armors.length; i++)
	{
		var obj = armors[i];
		if (obj.footstepOverride != undefined)
		{
			return [obj.footstepOverride,obj.footstepOverrideVolume,obj.footstepOverridePitch];
		}
	}
	return null;
}


var old_Game_Player_prototype_processFootstepSound = Game_Player.prototype.processFootstepSound;
Game_Player.prototype.processFootstepSound = function() {
  if (this.canPlayFootsteps()) {
    var volume = Yanfly.Param.Footsteps.PlayerVolume || 0;
    var pitch = Yanfly.Param.Footsteps.PlayerPitch || 0;
    var pan = 0;
	var leader = $gameParty.leader();
	var armors = leader.armors();
	var override = MTM101.FootstepExtensions.returnOverrideForArmor(armors);
    this.playFootstepSound(volume, pitch, pan, override);
  };
};

Game_Follower.prototype.processFootstepSound = function()
{
	if (this.canPlayFootsteps() && $gameSystem.canHearFootsteps()) 
	{
		var player = MTM101.FootstepExtensions.GetSoundListener();
		var distance = $gameMap.distance(this.x, this.y, player.x, player.y);
		var volume = Yanfly.Param.Footsteps.EventVolume || 0;
		volume += distance * Yanfly.Param.Footsteps.DistanceVolume;
		var pitch = Yanfly.Param.Footsteps.EventPitch || 0;
		pitch += distance * Yanfly.Param.Footsteps.DistancePitch;
		var pan = 0;
		pan -= $gameMap.deltaX(this.x, player.x);
		var myActor = this.actor();
		var armors = myActor.armors();
		var override = MTM101.FootstepExtensions.returnOverrideForArmor(armors);
		this.playFootstepSound(volume, pitch, pan, override);
	};
}

// override so we can change the sound origin
Game_CharacterBase.prototype.processFootstepSound = function() {
  if (this.canPlayFootsteps() && $gameSystem.canHearFootsteps()) {
    var player = MTM101.FootstepExtensions.GetSoundListener();
    var distance = $gameMap.distance(this.x, this.y, player.x, player.y);
    var volume = Yanfly.Param.Footsteps.EventVolume || 0;
    volume += distance * Yanfly.Param.Footsteps.DistanceVolume;
    var pitch = Yanfly.Param.Footsteps.EventPitch || 0;
    pitch += distance * Yanfly.Param.Footsteps.DistancePitch;
    var pan = 0;
    pan -= $gameMap.deltaX(this.x, player.x);
    this.playFootstepSound(volume, pitch, pan);
  };
};


MTM101.FootstepExtensions.ParseArmorNotetags = function()
{
	for (var n = 1; n < $dataArmors.length; n++) 
	{
		var obj = $dataArmors[n];
		var notedata = obj.note.split(/[\r\n]+/);
		for (var i = 0; i < notedata.length; i++) 
		{
			var line = notedata[i];
			if (line.match(/<(?:FOOTSTEP OVERRIDE):[ ](.+)>/i)) 
			{
				obj.footstepOverride = RegExp.$1;
				if (obj.footstepOverrideVolume == undefined)
				{
					obj.footstepOverrideVolume = 1;
				}
				if (obj.footstepOverridePitch == undefined)
				{
					obj.footstepOverridePitch = 100;
				}
			}
			if (line.match(/<(?:FOOTSTEP OVERRIDE VOLUME):[ ]([0-9.]+)>/i)) 
			{
				obj.footstepOverrideVolume = Number(RegExp.$1);
			}
			if (line.match(/<(?:FOOTSTEP OVERRIDE PITCH):[ ]([0-9.]+)>/i)) 
			{
				obj.footstepOverridePitch = Number(RegExp.$1);
			}
		}
	}
}

var old_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function()
{
	if (!old_DataManager_isDatabaseLoaded.call(this))
	{
		return false;
	}
	if (!MTM101._loadedFootstepExtensions)
	{
		MTM101._loadedFootstepExtensions = true;
		MTM101.FootstepExtensions.ParseArmorNotetags();
	}
	
	return true;
}