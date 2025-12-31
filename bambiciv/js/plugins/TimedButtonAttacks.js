"use strict";
//=============================================================================
// Timed Button Attacks v1.?
// by TamFey
// Last Update: 07.03.2016
// Last Update by Gamefall Team: 06/11/2019
//=============================================================================

var TamFey = TamFey || {};

/*:
 * @plugindesc v1.2.0 - Adds a DDR-like minigame to the combat system.
 * @author TamFey

 * @param hitSound
 * @desc the soundeffect that plays when you hit a button correctly.
 * @default Saint5

 * @param missSound
 * @desc the soundeffect that plays when you hit a button too early or miss it entirely.
 * @default Buzzer1

 * @param triggerAreaSize
 * @desc This is the size of the trigger area sprites.
 * @default 48

 * @param triggerAreaLines
 * @desc This parameter allows to set the value of the grey lines
 * @type number
 * @default 48

 * @param triggerAreaXpos1
 * @desc The distance in pixels between the left border of the screen and the first TriggerArea.
 * @default 0

 * @param triggerAreaXpos2
 * @desc The distance in pixels between the left border of the screen and the second TriggerArea.
 * @default 48

 * @param triggerAreaXpos3
 * @desc The distance in pixels between the left border of the screen and the third TriggerArea.
 * @default 96

 * @param triggerAreaXpos4
 * @desc The distance in pixels between the left border of the screen and the fourth TriggerArea.
 * @default 144

 * @param popupPosX
 * @desc The distance in pixels between the left border of the screen and the Spawnpoint for Popups.
 * @default 300

 * @param popupPosY
 * @desc The distance in pixels between the upper border of the screen and the Spawnpoint for Popups.
 * @default 400

 * @param popupFontSize
 * @desc The font size for the "Hit!!!" and "Miss!" popups.
 * @default 35

 * @param defaultPitch
 * @desc The pitch for hitSound and missSound.
 * @default 100

 * @param defaultVolume
 * @desc The volume for hitSound and missSound.
 * @default 100

 * @param disableHitAndMissSounds
 * @desc Disables 'Hit' and 'Miss' sounds for Custom Buttons.
 * true: sounds disabled - false: sounds enabled
 * @default false

 * @param currentComboVariable
 * @desc The variable that is used to store the current combo counter.
 * @default 10

 * @param maxComboVariable
 * @desc The variable that is used to store the highest combo that was achieved during the most recent action.
 * @default 11

 * @param hitCounterVariable
 * @desc The variable that is used to store the number of buttons that were hit correctly during the most recent action.
 * @default 12

 * @param showCurrentCombo
 * @desc true: show - false don't show
 * @default true

 * @param showMaxCombo
 * @desc true: show - false don't show
 * @default true

 * @param showHitCounter
 * @desc true: show - false don't show
 * @default true

 * @param comboWindowX
 * @desc The distance in pixels between the left border of the screen and the combo window.
 * @default 0

 * @param comboWindowY
 * @desc The distance in pixels between the upper border of the screen and the combo window.
 * @default 300

 * @param comboFontSize
 * @desc The font size used for the combo window.
 * @default 28

 * @param defaultDirection
 * @desc The default travel direction for timed buttons.
 * @default down

 * @param enableTBASystem
 * @desc determines if the tba system is enabled by default.
 * @default true
 *
 * @param Height Fix
 * @desc A parameter for fixing the height of the rhytm system;
 * @type number
 * @min 0
 * @default 140
 *
 * @help
 * ==============================================================================
 * Introduction
 * ==============================================================================
 * This plugin changes the way skills and items work in combat. Instead of just
 * starting an animation and an effect, skill/items will start a small minigame,
 * where icons appear on the top part of the screen. These icons move downwards
 * and when they reach a certain area, the player has to press the arrow keys.
 * The plugin will then start different animations and effects depending on whether
 * the player hit the button correctly or not.
 * ==============================================================================
 * Notetags
 * ==============================================================================
 * Skills/Items:
 *
 * <tba [type] [icon] [birthtime] [speed] [hitEffect] [missEffect]>
 * This notetag adds a button with the specified parameters to a skill/item.
 * [type] - 'up', 'down', 'left' or 'right'
 * determines the column that the button will appear in.
 * [icon] - the icon that is used for the button. (i.e. ArrowUp)
 * NOTE: Icons have to be located in the '/img/system/' folder of your project.
 * [birthtime] - The number of frames the game is going to wait before spawning the button.
 * the time is measured from the start of the action. (60 frames = 1 sec)
 * [speed] - The number of pixels the button is going to move every frame.
 * [hitEffect] - the ID of the skill that is used when the player hits the button.
 * [missEffect] - the ID of the skill that is used when the player misses the button.
 * NOTE: For details on hit/miss effects, see section 'Hit/Miss Effects' below.
 * IMPORTANT: Skills/items with at least one of these notetags will not process
 * action sequence notetags of the type 'whole actions' and 'target actions'.
 *
 * Example:
 * <tba up ArrowDown 110 3 5 11>
 * This notetag will create a button in the 'up' column. The button will have
 * the icon 'ArrowDown'. It will be spawned 110 frames after the action started
 * (~1.85 sec). It will move 3 pixels per frame. When the player hits it correctly,
 * skill #5 will be used, else skill #11 will be used.
 *
 * Randomness:
 * You can add randomness to the spawntimes of buttons by adding 'rX' at the end of
 * the notetag, where X is a positive integer.
 *
 * Randomness Example:
 * <tba down ArrowDown 1 2 4 12 r60>
 * this button will spawn sometimes between frame 1 and frame 61 of the attack.
 *
 * <tba no modifiers>
 * Speed modifiers don't apply to skill/items with this notetag.
 *
 * Equipment:
 *
 * <tba speed [operator] [value]>
 * Equipment pieces with this notetag modify the speed of all buttons as long as
 * the are worn.
 * [operator] - 'increase', 'decrease', 'divide' or 'multiply'.
 * determines how the speed will be modified.
 * [value] - determines how big the effect of the modifier is.
 * NOTE: No matter how many modifiers are applied to a button, its speed can't
 * become lower than 1.
 *
 * Successive hits required to trigger an effect:
 * If you want to trigger the skill only after a series of buttons have been
 * successfully hit or missed, simply put 0 as the [hitEffect] and / or
 * [missEffect] for the first buttons and the actual skill number on the final
 * button.
 * This can be repeated multiple time in the same skill.
 * Example:
 * <tba up ArrowUp 12 3 0 0>
 * <tba up ArrowDown 24 3 5 0>
 * <tba up ArrowUp 46 3 0 0>
 * <tba up ArrowDown 48 3 5 11>
 * The example above will trigger skill 5 once if the user successfully hits
 * ArrowUp then ArrowDown and again if he successfully hits them a second time.
 * If he manages to miss the 4 buttons, skill 11 will be triggered.
 * ==============================================================================
 * Hit/Miss Effects
 * ==============================================================================
 * NOTE: Hit and miss effects are processed the same way. The only difference is
 * that hit effects are called when the player hits a button correctly and miss
 * effects are called when the player hits the button too early or misses it
 * entirely.
 *
 * When a hit/miss effect is called, the plugin will read the notebox from the skill
 * with the appropriate ID (You can see an example in the 'notetags' section).
 * The plugin will then process and execute the action sequence notetags of the type
 * 'target actions' in that notebox.
 * NOTE: The plugin only reads the notetags of the effect skill. It will still use
 * the damage formula and other parameters of the skill that produced the button.
 * ==============================================================================
 * Combos
 * ==============================================================================
 * The plugin keeps track of the player's current combo, highest combo per battle
 * and the total amount of buttons the player hit per action. These values can be
 * displayed on the screen.
 * Combo values are also stored in variables for use in damage formulas and events.
 * ==============================================================================
 * Plugin Commands
 * ==============================================================================
 * 'TBA moveLeft [value]' - Moves the left column [value] pixels to the right.
 * 'TBA moveRight [value]' - Moves the right column [value] pixels to the right.
 * 'TBA moveUp [value]' - Moves the up column [value] pixels to the right.
 * 'TBA moveDown [value]' - Moves the down column [value] pixels to the right.
 * 'TBA setLeftX [value]' - Sets the left column's horizontal coordinate to [value].
 * 'TBA setRightX [value]' - Sets the right column's horizontal coordinate to [value].
 * 'TBA setUpX [value]' - Sets the up column's horizontal coordinate to [value].
 * 'TBA setDownX [value]' - Sets the down column's horizontal coordinate to [value].
 * 'TBA resetTriggerAreas' - Resets all column's horizontal coordinate to its default value.
 * 'TBA enable' - enables timed button attacks.
 * 'TBA disable' - disables timed button attacks.
 * NOTE: [value] can be negative.
 * ==============================================================================
 * Compatibility Notes
 * ==============================================================================
 * This plugin does not overwrite any functions.
 * This plugin alias the following functions:
 * - Game_Interpreter.prototype.pluginCommand
 * - DataManager.isDatabaseLoaded
 * - BattleManager.startAction
 * - BattleManager.update
 * - BattleManager.updatePhase
 * - BattleManager.endAction
 * - Scene_Battle.prototype.createDisplayObjects
 * - Scene_Battle.prototype.update
 * ==============================================================================
 * Changelog
 * ==============================================================================
 * Version 1.3.0:
 * -Fixed undefined error on wrong entries
 * -Tracks are now only displayed during a TBA action
 * -Passing 0 allows triggering a single skill after successive successes
 *
 * Version 1.2.0:
 * -Added the possibility to change the direction that buttons travel.
 * -Added mouse/touch input.
 *
 * Version 1.1.0:
 * -Added the possibility to randomize button spawntimes.
 * -fixed issues with displaying the combo variables.
 *
 * Version 1.0.1:
 * -fixed enabling/disabling the plugin.
 *
 * Version 1.0:
 * -Plugin finished.
 */
(function () {
    TamFey.parameters = PluginManager.parameters('TimedButtonAttacks');
    TamFey.param = TamFey.param || {};

    TamFey.param.hitSound = String(TamFey.parameters['hitSound']);
    TamFey.param.missSound = String(TamFey.parameters['missSound']);
    TamFey.param.triggerAreaSize = Number(TamFey.parameters['triggerAreaSize']);
    TamFey.param.triggerAreaLines = Number(TamFey.parameters['triggerAreaLines']);
    TamFey.param.defaultPitch = Number(TamFey.parameters['defaultPitch']);
    TamFey.param.defaultVolume = Number(TamFey.parameters['defaultVolume']);
    TamFey.param.disableHitAndMissSounds = String(TamFey.parameters['disableHitAndMissSounds']);
    TamFey.param.triggerAreaXpositions = [
        Number(TamFey.parameters['triggerAreaXpos1']),
        Number(TamFey.parameters['triggerAreaXpos2']),
        Number(TamFey.parameters['triggerAreaXpos3']),
        Number(TamFey.parameters['triggerAreaXpos4'])
    ];
    TamFey.param.popupPosX = Number(TamFey.parameters['popupPosX']);
    TamFey.param.popupPosY = Number(TamFey.parameters['popupPosY']);
    TamFey.param.popupFontSize = Number(TamFey.parameters['popupFontSize']);
    TamFey.param.currentComboVariable = Number(TamFey.parameters['currentComboVariable']);
    TamFey.param.maxComboVariable = Number(TamFey.parameters['maxComboVariable']);
    TamFey.param.hitCounterVariable = Number(TamFey.parameters['hitCounterVariable']);
    TamFey.param.showCurrentCombo = TamFey.parameters['showCurrentCombo'] == 'true';
    TamFey.param.showMaxCombo = TamFey.parameters['showMaxCombo'] == 'true';
    TamFey.param.showHitCounter = TamFey.parameters['showHitCounter'] == 'true';
    TamFey.param.comboWindowX = Number(TamFey.parameters['comboWindowX']);
    TamFey.param.comboWindowY = Number(TamFey.parameters['comboWindowY']);
    TamFey.param.comboFontSize = Number(TamFey.parameters['comboFontSize']);
    TamFey.param.travelDirection = String(TamFey.parameters['defaultDirection']);
    TamFey.param.tbaEnabled = TamFey.parameters['enableTBASystem'] == 'true';
    TamFey.param.heightFix = parseInt(TamFey.parameters["Height Fix"]);

    var TamFey_TBA_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        TamFey_TBA_Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'TBA') {
            switch (args[0]) {
                case 'moveLeft':
                    SceneManager._scene.moveTriggerArea('left', Number(args[1]));
                    break;
                case 'moveDown':
                    SceneManager._scene.moveTriggerArea('down', Number(args[1]));
                    break;
                case 'moveUp':
                    SceneManager._scene.moveTriggerArea('up', Number(args[1]));
                    break;
                case 'moveRight':
                    SceneManager._scene.moveTriggerArea('right', Number(args[1]));
                    break;
                case 'setLeftX':
                    SceneManager._scene.setTriggerAreaX('left', Number(args[1]));
                    break;
                case 'setDownX':
                    SceneManager._scene.setTriggerAreaX('down', Number(args[1]));
                    break;
                case 'setUpX':
                    SceneManager._scene.setTriggerAreaX('up', Number(args[1]));
                    break;
                case 'setRightX':
                    SceneManager._scene.setTriggerAreaX('right', Number(args[1]));
                    break;
                case 'resetTriggerAreas':
                    SceneManager._scene.resetTriggerAreaPositions();
                    break;
                case 'enable':
                    BattleManager.enableTBA();
                    break;
                case 'disable':
                    BattleManager.disableTBA();
                    break;
            }
        }
    };


    /*============================================================================
     DataManager
     ============================================================================*/
    /*
     (ALIAS)
     parameters:
     none.
     Calls the functions that process this plugin's notetags when the database is loaded.
     */
    var TamFey_TBA_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!TamFey_TBA_DataManager_isDatabaseLoaded.call(this)) return false;
        this.processTBANotetags($dataSkills);
        this.processTBAPosition($dataSkills);
        this.processTBANotetags($dataItems);
        this.processTBAModifierNotetags($dataWeapons);
        this.processTBAModifierNotetags($dataArmors);
        return true;
    };

    DataManager.processTBAPosition = function(group) {
        group.forEach(function(skill) {
            if(!skill) {return;}
            var match = skill.note.match(/<TBA Travel:\s*(.*)>/);
            if(!!match) {skill.tba_travel = String(match[1])}
            else {skill.tba_travel = "down";}
        })
    }

    /*
     parameters:
     -group: An array of objects that belong to a certain group(e.g. skills)
     This function reads the notetags of every object in the group, saves the attackButtons
     in an array and determines if the object allows modifiers.
     */
    DataManager.processTBANotetags = function (group) {
        for (var n = 1; n < group.length; n++) {
            var obj = group[n];
            var notedata = obj.note.split(/[\r\n]+/);
            var hitCounter = 0;
            var missCounter = 0;

            obj.attackButtons = [];
            obj.allowModifiers = true;

            for (var i = 0; i < notedata.length; i++) {
                var line = notedata[i];
                if (line.match(/<tba\s*no\s*modifiers>/i)) {
                    obj.allowModifiers = false;
                } else if (line.match(/<tba\s*(\w*)\s*(\w*)\s*(\d*)\s*(\d*)\s*(\d*)\s*(\d*)\s*\r?(\d*)>/i)) {
                    var attbtn = {};
                    if (RegExp.$1 == 'up' || RegExp.$1 == 'down' || RegExp.$1 == 'left' || RegExp.$1 == 'right') {
                        var btntype = RegExp.$1;
                    }
                    var spriteName = String(RegExp.$2);
                    var birthTime = parseInt(RegExp.$3);
                    var v = parseInt(RegExp.$4);
                    var hitID = parseInt(RegExp.$5);
                    var missID = parseInt(RegExp.$6);
                    var sprite = new Sprite();
                    var eff1 = undefined;
                    var eff2 = undefined;
                    var expectedHits = 0;
                    var expectedMisses = 0;

                    if (hitID === 0) {
                        hitCounter += 1;
                    } else {
                        eff1 = group[hitID].targetActions;
                        expectedHits = hitCounter;
                        hitCounter = 0;
                    }

                    if (missID === 0) {
                        missCounter += 1;
                    } else {
                        eff2 = group[missID].targetActions;
                        expectedMisses = missCounter;
                        missCounter = 0;
                    }

                    var randomAdd = 0;

                    if (RegExp.$7) {
                        randomAdd = RegExp.$7;
                    }

                    attbtn = {
                        button: btntype,
                        buttonName: spriteName,
                        spawntime: birthTime,
                        speed: v,
                        hitEffect: eff1,
                        expectedHits: expectedHits,
                        missEffect: eff2,
                        expectedMisses: expectedMisses,
                        btnSprite: sprite,
                        random: randomAdd
                    };
                    obj.attackButtons.push(attbtn);
                }

            }
        }
    };

    /*
     parameters:
     -group: An array of objects that belong to a certain group(e.g. skills)
     This function reads the notetags of every object in the group and determines
     their speed modifier and speed multiplier.
     */
    DataManager.processTBAModifierNotetags = function (group) {
        for (var n = 1; n < group.length; n++) {
            var obj = group[n];
            var notedata = obj.note.split(/[\r\n]+/);

            obj.speedMod = 0;
            obj.speedMultiplier = 1;

            for (var i = 0; i < notedata.length; i++) {
                var line = notedata[i];
                if (line.match(/<tba\s*speed\s*(\w*)\s*(\d*)>/i)) {
                    var value;
                    value = parseInt(RegExp.$2);
                    switch (RegExp.$1) {
                        case 'decrease':
                            value *= -1;
                            obj.speedMod += value;
                            break;
                        case 'multiply':
                            obj.speedMultiplier *= value;
                            break;
                        case 'divide':
                            obj.speedMultiplier /= value;
                            break;
                        default:

                    }

                }
            }
        }
    };


    /*============================================================================
     BattleManager
     ============================================================================*/

    var TamFey_TBA_BattleManager_startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function () {
        TamFey_TBA_BattleManager_startBattle.call(this);
        SceneManager._scene.resetComboVariables();
    };
    /*
     (ALIAS)
     parameters:
     -none.
     Initializes the variables needed for the action. If the action uses AttackButtons,
     it also removes the 'whole' and 'target' action phases, as they are not needed.
     */
    var TamFey_TBA_BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction = function () {
        this.allowTBAInputs = false;
        this.battleTimeCounter = 0;
        this.initializeTBAVariables();
        TamFey_TBA_BattleManager_startAction.call(this);
        if (TamFey.param.tbaEnabled == true && this._action.item().attackButtons.length >= 1) {
            TamFey.param.travelDirection = this._action.item().tba_travel.toLowerCase();
            SceneManager._scene.createTriggerAreas();
            SceneManager._scene.remainingAttackButtons = this._action.item().attackButtons.slice();
            SceneManager._scene.calculateSpawntimes();
            this.allowTBAInputs = true;
            this._phaseSteps = ['setup', 'follow', 'finish'];
        }
    };

    /*
     parameters:
     -none.
     Initializes the variables that are needed for TBA actions.
     */
    BattleManager.initializeTBAVariables = function () {
        SceneManager._scene.tbaActions = [];
        SceneManager._scene.remainingAttackButtons = [];
        SceneManager._scene.activeAttackButtons = [];
        SceneManager._scene.activeTriggeredSprites = [];
        SceneManager._scene.activePopupWindows = [];
        SceneManager._scene.activePopupSprites = [];
        SceneManager._scene.tbaSoundPitch = TamFey.param.defaultPitch;
        SceneManager._scene.tbaCombo = 0;
        SceneManager._scene.actualMisses = 0;
        SceneManager._scene.actualHits = 0;
    };

    BattleManager.enableTBA = function () {
        TamFey.param.tbaEnabled = true;
    };

    BattleManager.disableTBA = function () {
        TamFey.param.tbaEnabled = false;
    };

    /*
     (ALIAS)
     parameters:
     -none.
     Checks whether the current action has attackButtons assigned. If so, the function calls
     checkForButtonSpawns, moves active attackButtons and checks for input from the player.
     */
    var TamFey_TBA_BattleManager_update = BattleManager.update;
    BattleManager.update = function () {
        this.battleTimeCounter += 1;
        TamFey_TBA_BattleManager_update.call(this);
        if (TamFey.param.tbaEnabled == true && this._action && this._action.item().attackButtons.length >= 1) {
            TamFey.param.travelDirection = this._action.item().tba_travel.toLowerCase();
            this.updateTBAActions();
            this.checkForButtonSpawns(this.battleTimeCounter);
            SceneManager._scene.moveAllActiveButtons();
            SceneManager._scene.checkForTBAInput();
            SceneManager._scene.updateActiveTriggeredSprites();
        }
    };

    /*
     parameters:
     -attackTime: Time passed since the start of the action.
     This function checks if the current action has buttons with a spawntime equals to 'attackTime'.
     If so, it will spawn that button and remove it from the remaining buttons.
     */
    BattleManager.checkForButtonSpawns = function (attackTime) {
        SceneManager._scene.remainingAttackButtons.forEach(function (btn, i, o) {
            if (btn.spawntime == attackTime) {
                SceneManager._scene.spawnButton(btn);
                SceneManager._scene.removeFromRemainingButtons(btn);
            }
        });
    };

    /*
     (ALIAS)
     parameters:
     -none.
     Calls TBAPhaseIsEndable to determine whether the current phase can be ended.
     This is done, so 'follow' and 'finish' actions are only called after all
     attack buttons have been processed.
     */
    var TamFey_TBA_BattleManager_updatePhase = BattleManager.updatePhase;
    BattleManager.updatePhase = function () {
        if (this._phaseSteps[0] === 'follow' && !this.TBAPhaseIsEndable()) return;
        TamFey_TBA_BattleManager_updatePhase.call(this);
    };

    /*
     (ALIAS)
     parameters:
     -none.
     Prevents the end of the action until there are no more attack buttons left.
     */
    var TamFey_TBA_BattleManager_endAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        if (this._action.item().attackButtons.length >= 1) {
            if (!this.TBAPhaseIsEndable()) {
                return;
            }
        }
        this.allowTBAInputs = false;
        TamFey_TBA_BattleManager_endAction.call(this);
        SceneManager._scene.clear_trigger_areas();
    };

    /*
     parameters:
     -none.
     Checks if activeAttackButtons, remainingAttackButtons and activeTriggeredSprites are empty.
     */
    BattleManager.TBAPhaseIsEndable = function () {
        if (SceneManager._scene.remainingAttackButtons.length >= 1) return false;
        if (SceneManager._scene.activeAttackButtons.length >= 1) return false;
        if (SceneManager._scene.activeTriggeredSprites.length >= 1) return false;
        return true;
    };

    /*
     parameters:
     -none.
     Processes the action sequence notetags of all active TBA actions.
     */
    BattleManager.updateTBAActions = function () {
        if (SceneManager._scene.tbaActions.length <= 0) return;
        SceneManager._scene.tbaActions.forEach(function (actionl, i, o) {
            var actseq = actionl.shift();
            if (actseq) {
                var seqName = actseq[0].toUpperCase();
                BattleManager.processActionSequence(seqName, actseq[1])
            }
        });
    };


    /*============================================================================
     Scene_Battle
     ============================================================================*/
    /*
     (ALIAS)
     parameters:
     -none.
     Creates objects that have to be created at battle start.
     */
    var TamFey_TBA_Scene_Battle_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
    Scene_Battle.prototype.createDisplayObjects = function () {
        TamFey_TBA_Scene_Battle_createDisplayObjects.call(this);
        if (TamFey.param.tbaEnabled == true) {
            //this.createTriggerAreas();
            this.triggerAreaSprites = [];
            this.createComboWindow();
        }
    };


    /*
     parameters:
     -none.
     Creates four sprites that indicate the keys the player has to press in order to
     activate the buttons in the same column.
     */
    Scene_Battle.prototype.createTriggerAreas = function () {
        this.triggerAreaSprites = [];
        var spriteSize = TamFey.param.triggerAreaLines;
        var numberOfTriggerAreas = 4;
        for (var i = 0; i < numberOfTriggerAreas; i++) {
            var sprite;
            var area;
            var areaX;
            var areaY;
            var triggerTrack;
            switch (i) {
                case 0:
                    sprite = new Sprite(ImageManager.loadSystem("arrow/" + "TriggerArrowLeft"));
                    break;
                case 1:
                    sprite = new Sprite(ImageManager.loadSystem("arrow/" + "TriggerArrowDown"));
                    break;
                case 2:
                    sprite = new Sprite(ImageManager.loadSystem("arrow/" + "TriggerArrowUp"));
                    break;
                case 3:
                    sprite = new Sprite(ImageManager.loadSystem("arrow/" + "TriggerArrowRight"));
                    break;
                default:

            }
            switch (TamFey.param.travelDirection) {
                case 'up':
                    areaX = TamFey.param.triggerAreaXpositions[i];
                    areaY = spriteSize;
                    break;
                case 'down':
                    areaX = TamFey.param.triggerAreaXpositions[i];
                    areaY = Graphics.height - (spriteSize + TamFey.param.heightFix);
                    break;
                case "left":
                    areaY = Graphics.boxHeight / 4 + (TamFey.param.triggerAreaXpositions[i]);
                    areaX = spriteSize;
                    break;
                case "right":
                    areaY = Graphics.boxHeight / 4 + (TamFey.param.triggerAreaXpositions[i]);
                    areaX = (Graphics.boxWidth / 2) - spriteSize;
                    break;
                default:
                    areaY = Graphics.height - (spriteSize + TamFey.param.heightFix);
            }

            sprite.x = areaX;
            sprite.y = areaY;


            //areaX = sprite.x;

            triggerTrack = this.createTriggerAreaTrack(areaX, areaY, TamFey.param.travelDirection);

            area = {areasprite: sprite, track: triggerTrack, xpos: areaX, ypos: areaY};
            this.triggerAreaSprites.push(area);
            this.addChild(sprite);
        }
    };

    Scene_Battle.prototype.clear_trigger_areas = function() {
        for(var i = 0; i < this.triggerAreaSprites.length; i++) {
            var sp = this.triggerAreaSprites[i];
            sp.areasprite.parent.removeChild(sp.areasprite);
            sp.track.parent.removeChild(sp.track);
        }
        this.triggerAreaSprites = [];
    }

    /*
     parameters:
     -areaX: An Integer that determines the x position of the trigger track.
     Creates a 'track' at the desired position. During actions active attack
     buttons will move on the track.
     */
    Scene_Battle.prototype.createTriggerAreaTrack = function (areaX, areaY, pos) {
        var track;
        var trackX;
        var trackY;
        var trackWidth;
        var trackHeight;
        var trackBitmap;
        var trackOffset = 3;
        var trackColor = Utils.rgbToCssColor(40, 37, 43);
        var trackOpacity = 125;

        switch(pos) {
            case "up":
            case "down":
                trackX = areaX + trackOffset;
                trackY = 0;
                trackWidth = TamFey.param.triggerAreaLines - (trackOffset * 2);
                trackHeight = Graphics.height - TamFey.param.heightFix;
                break;
            case "left":
            case "right":
                trackX = 0;
                trackY = areaY + trackOffset;
                trackWidth = Graphics.boxWidth / 2;
                trackHeight = TamFey.param.triggerAreaLines - (trackOffset * 2);  
                break;             
        }
        trackBitmap = new Bitmap(trackWidth, trackHeight);
        trackBitmap.fillAll(trackColor);
        track = new Sprite(trackBitmap);
        track.opacity = trackOpacity;
        track.x = trackX;
        track.y = trackY;
        track.z = 0;
        this._spriteset.addChild(track);
        return track;
    };

    /*
     parameters:
     -attbtn: An object that describes a button.
     This function creates a sprite for the passed attackButton.
     */
    Scene_Battle.prototype.spawnButton = function (attbtn) {
        var buttonSprite;
        var buttonColumn = 0;
        var buttonX;
        var buttonY;
        var spriteSize = TamFey.param.triggerAreaSize;

        if (attbtn.button == "left") {

        } else if (attbtn.button == "down") {
            buttonColumn = 1;
        } else if (attbtn.button == "up") {
            buttonColumn = 2;
        } else if (attbtn.button == "right") {
            buttonColumn = 3;
        }
        switch (TamFey.param.travelDirection) {
            case 'up':
                buttonX = TamFey.param.triggerAreaXpositions[buttonColumn];
                buttonY = Graphics.height - (spriteSize + TamFey.param.heightFix);
                break;
            case 'down':
                buttonX = TamFey.param.triggerAreaXpositions[buttonColumn];
                buttonY = 0;
                break;
            case 'left':
                buttonX = (Graphics.boxWidth / 2) - spriteSize;
                buttonY = Graphics.boxHeight / 4 + (TamFey.param.triggerAreaXpositions[buttonColumn]);
                break;
            case 'right':
                buttonX = 0;
                buttonY = Graphics.boxHeight / 4 + (TamFey.param.triggerAreaXpositions[buttonColumn]);
                break;
            default:
                buttonY = 0;
        }

        buttonSprite = new Sprite(ImageManager.loadSystem("arrow/" + attbtn.buttonName));

        attbtn.btnSprite = buttonSprite;

        buttonSprite.x = buttonX;
        buttonSprite.y = buttonY;
        this.addChild(buttonSprite);
        this.activeAttackButtons.push(attbtn);

    };

    /*
     parameters:
     -none.
     Iterates through all active attack buttons and moves them. Afterwards this checks if the button has to be removed.
     */
    Scene_Battle.prototype.moveAllActiveButtons = function () {
        this.activeAttackButtons.forEach(function (attbtn, i, o) {
            SceneManager._scene.moveButtonSprite(attbtn.btnSprite, attbtn.speed);
            SceneManager._scene.checkForButtonRemove(attbtn);
        });
    };

    /*
     parameters:
     -sprite: The sprite of an attackButton.
     -speed: The speed the button is supposed to be moved at.
     This function moves the passed attackButton by [speed] pixels in the y-direction.
     */
    Scene_Battle.prototype.moveButtonSprite = function (sprite, speed) {
        var distance = speed;
        var distanceMultiplier = 1;
        if (BattleManager._action.item().allowModifiers) {
            $gameActors._data.forEach(function (actr, i, o) {
                if (actr !== null) {
                    actr.equips().forEach(function (equ, i, o) {
                        if (equ) distance += equ.speedMod;
                        if (equ) distanceMultiplier *= equ.speedMultiplier;
                    });
                }
            });
            distance *= distanceMultiplier;
        }
        if (distance < 1) distance = 1;
        switch (TamFey.param.travelDirection) {
            case 'up':
                sprite.y -= distance;
                break;
            case 'down':
                sprite.y += distance;
                break;
            case "left": 
                sprite.x -= distance;
                break;
            case "right":
                sprite.x += distance;
                break;
            default:
                sprite.y += distance;
        }

    };

    /*
     parameters:
     -startingPos: An Integer, default position of the buttons that will be moved.
     -distance:An Integer, amount of pixels the buttons will be moved.
     Takes all active buttons at position 'startingPos' and moves them 'distance' pixels to the right.
     */
    Scene_Battle.prototype.adjustButtonXposition = function (startingPos, distance) {
        this.activeAttackButtons.forEach(function (attbtn, i, o) {
            if (attbtn.btnSprite.x == startingPos) {
                attbtn.btnSprite.x += distance;
            }
        });
    };

    /*
     parameters:
     -startingPos: An Integer, default position of the buttons that will be moved.
     -newPos:An Integer, new position for the moved buttons.
     Takes all active buttons at position 'startingPos' and moves them to 'newPos'.
     */
    Scene_Battle.prototype.setButtonXposition = function (startingPos, newPos) {
        this.activeAttackButtons.forEach(function (attbtn, i, o) {
            if (attbtn.btnSprite.x == startingPos) {
                attbtn.btnSprite.x = newPos;
            }
        });
    };

    /*
     parameters:
     -area: A String ('up', 'down', 'left' or 'right')
     -distance: An Integer
     Takes the triggerArea 'area' and moves it 'distance' pixels to the right.
     */
    Scene_Battle.prototype.moveTriggerArea = function (area, distance) {
        var target;
        var triggerTrackOffset = 3;
        var buttonXpos = 0;
        switch (area) {
            case 'left':
                target = this.triggerAreaSprites[0];
                TamFey.param.triggerAreaXpositions[0] += distance;
                break;
            case 'down':
                target = this.triggerAreaSprites[1];
                TamFey.param.triggerAreaXpositions[1] += distance;
                break;
            case 'up':
                target = this.triggerAreaSprites[2];
                TamFey.param.triggerAreaXpositions[2] += distance;
                break;
            case 'right':
                target = this.triggerAreaSprites[3];
                TamFey.param.triggerAreaXpositions[3] += distance;
                break;
            default:
        }
        buttonXpos = target.xpos;
        target.xpos += distance;
        target.areasprite.x = target.xpos;
        target.track.x = target.xpos + triggerTrackOffset;
        this.adjustButtonXposition(buttonXpos, distance);
    };

    /*
     parameters:
     -area: A String ('up', 'down', 'left' or 'right')
     -position: An Integer
     Takes the triggerArea 'area' and moves it to position 'position'.
     */
    Scene_Battle.prototype.setTriggerAreaX = function (area, position) {
        var target;
        var triggerTrackOffset = 3;
        var buttonXpos = 0;
        switch (area) {
            case 'left':
                target = this.triggerAreaSprites[0];
                TamFey.param.triggerAreaXpositions[0] = position;
                break;
            case 'down':
                target = this.triggerAreaSprites[1];
                TamFey.param.triggerAreaXpositions[1] = position;
                break;
            case 'up':
                target = this.triggerAreaSprites[2];
                TamFey.param.triggerAreaXpositions[2] = position;
                break;
            case 'right':
                target = this.triggerAreaSprites[3];
                TamFey.param.triggerAreaXpositions[3] = position;
                break;
            default:

        }
        buttonXpos = target.xpos;
        target.xpos = position;
        target.areasprite.x = target.xpos;
        target.track.x = target.xpos + triggerTrackOffset;
        this.setButtonXposition(buttonXpos, position);
    };

    /*
     parameters:
     -none.
     Resets the positions of all TriggerAreas.
     */
    Scene_Battle.prototype.resetTriggerAreaPositions = function () {
        var triggerTrackOffset = 3;
        TamFey.param.triggerAreaXpositions = [
            Number(TamFey.parameters['triggerAreaXpos1']),
            Number(TamFey.parameters['triggerAreaXpos2']),
            Number(TamFey.parameters['triggerAreaXpos3']),
            Number(TamFey.parameters['triggerAreaXpos4'])
        ];
        this.triggerAreaSprites.forEach(function (target, i, o) {
            var buttonXpos = 0;
            buttonXpos = target.xpos;
            target.xpos = TamFey.param.triggerAreaXpositions[i];
            target.areasprite.x = target.xpos;
            target.track.x = target.xpos + triggerTrackOffset;
            this.setButtonXposition(buttonXpos, position);
        });
    };

    Scene_Battle.prototype.calculateSpawntimes = function () {
        this.remainingAttackButtons.forEach(function (atkbtn, i, o) {
            atkbtn.spawntime += Math.randomInt(atkbtn.random);
        });
    };

    /*
     parameters:
     -attbtn: An object that describes an attackButton.
     Checks if the button has moved past the triggerArea.
     If so, it's passed to the removeButton function.
     */
    Scene_Battle.prototype.checkForButtonRemove = function (attbtn) {
        if (this.buttonIsPastTriggerArea(attbtn)) {
            if (!(TamFey.param.disableHitAndMissSounds && this.buttonIsCustom(attbtn))) {
                this.playTBASound(TamFey.param.missSound);
            }
            if (attbtn.missEffect!==undefined) {
                if (attbtn.expectedMisses === SceneManager._scene.actualMisses) {
                    var missActions = attbtn.missEffect.slice();
                    this.tbaActions.push(missActions);
                }
                SceneManager._scene.actualMisses = 0;
            } else {
                SceneManager._scene.actualMisses += 1;
            }
            this.createTriggeredWrongSprite(attbtn.btnSprite.x, attbtn.btnSprite.y);
            //this.createMissWindow();
            this.removeButton(attbtn);
            SceneManager._scene.tbaCombo = 0;
            SceneManager._scene.updateComboVariables(SceneManager._scene.tbaCombo);
        }
    };

    Scene_Battle.prototype.buttonIsPastTriggerArea = function (attbtn) {
        switch (TamFey.param.travelDirection) {
            case 'up':
                return attbtn.btnSprite.y <= (TamFey.param.triggerAreaSize / 2);
                break;
            case 'down':
                return attbtn.btnSprite.y >= (Graphics.height - TamFey.param.heightFix);
                break;
            case "left":
                return attbtn.btnSprite.x <= (TamFey.param.triggerAreaSize / 2);
            case "right":
                return attbtn.btnSprite.x >= Graphics.boxWidth / 2;
            default:
                return false;
        }
    };

    /*
     parameters:
     -attbtn: An object that describes an attackButton.
     Removes the passed button from activeAttackButtons, deletes it and removes its sprite.
     */
    Scene_Battle.prototype.removeButton = function (attbtn) {
        var btnIndex = this.activeAttackButtons.indexOf(attbtn);
        this.removeChild(attbtn.btnSprite);
        this.activeAttackButtons.splice(btnIndex, 1);
    };


    /*
     parameters:
     -attbtn: An object that describes an attackButton.
     Removes the passed button from remainingAttackButtons.
     */
    Scene_Battle.prototype.removeFromRemainingButtons = function (attbtn) {
        var btnIndex = this.remainingAttackButtons.indexOf(attbtn);
        var arr = this.remainingAttackButtons.slice(0, btnIndex).concat(this.remainingAttackButtons.slice(btnIndex + 1));
        this.remainingAttackButtons = arr;
    };

    Scene_Battle.prototype.buttonIsCustom = function (attbtn) {
        var isCustom = false;
        if (attbtn.buttonName == "ArrowUp") isCustom = false;
        if (attbtn.buttonName == "ArrowDown") isCustom = false;
        if (attbtn.buttonName == "ArrowLeft") isCustom = false;
        if (attbtn.buttonName == "ArrowRight") isCustom = false;
        return isCustom;
    };

    /*
     parameters:
     -none.
     Checks if any of the arrow keys are pressed.
     If so, it calls triggerTriggerArea.
     Only works when there are active attackButtons.
     */
    Scene_Battle.prototype.checkForTBAInput = function () {
        if (this.activeAttackButtons.length < 1) return;
        var touchedX = 0;
        var touchedY = 0;
        //TODO die boolean variablen durch ein array ersetzen und checkForPressedLeft in checkForPressedAreas umschreiben.
        var pressedDirections = [false, false, false, false]; //left, down, up, right
        /*var pressedLeft = false;
         var pressedDown = false;
         var pressedUp = false;
         var pressedRight = false;*/
        if (TouchInput.isPressed()) {
            touchedX = TouchInput.x;
            touchedY = TouchInput.y;
            pressedDirections = this.checkForPressedAreas(touchedX, touchedY);
        }
        if (Input.isTriggered('left') || pressedDirections[0] == true) {
            this.triggerTriggerArea('left');
        }
        if (Input.isTriggered('down') || pressedDirections[1] == true) {
            this.triggerTriggerArea('down');
        }
        if (Input.isTriggered('up') || pressedDirections[2] == true) {
            this.triggerTriggerArea('up');
        }
        if (Input.isTriggered('right') || pressedDirections[3] == true) {
            this.triggerTriggerArea('right');
        }
    };

    Scene_Battle.prototype.checkForPressedAreas = function (x, y) {
        var pressedDirections = [false, false, false, false]; //left, down, up, right
        var areaSize = TamFey.param.triggerAreaSize;
        for (var i = 0; i < pressedDirections.length; i++) {
            var areaX = TamFey.param.triggerAreaXpositions[i];
            var areaY = this.triggerAreaSprites[i].areasprite.y;
            pressedDirections[i] = ( (x >= areaX) && (x <= (areaX + areaSize)) && (y >= areaY) && (y <= (areaY + areaSize)))
        }
        return pressedDirections;
    };

    /*
     parameters:
     -dir: A String ('left', 'down', 'up' or 'right')
     This function determines size and position of the desired trigger area,
     creates a 'triggered' sprite at its position and calls checkForButtonsWithinArea.
     */
    Scene_Battle.prototype.triggerTriggerArea = function (dir) {
        var areaSize = TamFey.param.triggerAreaSize;
        var areaX = 0;
        var areaY = 0; //Graphics.height - (areaSize + this._partyCommandWindow.height);
        var travel_direction = TamFey.param.travelDirection;
        switch(travel_direction) {
            case "up":
            case "down":
                switch (dir) {
                    case "left":
                        areaX = TamFey.param.triggerAreaXpositions[0];
                        areaY = this.triggerAreaSprites[0].areasprite.y;
                        break;
                    case "down":
                        areaX = TamFey.param.triggerAreaXpositions[1];
                        areaY = this.triggerAreaSprites[1].areasprite.y;
                        break;
                    case "up":
                        areaX = TamFey.param.triggerAreaXpositions[2];
                        areaY = this.triggerAreaSprites[2].areasprite.y;
                        break;
                    case "right":
                        areaX = TamFey.param.triggerAreaXpositions[3];
                        areaY = this.triggerAreaSprites[3].areasprite.y;
                        break;
                    default:
                        areaX = 0;

                }
                break;
            case "left":
            case "right":
                switch (dir) {
                    case "left":
                        areaY = (Graphics.boxHeight / 4) + TamFey.param.triggerAreaXpositions[0];
                        areaX = this.triggerAreaSprites[0].areasprite.x;
                        break;
                    case "down":
                        areaY = (Graphics.boxHeight / 4) + TamFey.param.triggerAreaXpositions[1];
                        areaX = this.triggerAreaSprites[1].areasprite.x;
                        break;
                    case "up":
                        areaY = (Graphics.boxHeight / 4) + TamFey.param.triggerAreaXpositions[2];
                        areaX = this.triggerAreaSprites[2].areasprite.x;
                        break;
                    case "right":
                        areaY = (Graphics.boxHeight / 4) + TamFey.param.triggerAreaXpositions[3];
                        areaX = this.triggerAreaSprites[3].areasprite.x;
                        break;
                    default:
                        areaX = 0;

                }
                break;
        }
        // this.createTriggeredSprite("Triggered", areaX);
        this.checkForButtonsWithinArea(areaX, areaY, areaSize);

    };

    /*
     parameters:
     -x: An Integer
     -y: An Integer
     -size: An Integer
     This function checks if there are active attack buttons within the target area.
     If so, it creates a TriggeredCorrect sprite and removes the button.
     If not, the function calls processNoButtonHit.
     */
    Scene_Battle.prototype.checkForButtonsWithinArea = function (x, y, size) {
        var travel_direction = TamFey.param.travelDirection;
        var upperBorder;
        var lowerBorder;
        var touch_cound;
        switch(travel_direction) {
            case "up":
            case "down":
                upperBorder = y - (size / 4);
                lowerBorder = y + size;
                break;
            case "right":
            case "left":
                upperBorder = x - (size / 4);
                lowerBorder = x + size;
                break;
        }
        var buttonWasHit = false;
        this.activeAttackButtons.forEach(function (btn, i, o) {
            var touch_cond;
            switch(travel_direction) {
                case "up":
                case "down":
                    touch_cond = (btn.btnSprite.x == x) && (btn.btnSprite.y >= upperBorder) && (btn.btnSprite.y <= lowerBorder);
                    break;
                case "right":
                case "left":
                    touch_cond = (btn.btnSprite.y == y) && (btn.btnSprite.x >= upperBorder) && (btn.btnSprite.x <= lowerBorder);
                    break;
            }
            if (!!touch_cond) {
                if (!(TamFey.param.disableHitAndMissSounds && SceneManager._scene.buttonIsCustom(btn))) SceneManager._scene.playTBASound(TamFey.param.hitSound);
                if (btn.hitEffect!==undefined) {
                    if (btn.expectedHits === SceneManager._scene.actualHits) {
                        var hitActions = btn.hitEffect.slice();
                        SceneManager._scene.tbaActions.push(hitActions);
                    }
                    SceneManager._scene.actualHits = 0;
                } else {
                    SceneManager._scene.actualHits += 1;
                }
                SceneManager._scene.createTriggeredCorrectSprite(x, y);
                //SceneManager._scene.createHitWindow();
                SceneManager._scene.removeButton(btn);
                SceneManager._scene.tbaCombo += 1;
                SceneManager._scene.updateComboVariables(SceneManager._scene.tbaCombo);
                buttonWasHit = true;
            }
        });
        if (!buttonWasHit && ( this.buttonsInColumnExist(x) )) {
            this.processNoButtonHit(x, y, travel_direction, upperBorder);
        }
    };

    /*
     parameters:
     -x: An Integer
     This function checks, if any of the active attack buttons has the passed
     x-position.
     */
    Scene_Battle.prototype.buttonsInColumnExist = function (x, y, travel_direction) {
        var buttonsExist = false;
        this.activeAttackButtons.forEach(function (btn, i, o) {
            var cond;
            switch(travel_direction) {
                case "up":
                case "down":
                    cond = btn.btnSprite.x == x;
                case "right":
                case "left":
                    cond = btn.btnSprite.y == y
            }
            if (!!cond) {
                buttonsExist = true;
            }
        });
        return buttonsExist;
    };


    /*
     parameters:
     -x: An Integer
     -upperBorder: An Integer. Limit of the hitbox. Buttons with an y-position lower than this will be processed.
     This function looks for the button with the highest y-position that has the passed upperBorder.
     That button is then removed and the function creates a miss! message and updates the combo variables.
     If no buttons are passed that border, no buttons are removed but the combo is reset.
     */
    Scene_Battle.prototype.processNoButtonHit = function (x, y, travel_direction, upperBorder) {
        var closestButton;
        var closestX = 0;
        var closestY = 0;
        var is_y_type = travel_direction === "up" || travel_direction === "down" ? true : false;
        this.activeAttackButtons.forEach(function (btn, i, o) {
            if (this.buttonIsAheadOfTriggerArea(btn, x, y, upperBorder)) {
                var distance;
                var cond = !!is_y_type ? (distance < closestY) || (closestY == 0) : (distance < closestX) || (closestX == 0)
                distance = this.calculateDistanceToTriggerArea(btn);
                if (!!cond) {
                    closestButton = btn;
                    if(!!is_y_type) {closestY = btn.btnSprite.y;}
                    else {closestX = btn.btnSprite.x;}
                }
            }
        }.bind(this));
        if (closestButton) {
            if (!(TamFey.param.disableHitAndMissSounds && this.buttonIsCustom(closestButton))) {
                this.playTBASound(TamFey.param.missSound);
            }
            var missActions = closestButton.missEffect.slice();
            SceneManager._scene.tbaActions.push(missActions);
            SceneManager._scene.removeButton(closestButton);
            SceneManager._scene.createTriggeredWrongSprite(x, y);
            //SceneManager._scene.createMissWindow();
        }
        SceneManager._scene.tbaCombo = 0;
        SceneManager._scene.updateComboVariables(SceneManager._scene.tbaCombo);
    };


    Scene_Battle.prototype.buttonIsAheadOfTriggerArea = function (btn, x, y, border) {
        var isInFront = false;
        switch (TamFey.param.travelDirection) {
            case 'up':
                if ((btn.btnSprite.x == x) && (btn.btnSprite.y <= border)) isInFront = true;
                break;
            case 'down':
                if ((btn.btnSprite.x == x) && (btn.btnSprite.y >= border)) isInFront = true;
                break;
            case "left":
                if ((btn.btnSprite.y == y) && (btn.btnSprite.x <= border)) isInFront = true;
                break;
            case "right":
                if ((btn.btnSprite.y == y) && (btn.btnSprite.x >= border)) isInFront = true;
                break;           
            default:
                isInFront = false;
        }
        return isInFront;
    };

    //NOTE This doesn't actually calculate the distance to the trigger area, but rather the distance to the window border.
    Scene_Battle.prototype.calculateDistanceToTriggerArea = function (btn) {
        var distance = 0;
        switch (TamFey.param.travelDirection) {
            case 'up':
                distance = btn.btnSprite.y;
                break;
            case 'down':
                distance = Graphics.height - btn.btnSprite.y;
                break;
            case "left":
                distance = btn.btnSprite.x;
                break;
            case "right":
                distance = (Graphics.boxWidth / 2) - btn.btnSprite.x;
                break;
        }
        return distance;
    };

    /*
     parameters:
     -x: An Integer
     -name: A String
     This function creates a sprite and adds it to the activeTriggeredSprites.
     The sprite will be determined by the passed name.
     */
    Scene_Battle.prototype.createTriggeredSprite = function (name, x, y) {
        var triggeredSprite;
        var spriteSize = TamFey.param.triggerAreaLines;
        var spriteLifeTime = 8;
        var spriteX = 0;
        var spriteY = 0;
        var trig;

        triggeredSprite = new Sprite(ImageManager.loadSystem("arrow/" + name));
        switch (TamFey.param.travelDirection) {
            case 'up':
                spriteX = x;
                spriteY = spriteSize;
                break;
            case 'down':
                spriteX = x;
                spriteY = Graphics.height - (spriteSize + TamFey.param.heightFix);
                break;
            case "left":
                spriteY = y;
                spriteX = spriteSize
                break;
            case "right":
                spriteY = y;
                spriteX = (Graphics.boxWidth / 2) - spriteSize;
                break;
            default:
                spriteY = Graphics.height - (spriteSize + TamFey.param.heightFix);
        }
        triggeredSprite.x = spriteX;
        triggeredSprite.y = spriteY;

        trig = {trigsprite: triggeredSprite, lifetime: spriteLifeTime};
        this.activeTriggeredSprites.push(trig);
        this.addChild(triggeredSprite);
    };

    /*
     parameters:
     -x: An Integer
     Creates a triggeredSprite with the name 'TriggeredCorrect'.
     */
    Scene_Battle.prototype.createTriggeredCorrectSprite = function (x, y) {
        this.createTriggeredSprite("TriggeredCorrect", x, y);
    };

    /*
     parameters:
     -x: An Integer
     Creates a triggeredSprite with the name 'TriggeredWrong'.
     */
    Scene_Battle.prototype.createTriggeredWrongSprite = function (x, y) {
        this.createTriggeredSprite("TriggeredWrong", x, y);
    };

    /*
     parameters:
     -none.
     This function lowers the lifetime of all activeTriggeredSprites by 1,
     changes their opacity and removes them if their lifetime is 0.
     */
    Scene_Battle.prototype.updateActiveTriggeredSprites = function () {
        this.activeTriggeredSprites.forEach(function (trig, i, o) {
            var opacityDivisor = 5;
            trig.lifetime -= 1;
            opacityDivisor -= trig.lifetime;
            if (opacityDivisor > 0) trig.trigsprite.opacity = 255 / opacityDivisor;
            if (trig.lifetime <= 0) {
                SceneManager._scene.removeTriggeredSprite(trig);
            }
        });
    };

    /*
     parameters:
     -trig: An object that contains a sprite and an Integer
     Reomes trig from activeTriggeredSprites and deletes it.
     */
    Scene_Battle.prototype.removeTriggeredSprite = function (trig) {
        var arr = [];
        var trigIndex = this.activeTriggeredSprites.indexOf(trig);
        this.removeChild(trig.trigsprite);
        this.activeTriggeredSprites.splice(trigIndex, 1);
    };

    /*
     parameters:
     -sound: A String
     Calculates the correct pitch for the passed sound effect and plays it.
     */
    Scene_Battle.prototype.playTBASound = function (sound) {
        var normalPitch = TamFey.param.defaultPitch;
        var highestPitch = 200;
        var seName = sound;
        var seVolume = TamFey.param.defaultVolume;
        var sePitch = this.tbaSoundPitch;
        var soundEffect = {name: seName, volume: seVolume, pitch: sePitch};
        AudioManager.playSe(soundEffect);
        if (seName == TamFey.param.missSound) {
            this.tbaSoundPitch = normalPitch;
        } else if ((seName == TamFey.param.hitSound) && (this.tbaSoundPitch <= highestPitch)) {
            this.tbaSoundPitch += 5;
        }
    };

    /*
     parameters:
     -none.
     This function creates a PopupWindow with the hit-text.
     */
    Scene_Battle.prototype.createHitWindow = function () {
        this.createPopupWindow("\\c[3]Hit!!!");
    };

    /*
     parameters:
     -none.
     This function creates a PopupWindow with the miss-text.
     */
    Scene_Battle.prototype.createMissWindow = function () {
        this.createPopupWindow("\\c[18]Miss!");
    };

    /*
     parameters:
     -name: A String.
     Creates a PopupWindow with the passed name as text.
     */
    Scene_Battle.prototype.createPopupWindow = function (name) {
        var pop = new Window_Popup(name);
        this.addChild(pop);
        this.activePopupWindows.push(pop);
    };

    /*
     (ALIAS)
     parameters:
     -none.
     Calls the update functions of trigger areas and the combo window, if they exist.
     */
    var TamFey_TBA_Scene_Battle_Update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        TamFey_TBA_Scene_Battle_Update.call(this);
        if (TamFey.param.tbaEnabled == true) {
            if (this.triggerAreaSprites.length >= 1) this.updateTBATriggerAreas();
            if (TamFey.param.showCurrentCombo || TamFey.param.showMaxCombo || TamFey.param.showHitCounter) {
                this._comboWindow.update();
            }
        }
    };

    /*
     parameters:
     -none.
     Makes the trigger areas invisible if there is an important window active and
     makes them visible again if there is no important window active.
     */
    Scene_Battle.prototype.updateTBATriggerAreas = function () {
        if ((this._equipSlotWindow && this._equipSlotWindow.visible) || $gameMessage.isBusy() || !BattleManager.allowTBAInputs) {
            this.triggerAreaSprites.forEach(function (area, i, o) {
                area.areasprite.opacity = 0;
                area.track.opacity = 0;
            });
        } else if (this.isActive() && !this._messageWindow.isClosing()) {
            this.triggerAreaSprites.forEach(function (area, i, o) {
                area.areasprite.opacity = 255;
                area.track.opacity = 125;
            });
        }
    }

    /*
     parameters:
     -none.
     Sets currentCombo, maxCombo and hitCounter to 0.
     */
    Scene_Battle.prototype.resetComboVariables = function () {
        $gameVariables.setValue(TamFey.param.currentComboVariable, 0);
        $gameVariables.setValue(TamFey.param.maxComboVariable, 0);
        $gameVariables.setValue(TamFey.param.hitCounterVariable, 0);
    };

    /*
     parameters:
     -counter: An Integer.
     Sets the combo variables to the newest values.
     */
    Scene_Battle.prototype.updateComboVariables = function (counter) {
        var newHitCount = $gameVariables.value(TamFey.param.hitCounterVariable) + 1;

        if (counter > 0) {
            $gameVariables.setValue(TamFey.param.currentComboVariable, counter);
            $gameVariables.setValue(TamFey.param.hitCounterVariable, newHitCount);
            if (counter > $gameVariables.value(TamFey.param.maxComboVariable)) {
                $gameVariables.setValue(TamFey.param.maxComboVariable, counter);
            }
        } else {
            $gameVariables.setValue(TamFey.param.currentComboVariable, 0);
        }
    };


    /*
     parameters:
     -none.
     Creates a new combo window and adds it as a child to the scene.
     */
    Scene_Battle.prototype.createComboWindow = function () {
        this._comboWindow = new Window_Combo();
        this.addChild(this._comboWindow);
    };

    /*============================================================================
     Window_Combo
     ============================================================================*/
    function Window_Combo() {
        this.initialize.apply(this, arguments);
    }

    Window_Combo.prototype = Object.create(Window_Base.prototype);
    Window_Combo.prototype.constructor = Window_Combo;

    /*
     parameters:
     -none.
     Initializes size, display values and position of the window.
     */
    Window_Combo.prototype.initialize = function () {
        var xPos = TamFey.param.comboWindowX;
        var yPos = TamFey.param.comboWindowY;
        var width = Graphics.width;
        var height = (this.lineHeight() * 3) + (this.standardPadding() * 2);
        Window_Base.prototype.initialize.call(this, xPos, yPos, width, height);
        this.createContents();
        this.updateOpacity();
        this.displayValue = 0;
        this.displayMaxValue = 0;
        this.displayTotal = 0;
        this.refresh();
    };

    /*
     parameters:
     -none.
     Updates the display values.
     If they have changed, the displayed values get updated as well.
     */
    Window_Combo.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        var oldOpacity = this.contentsOpacity;
        var oldDisplayValue = this.displayValue;
        this.updateOpacity();
        this.displayValue = $gameVariables.value(TamFey.param.currentComboVariable);
        this.displayMaxValue = $gameVariables.value(TamFey.param.maxComboVariable);
        this.displayTotal = $gameVariables.value(TamFey.param.hitCounterVariable);
        if ((oldOpacity != this.contentsOpacity) || (oldDisplayValue != this.displayValue)) {
            this.refresh();
        }
    };

    /*
     parameters:
     -none.
     Makes the combo display invisible, when it's not needed.
     */
    Window_Combo.prototype.updateOpacity = function () {
        if ((TamFey.param.showCurrentCombo == true || TamFey.param.showMaxCombo == true || TamFey.param.showHitCounter == true) && BattleManager.allowTBAInputs) {
            this.contentsOpacity = 255;
        } else {
            this.contentsOpacity = 0;
        }
        this.opacity = 0;
    };

    /*
     parameters:
     -none.
     Adjusts the displayed text to show the current displayValues
     */
    Window_Combo.prototype.refresh = function () {
        this.contents.clear();
        this.contents.fontSize = TamFey.param.comboFontSize;
        var text = "";
        if (TamFey.param.showCurrentCombo == true) text = text + "\\C[9]Combo: " + this.getComboColor(this.displayValue) + this.displayValue + "\\C[0]\n";
        if (TamFey.param.showMaxCombo == true) text = text + "\\C[9]MaxCombo:\\C[0] " + this.displayMaxValue + "\n";
        if (TamFey.param.showHitCounter == true) text = text + "\\C[9]Total:\\C[0] " + this.displayTotal + "\\C[0]";
        this.drawTextEx(text, 0, 0);
    };

    /*
     parameters:
     -combo: An Integer that contains the current combo.
     Returns a different color code, depending on the current combo.
     */
    Window_Combo.prototype.getComboColor = function (combo) {
        if (combo >= 10) {
            return "\\c[18]";
        } else if (combo >= 9) {
            return "\\c[10]";
        } else if (combo >= 7) {
            return "\\c[2]";
        } else if (combo >= 5) {
            return "\\c[14]";
        } else if (combo >= 4) {
            return "\\c[17]";
        } else if (combo >= 3) {
            return "\\c[6]";
        } else if (combo >= 2) {
            return "\\c[3]";
        } else {
            return "\\c[0]";
        }
    };

    /*============================================================================
     Window_Popup
     ============================================================================*/
    function Window_Popup(displayText) {
        this.initialize.apply(this, arguments, displayText);
    }

    Window_Popup.prototype = Object.create(Window_Base.prototype);
    Window_Popup.prototype.constructor = Window_Popup;

    /*
     parameters:
     -none.
     Initializes size, display values and position of the window.
     */
    Window_Popup.prototype.initialize = function (displayText) {
        var xPos = TamFey.param.popupPosX;
        var yPos = TamFey.param.popupPosY;
        var width = Graphics.width;
        var height = (this.lineHeight() * 3) + (this.standardPadding() * 2);
        Window_Base.prototype.initialize.call(this, xPos, yPos, width, height);
        this.displayText = displayText;
        this.lifetime = 24;
        this.createContents();
        this.updateOpacity();
        this.refresh();
    };

    /*
     parameters:
     -none.
     refreshes window, if opacity has changed.
     */
    Window_Popup.prototype.update = function () {
        Window_Base.prototype.update.call(this);
        var oldOpacity = this.contentsOpacity;
        this.updateOpacity();
        if ((oldOpacity != this.contentsOpacity)) {
            this.refresh();
        }
    };

    /*
     parameters:
     -none.
     Changes opacity based on lifetime left.
     */
    Window_Popup.prototype.updateOpacity = function () {
        var speed = 3;
        var opacityDivisor = 6;
        this.lifetime -= 1;
        opacityDivisor -= this.lifetime;
        if (opacityDivisor > 0) this.contentsOpacity = 255 / opacityDivisor;
        this.y -= speed;
        if (this.lifetime <= 0) {
            this.close();
            if(this.isClosed()) {this.parent.removeChild(this);}
        }
        this.opacity = 0;
    };

    /*
     parameters:
     -none.
     rewrites the displayed text.
     */
    Window_Popup.prototype.refresh = function () {
        this.contents.clear();
        this.contents.fontSize = TamFey.param.popupFontSize;
        this.drawTextEx(this.displayText, 0, 0);
    };


})();
