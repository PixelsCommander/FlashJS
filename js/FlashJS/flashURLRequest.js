flash.namespace('flash.display.URLRequest');

flash.display.URLRequest = (function(window, undefined){
	
	function URLRequest(url, method){
		this.url = url;
		this.method = method
	}
	
	window.URLRequest = URLRequest;
}(window))