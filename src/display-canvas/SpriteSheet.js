/*
 * SpriteSheet is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2013 pixelsresearch.com,
 */

(function (w) {
    var SpriteSheet = function (image, width, height, total, animationsData) {
        this.data = image;

        this.frames = [];
        this.flippedFrames = [];
        this.animations = {};

        this._frameWidth = width;
        this._frameHeight = height;
        this._totalFrames = total;
        this._animationsData = animationsData;

        this.initAnimations();

        if (image !== undefined) {
            if (image.constructor == Array) {
                this.fillFramesFromImagesArray();
            } else {
                this.fillFramesFromSpritesheet();
            }
        }
    }

    var p = SpriteSheet.prototype;

    p.data = {};

    p.defaultAnimationName = 'default';
    p._frameWidth = 0;
    p._frameHeight = 0;
    p._totalFrames = 0;

    p.fillFramesFromSpritesheet = function () {
        var rows = Math.round(this.data.width / this._frameWidth);
        var columns = Math.round(this.data.height / this._frameHeight);

        for (var c = 0; c < columns; c++) {
            for (var r = 0; r < rows; r++) {
                if (this.frames.length <= this._totalFrames) {
                    var canvas = document.createElement("canvas");

                    canvas.width = this._frameWidth;
                    canvas.height = this._frameHeight;

                    var context = canvas.getContext("2d");
                    context.drawImage(this.data, this._frameWidth * r, this._frameHeight * c, this._frameWidth, this._frameHeight, 0, 0, this._frameWidth, this._frameHeight);
                    this.frames.push(canvas);
                }
            }
        }
    }

    p.fillFramesFromImagesArray = function () {
        this.frames = this.data;
    }

    p.fillFlippedFrames = function () {
        for (var i = 0; i < this.frames.length; i++) {
            var currentAnimation = this.getAnimationByFrameNumber(i);
            if (currentAnimation !== undefined && currentAnimation.makeFlip) {
                this.flippedFrames.push(w.flash.getFlippedImage(this.frames[i], true));
            } else {
                this.flippedFrames.push(undefined);
            }
        }
    }

    p.getAnimationByFrameNumber = function (frameNumber) {
        for (var key in this.animations) {
            var animationToCheck = this.animations[key];

            if (animationToCheck.startFrame <= frameNumber && animationToCheck.endFrame >= frameNumber) {
                return animationToCheck;
            }
        }

        return undefined;
    }

    p.initAnimations = function () {
        for (var animationName in this._animationsData) {
            this.animations[animationName] = {
                "name": animationName,
                "startFrame": this._animationsData[animationName].startFrame,
                "endFrame": this._animationsData[animationName].endFrame,
                "interval": this._animationsData[animationName].interval,
                "makeFlip": this._animationsData[animationName].makeFlip,
                "looped": this._animationsData[animationName].looped};
        }

        this.animations[this.defaultAnimationName] = {
            endFrame: this._totalFrames,
            interval: 50,
            looped: 1,
            makeFlip: 0,
            startFrame: 1
        };
    }

    w.flash.cloneToNamespaces(SpriteSheet, 'SpriteSheet');
})(window);