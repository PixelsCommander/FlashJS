flash.namespace('flash.display.CollisionManager');

flash.display.CollisionManager = (function(window, undefined){
	function CollisionManager(DOMObject){
		
		this.objects = [];
		this.collisions = [];
		
		this.collisionStart = function (objectA, objectB, directionString){ //Direction string would be +x for collision where objectA.x > objectB.x
			console.log('Collision start');	
		}
		
		this.collisionStop = function (objectA, objectB, directionString){
			console.log('Collision stop');	
		}
		
		this.addObject = function(object) {
			this.objects.push(object);
			if (this.objects.collisions === undefined) object.collisions = {};
		}
		
		this.testCollisions = function(objectA, objectB) {
			var a = {x1: objectA.getx(), x2: objectA.getx() + objectA.getwidth(), y1: objectA.gety(), y2: objectA.gety() + objectA.getheight()};
			var b = {x1: objectB.getx(), x2: objectB.getx() + objectB.getwidth(), y1: objectB.gety(), y2: objectB.gety() + objectB.getheight()};
			
			if (a.x1 < b.x2 
				&& 
				a.x2 > b.x1 
				&& 
				a.y1 < b.y2 
				&& 
				a.y2 > b.y1) {
				if (objectA.collisions[objectB.id] === undefined) {
					this.collisionStart(objectA, objectB);	
				} 
				
				objectA.collisions[objectB.id] = objectB;
				objectB.collisions[objectA.id] = objectA;
				
				return true;
			} else {
				if (objectA.collisions[objectB.id] !== undefined) {
					this.collisionStop(objectA, objectB);	
				}
				
				objectA.collisions[objectB.id] = undefined;
				objectB.collisions[objectA.id] = undefined;
				return false;
			}
		}
		
		this.step = function(object) {
			for (var i in this.objects) {
				for (var z in this.objects) {
					if (this.objects[i] !== this.objects[z]) this.testCollisions(this.objects[i], this.objects[z]);
				}
			}	
		}
		
	}
	
	window.CollisionManager = CollisionManager;
	window.CollisionManager.prototype = CollisionManager.prototype; 
})(window);

	