/*
 * APISound is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var APISound = function (dataOrURL) {
        if (w.flash.iOS === true) {
            w.flash.APISound.sounds.push(this);
        }

        this.codec = 'mp3';
        this.loop = false;
        this.context = w.flash.APISound.getAudioContext();
        this.audio = this.context.createBufferSource();
        this.gain = {};

        if (this.context.createGain !== undefined) {
            this.gain = this.context.createGain();
        } else {
            this.gain = this.context.createGainNode();
        }
        this.audio.connect(this.gain);
        this.gain.connect(this.context.destination);
        this.onload = this.onload || {};

        if (dataOrURL !== undefined) {
            if (typeof dataOrURL === 'string') {
                this.URL = dataOrURL;
            } else {
                this.buffer = dataOrURL;
                this.audio.buffer = this.buffer;
            }
        }
    }

    var p = APISound.prototype;

    p.load = function () {
        this.changeCodecTo('mp3');
        var request = new XMLHttpRequest();
        request.open('GET', this.URL, true);
        request.responseType = 'arraybuffer';
        request.onload = this.onsoundloaded.bind(this);
        request.send();
    }

    p.onsoundloaded = function (e) {
        this.buffer = this.context.createBuffer(e.target.response, false);
        this.audio.buffer = this.buffer;
        if (this.onload !== undefined) {
            this.onload();
        }
    }

    p.onerror = function () {
        throw new Error("Playback error of sound " + this.URL);
    }

    p.play = function () {
        if (flash.soundMuted === true) {
            return;
        }

        this.audio = this.context.createBufferSource();
        this.gain = this.context.createGainNode();
        this.audio.connect(this.gain);
        this.gain.connect(this.context.destination);
        this.audio.buffer = this.buffer;
        this.audio.loop = this.loop;
        this.audio.noteOn(0);
    }

    p.stop = function () {
        this.audio.noteOff(0);
    }

    p.setVolume = function (volume) {
        this.gain.gain.value = volume;
    }

    p.getVolume = function () {
        return this.gain.gain.value;
    }

    p.changeCodecTo = function (codecType) {
        this.URL = replaceAll(this.URL, 'mp3', codecType);
        this.URL = replaceAll(this.URL, 'ogg', codecType);
        this.URL = replaceAll(this.URL, 'wav', codecType);
    }

    APISound.getAudioContext = function () {
        if (this.audioContext !== undefined) {
            return this.audioContext;
        } else {
            if ('AudioContext' in w) {
                this.audioContext = new AudioContext();
            } else if ('webkitAudioContext' in w) {
                this.audioContext = new webkitAudioContext();
            } else {
                this.audioContext = false;
            }
        }

        return this.audioContext;
    }

    defineGetterSetter(p, 'volume', p.getVolume, p.setVolume);

    if (w.flash.iOS === true) {
        APISound.initAPI = function () {
            var soundToPlay = APISound.getFirstReadySound();
            if (soundToPlay !== undefined) {
                var tempVolume = soundToPlay.volume;
                soundToPlay.volume = 0;
                soundToPlay.play();
                soundToPlay.volume = tempVolume;
                w.removeEventListener('touchstart', APISound.initAPI);
            }
        }

        APISound.sounds = [];

        APISound.getFirstReadySound = function () {
            for (var i = 0; i < APISound.sounds.length; i++) {
                if (APISound.sounds[i].buffer !== undefined) {
                    return APISound.sounds[i];
                }
            }
            return undefined;
        }
        w.addEventListener('touchstart', APISound.initAPI);
    }

    w.flash.cloneToNamespaces(APISound, 'APISound');
})(window);