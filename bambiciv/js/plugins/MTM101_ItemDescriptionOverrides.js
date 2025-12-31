MTM101 = MTM101 || {}

MTM101.ItemDescriptionOverrides = []


MTM101.ItemDescriptionOverrides.Parameters = PluginManager.parameters("MTM101_ItemDescriptionOverrides");

/*:
 * @author MissingTextureMan101
 * @plugindesc Allows item descriptions to be overwritten via plugin calls.
 * @help
 * Plugin Commands:
 * ChangeItemDescription ItemType ItemID Description
 * Changes an items description.
 * ClearItemDescription ItemType ItemID
 * Resets an items description.
 * LoadItemDescriptionTemplate TemplateName
 * Clears all item descriptions and loads the ones from the template.
 * ClearAllItemDescriptions
 * Clears all modified item descriptions
 * @param Templates
 * @type struct<ReplacementTemplate>[]
 * @default []
 * @desc Premade replacements that can be easily loaded.
 *
*/


/*~struct~ReplacementTemplate:
 * @param Name 
 * @type text
 * @desc The name of this template.
 *
 * @param ItemReplacements
 * @type struct<ItemDescReplacement>[]
 * @default []
 * @desc The item description replacements.
 *
 * @param WeaponReplacements
 * @type struct<WeaponDescReplacement>[]
 * @default []
 * @desc The weapon description replacements.
 * 
 * @param ArmorReplacements
 * @type struct<ArmorDescReplacement>[]
 * @default []
 * @desc The armor description replacements.
 * 
 * @param SkillReplacements
 * @type struct<SkillDescReplacement>[]
 * @default []
 * @desc The skill description replacements.
 * 
 */

/*~struct~ItemDescReplacement:
 * @param ID 
 * @type item
 * @desc The item to replace the description of.
 *
 * @param Description
 * @type note
 * @default Put replacement here!
 * @desc The description that will take the place of the original description.
 * 
 */
 
/*~struct~ArmorDescReplacement:
 * @param ID 
 * @type armor
 * @desc The armor to replace the description of.
 *
 * @param Description
 * @type note
 * @default Put replacement here!
 * @desc The description that will take the place of the original description.
 * 
 */
 
/*~struct~WeaponDescReplacement:
 * @param ID 
 * @type weapon
 * @desc The weapon to replace the description of.
 *
 * @param Description
 * @type note
 * @default Put replacement here!
 * @desc The description that will take the place of the original description.
 * 
 */
 
/*~struct~SkillDescReplacement:
 * @param ID 
 * @type skill
 * @desc The skill to replace the description of.
 *
 * @param Description
 * @type note
 * @default Put replacement here!
 * @desc The description that will take the place of the original description.
 * 
 */


var data = JSON.parse(MTM101.ItemDescriptionOverrides.Parameters["Templates"]);

MTM101.ItemDescriptionOverrides.Templates = []

for (var i = 0; i < data.length; i++)
{
	//MTM101.ItemDescriptionOverrides.Templates.push(JSON.parse(data[i]));
	var currentTemplate = JSON.parse(data[i])
	// item replacements
	currentTemplate.ItemReplacements = JSON.parse(currentTemplate.ItemReplacements);
	for (var j = 0; j < currentTemplate.ItemReplacements.length; j++)
	{
		currentTemplate.ItemReplacements[j] = JSON.parse(currentTemplate.ItemReplacements[j]);
	}
	// weapon replacements
	currentTemplate.WeaponReplacements = JSON.parse(currentTemplate.WeaponReplacements);
	for (var j = 0; j < currentTemplate.WeaponReplacements.length; j++)
	{
		currentTemplate.WeaponReplacements[j] = JSON.parse(currentTemplate.WeaponReplacements[j]);
	}
	// armor replacements
	currentTemplate.ArmorReplacements = JSON.parse(currentTemplate.ArmorReplacements);
	for (var j = 0; j < currentTemplate.ArmorReplacements.length; j++)
	{
		currentTemplate.ArmorReplacements[j] = JSON.parse(currentTemplate.ArmorReplacements[j]);
	}
	// armor replacements
	currentTemplate.SkillReplacements = JSON.parse(currentTemplate.SkillReplacements);
	for (var j = 0; j < currentTemplate.SkillReplacements.length; j++)
	{
		currentTemplate.SkillReplacements[j] = JSON.parse(currentTemplate.SkillReplacements[j]);
	}
	MTM101.ItemDescriptionOverrides.Templates[currentTemplate.Name] = currentTemplate;
};

// okay so vars can conflict across plugins. TODO: fix this across all my stuff
var oldInit = Game_System.prototype.initialize;
Game_System.prototype.initialize = function()
{
	oldInit.call(this);
	this._itemDescriptionOverrides = {
		Item:[],
		Armor:[],
		Weapon:[],
		Unknown:[],
		Skill:[],
	};
}

Game_System.prototype.GetItemDescriptionWOverrides = function(item)
{
	if (typeof(this._itemDescriptionOverrides) === "undefined")
	{
		this._itemDescriptionOverrides = {
			Item:[],
			Armor:[],
			Weapon:[],
			Unknown:[],
			Skill:[],
		};
		return item.description;
	}
	return this._itemDescriptionOverrides[DataManager.GetDataTypeString(item)][item.id] || item.description;
}

DataManager.GetDataTypeString = function(item)
{
	if (DataManager.isItem(item)) return "Item";
	if (DataManager.isWeapon(item)) return "Weapon";
	if (DataManager.isArmor(item)) return "Armor";
	if (DataManager.isSkill(item)) return "Skill";
	return "Unknown";
}

var Window_HelpOldsetItem = Window_Help.prototype.setItem;

Window_Help.prototype.setItem = function(item) {
	if (item)
	{
		this.setText($gameSystem.GetItemDescriptionWOverrides(item));
		return;
	}
    Window_HelpOldsetItem.call(this);
};


// lots of ugly copy and pasted code because i need to get this working
var oldPlgCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) 
{
	if (command.toLowerCase() == "changeitemdescription")
	{
		var resultText = ""
		for (var i = 2; i < args.length; i++)
		{
			resultText = resultText + args[i] + " ";
		}
		resultText = resultText.trim();
		$gameSystem._itemDescriptionOverrides[args[0]][args[1]] = resultText
	}
	else if (command.toLowerCase() == "clearitemdescription")
	{
		$gameSystem._itemDescriptionOverrides[args[0]][args[1]] = undefined
	}
	else if (command.toLowerCase() == "clearallitemdescriptions")
	{
		$gameSystem._itemDescriptionOverrides = {
			Item:[],
			Armor:[],
			Weapon:[],
			Unknown:[],
			Skill:[],
		};
	}
	else if (command.toLowerCase() == "loaditemdescriptiontemplate")
	{
		$gameSystem._itemDescriptionOverrides = {
			Item:[],
			Armor:[],
			Weapon:[],
			Unknown:[],
			Skill:[],
		};
		var resultText = ""
		for (var i = 0; i < args.length; i++)
		{
			resultText = resultText + args[i] + " ";
		}
		resultText = resultText.trim();
		var foundTemplate = MTM101.ItemDescriptionOverrides.Templates[resultText];
		for (var i = 0; i < foundTemplate.ItemReplacements.length; i++)
		{
			var replacemnt = foundTemplate.ItemReplacements[i];
			$gameSystem._itemDescriptionOverrides["Item"][replacemnt.ID] = replacemnt.Description;
		}
		for (var i = 0; i < foundTemplate.ArmorReplacements.length; i++)
		{
			var replacemnt = foundTemplate.ArmorReplacements[i];
			$gameSystem._itemDescriptionOverrides["Armor"][replacemnt.ID] = replacemnt.Description;
		}
		for (var i = 0; i < foundTemplate.WeaponReplacements.length; i++)
		{
			var replacemnt = foundTemplate.WeaponReplacements[i];
			$gameSystem._itemDescriptionOverrides["Weapon"][replacemnt.ID] = replacemnt.Description;
		}
		for (var i = 0; i < foundTemplate.SkillReplacements.length; i++)
		{
			var replacemnt = foundTemplate.SkillReplacements[i];
			$gameSystem._itemDescriptionOverrides["Skill"][replacemnt.ID] = replacemnt.Description;
		}
	}
	else
	{
		oldPlgCommand.call(this, command, args);
	}
}