flash.namespace('flash.events.Event');

flash.events.Event = {
	COMPLETE : 'load',
	ENTER_FRAME : 'enterFrame',
	RESIZE : 'resize'
}

flash.events.IOErrorEvent = {
	IO_ERROR : 'ioerror'
}

flash.events.LoadingManagerEvent = {
	ALL_COMPLETED : 'allcompleted',
	HAVE_ACTIVE : 'haveactive'	
}

flash.namespace('flash.events.MouseEvent');

flash.events.MouseEvent = {
	CLICK : "click",
	MOUSE_MOVE : "mousemove",
	MOUSE_DOWN : "mousedown",
	MOUSE_UP : "mouseup",
	MOUSE_OUT : "mouseout",
 	MOUSE_OVER : "mouseover"
}

flash.events.KeyboardEvent = {
	KEY_DOWN : 'keyDown',
	KEY_UP : 'keyUp',
	UP_CODE : 38,
	DOWN_CODE : 40,
	LEFT_CODE : 37,
	RIGHT_CODE : 39,
	SPACEBAR_CODE : 32
}

function jqMouseEventToFlashMouseEvent(e){
	e.localX = e.clientX;
	e.localY = e.clientY;
	e.stageX = flash.stage.mouseX;
	e.stageY = flash.stage.mouseY;
	e.delta = wheelDelta;
}

IOErrorEvent = flash.events.IOErrorEvent;
LoadingManagerEvent = flash.events.LoadingManagerEvent;

flash.extend(window.Event, flash.events.Event);
flash.extend(window.IOErrorEvent, flash.events.IOErrorEvent);
flash.extend(window.LoadingManagerEvent, flash.events.LoadingManagerEvent);
flash.extend(window.MouseEvent, flash.events.MouseEvent);
flash.extend(window.KeyboardEvent, flash.events.KeyboardEvent);

if (window.KeyboardEvent === undefined) window.KeyboardEvent = flash.events.KeyboardEvent;
