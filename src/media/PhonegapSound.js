/*
 * PhoneGapSound is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var PhonegapSound = function (URL) {
        this.loop = false;
        if (URL !== undefined) {
            this.audio = new Media(URL, this.onsoundended, this.onerror);
        }
        this.URL = URL;
        this.onload = this.onload || {};
    }

    var p = PhonegapSound.prototype;

    p.load = function () {
        if (this.audio !== undefined) {
            this.audio.release();
        }

        this.audio = new Media(URL, this.onsoundended, this.onerror);
        this.onload();
    }

    p.onsoundended = function (e) {
        if (this.loop === true) {
            this.audio.play();
        }
    }

    p.onerror = function () {
        throw new Error("Playback error of sound " + this.URL);
    }

    p.play = function () {
        if (flash.soundMuted === true) {
            return;
        }
        this.audio.play();
    }

    p.stop = function () {
        this.audio.noteOff(0);
    }

    p.setVolume = function (volume) {
        console.log('No volume control for this API yet.');
    }

    p.getVolume = function () {
        console.log('No volume control for this API yet.');
    }

    defineGetterSetter(p, 'volume', p.getVolume, p.setVolume);

    w.flash.cloneToNamespaces(PhonegapSound, 'PhonegapSound');
})(window);