flash.namespace('flash.events.Event');

flash.events.Event = {
	COMPLETE : 'load',
	ENTER_FRAME : 'enterFrame',
	RESIZE : 'resize'
}

flash.namespace('flash.events.MouseEvent');

flash.events.MouseEvent = {
	CLICK : "click"
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

flash.extend(window.Event, flash.events.Event);
flash.extend(window.MouseEvent, flash.events.MouseEvent);
flash.extend(window.KeyboardEvent, flash.events.KeyboardEvent);

if (window.KeyboardEvent === undefined) window.KeyboardEvent = flash.events.KeyboardEvent;
