var flash = flash || {};
flash.namespace = function (ns_string) {
	var parts = ns_string.split('.'),
	parent = flash,
	i;
	
	if (parts[0] === "flash"){
		parts = parts.slice(1);
	}
	
	for (i = 0; i < parts.length; i += 1) {
		if (typeof parent[parts[i]] === "undefined"){
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	return parent;
};
flash.extend = function (destination, source) {
  if (destination != undefined) {
	  for (var k in source) {
	    if (source.hasOwnProperty(k)) {
	      destination[k] = source[k];
	    }
	  }	
  } else {
  	destination = source;
  }
  
  return destination;
}

flash.namespace('flash.display.Stage');

flash.display.Stage = (function(window, undefined){
	
	flash = window.flash;
	_flash = window.flash;
	
	var document = window.document,
	navigator = window.navigator,
	location = window.location;
	
	function createStage(DOMObject, stageWidth, stageHeight, stageColor){

		if (DOMObject === undefined) DOMObject = $('body');
		
		if (stageColor === undefined){
			stageColor = '#000000';	
		} 
		
		width = flash.utils.numToPx(stageWidth, '100%');
		height = flash.utils.numToPx(stageHeight, '100%');
		
		flash.stage = new DisplayObject();
		
		flash.stage.appendTo(DOMObject);	
		
		flash.stage.width = stageWidth;
		flash.stage.height = stageHeight;
		
		flash.stage.fillColor = stageColor;
		
		window.stage = flash.stage;
		$(window).bind('resize', function(){
			flash.stage.trigger(flash.events.Event.RESIZE);
		});
		
		flash.stage.debugGet = function(){
			return flash.stage._debug;
		}
		
		//Debug setter/getter
		//First, define shared function used then by both standards-compatible and legacy syntax
		flash.stage.debugSet = function(x){
			if (flash.stage._debug === undefined){
				//Debug panel
				flash.stage.debugPanel = $('<div/>', {'id': 'debugPanelDiv' ,'style': 'color:#ffffff; position: absolute; width:100px; height:50px; background-color:#1c3c34;'});
				flash.stage.debugPanel.fpsCounter = $('<p/>', {'style': ' position: absolute;font-family: helvetica, tahoma ;font-size:10px; left:15px; top:0px'});
				flash.stage.debugPanel.objectsCounter = $('<p/>', {'style': ' position: absolute;font-family: helvetica, tahoma ;font-size:10px; left:15px; top:20px'});
				flash.stage.debugPanel.append(flash.stage.debugPanel.fpsCounter);
				flash.stage.debugPanel.append(flash.stage.debugPanel.objectsCounter);
				$('body').append(flash.stage.debugPanel);
				
				var lastLoop = new Date;
			
				flash.stage.countFps = function () { 
				    var thisLoop = new Date;
				    flash.stage.fps = Math.round(1000 / (thisLoop - lastLoop));
				    lastLoop = thisLoop;
				}
				
				flash.stage.setObjects = function(number){
					flash.stage.debugPanel.objectsCounter.html("OBJ: " + number);	
				}		
			}
			
			flash.stage._debug = x;
			if (x === true) {
						setInterval(function(){
							flash.stage.debugPanel.fpsCounter.html("FPS: " + flash.stage.fps);
						}, 1000);
						flash.stage.debugPanel.css('display','inline');
				} else {
					flash.stage.debugPanel.css('display','none');
				}
		}
		
		defineGetterSetter(flash.stage, "debug", flash.stage.debugGet, flash.stage.debugSet);
		
		//Keyboard hooks initialized
		$(window).keydown(onkeydown);
		$(window).keyup(onkeyup);
		function onkeydown(eventObject){
			if (flash.utils.KeyboardManager) flash.utils.KeyboardManager.down(eventObject.keyCode);
			eventObject.type = flash.events.KeyboardEvent.KEY_DOWN;
			flash.stage.trigger(eventObject);
			eventObject.preventDefault();	
		}		
		function onkeyup(eventObject){
			if (flash.utils.KeyboardManager) flash.utils.KeyboardManager.up(eventObject.keyCode);
			eventObject.type = flash.events.KeyboardEvent.KEY_UP;
			flash.stage.trigger(eventObject);
			eventObject.preventDefault();
		}
		
		//Hooks for onEnterFrame
		window.requestAnimFrame = (function(){
	    return  window.requestAnimationFrame       || 
	              window.webkitRequestAnimationFrame || 
	              window.mozRequestAnimationFrame    || 
	              window.oRequestAnimationFrame      || 
	              window.msRequestAnimationFrame     || 
	              function(/* function */ callback, /* DOMElement */ element){
	                window.setTimeout(callback, 1000 / 60);
	              };
	    })();    
	    function onEnterFrame() {
		    if (flash.stage.onEnterFrame) flash.stage.onEnterFrame();
		    window.requestAnimFrame( onEnterFrame );
		    flash.stage.trigger({type: flash.events.Event.ENTER_FRAME});
		    if (flash.stage.debug) flash.stage.countFps();
		}
		onEnterFrame();
		
		//Define trace function
		window.trace = function(text){
			window.console.log(text);	
		}
	
		//Camera follower
		flash.stage.followForObject = function(object){
			flash.stage.cameraTarget = object;	
		}
	}
	
	if (flash.display.cssTransformFunction === undefined) {
		if ($.browser.webkit) {
			var browserTransformPrefix = ('-webkit-transform');
		} else if ($.browser.mozilla){
			var browserTransformPrefix = ('-moz-transform');
		} else if ($.browser.opera){
			var browserTransformPrefix = ('-o-transform');
		} else if ($.browser.msie){
			var browserTransformPrefix = ('-ms-transform');
		}

		flash.display.cssTransformFunction = function(angle, scalex, scaley){
				this.css(browserTransformPrefix , 'rotate(' + -angle + 'deg) scale(' + scalex + ',' + scaley + ')');//this.angleCache = angle; this.scaleXCache = scalex;this.scaleYCache = scaley;
			}
	}
	
	flash.initStage = createStage;
	
	//TODO Optimization candidate
	flash.call = flash.extend(flash, flash.display.Stage); 

})(window)

$(document).ready(function() {
	  $("actionscript,flash").each(function(index) {
	    flash.initStage(this.parent);
	    var newElement = $("<script type='text/javascript'>" + this.textContent + "</" + "script>");
		$(this).replaceWith(newElement);
		
		// lock scroll position, but retain settings for later
	      var scrollPosition = [
	        self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
	        self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
	      ];
	      var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
	      html.data('scroll-position', scrollPosition);
	      html.data('previous-overflow', html.css('overflow'));
	      html.css('overflow', 'hidden');
	      window.scrollTo(scrollPosition[0], scrollPosition[1]);
	      $("body").css("overflow", "hidden");
	  });
  
  	document.documentElement.style.overflow = 'hidden';	 // firefox, chrome
	document.body.scroll = "no";	// ie only
	document.documentElement.style.overflowX = 'hidden';	 // horizontal scrollbar will be hidden
	document.documentElement.style.overflowY = 'hidden';	 // vertical scrollbar will be hidden
});
