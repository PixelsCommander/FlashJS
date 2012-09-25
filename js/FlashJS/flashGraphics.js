flash.namespace('flash.display.Graphics');

flash.display.Graphics = function (TargetObject){
		if (TargetObject && TargetObject._graphics === undefined) {
		  // Get the 2d context and put it to the graphics property
		  var canvas = $("<canvas width='" + TargetObject.width + "' height='" + TargetObject.height + "' style='position: absolute;left:0px; top:0px; width:100%; height:100%;'></canvas>");
		  canvas.appendTo(TargetObject);
		  TargetObject._graphics = canvas[0].getContext('2d');
		  TargetObject._graphics.fillStyle = "transparent";
		  TargetObject._graphics.strokeStyle = "#000000";
		  TargetObject._graphics.lineCap = "butt";
		  TargetObject._graphics.strokeStyle = "black";
		  TargetObject._graphics.lineWidth = 1;
		  TargetObject._graphics.moveTo(0,0);
		  currentX = 0;
		  currentY = 0;
		}
		
		TargetObject._graphics.finishDraw = function(){
			if (TargetObject._graphics.strokeStyle != 'transparent') TargetObject._graphics.stroke();
			if (TargetObject._graphics.fillStyle != 'transparent') TargetObject._graphics.fill();
		}
		
		TargetObject._graphics.lineTo = function(){
			
		}
		
		TargetObject._graphics.curveTo = function(controlX, controlY, endX, endY){
			TargetObject._graphics.quadraticCurveTo(controlX, controlY, endX, endY);
			TargetObject._graphics.closePath();
			TargetObject._graphics.finishDraw();
		}
		
		TargetObject._graphics.drawRect = function(topLeftCornerX, topLeftCornerY, width, height){
			TargetObject._graphics.rect(topLeftCornerX, topLeftCornerY, width, height);
			TargetObject._graphics.closePath();
			TargetObject._graphics.finishDraw();	
		}
		
		TargetObject._graphics.lineStyle = function(thickness, color, alpha){
			if (color === undefined){
				color = "#000000";
			}
			
			if (alpha === undefined){
				alpha = 1;
			}
			
			TargetObject._graphics.fillStyle = "rgba(" + hexToR(color) + "," + hexToG(color) + "," + hexToB(color) + "," + alpha + ")";
			TargetObject._graphics.strokeStyle = color;
			TargetObject._graphics.lineWidth = thickness;
		}
		
		TargetObject._graphics.drawCircle = function(centerX, centerY , radius){
			TargetObject._graphics.beginPath();
			TargetObject._graphics.arc(centerX,centerY,radius,0,Math.PI*2,true);
			TargetObject._graphics.closePath();
			TargetObject._graphics.finishDraw();
		}
		
		TargetObject._graphics.beginFill = function(color, alpha){
			TargetObject._graphics.fillStyle = color;	
		}
		
		TargetObject._graphics.endFill = function(){
			TargetObject._graphics.fillStyle = 'transparent';	
		}
		
		TargetObject._graphics.beginLine = function(color){
			TargetObject._graphics.strokeStyle = color;	
		}
		
		TargetObject._graphics.endLine = function(){
			TargetObject._graphics.strokeStyle = 'transparent';	
		}
		
		TargetObject._graphics.clear = function(){
			TargetObject._graphics.clearRect ( 0 , 0 , TargetObject._graphics.canvas.width , TargetObject._graphics.canvas.height );
		}
		
		TargetObject._graphics.curveTo = TargetObject._graphics.bezierCurveTo;
		
		function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)};
		function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)};
		function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)};
		function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h};
		
		return TargetObject._graphics;
	}