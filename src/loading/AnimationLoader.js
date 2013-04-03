/*
 * AnimationLoader is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var AnimationLoader = function (URL, options, callback, errorCallback, context) {

        this.url = URL || w.webkitURL;
        this.options = options;
        this.callback = callback;
        this.spriteSheet = new SpriteSheet(undefined, options.width * options.scale, options.height * options.scale, options.framesTotal, options.animations);
        this.context = context;
        this.frames = [];

        if (URL[URL.length - 1] === "/") {
            this.addAssetsToLoader();
        } else {
            this.loadSpritesheet();
        }

        return this.spriteSheet;
    }

    p = AnimationLoader.prototype;

    p.loadSpritesheet = function () {
        this.image = new Image();

        if (false) {
            this.image.src = w.webkitURL.createObjectURL(this.url);
        } else {
            this.image.src = this.url;
        }

        this.image.onload = this.onSpritesheetLoad.bind(this);

        this.image.onerror = function (arg) {
            if (errorCallback !== undefined) errorCallback(arg);
        }
    }

    p.onSpritesheetLoad = function (arg) {
        this.spriteSheet.data = this.image;
        this.spriteSheet.fillFramesFromSpritesheet();
        this.spriteSheet.fillFlippedFrames();
        if (this.callback !== undefined) this.callback(arg);
    }

    p.addAssetsToLoader = function () {
        this.framesToLoad = 0;
        for (var i = 0; i < this.options.framesTotal; i++) {
            var numberString = i + (this.options.startFrame + 0);
            numberString = this.getFileNameByFrameNumber(numberString);
            var objectToAdd = {id:this.options.id + '_' + i, url:this.url + numberString + '.png', callback:this.frameLoaded.bind(this), frameNumber:i};
            this.context.add(objectToAdd);
            this.framesToLoad++;
        }
    }

    p.getFileNameByFrameNumber = function (frameNumber) {
        var frameNumberString = frameNumber + '';
        var fileName = '';
        var neededLength = this.options.fileNameNumbers || 5;
        var zerosToAdd = neededLength - frameNumberString.length;

        for (var i = 0; i < zerosToAdd; i++) {
            fileName += '0';
        }

        fileName += frameNumberString;
        return fileName;
    }

    p.frameLoaded = function (item) {
        this.framesToLoad--;
        this.frames[item.frameNumber] = item.data;

        if (this.framesToLoad === 0) {
            this.spriteSheet.data = this.frames;
            this.spriteSheet.fillFramesFromImagesArray();
            this.spriteSheet.fillFlippedFrames();
            this.callback();
        }
    }

    AnimationLoader.checkLoaderType = function (URL, options) {
        return ((getFileExtension(URL) === '') || (options.animations !== undefined));
    }

    w.flash.cloneToNamespaces(AnimationLoader, 'AnimationLoader');
})(window);