var MTM101 = MTM101 || {}

MTM101.EnhancedTitle = []

MTM101.EnhancedTitle.Parameters = PluginManager.parameters("MTM101_EnhancedTitleScreen");


/*:
 * @author MissingTextureMan101
 * @plugindesc Allows you to add extra options to your title screen.
 * @help
 * This plugin requires basic script knowledge to use to its fullest extent.
 * Beware that this plugin might conflict with other plugins 
 * that add their own options to the title screen, so to avoid that, put it at the bottom of the list.
 * 
 * 
 * @param TitlePages
 * @type struct<TitlePage>[]
 * @default []
 * @desc The pages for every menu on the title screen
 *
 * @param Y Offset
 * @type Number
 * @desc The Y  Offset to apply to the spawned window
 * @min -99999
 * @max 99999
 *
 * @param X Offset
 * @type Number
 * @desc The X Offset to apply to the spawned window
 * @min -99999
 * @max 99999
*/

/*~struct~TitleOption:
 * @param Name
 * @type text
 * @default Button
 * @desc The name of the option.
 *
 * @param Script
 * @type note
 * @default "this._commandWindow.close();\nthis.fadeOutAll();"
 * @desc The code that gets run when the option is chosen
 * 
 * @param Visible
 * @type text 
 * @default true;
 * @desc Whether or not this option will show up on the title screen.
 * 
 * @param Enabled
 * @type text
 * @default true;
 * @desc Whether or not this option will be able to be selected.
 */
 
 /*~struct~TitlePage:
 * @param Tip Text
 * @type text
 * @default Page Text Goes Here.
 * @desc The text that is displayed under this page. Leave blank for no text.
 *
 * @param Options
 * @type struct<TitleOption>[]
 * @default []
 * @desc The options displayed on this page
 */

MTM101.EnhancedTitle.Pages = [];

var data = JSON.parse(MTM101.EnhancedTitle.Parameters["TitlePages"]);

var xOff = Number(MTM101.EnhancedTitle.Parameters["X Offset"])
var yOff = Number(MTM101.EnhancedTitle.Parameters["Y Offset"])

for (var i = 0; i < data.length; i++)
{
	var currentPageData = JSON.parse(data[i]);
	currentPageData["Options"] = JSON.parse(currentPageData["Options"]);
	for (var j = 0; j < currentPageData["Options"].length; j++)
	{
		currentPageData.Options[j] = JSON.parse(currentPageData.Options[j]);
		currentPageData.Options[j].Script = eval(currentPageData.Options[j].Script);
	}
	MTM101.EnhancedTitle.Pages.push(currentPageData);
	//MTM101.EnhancedTitle.TitleOptions.push(JSON.parse(data[i]))
	//MTM101.EnhancedTitle.TitleOptions[i].Visible = eval(MTM101.EnhancedTitle.TitleOptions[i].Visible);
	//MTM101.EnhancedTitle.TitleOptions[i].Enabled = eval(MTM101.EnhancedTitle.TitleOptions[i].Enabled);
	//MTM101.EnhancedTitle.TitleOptions[i].Script = eval(MTM101.EnhancedTitle.TitleOptions[i].Script);
};


Scene_Title.prototype.commandCustom = function(scr)
{
	eval(scr);
};

Scene_Title.prototype.updateCommandWindowHandlers = function()
{
	this._commandWindow._handlers = {}
	var currentPage = MTM101.EnhancedTitle.Pages[this._commandWindow._page];
	for (let i = 0; i < currentPage.Options.length; i++)
	{
		var titleoption = currentPage.Options[i];
		this._commandWindow.setHandler(titleoption.Name.concat('_',i), this.commandCustom.bind(this,titleoption.Script));
	}
}

Scene_Title.prototype.createCommandWindow = function() 
{
	this._commandWindow = new Window_TitleCommand();
	this.updateCommandWindowHandlers();
	this.addWindow(this._commandWindow);
	this._commandWindow.x += xOff
	this._commandWindow.y += yOff
};

Window_TitleCommand.prototype.selectLast = function() {
    if (Window_TitleCommand._lastCommandSymbol) 
	{
        this.selectSymbol(Window_TitleCommand._lastCommandSymbol);
    }
};

Window_TitleCommand.prototype.refreshCommandList = function()
{
	SceneManager._scene.updateCommandWindowHandlers();
	this.clearCommandList();
	this.makeCommandList();
}

Window_TitleCommand.prototype.switchPage = function(page)
{
	this._page = page;
	//this.refreshCommandList();
	this.refresh();
    this.select(0);
	Window_TitleCommand.initCommandPosition();
}

var Window_TitleCommand_prototype_initialize = Window_TitleCommand.prototype.initialize
Window_TitleCommand.prototype.initialize = function()
{
	this._page = 0;
	Window_TitleCommand_prototype_initialize.call(this);
}

Window_TitleCommand.prototype.makeCommandList = function() 
{
	var currentPage = MTM101.EnhancedTitle.Pages[this._page];
    for (let i = 0; i < currentPage.Options.length; i++)
	{
		var titleoption = currentPage.Options[i];
		if (eval(titleoption.Visible))
		{
			this.addCommand(titleoption.Name, titleoption.Name.concat('_',i), eval(titleoption.Enabled));
		}
	}
};
