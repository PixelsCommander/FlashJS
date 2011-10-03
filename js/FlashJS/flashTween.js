flash.namespace('flash.events.Tween');

flash.events.Tween = (function(window, undefined){
	function Tween(object, property, successHandler, begin, end, durationTime, useSeconds){		
	
	end = parseInt(end);
	begin = parseInt(begin);
	
	object[property.toString()] = begin;
	
	if (useSeconds) {
		durationTime = durationTime * 1000;
	}
	
	if (property === 'x') {
		property = 'left';
		end = end + 'px';	
	}
	
	if (property === 'y') {
		property = 'top';
		end = end + 'px';	
	}
	
	if (property === 'alpha') {
		property = 'opacity';
		end = end / 100;	
	}
	
	emile(object.attr('id'), property.toString() + ':' + end, {duration: durationTime, success: successHandler});
	
	function bounce(pos) {
			if (pos < (1/2.75)) {
		    	return (7.5625*pos*pos);
		    } else if (pos < (2/2.75)) {
		        return (7.5625*(pos-=(1.5/2.75))*pos + .75);
		    } else if (pos < (2.5/2.75)) {
		        return (7.5625*(pos-=(2.25/2.75))*pos + .9375);
		    } else {
		        return (7.5625*(pos-=(2.625/2.75))*pos + .984375);
		    }
		}
	}
	
	window.Tween = Tween;
}(window))