/*:
 * @author MissingTextureMan101 and AM_Erizur
 * @plugindesc Allows customization of balloon offsets.
 * @help
 * Ben can you buy me rewired free please
 * @param Offsets
 * @type struct<BalloonOffset>[]
 * @default []
 * @desc The balloon offsets to apply per character
*/

/*~struct~BalloonOffset:
 * @param Image
 * @type text
 * @desc The sprite this offset applies to
 *
 * @param Index
 * @type number
 * @default 0
 * @desc The index in the character sheet that this offset applies to
 *
 * @param Offset
 * @type number
 * @default 0
 * @min -256
 * @max 256
 * @desc The offset itself
 */
 
var MTM101 = MTM101 || {};


MTM101.balloonOffsets = [];

MTM101.balloonOffsets.Offsets = [];

MTM101.balloonOffsets.Parameters = PluginManager.parameters("MTM101_ERZ_BalloonFixer");

var data = JSON.parse(MTM101.balloonOffsets.Parameters["Offsets"]);

for (let i = 0; i < data.length; i++)
{
	MTM101.balloonOffsets.Offsets.push(JSON.parse(data[i]));
}

var _Sprite_Character_updateBalloon = Sprite_Character.prototype.updateBalloon;
Sprite_Character.prototype.updateBalloon = function() {
	_Sprite_Character_updateBalloon.call(this);
	if (this._balloonSprite) 
	{
		for (var i = 0; i < MTM101.balloonOffsets.Offsets.length; i++)
		{
			var offset = MTM101.balloonOffsets.Offsets[i]
			if (offset.Image == this._characterName && offset.Index == this._characterIndex)
			{
				this._balloonSprite.y = (this.y - this.height) + Number(offset.Offset);
				return;
			}
		}
	}
}