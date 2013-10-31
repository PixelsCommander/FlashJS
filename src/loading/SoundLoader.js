/*
 * SoundLoader is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var SoundLoader = function (URL, options, callback, errorCallback, context) {
        this.URL = URL;
        this.loop = options.loop || false;
        this.volume = options.volume || 1;
        this.callback = callback;
        this.errorCallback = errorCallback;
        this.context = context;

        var sound = undefined;

        if (w.flash.APISound.getAudioContext() !== false) {
            sound = new APISound();
        } else if ((window.phonegap !== undefined || window.cordova !== undefined || window.Phonegap !== undefined) && window.Media !== undefined) {
            sound = new PhonegapSound();
        } else {
            sound = new Sound();
        }

        sound.URL = this.URL;
        sound.loop = this.loop;
        sound.volume = this.volume;
        sound.onload = this.callback;
        sound.onerror = this.callback;
        sound.load();

        return sound;
    }

    p = SoundLoader.prototype;

    SoundLoader.checkLoaderType = function (URL, options) {
        var extension = (getFileExtension(URL));
        if ((extension === 'ogg') || (extension === 'mp3') || (extension === 'wav')) {
            return true;
        }
    }

    w.flash.cloneToNamespaces(SoundLoader, 'SoundLoader');
})(window);