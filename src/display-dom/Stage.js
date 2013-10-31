/*
 * Stage is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelscommander.com,
 */

(function (w) {
    var Stage = function (selector, baseWidth, baseHeight, options) {
        this.options = options || {};

        this.enabled = true;

        this.canvas = typeof selector == 'string' ? document.querySelector(selector) : selector;
        this.canvas.style.overflow = 'hidden';

        this.baseWidth = baseWidth || 480;
        this.baseHeight = baseHeight || 320;

        //Options === undefined condition is here for backward compatibility
        if (this.options.multiResolution === true || this.options.multiResolution === undefined || this.options === undefined) {
            this.resize();

            var canvasWidth = this.canvas.offsetWidth || parseInt(this.canvas.style.width);
            var canvasHeight = this.canvas.offsetHeight || parseInt(this.canvas.style.height);

            var windowWidth = window.parent ? window.parent.innerWidth : window.innerWidth;
            var widnowHeight = window.parent ? window.parent.innerHeight : window.innerHeight;

            this.scale = Math.min(canvasWidth / this.baseWidth, canvasHeight / this.baseHeight);

            this.pixelScale = Math.min(windowWidth / this.baseWidth, widnowHeight / this.baseHeight);
            this.pixelScale = Math.max(1, Math.ceil(this.pixelScale));
            this.pixelScale = Math.min(4, this.pixelScale);

            this.canvas.pixelScale = this.pixelScale;
        } else {
            this.canvas.pixelScale = this.pixelScale = 1;
        }

        this.lastFrameTime = Date.now();

        this.init();

        this.canvas.appendChild(this._node);

        w.flash.stages = w.flash.stages || {};
        w.flash.stages[this.id] = this;

        this.canvas.addEventListener("resize", this.resize.bind(this));
        window.addEventListener("resize", this.resize.bind(this));

        this.mouseMoveClosure = function (e) {
            e = w.flash.events.normalizeEvent(e);

            this.mouseX = e.offsetX;
            this.mouseY = e.offsetY;

            //TODO fire events
            //$(this.canvas).trigger(MouseEvent.MOUSE_MOVE, e);
            //e = jqMouseEventToFlashMouseEvent(e);

            if (this.onMouseMove) this.onmousemove(e);
        }
        this.mouseMoveClosure = this.mouseMoveClosure.bind(this);

        this.clickClosure = function (e) {
            e = w.flash.events.normalizeEvent(e);

            if (this.onClick) this.onClick(e);
        }
        this.clickClosure = this.clickClosure.bind(this);

        this.onDownClosure = function (e) {
            e = w.flash.events.normalizeEvent(e);
            this.startTouchTime = Date.now();
            if (this.onMouseDown) {
                this.onMouseDown(e)
            }
        }
        this.onDownClosure = this.onDownClosure.bind(this);

        this.onUpClosure = function (e) {
            e = w.flash.events.normalizeEvent(e);
            if (this.onMouseUp) {
                this.onMouseUp(e)
            }
        }
        this.onUpClosure = this.onUpClosure.bind(this);

        w.flash.initTouch(this);

        this.childs = [];
    }

    var p = Stage.prototype = new DisplayList();

    p._addChild = p.addChild;


    p.addChild = function (child) {
        this._addChild(child);
        child.stage = this;
    }

    p.interval = 33;
    p.mouseX = 0;
    p.mouseY = 0;
    p.maxzindex = 0;

    p.setFrameRate = function (frameRate) {
        this.interval = 1000 / frameRate;
    }

    p.render = function () {

    };

    p.resize = function () {
        var containerWidth = window.innerWidth;
        var containerHeight = window.innerHeight;
        var scaleToFitX = containerWidth / this.baseWidth;
        var scaleToFitY = containerHeight / this.baseHeight;

        var currentScreenRatio = containerWidth / containerHeight;
        var optimalRatio = Math.min(scaleToFitX, scaleToFitY);
        this.scale = this.canvas.scale = optimalRatio;

        //if (this.scaleToScreen === true){
        if (currentScreenRatio >= 1.77 && currentScreenRatio <= 1.79) {
            this.canvas.style.width = containerWidth + "px";
            this.canvas.style.height = containerHeight + "px";
        }
        else {
            this.canvas.style.width = this.baseWidth * optimalRatio + "px";
            this.canvas.style.height = this.baseHeight * optimalRatio + "px";
        }
        //}

        var leftOffset = (window.innerWidth - this.baseWidth * optimalRatio) / 2;
        this.leftOffset = this.canvas.leftOffset = leftOffset;

        //Calculating canvas offset
        var parentNode = this.canvas, offsetX = 0, offsetY = 0;
        do {
            if (parentNode.offsetLeft !== undefined) {
                offsetX += parentNode.offsetLeft;
                offsetY += parentNode.offsetTop;
            }
        } while ((parentNode = parentNode.parentNode));

        this.canvas.offsetX = offsetX;
        this.canvas.offsetY = offsetY;

        if (this.onresize) {
            this.onresize();
        }
    }

    w.flash.cloneToNamespaces(Stage, 'Stage');
}(window));