flash.namespace('flash.display.Loader');

flash.display.Loader = (function(window, undefined){
	
	function Loader(URL, handler){
		var self = new DisplayObject();
		self.width = undefined;
		self.height = undefined;
		var img = $('<img/>', {'src': URL});
		self.addChild(img);
		return self;
	}
	
	window.Loader = Loader;
}(window))