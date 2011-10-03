flash.namespace('flash.utils.KeyboardManager');

flash.utils.KeyboardManager = (function(window, undefined){
	
	if (pressedKeys === undefined){
		var pressedKeys = [];
	}

	function keyDown(keyCode){
		pressedKeys[keyCode] = true;
	}
	
	function keyUp(keyCode){
		pressedKeys[keyCode] = false;	
	}
	
	function isKeyDown(keyCode){
		if (pressedKeys[keyCode] != undefined){
			return pressedKeys[keyCode]
		} else {
			return false;
		}
	}
	
	return{
		isDown: isKeyDown,
		up: keyUp,
		down: keyDown
	}
}(window))

window.KeyboardManager = flash.utils.KeyboardManager;