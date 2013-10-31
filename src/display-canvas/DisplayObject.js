/*
 * DisplayObject is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var DisplayObject = function (image, width, height, stage) {
        this.init();

        if (image !== undefined) {
            if ((typeof image) === 'string') {
                image = new ImageLoader(image, undefined, (function () {
                    this.setImage(image, width, height);
                }).bind(this));
            } else {
                this.setImage(image);
            }
        }

        if (stage !== undefined) {
            this.setStage(stage);
        }
    }

    var p = DisplayObject.prototype;

    p.cacheCanvas = null;

    p.id = -1;
    p.name = null;
    p.parent = null;
    p.zindexCache = 0;

    p.x = 0;
    p.y = 0;
    p.regX = 0;
    p.regY = 0;

    p.width = 0;
    p.height = 0;
    p._width = 0;
    p._height = 0;

    p.scaleX = 1;
    p.scaleY = 1;

    p.rotation = 0;
    p.alpha = 1;
    p._matrix = null;
    p.visible = true;
    p.mouseEnabled = true;
    p.snapToPixel = false;

    p.handlers = [];

    //Handlers
    p.onPress = null;
    p.onClick = null;
    p.onMousOver = null;
    p.onMouseOut = null;
    p.onTick = null;

    p.init = function () {
        this.id = w.UID();
        this._matrix = new w.Matrix2D();
    }

    p.setZIndex = function (zIndex) {
        this.zindexCache = zIndex;
        this.updateMaxZIndex(zIndex);
    }

    p.getZIndex = function () {
        return this.zindexCache;
    }

    //zIndex
    defineGetterSetter(p, "zIndex", p.getZIndex, p.setZIndex);

    p.updateMaxZIndex = function (zindex, object) {
        if (this._stage !== undefined) {
            if (zindex === undefined) zindex = this.zindexCache;
            this._stage.maxzindex = Math.max(this._stage.maxzindex, zindex + 1);
        }
    }

    p.setWidth = function (width) {
        this._originalWidth = width;
        if (this._stage !== undefined) {
            this._width = this._originalWidth / this._stage.pixelScale;
        } else {
            this._width = this._originalWidth;
        }
        this._halfWidth = this._width / 2;
    }

    p.getWidth = function () {
        return this._width;
    }

    defineGetterSetter(p, 'width', p.getWidth, p.setWidth);

    p.setHeight = function (height) {
        this._originalHeight = height;
        if (this._stage !== undefined) {
            this._height = this._originalHeight / this._stage.pixelScale;
        } else {
            this._height = this._originalHeight;
        }
        this._halfHeight = this._height / 2;
    }

    p.getHeight = function () {
        return this._height;
    }

    defineGetterSetter(p, 'height', p.getHeight, p.setHeight);

    p.setStage = function (stage) {
        this._stage = stage;
        this.refreshDimensions();
        this.refreshHalfDimensions();
        this.updateMaxZIndex();
    }

    p.getStage = function () {
        return this._stage;
    }

    defineGetterSetter(p, 'stage', p.getStage, p.setStage);

    p.setImage = function (image, width, height) {
        if (this.cacheCanvas === null) this.cacheCanvas = document.createElement("canvas");

        this.width = width || image.width;
        this.height = height || image.height;

        this.cacheCanvas.width = this._originalWidth;
        this.cacheCanvas.height = this._originalHeight;

        var ctx = this.cacheCanvas.getContext('2d');
        ctx.drawImage(image, 0, 0, this._originalWidth, this._originalHeight);
    }

    p.setRotationCenter = function () {
        this.regX = this.cacheCanvas.width / 2;
        this.regY = this.cacheCanvas.height / 2;
    }

    p.refreshHalfDimensions = function () {
        this._halfHeight = this._height / 2;
        this._halfWidth = this._width / 2;
    }

    p.refreshDimensions = function () {
        this._height = this._originalHeight / this._stage.pixelScale;
        this._width = this._originalWidth / this._stage.pixelScale;
    }

    p.isVisible = function () {
        return this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0;
    }

    p.draw = function (ctx, ignoreCache, zIndex) {
        if (!this.isVisible()) return;

        if (zIndex !== undefined && this.zindexCache !== zIndex && this.childs === undefined) {
            return;
        }

        if (ignoreCache || !this.cacheCanvas) {
            return false;
        }

        ctx.drawImage(this.cacheCanvas, 0, 0, this._originalWidth, this._originalHeight);

        return true;
    }

    p.updateContext = function (ctx, zIndex) {
        if (!this.isVisible()) return;

        if (zIndex !== undefined && this.zindexCache !== zIndex && this.childs === undefined) {
            return;
        }

        if (this._stage === undefined) {
            this.setStage(this.getStage());
        }

        //TO DO MASK
        var mtx;

        var x = this.x;
        var y = this.y;

        if (this._stage !== undefined) {
            x = this.x * this._stage.pixelScale;
            y = this.y * this._stage.pixelScale;
        }

        mtx = this._matrix.identity().appendTransform(x, y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.regX, this.regY);
        ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx + 0.5 | 0, mtx.ty + 0.5 | 0);
        ctx.globalAlpha *= this.alpha;
    }

    p.getStage = function () {
        if (this.canvas !== undefined) {
            return this;
        }
        var stage = undefined;
        var o = this.parent;

        while (stage === undefined && o !== undefined) {
            stage = o.stage;
            o = this.parent;
        }

        return stage;
    }

    p.getConcatenatedMatrix = function (matrix) {
        if (matrix) {
            matrix.identity();
        }
        else {
            matrix = new w.Matrix2D();
        }
        var o = this;
        while (o != null) {
            matrix.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY).prependProperties(o.alpha, o.shadow, o.compositeOperation);
            o = o.parent;
        }
        return matrix;
    }

    p.addEventListener = function (type, handler) {
        handler = handler.bind(this);
        document.addEventListener(type, handler);
        this.handlers.push({
            type: type, handler: handler
        });
    }

    p.removeEventListener = function (type, handler) {
        document.removeEventListener(type, handler);
    }

    p.cleanListeners = function () {
        for (var i = 0; i < this.handlers.length; i++) {
            this.removeEventListener(this.handlers[i].type, this.handlers[i].handler);
        }
    }

    p.distanceToObject = function (objectToMeasure) {
        var xs = 0;
        var ys = 0;

        xs = (objectToMeasure.x + objectToMeasure._halfWidth) - (this.x + this._halfWidth);
        xs = xs * xs;

        ys = (objectToMeasure.y + objectToMeasure._halfHeight) - (this.y + this._halfHeight);
        ys = ys * ys;

        return Math.sqrt(xs + ys);
    }

    DisplayObject.fromJSON = function (object, assets) {
        try {
            var tempObject = new DisplayObject(assets.items[object.asset].data);
        } catch (e) {
            throw new Error('Can`t find asset ' + object.asset + ' in list');
        }

        tempObject.x = object.x;
        tempObject.y = object.y;
        tempObject.zIndex = object.zIndex;
        tempObject.data = object;

        return tempObject;
    }

    w.flash.cloneToNamespaces(DisplayObject, 'DisplayObject');
}(window));