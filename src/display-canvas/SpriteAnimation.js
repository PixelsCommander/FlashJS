/*
 * SpriteAnimation is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var SpriteAnimation = function (spriteSheet) {
        if (spriteSheet) this.init(spriteSheet);

        this.currentAnimation = {};

        this._currentFrame = 0;
        this._framerate = 24;
        this._nextAnimation = undefined;
        this._animationsStack = [];
        this._frameChanged = 0;
        this._timesRepeat = 0;
    }

    p = SpriteAnimation.prototype = new DisplayObject();
    p._init = p.init;
    p.paused = false;

    p.init = function (spriteSheet) {
        this._init();
        if (spriteSheet) this.spriteSheet = spriteSheet;

        for (var animation in this.spriteSheet.animations) {
            if (this.spriteSheet.animations.hasOwnProperty(animation)) {
                this.currentAnimation = this.spriteSheet.animations[animation];
                break;
            }
        }

        this.width = this.spriteSheet._frameWidth;
        this.height = this.spriteSheet._frameHeight;

        this.setCurrentFrame(this.currentAnimation.startFrame);
    }

    p.draw = function (ctx, someArg, zIndex) {
        if (!this.isVisible()) return;

        if (zIndex !== undefined && this.zindexCache !== zIndex && this.childs === undefined) {
            return;
        }

        this.nextFrame();

        if (this.currentAnimationFlipped) {
            var o = this.spriteSheet.flippedFrames[this._currentFrame];
        } else {
            var o = this.spriteSheet.frames[this._currentFrame];
        }
        if (o == null) {
            return;
        }
        ctx.drawImage(o, 0, 0, this.spriteSheet._frameWidth, this.spriteSheet._frameHeight);
        return true;
    }

    p.nextFrame = function () {

        var now = Date.now();
        var delta = now - this._frameChanged;

        if (delta > this.currentAnimation.interval) {
            if (this.currentAnimation.reverse) {
                this.setCurrentFrame(this._currentFrame - Math.floor(delta / this.currentAnimation.interval));
            } else {
                this.setCurrentFrame(this._currentFrame + Math.floor(delta / this.currentAnimation.interval));
            }
        }

        //Animation ends
        if (((this.currentAnimation._endFrame <= this._currentFrame) && (!this.currentAnimation.reverse)) || ((this.currentAnimation._endFrame >= this._currentFrame) && (this.currentAnimation.reverse))) {

            if (this.currentAnimation.callback !== undefined) {
                this.currentAnimation.callback();
            }

            //If animation set to be repeated - repeat it
            if (this._timesRepeat > 0) {
                this._currentFrame = this.currentAnimation._startFrame
                this._timesRepeat--;
            } else if (this._animationsStack.length > 0) {
                this.setAnimation(this._animationsStack[0].animation, this._animationsStack[0].reverse, this._animationsStack[0].callback);
                this._animationsStack.shift();
            } else {
                if (this.currentAnimation.looped) {
                    this.setCurrentFrame(this.currentAnimation._startFrame, now);
                } else {
                    this.setCurrentFrame(this.currentAnimation._endFrame, now);
                }
            }
        }
    }

    p.setCurrentFrame = function (frameNumber, now) {
        this._currentFrame = frameNumber;
        if (now !== undefined) {
            this._frameChanged = now;
        } else {
            this._frameChanged = Date.now();
        }
    }

    p.setAnimation = function (animationName, reverse, callback, repeat, flipped) {
        if (animationName !== this.currentAnimation.name && this.onAnimationChanged !== undefined) {
            if (this.currentAnimation !== undefined) {
                this.onAnimationChanged(this.currentAnimation.name, animationName, reverse, callback, repeat, flipped);
            } else {
                this.onAnimationChanged(undefined, animationName, reverse, callback, repeat, flipped);
            }
        }

        if (this.locked === true) return;
        this.currentAnimation = this.spriteSheet.animations[animationName];
        this.currentAnimation.reverse = reverse;
        this.currentAnimation.callback = callback;

        if (this.currentAnimation.makeFlip) {
            this.currentAnimationFlipped = flipped;
        } else {
            this.currentAnimationFlipped = false;
        }
        this._timesRepeat = repeat;

        if (reverse) {
            this.currentAnimation._startFrame = this.currentAnimation.endFrame;
            this.currentAnimation._endFrame = this.currentAnimation.startFrame;
        } else {
            this.currentAnimation._startFrame = this.currentAnimation.startFrame;
            this.currentAnimation._endFrame = this.currentAnimation.endFrame;
        }

        this.setCurrentFrame(this.spriteSheet.animations[animationName]._startFrame);
    }

    p.setNextAnimation = function (animationName, reverse, callback, flipped) {
        this._animationsStack.push({'animation': animationName, 'reverse': reverse, 'callback': callback, 'flipped': flipped});
    }

    p.clearStack = function () {
        this._animationsStack = [];
    }

    p.gotoFrame = function (frame) {
        if (this.currentAnimation.endFrame > frame) {
            this._currentFrame = frame;
        }
    }

    p.play = function () {
        this.paused = false;
    }

    p.stop = function () {
        this.paused = true;
    }

    w.flash.cloneToNamespaces(SpriteAnimation, 'SpriteAnimation');
})(window);