/*
 * DisplayList is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var DisplayList = function () {
        this.init();
        this.childs = [];
        this.drawFromCache = false;
        this.cacheFilled = false;
        this.maxzindex = 1;
    }

    var p = DisplayList.prototype = new DisplayObject();

    p._draw = p.draw;

    p.draw = function (ctx, matrix, zIndex) {
        if (this.drawFromCache) {
            if (!this.cacheFilled) {
                this.drawToCache();
            }
            this._draw(ctx, false, zIndex);
        } else {
            for (var i = 0; i < this.childs.length; i++) {
                ctx.save();
                this.childs[i].updateContext(ctx, zIndex);
                this.childs[i].draw(ctx, false, zIndex);
                ctx.restore();
            }
        }
    }

    p.drawToCache = function () {
        if (this.cacheCanvas === undefined) this.cacheCanvas = document.createElement("canvas");
        var ctx = this.cacheCanvas.getContext('2d');

        for (var i = 0; i < this.childs.length; i++) {
            ctx.save();
            this.childs[i].updateContext(ctx);
            this.childs[i].draw(ctx, false);
            ctx.restore();
        }

        this.cacheFilled = true;
    }

    p.addChild = function (child) {
        this.childs.push(child);
        child.parent = this;
        if (this.stage !== undefined) {
            child.stage = this.stage;
        }
    }

    p.removeChild = function (child) {
        for (var i = 0; i < this.childs.length; i++) {
            if (this.childs[i] === child) {
                this.removeChildByIndex(i);
            }
        }
    }

    p.removeChildByIndex = function (index) {
        this.childs[index].cleanListeners();
        this.childs.splice(index, 1);
    }

    w.flash.cloneToNamespaces(DisplayList, 'DisplayList');
})(window);