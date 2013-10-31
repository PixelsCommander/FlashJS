/*
 * DisplayObject is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

function testCSS(prop) {
    return prop in document.documentElement.style;
}

if (flash.cssTransformFunction === undefined) {
    if (testCSS('WebkitTransform')) {
        var browserTransformPrefix = ('webkitTransform');
    } else if (testCSS('MozBoxSizing')) {
        var browserTransformPrefix = ('MozTransform');
    } else if (/*@cc_on!@*/false || testCSS('msTransform')) {
        var browserTransformPrefix = ('-ms-transform');
    }

    flash.cssTransformFunction = function (angle, scalex, scaley) {
        //this.css(browserTransformPrefix , 'rotate(' + -angle + 'deg) scale(' + scalex + ',' + scaley + ')');//this.angleCache = angle; this.scaleXCache = scalex;this.scaleYCache = scaley;
        this._node.style[browserTransformPrefix] = 'rotate(' + -angle + 'deg) scale(' + scalex + ',' + scaley + ')';
    }
}

(function (w) {
    var DisplayObject = function (image, width, height, stage) {
        if (typeof(image) === 'string') {
            this._image = document.createElement('img');
            this._image.src = image;
        } else if (image !== undefined) {
            this._image = document.createElement('img');
            this._image.src = image.src;
        }

        this.init();

        if (image !== undefined) {
            this._node.appendChild(this._image);
        }

        if (image !== undefined) {
            this.setImage(image, width, height);
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
    p.zindex = 0;

    p.angleCache = 0;
    p.scaleXCache = 1;
    p.scaleYCache = 1;
    p.xCache = 0;
    p.yCache = 0;
    p.childs = [];

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

    p.compositeOperation = null;
    p.snapToPixel = false;

    p._image = {};

    //Handlers
    p.onPress = null;
    p.onClick = null;
    p.onMousOver = null;
    p.onMouseOut = null;
    p.onTick = null;

    p.init = function () {
        this.id = w.UID();
        this._node = document.createElement('div');
        this._node.id = this.id;
        this._node.style.position = 'absolute';
        this._node.addEventListener('mousedown', function (event) {
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
        });
        this._node.addEventListener('touchdown', function (event) {
            event.preventDefault ? event.preventDefault() : event.returnValue = false;
        });
    }

    p.setZIndex = function (zIndex) {
        this._node.style.zIndex = zIndex;
    }

    p.getZIndex = function () {
        return this.zindexCache;
    }

    p.setWidth = function (width) {
        this._originalWidth = width;
        if (this._stage !== undefined) {
            this._width = this._originalWidth / this._stage.pixelScale;
        } else {
            this._width = this._originalWidth;
        }
        this._halfWidth = this._width / 2;
        this._node.style.width = this._width + 'px';
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
        this._node.style.height = this._height + 'px';
    }

    p.getHeight = function () {
        return this._height;
    }

    defineGetterSetter(p, 'height', p.getHeight, p.setHeight);

    p.setStage = function (stage) {
        this._stage = stage;
        this.refreshDimensions();
        this.refreshHalfDimensions();
    }

    p.getStage = function () {
        return this._stage;
    }

    defineGetterSetter(p, 'stage', p.getStage, p.setStage);

    p.setImage = function (image, width, height) {
        this.width = width || image.width;
        this.height = height || image.height;

        this._node.removeChild(this._image);

        if (typeof(image) === 'string') {
            this._image = document.createElement('img');
            this._image.src = image;
            this._node.appendChild(this._image);
        } else if (image !== undefined) {
            this._image = document.createElement('img');
            this._image.src = image.src;
            this._node.appendChild(this._image);
        }
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

    //X, Y  getters / setters
    p.xGet = function () {
        return this.xCache;//parseInt(this._node.style['left']);
    }
    p.xSet = function (x) {
        this.xCache = x;
        this._node.style['left'] = (x * this._stage.pixelScale || 1) + 'px';
        /*if (flash.stage != undefined && this === flash.stage.cameraTarget){
         flash.stage.x = (-x + flash.stage.width * 0.5) * flash.stage.scaleX;
         }*/
    }
    p.yGet = function () {
        return this.yCache;//parseInt(this._node.style['top']);
    }
    p.ySet = function (y) {
        this.yCache = y;
        this._node.style['top'] = (y * this.stage.pixelScale || 1) + 'px';
        /*if (flash.stage != undefined && this === flash.stage.cameraTarget){
         flash.stage.y = (-y + flash.stage.height * 0.5) * flash.stage.scaleY;
         }*/
    }

    //Width and height getters / setters
    p.widthGet = function () {
        return parseInt(this._node.style.width);
    }
    p.widthSet = function (x) {
        this._node.style.width = x + 'px';
    }
    p.heightGet = function () {
        return parseInt(this._node.style.height);
    }
    p.heightSet = function (x) {
        this._node.style.height = x + 'px';
    }

    //Rotation getters / setters. Rotation setter uses flash.display.rotationFunction that is choosed once for flash.display.Stage
    p.rotationGet = function () {
        this.angleCache = this.angleCache != undefined ? this.angleCache : 0;
        return this.angleCache;
    }

    p.rotationSet = function (angle) {
        this.angleCache = angle;
        this.refreshCSSTransform();
    }

    //Opacity
    p.alphaGet = function () {
        return this._node.style['opacity'];
    }
    p.alphaSet = function (x) {
        this._node.style['opacity'] = x;
    }

    //Fill color
    p.fillColorGet = function () {
        return this._node.style['backgroundColor'];
    }
    p.fillColorSet = function (x) {
        this._node.style['backgroundColor'] = x;
    }

    //Visible
    p.visibleGet = function () {
        if (this._node.style['display'] === 'none') {
            return false;
        } else {
            return true;
        }
    }
    p.visibleSet = function (x) {
        if (x === true) {
            this._node.style['display'] = 'inline';
        } else {
            this._node.style['display'] = 'none';
        }
    }

    //ScaleX
    p.scaleXGet = function () {
        return this.scaleXCache;
    }

    p.scaleXSet = function (x) {
        this.scaleXCache = x;
        this.refreshCSSTransform();
    }

    //ScaleY
    p.scaleYGet = function () {
        return this.scaleYCache;
    }

    p.scaleYSet = function (y) {
        this.scaleYCache = y;
        this.refreshCSSTransform();
    }

    p.refreshCSSTransform = function () {
        flash.cssTransformFunction.call(this, this.angleCache, this.scaleXCache, this.scaleYCache);
    }

    //Method for advanced users to setup scale and rotation CSS properties at once,
    //it would speed up your app in case you are using all transformations
    p.setTransformAtOnce = function (angle, scaleX, scaleY) {
        this.angleCache = angle;
        this.scaleX = scaleX;
        this.scaleY = scaleY
        flash.cssTransformFunction.call(this, this.angleCache, this.scaleXCache, this.scaleYCache);
    }

    //numChildren getter
    defineGetterSetter(p, "numChildren", p.numChildrenGet, function (x) {
    });

    //X, Y  getters / setters
    defineGetterSetter(p, "x", p.xGet, p.xSet);
    defineGetterSetter(p, "y", p.yGet, p.ySet);

    //Width and height getters / setters
    defineGetterSetter(p, "width", p.widthGet, p.widthSet);
    defineGetterSetter(p, "height", p.heightGet, p.heightSet);

    //Rotation getters / setters. Rotation setter uses flash.display.rotationFunction that is choosed once for flash.display.Stage 			
    defineGetterSetter(p, "rotation", p.rotationGet, p.rotationSet);

    // Opacity
    defineGetterSetter(p, "alpha", p.alphaGet, p.alphaSet);

    // Fill color
    defineGetterSetter(p, "fillColor", p.fillColorGet, p.fillColorSet);

    // Visible
    defineGetterSetter(p, "visible", p.visibleGet, p.visibleSet);

    // Scale
    defineGetterSetter(p, "scaleX", p.scaleXGet, p.scaleXSet);
    defineGetterSetter(p, "scaleY", p.scaleYGet, p.scaleYSet);

    //zIndex
    defineGetterSetter(p, "zIndex", p.getZIndex, p.setZIndex);

    p.addEventListener = function (type, handler) {
        this._node.addEventListener(type, handler);
    }

    DisplayObject.fromJSON = function (object, assets) {
        try {
            var tempObject = new DisplayObject(assets.items[object.asset].data);
        } catch (e) {
            throw new Error('Can`t find asset ' + object.asset + ' in list');
        }

        tempObject.x = object.x;
        tempObject.y = object.y;
        tempObject.zindex = object.zindex;
        tempObject.data = object;

        return tempObject;
    }

    w.flash.cloneToNamespaces(DisplayObject, 'DisplayObject');
}(window));