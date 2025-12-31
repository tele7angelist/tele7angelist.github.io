/*:
 * @author MissingTextureMan101
 * @plugindesc Macros for text stuff. yay
 * @help
 * Make you're own text replacement macros that do cool things
 * 
 * 
 * @param Macros
 * @type struct<Macro>[]
 * @default ["{\"Name\":\"fartface\",\"Text\":\"fart\"}"]
 * @desc The dialogue macros
*/

/*~struct~Macro:
 * @param Name
 * @type text
 * @default newmacro
 * @desc The name of the macro.
 *
 * @param Text
 * @type text
 * @default ""
 * @desc The text this macro gets replaced with.
 */



var MTM101 = MTM101 || {};


MTM101.dialogueMacros = [];

MTM101.dialogueMacros.Macros = [];

MTM101.dialogueMacros.Parameters = PluginManager.parameters("MTM101_DialogueMacros");

var data = JSON.parse(MTM101.dialogueMacros.Parameters["Macros"]);

for (let i = 0; i < data.length; i++)
{
	MTM101.dialogueMacros.Macros.push(JSON.parse(data[i]));
};

(function(_) {

	var _Game_Message_addText = Game_Message.prototype.addText;
	Game_Message.prototype.addText = function(txt) {
		for (var i = 0; i < MTM101.dialogueMacros.Macros.length; i++)
		{
			var macro = MTM101.dialogueMacros.Macros[i]
			txt = txt.replace("\\" + macro.Name, macro.Text)
		}
		_Game_Message_addText.call(this, txt);
	};

})()