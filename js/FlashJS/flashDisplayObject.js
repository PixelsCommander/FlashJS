flash.namespace('flash.display.DisplayObject');



flash.display.DisplayObject = (function(window, undefined){
	function DisplayObject(DOMObject){
		
		function addCounter(){
			if (flash.stage != undefined){
				if (flash.stage.objectsNumber === undefined) flash.stage.objectsNumber = 0;
				flash.stage.objectsNumber ++;
				if(flash.stage.debug){
					flash.stage.setObjects(flash.stage.objectsNumber);
				}	
			}
		}
		
		addCounter();
		
		//Object creation and initialization
		if(DOMObject){
			var object = $(DOMObject);
		} else {
			var object = $('<div/>', {'id': _.uniqueId() ,'style': 'position: absolute;'});
		}
		
		object.angleCache = (0);
		
		object.childs = [];
		
		//Listeners initialization
		object.mousemove( function(e) {
		   object.mouseX = e.clientX; 
		   object.mouseY = e.clientY;
		 });
		
		// Define getters and setters - functions shared by both standard-compatible and legacy browsers
		// numChildren getter 
		var objGetSet = new Object();
		
		objGetSet.numChildrenGet = function(){
			return this.childs.length;
		}
		
		//X, Y  getters / setters
		objGetSet.xGet = function(){
			return parseInt(this.css('left'));
		}
		objGetSet.xSet = function(x){
			this.css('left', flash.utils.numToPx(x));
			if (flash.stage != undefined && this === flash.stage.cameraTarget){
				flash.stage.x = -x + flash.stage.width * 0.5;
			}
		}
		objGetSet.yGet = function(){
			return parseInt(this.css('top'));
		}
		objGetSet.ySet = function(x){
			//console.log("top" + this.css('top'));
			this.css('top', flash.utils.numToPx(x));
			if (flash.stage != undefined && this === flash.stage.cameraTarget){
				flash.stage.y = -x + flash.stage.height * 0.5;
			}
		}
	
		//Width and height getters / setters
		objGetSet.widthGet = function(){
			return parseInt(this.css('width'));
		}
		objGetSet.widthSet = function(x){
			this.css('width', flash.utils.numToPx(x));
		}
		objGetSet.heightGet = function(){
			return parseInt(this.css('height'));
		}
		objGetSet.heightSet = function(x){
			this.css('height', flash.utils.numToPx(x));
		}
		
		//Rotation getters / setters. Rotation setter uses flash.display.rotationFunction that is choosed once for flash.display.Stage 
		objGetSet.rotationGet = function(){
			
			this.angleCache = this.angleCache != undefined ? this.angleCache : 0; 
			
			return this.angleCache;
		}
		
		//Opacity
		objGetSet.alphaGet = function(){
			return this.css('opacity') * 100;
		}
		objGetSet.alphaSet = function(x){
			this.css('opacity', x / 100);
		}
		
		//Fill color
		objGetSet.fillColorGet = function(){
			return this.css('background-color');
		}
		objGetSet.fillColorSet = function(x){
			this.css('background-color', x);
		}
		
		//Visible
		objGetSet.visibleGet = function(){
			if (this.css('display') === 'none'){
				return false;
			} else {
				return true;
			}
		}
		objGetSet.visibleSet = function(x){
			if (x === true){
				this.css('display', 'inline');
			} else {
				this.css('display', 'none');
			}
		}
		
		// Check for standards-compatible browser
		if (Object.defineProperty)
		{
			
			// For standards-based syntax
			var DOMonly = false;
			try
			{
				//numChildren getter
				Object.defineProperty(object, "numChildren", { get: objGetSet.numChildrenGet, set: function(x){} });
				
				//X, Y  getters / setters
				Object.defineProperty(object, "x", { get: objGetSet.xGet, set: objGetSet.xSet });
				Object.defineProperty(object, "y", { get: objGetSet.yGet, set: objGetSet.ySet });

				//Width and height getters / setters
				Object.defineProperty(object, "width", { get: objGetSet.widthGet, set: objGetSet.widthSet });
				Object.defineProperty(object, "height", { get: objGetSet.heightGet, set: objGetSet.heightSet });

				//Rotation getters / setters. Rotation setter uses flash.display.rotationFunction that is choosed once for flash.display.Stage 			
				Object.defineProperty(object, "rotation", { get: objGetSet.rotationGet, set: flash.display.rotationFunction });
				
				// Opacity
				Object.defineProperty(object, "alpha", { get: objGetSet.alphaGet, set: objGetSet.alphaSet });
				
				// Fill color
				Object.defineProperty(object, "fillColor", { get: objGetSet.fillColorGet, set: objGetSet.fillColorSet });
				
				// Visible
				Object.defineProperty(object, "visible", { get: objGetSet.visibleGet, set: objGetSet.visibleSet });
			}
			catch(e)
			{
				DOMonly = true;
				}
		}
		else if (document.__defineGetter__)
		{
			// Use the legacy syntax
			object.__defineGetter__("numChildren", objGetSet.numChildrenGet);
			
			//X, Y  getters / setters
			object.__defineGetter__("x", objGetSet.xGet);
			object.__defineSetter__("x", objGetSet.xSet);
			object.__defineGetter__("y", objGetSet.yGet);
			object.__defineSetter__("y", objGetSet.ySet);
		
			//Width and height getters / setters
			object.__defineGetter__("width", objGetSet.widthGet);
			object.__defineSetter__("width", objGetSet.widthSet);
			object.__defineGetter__("height", objGetSet.heightGet);
			object.__defineSetter__("height", objGetSet.heightSet);
			
			//Rotation getters / setters. Rotation setter uses flash.display.rotationFunction that is choosed once for flash.display.Stage 
			object.__defineGetter__("rotation", objGetSet.rotationGet);
			object.__defineSetter__("rotation", flash.display.rotationFunction);
			
			//Opacity
			object.__defineGetter__("alpha", objGetSet.alphaGet);
			object.__defineSetter__("alpha", objGetSet.alphaSet);
			
			//Fill color
			object.__defineGetter__("fillColor", objGetSet.fillColorGet);
			object.__defineSetter__("fillColor", objGetSet.fillColorSet);
			
			//Visible
			object.__defineGetter__("visible", objGetSet.visibleGet);
			object.__defineSetter__("visible", objGetSet.visibleSet);		
		}
		else
		{
			// if neither defineProperty or __defineGetter__ is supported
		}
		
		object.addChild = function(displayObject){
			displayObject.appendTo(this);
			this.childs.push(displayObject);
			return displayObject;	
		}
		
		object.removeChildAt = function(index){
			this.childs[index].remove();
			delete this.childs[index];
			this.childs.splice(index, 1);	
		}
		
		object.removeChild = function(objectToDelete){
			var childsLength = this.childs.length;
			for (var i = 0; i < childsLength; i++){
				if (this.childs[i] == objectToDelete){
					this.removeChildAt(i);
				}
			}
			delete objectToDelete;	
		}
		
		object.getChildAt = function(index){
			return object.childs[index];
		}
		
		object.getChildByName = function(name){
			var childsLength = this.childs.length;
			for (var i = 0; i < childsLength; i++){
				if (this.childs[i].name === name){
					return object.childs[i];
				}
			}
		}
		
		object.addEventListener = object.bind;
		
		object.x = 0;
		object.y = 0;
		
		return object;	
	}
	
	window.DisplayObject = DisplayObject;
	window.DisplayObject.prototype = DisplayObject.prototype; 	
}(window)
)


