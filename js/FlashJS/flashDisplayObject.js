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
		object.scaleXCache = (1);
		object.scaleYCache = (1);
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
				flash.stage.x = (-x + flash.stage.width * 0.5) * flash.stage.scaleX;
			}
		}
		objGetSet.yGet = function(){
			return parseInt(this.css('top'));
		}
		objGetSet.ySet = function(y){
			//console.log("top" + this.css('top'));
			this.css('top', flash.utils.numToPx(y));
			if (flash.stage != undefined && this === flash.stage.cameraTarget){
				flash.stage.y = (-y + flash.stage.height * 0.5) * flash.stage.scaleY;
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
		
		objGetSet.rotationSet = function(angle){
			this.angleCache = angle; 			
			this.refreshCSSTransform();
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
		
		//ScaleX
		objGetSet.scaleXGet = function(){
			return this.scaleXCache;
		}
		
		objGetSet.scaleXSet = function(x){
			this.scaleXCache = x;
			this.refreshCSSTransform();
		}
		
		//ScaleY
		objGetSet.scaleYGet = function(){
			return this.scaleYCache;
		}
		
		objGetSet.scaleYSet = function(y){
			this.scaleYCache = y;
			this.refreshCSSTransform();
		}
		
		
		//numChildren getter
		defineGetterSetter(object, "numChildren", objGetSet.numChildrenGet, function(x){});
		
		//X, Y  getters / setters
		defineGetterSetter(object, "x", objGetSet.xGet, objGetSet.xSet);
		defineGetterSetter(object, "y", objGetSet.yGet, objGetSet.ySet);

		//Width and height getters / setters
		defineGetterSetter(object, "width", objGetSet.widthGet, objGetSet.widthSet);
		defineGetterSetter(object, "height", objGetSet.heightGet, objGetSet.heightSet);

		//Rotation getters / setters. Rotation setter uses flash.display.rotationFunction that is choosed once for flash.display.Stage 			
		defineGetterSetter(object, "rotation", objGetSet.rotationGet, objGetSet.rotationSet);
		
		// Opacity
		defineGetterSetter(object, "alpha", objGetSet.alphaGet, objGetSet.alphaSet);
		
		// Fill color
		defineGetterSetter(object, "fillColor", objGetSet.fillColorGet, objGetSet.fillColorSet);
		
		// Visible
		defineGetterSetter(object, "visible", objGetSet.visibleGet, objGetSet.visibleSet);
		
		// Scale
		defineGetterSetter(object, "scaleX", objGetSet.scaleXGet, objGetSet.scaleXSet);
		defineGetterSetter(object, "scaleY", objGetSet.scaleYGet, objGetSet.scaleYSet);
		
		//CSS transform refresh function to update rotation, scale and potentially skew
		object.refreshCSSTransform = function(){
			flash.display.cssTransformFunction.call(this, this.angleCache, this.scaleXCache, this.scaleYCache);	
		} 
		
		//Method for advanced users to setup scale and rotation CSS properties at once, 
		//it would speed up your app in case you are using all transformations
		object.setTransformAtOnce = function(angle, scaleX, scaleY){
			this.angleCache = angle;
			this.scaleX = scaleX;
			this.scaleY = scaleY
			flash.display.cssTransformFunction.call(this, this.angleCache, this.scaleXCache, this.scaleYCache);	
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


