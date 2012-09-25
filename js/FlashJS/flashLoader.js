flash.namespace('flash.display.Loader');

flash.display.Loader = (function(window, undefined){
	
	function Loader(url, handler, loadForAnimation){
		var self = new MovieClip();
		self.loadingCallback = handler;
		self.loaded = false;
		self.url = url;
		self.loadForAnimation = loadForAnimation;
		
		self.jqload = self.load; //Duplicating jquery function because need Loader.load for flash consistency
		
		self.errorOccured = function (error){
			console.log("Error loading " + self.url);
			flash.stage.removeActiveLoader();
			self.dispatchEvent(new Event(IOErrorEvent.IO_ERROR));
			delete self;
		}
		
		self.loaded = function (message){
			if (self.loadingCallback) {
				self.loadingCallback(new Event(Event.COMPLETE));
			}
			flash.stage.removeActiveLoader();
			self.dispatchEvent(new Event(Event.COMPLETE));
			self.loaded = true;
			if (self.loadForAnimation) self.img.remove();
		}
		
		self.startLoad = function(){
			if (self.loaded === true) return;
			
			if (self.url && self.url.indexOf('.html') !== -1) {
				self.jqload(self.url);
				
			} else {
				self.img = $('<img/>', {'src': self.url}).load(self.loaded).error(self.errorOccured);
				
				if (!self.loadForAnimation) {
					self.addChild(self.img);
				} else {
					self[0].style['background-image'] = 'url("' + self.url + '")';	
				}
				flash.stage.addActiveLoader(self);		
			}
			
			
		}
		
		self.load = function (urlRequest){
			self.url = urlRequest.url
			
			//Commented for optimisation reasons, not needed yet
			//self.method = urlRequest.method;
			//self.request = urlRequest;
			
			self.startLoad();	
		}
		
		self.unload = function (){
			self.remove();	
		}
		
		if (url){
			self.startLoad();	
		}
		
		self.width = undefined;
		self.height = undefined;
		
		return self;
	}
	
	window.Loader = Loader;
}(window))