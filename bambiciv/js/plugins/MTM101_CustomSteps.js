MTM101 = MTM101 || {}

MTM101.CustomSteps = []

MTM101.CustomSteps.Parameters = PluginManager.parameters("MTM101_CustomSteps");


/*:
 * @author MissingTextureMan101
 * @plugindesc Allows you to run code whenever the player takes a step.
 * @help
 * This plugin requires scripting knowledge to use to its fullest extent.
 * Simply create a step script, use a unique id and plug in the step count and the script.
 * Use the condition if you only want the step counter(and thus the event) to trigger under specific conditions, such as standing on a certain tile or running for instance
 * 
 * @param StepScripts
 * @type struct<StepEvent>[]
 * @default []
 * @desc All the possible step events
 *
*/

/*~struct~StepEvent:
 * @param ID 
 * @type text
 * @default step_event
 * @desc The internal ID used for save files for this step event
 *
 * @param StepCount
 * @type Number
 * @default 30
 * @desc The amount of steps this requires before being ran.
 *
 * @param Script
 * @type note
 * @default "console.log('STEP!')"
 * @desc The code that gets run when this event triggers
 * 
 * @param Condition
 * @type note 
 * @default true;
 * @desc The condition that is required for the step counter for this event to go down.
 * 
 */


var data = JSON.parse(MTM101.CustomSteps.Parameters["StepScripts"]);

MTM101.CustomSteps.StepEvents = []

for (let i = 0; i < data.length; i++)
{
	MTM101.CustomSteps.StepEvents.push(JSON.parse(data[i]))
	MTM101.CustomSteps.StepEvents[i].StepCount = Number(eval(MTM101.CustomSteps.StepEvents[i].StepCount));
	MTM101.CustomSteps.StepEvents[i].Script = eval(MTM101.CustomSteps.StepEvents[i].Script);
	MTM101.CustomSteps.StepEvents[i].Condition = eval(MTM101.CustomSteps.StepEvents[i].Condition);
};

var stepScripts = MTM101.CustomSteps.StepEvents

var Game_Actor_prototype_onPlayerWalk = Game_Actor.prototype.onPlayerWalk

Game_Actor.prototype.onPlayerWalk = function()
{
	Game_Actor_prototype_onPlayerWalk.call(this);
	if ($gamePlayer.isNormal()) 
	{
		for (var i = 0; i < stepScripts.length; i++)
		{
			var script = stepScripts[i]
			if (!eval(script.Condition)) continue;
			if (typeof $gameParty.stepScriptCounts === "undefined")
			{
				$gameParty.stepScriptCounts = {}
			}
			$gameParty.stepScriptCounts[script.ID] = ($gameParty.stepScriptCounts[script.ID] + 1) || 0
			if ($gameParty.stepScriptCounts[script.ID] >= script.StepCount)
			{
				eval(script.Script)
				$gameParty.stepScriptCounts[script.ID] = 0
			}
		}
	}
}