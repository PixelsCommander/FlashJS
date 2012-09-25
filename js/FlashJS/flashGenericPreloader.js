flash.namespace('flash.display.GenericPreloader');

flash.display.GenericPreloader = (function(window, undefined){
	
	function GenericPreloader(URL, handler){
		var self = $("<div style='background-color:#000000; opacity:0.9; width:100%; height:100%; position:absolute; left:0px;top:0px;vertical-align:middle;' text-align=middle align=center><img style='position:absolute;top:50%;vertical-align:middle;' src='./js/FlashJS/genericPreloader.gif'/></div>");
		self.appendTo($('body'));
		return self;
	}
	
	window.GenericPreloader = GenericPreloader;
}(window))