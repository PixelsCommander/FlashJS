flash.namespace('flash.utils');

flash.utils = (function(window) {
	
	function numToPx(num, ifUndefined){
		if (num != undefined){
			num = num + 'px';
		} else {
			if (ifUndefined === undefined) ifUndefined = '100%'; 
			num = ifUndefined;
		}
		return num;	
	}
	
	return {
		numToPx: numToPx	
	};

}(window))
