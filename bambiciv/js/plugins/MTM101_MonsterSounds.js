MTM101 = MTM101 || {}

MTM101.EnemySounds = []

MTM101.EnemySounds.Parameters = PluginManager.parameters("MTM101_MonsterSounds");

/*:
 * @author MissingTextureMan101
 * @plugindesc Allows sounds to be assigned to a enemy to be played manually, when appearing, or when entering a battle via a common event.
 * @help
 * this plugin is massive wip and will likely be completely useless out of any context that isnt bambi civ atm
 * 
 * @param Sounds
 * @type struct<EnemySoundTable>[]
 * @default []
 * @desc All the possible monster sounds
 *
*/

/*~struct~EnemySoundTable:
 * @param ID 
 * @type enemy
 * @desc The enemy this applies to
 *
 * @param Sounds
 * @type struct<EnemySound>[]
 * @default []
 * @desc The list of possible sounds
 *
 */
 
/*~struct~EnemySound:
 * @param Sound 
 * @type file
 * @dir audio/se/
 * @require 1
 *
 * @param Volume
 * @type number
 * @default 90
 *
 * @param Pitch
 * @type number
 * @default 100
 *
 */

var data = JSON.parse(MTM101.EnemySounds.Parameters["Sounds"]);

MTM101.EnemySounds.SoundMap = {}

for (let i = 0; i < data.length; i++)
{
	var currentEnemyData = JSON.parse(data[i]);
	var currentEnemySoundArray = JSON.parse(currentEnemyData.Sounds);
	var currentEnemySoundData = []
	for (var j = 0; j < currentEnemySoundArray.length; j++)
	{
		var parsedData = JSON.parse(currentEnemySoundArray[j]);
		currentEnemySoundData.push({
			name:parsedData.Sound,
			volume:Number(parsedData.Volume),
			pitch:Number(parsedData.Pitch),
			pan:0
		});
	}
	MTM101.EnemySounds.SoundMap[currentEnemyData.ID] = currentEnemySoundData;
};

Game_Enemy.prototype.playMonsterSound = function()
{
	if (!this._hasPlayedMonsterSound)
	{
		this._hasPlayedMonsterSound = true;
		var soundmapForMe = MTM101.EnemySounds.SoundMap[this.enemyId()];
		if (soundmapForMe)
		{
			AudioManager.playSe(soundmapForMe[Math.randomInt(soundmapForMe.length)]);
		}
	}
}

Game_Enemy.prototype.appear = function()
{
	Game_BattlerBase.prototype.appear.call(this);
	this.playMonsterSound();
}

var old_Game_Enemyprototypesetup = Game_Enemy.prototype.setup;

Game_Enemy.prototype.setup = function(enemyId, x, y)
{
	old_Game_Enemyprototypesetup.call(this, enemyId, x, y);
	this._hasPlayedMonsterSound = false;
}