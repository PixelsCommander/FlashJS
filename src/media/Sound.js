/*
 * Sound is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var Sound = function (data) {
        if (data !== undefined) {
            this._audio = data;
        } else {
            this._audio = new Audio();
        }
        this.codec = 'mp3';
        this.loop = false;
    }

    var p = Sound.prototype;

    p.load = function () {
        if (this.URL === undefined) {
            throw new Error("Trying to load Sound without URL");
        }

        this.codec = 'mp3';

        this._audio.autobuffer = true;
        this._audio.preload = 'auto';
        this._audio.autoplay = false;

        if ((this._audio).canPlayType("audio/mpeg")) {
            this.codec = 'mp3';
        } else if ((this._audio).canPlayType("audio/ogg; codecs=vorbis")) {
            this.codec = 'ogg';
        } else {
            //If we are in old Android
            this.codec = 'mp3';
            this._audio = document.createElement("video");
            this._audio.preload = 'auto';
            this._audio.autobuffer = true;
            this.onload();
        }

        this.changeCodecTo(this.codec);

        if (this.onload !== undefined) {
            var tempLoadHandler = this.onload;

            this.onload = function () {
                tempLoadHandler();
                this._audio.removeEventListener('canplaythrough', this.onload);
                this._audio.removeEventListener('load', this.onload, false);
            }

            this.onload = this.onload.bind(this);

            this._audio.addEventListener('canplaythrough', this.onload, false);
            this._audio.addEventListener('load', this.onload, false);
        }

        if (w.flash.iOS === true) {
            this.onload();
        }

        this._audio.src = this.URL;
    }

    p.changeCodecTo = function (codecType) {
        this.URL = replaceAll(this.URL, 'mp3', codecType);
        this.URL = replaceAll(this.URL, 'ogg', codecType);
        this.URL = replaceAll(this.URL, 'wav', codecType);
    }

    p.play = function () {
        if (flash.soundMuted === true) {
            return;
        }
        this._audio.loop = this.loop;
        if (this._audio.paused) {
            if (this._audio.loop && this.codec === 'ogg') {
                this._audio.addEventListener('ended', function () {
                    this.currentTime = 0;
                    this.play();
                }, false);
            }
            this._audio.play();
        } else {
            var tempSound = this.clone();
            tempSound.play();
        }
    }

    p.stop = function () {
        this._audio.stop();
    }

    p.clone = function () {
        var clonedAudio = new Audio();
        clonedAudio.src = this._audio.src;
        clonedAudio.loop = this.loop;
        clonedAudio.volume = this.volume;

        var clonedSound = new Sound(clonedAudio);
        clonedSound.loop = this.loop;
        clonedSound.codec = this.codec;
        return clonedSound;
    }

    p.setVolume = function (volume) {
        this._audio.volume = volume;
    }

    p.getVolume = function () {
        return this._audio.volume;
    }

    defineGetterSetter(p, 'volume', p.getVolume, p.setVolume);

    w.flash.cloneToNamespaces(Sound, 'Sound');
})(window);