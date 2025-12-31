/*:
 * @plugindesc Adds functions for fast forwarding game scenes significantly, showing a loading screen.
 * @author MissingTextureMan101

 * @help
 * In order to start a skip, use MTM101.SkipCutscene.StartSkip(). Right now there is no built in UI/GUI for skipping cutscenes so you will have to figure this out yourself.
 * Skipping will continue until a comment with the text "END SKIP" is reached, or when you call MTM101.SkipCutscene.EndSkip().
 * BE SURE TO ADD AN "END SKIP" OR ELSE THE SKIP WILL NOT STOP, EVEN IF THE EVENT ENDS
 * 
 * MTM101.SkipCutscene.currentlySkipping() - Returns true if the game is currently fast forwarding, use this to skip anything that requires player input
 * MTM101.SkipCutscene.skipSpeed - Set this to change the skip speed(THIS IS GLOBAL, IF YOU CHANGE IT BE SURE TO SET IT BACK)
 * MTM101.SkipCutscene.StartSkip() - Starts the skip
 * MTM101.SkipCutscene.EndSkip() - Ends the skip
 * 
 * @param Skip Speed
 * @type Number
 * @desc The amount of extra steps to skip during a skip, lower this number if you are targetting lower end devices
 * @default 50
 * @min 1
 * @max 500
 * @param Debug Mode
 * @type Boolean
 * @desc Set this to true to turn on Debug Mode, which disables the loading screen graphic
 
*/

MTM101 = MTM101 || {}

MTM101.SkipCutscene = {}

MTM101.SkipCutscene.Parameters = PluginManager.parameters("MTM101_SkipCutscene");

MTM101.SkipCutscene.debugMode = MTM101.SkipCutscene.Parameters["Debug Mode"] == "true";
MTM101.SkipCutscene.skipSpeed = Number(MTM101.SkipCutscene.Parameters["Skip Speed"]);

MTM101.SkipCutscene.currentlySkipping = function()
{
	return SceneManager._scene._beingCustomSkipped;
}

MTM101.SkipCutscene.StartSkip = function()
{
	// so your ears don't bleed
	WebAudio.setMasterVolume(0);
    Graphics.setVideoVolume(0);
	SceneManager._scene._beingCustomSkipped = true;
}

// mute all sound effect calls when skipping so it doesn't sound weird
var AudioManager_playStaticSe = AudioManager.playStaticSe;

AudioManager.playStaticSe = function(se) 
{
	if (SceneManager._scene._beingCustomSkipped) return;
	AudioManager_playStaticSe.call(this,se)
};

var AudioManager_playSe = AudioManager.playSe;

AudioManager.playSe = function(se) 
{
	if (SceneManager._scene._beingCustomSkipped) return;
	AudioManager_playSe.call(this,se)
};

MTM101.SkipCutscene.EndSkip = function()
{
	SceneManager._scene._beingCustomSkipped = false;
	// so your ears can hear
	WebAudio.setMasterVolume(AudioManager._masterVolume);
    Graphics.setVideoVolume(AudioManager._masterVolume);
	AudioManager.stopSe();
}

var Old_Scene_Base_prototype_initialize = Scene_Base.prototype.initialize;

Scene_Base.prototype.initialize = function()
{
	Old_Scene_Base_prototype_initialize.call(this);
	this._beingCustomSkipped = false;
}


var Window_Message_prototype_update = Window_Message.prototype.update;

Window_Message.prototype.update = function()
{
	Window_Message_prototype_update.call(this);
	if (SceneManager._scene._beingCustomSkipped)
	{
		this.terminateMessage();
		//this._pauseSkip = true;
		//this._showFast = true;
		//this._waitCount = 0;
		//this.pause = false;
	}
}

var Old_SceneManager_updateScene = SceneManager.updateScene;

SceneManager.updateScene = function()
{
	Old_SceneManager_updateScene.call(this);
	if (this._scene)
	{
		if (this.isCurrentSceneStarted()) 
		{
			if (this._scene._beingCustomSkipped)
			{
				for (var i = 1; i < (MTM101.SkipCutscene.skipSpeed); i++)
				{
					if (!this._scene._beingCustomSkipped) break; //don't unnecessarily run extra steps
					this._scene.update();
				}
			}
        }
	}
}

var Old_SceneManager_renderScene = SceneManager.renderScene

SceneManager.renderScene = function()
{
	if (MTM101.SkipCutscene.debugMode)
	{
		Old_SceneManager_renderScene.call(this);
		return;
	}
	if (this._scene)
	{
		if (this.isCurrentSceneStarted()) 
		{
			if (this._scene._beingCustomSkipped)
			{
				Graphics._loadingCount = 10000;
				Graphics._skippingLoad = true;
				Graphics.updateLoading();
				return;
			}
		}
	}
	if (Graphics._skippingLoad)
	{
		Graphics.endLoading();
		Graphics._skippingLoad = false;
	}
	Old_SceneManager_renderScene.call(this);
}

var Old_Game_Interpreter_prototype_command108 = Game_Interpreter.prototype.command108

Game_Interpreter.prototype.command108 = function()
{
	var return_val = Old_Game_Interpreter_prototype_command108.call(this);
	if (this._comments[0] == "END SKIP")
	{
		MTM101.SkipCutscene.EndSkip();
	}
	return return_val
}