//=============================================================================
// MTM101_GalvZoomExtension.js
//=============================================================================


/*:
 * @plugindesc Addeds a new targetOffset function to Galv's zoom extension.
 * @author MissingTextureMan101
 
*/

Galv.ZOOM.targetOffset = function(xoff,yoff,id,scale,duration) {
	if (id <= 0) {
		var target = $gamePlayer;
	} else {
		var target = $gameMap.event(id);
	}
	var x = target.screenX() + xoff;
	var y = (target.screenY() - 12 - scale) + yoff;
	$gameScreen.startZoom(x,y,scale,duration);
};