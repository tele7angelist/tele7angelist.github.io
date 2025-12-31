/*:
 * @plugindesc epic mode
 * @author MissingTextureMan101
 * @help
 * best plugin
*/



var AudioManager_playSe = AudioManager.playSe;

AudioManager.playSe = function(se) 
{
	se.name = "VINE_BOOM"
	return AudioManager_playSe.call(this,se)
};

var AudioManager_playStaticSe = AudioManager.playStaticSe;

AudioManager.playStaticSe = function(se) 
{
	se.name = "VINE_BOOM"
	return AudioManager_playStaticSe.call(this,se)
};

AudioManager_playBgm = AudioManager.playBgm;

AudioManager.playBgm = function(bgm, pos) 
{
	bgm.name = "bestsong"
	return AudioManager_playBgm.call(this,bgm, pos)
};
