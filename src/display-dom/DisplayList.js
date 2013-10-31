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
    }

    var p = DisplayList.prototype = new DisplayObject();

    p.maxzindex = 0;

    p.addChild = function (displayObject) {
        this._node.appendChild(displayObject._node);
        this.childs.push(displayObject);
        return displayObject;
    }

    p.removeChildAt = function (index) {
        this.childs[index].remove();
        delete this.childs[index];
        this.childs.splice(index, 1);
    }

    p.removeChild = function (objectToDelete) {
        var childsLength = this.childs.length;
        for (var i = 0; i < childsLength; i++) {
            if (this.childs[i] == objectToDelete) {
                this.removeChildAt(i);
            }
        }
        delete objectToDelete;
    }

    p.getChildAt = function (index) {
        return object.childs[index];
    }

    p.getChildByName = function (name) {
        var childsLength = this.childs.length;
        for (var i = 0; i < childsLength; i++) {
            if (this.childs[i].name === name) {
                return object.childs[i];
            }
        }
    }

    w.flash.cloneToNamespaces(DisplayList, 'DisplayList');
})(window);