MTM101 = MTM101 || {}

/*:
 * @author MissingTextureMan101
 * @plugindesc Adds the ability to call fake error messages
 * @help
 * Yeah.
 * 
*/

MTM101.FakeError = []
MTM101.FakeError.Spawn = function(toptext,bottext, retrytext)
{
	SceneManager.stop();
	Graphics._applyCanvasFilter();
    Graphics._clearUpperCanvas();
	if (Graphics._errorPrinter && !Graphics._errorShowed) {
        Graphics._errorPrinter.innerHTML = Graphics._makeErrorHtml(toptext, bottext);
        var button = document.createElement('button');
        button.innerHTML = retrytext;
        button.style.fontSize = '24px';
        button.style.color = '#ffffff';
        button.style.backgroundColor = '#000000';
        button.onmousedown = button.ontouchstart = function(event) {
            SceneManager.resume();
			//restore canvas settings
			if (Graphics._canvas) {
				Graphics._canvas.style.opacity = 1;
				Graphics._canvas.style.filter = '';
				Graphics._canvas.style.webkitFilter = '';
			}
			Graphics._errorPrinter.innerHTML = '';
        };
        Graphics._errorPrinter.appendChild(button);
    }
}