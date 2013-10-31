/*
 * Loader is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var Loader = function (URL, options, callback, errorCallback, context) {
        var particularLoader = Loader.getLoader(URL, options);
        return new particularLoader(URL, options, callback, errorCallback, context);
    }

    Loader.getLoader = function (URL, options) {
        for (var i = 0; i < Loader.loaders.length; i++) {
            if (Loader.loaders[i].checkLoaderType(URL, options)) {
                return Loader.loaders[i];
            }
        }
    }

    Loader.loaders = [AnimationLoader, ImageLoader, SoundLoader];

    w.flash.cloneToNamespaces(Loader, 'Loader');
})(window);