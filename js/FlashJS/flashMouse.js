
flash.namespace('flash.Mouse');

flash.Mouse = (function(window, undefined){
	flash.Mouse.hide = function (){
		flash.stage.css('cursor','none');
	}
	
	flash.Mouse.show = function (){
		flash.stage.css('cursor','default');
	}		
	
	window.Mouse = flash.Mouse;
})(window);
