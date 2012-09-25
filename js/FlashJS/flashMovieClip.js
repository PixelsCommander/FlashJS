flash.namespace('flash.display.MovieClip');

flash.display.MovieClip = (function(window, undefined){
	function MovieClip(DOMObject){
		var object = new DisplayObject(DOMObject);
		var spritesheet = {};
		
		object.activateAllIncludedMC = function() {
			var allChilds = this.getChildsByTag('*');
			
			for (var i in allChilds) {
				if (allChilds[i].attr('data-movieclip') !== undefined) {
					new MovieClip(allChilds[i]);
					alert('MovieClip found');
				} 	
			}
		}
		
		object.activateSpritesheet = function() {
			
		}
		
		object.gotoAndPlay = function(frameNumber){
			
		}
		
		object.gotoAndStop = function(frameNumber){
			
		}
		
		object.play = function(){
			
		}
		
		object.stop = function(){
			
		}
		
		object.activateAllIncludedMC();
		
		return object; 
	}
	
	window.MovieClip = MovieClip;
	window.MovieClip.prototype = MovieClip.prototype; 
})(window);
