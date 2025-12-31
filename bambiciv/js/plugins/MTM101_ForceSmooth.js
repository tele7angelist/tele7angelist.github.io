var old_ImageManager_loadBitmap = ImageManager.loadBitmap;

ImageManager.loadBitmap = function(folder, filename, hue, smooth) {
    smooth = true;
	return old_ImageManager_loadBitmap.call(this,folder,filename,hue,smooth);
};