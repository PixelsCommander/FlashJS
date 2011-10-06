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
		
		//numChildren getter
		object.__defineGetter__("numChildren", function(){
			return this.childs.length;
		});
		
		//X, Y getters / setters
		object.__defineGetter__("x", function(){
			return parseInt(this.css('left'));
		});
		object.__defineSetter__("x", function(x){
			this.css('left', flash.utils.numToPx(x));
			if (flash.stage != undefined && this === flash.stage.cameraTarget){
				flash.stage.x = -x + flash.stage.width * 0.5;
			}
		});
		object.__defineGetter__("y", function(){
			return parseInt(this.css('top'));
		});
		object.__defineSetter__("y", function(x){
			this.css('top', flash.utils.numToPx(x));
			if (flash.stage != undefined && this === flash.stage.cameraTarget){
				flash.stage.y = -x + flash.stage.height * 0.5;
			}
		});
		
		//Width and height getters / setters
		object.__defineGetter__("width", function(){
			return parseInt(this.css('width'));
		});
		object.__defineSetter__("width", function(x){
			this.css('width', flash.utils.numToPx(x));
		});
		object.__defineGetter__("height", function(){
			return parseInt(this.css('height'));
		});
		object.__defineSetter__("height", function(x){
			this.css('height', flash.utils.numToPx(x));
		});
		
		//Rotation getters / setters. Rotation setter uses flash.display.rotationFunction that is choosed once for flash.display.Stage 
		object.__defineGetter__("rotation", function(){
			
			this.angleCache = this.angleCache != undefined ? this.angleCache : 0; 
			
			return this.angleCache;
		});
		object.__defineSetter__("rotation", flash.display.rotationFunction);
		
		//Opacity
		object.__defineGetter__("alpha", function(){
			return this.css('opacity') * 100;
		});
		object.__defineSetter__("alpha", function(x){
			this.css('opacity', x / 100);
		});
		
		//Fill color
		object.__defineGetter__("fillColor", function(){
			return this.css('background-color');
		});
		object.__defineSetter__("fillColor", function(x){
			this.css('background-color', x);
		});
		
		//Visible
		object.__defineGetter__("visible", function(){
			if (this.css('display') === 'none'){
				return false;
			} else {
				return true;
			}
		});
		object.__defineSetter__("visible", function(x){
			if (x === true){
				this.css('display', 'inline');
			} else {
				this.css('display', 'none');
			}
		});
		
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


