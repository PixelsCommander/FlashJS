/*
* ImageLoader is a part of FlashJS engine
*
* http://flashjs.com
*
* Copyright (c) 2011 - 2012 pixelsresearch.com,
*/

(function(w){
	var ImageLoader = function(URL, options, callback, errorCallback, context){
		var image = new Image();

		var url = w.URL || w.webkitURL; 

		image.onload = function(arg){
			if (callback !== undefined) callback(arg);
		}

		image.onerror = function(arg){
			if (errorCallback !== undefined) errorCallback(arg);
		}

        if (false){
            image.src = w.webkitURL.createObjectURL(URL);
        } else {
            image.src = URL;
        }

		return image;
	}

	ImageLoader.checkLoaderType = function(URL, options){
		var extension = (getFileExtension(URL));
		if ((extension === 'jpg') || (extension === 'png') || (extension === 'gif')){
			return true;
		}
	}

	p = ImageLoader.prototype = new DisplayObject();

	w.flash.cloneToNamespaces(ImageLoader, 'ImageLoader');
})(window);