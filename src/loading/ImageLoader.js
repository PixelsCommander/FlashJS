/*
 * ImageLoader is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var ImageLoader = function (URL, options, callback, errorCallback, context) {
        this.context = context;
        this.options = options;
        this.callback = callback;
        var image = new Image();

        var url = w.URL || w.webkitURL;

        //modifiedVersions will be added to AssetsList as separate assets with appliedModifiers object
        if (this.context !== undefined) {
            this.modifiedVersions = [];
            this.addModifiedVersions();
            this.modifyCallBack();
        }

        image.onload = (function (arg) {
            if (callback !== undefined) {
                callback(arg);
            }
        }).bind(this);

        image.onerror = function (arg) {
            if (errorCallback !== undefined) {
                errorCallback(arg);
            }
        }

        if (false) {
            image.src = w.webkitURL.createObjectURL(URL);
        } else {
            image.src = URL;
        }

        return image;
    }

    ImageLoader.checkLoaderType = function (URL, options) {
        var extension = (w.getFileExtension(URL));
        if ((extension === 'jpg') || (extension === 'png') || (extension === 'gif')) {
            return true;
        }
    }

    ImageLoader.modifiers = {
        verticalFlip: function (data) {
            return w.flash.getFlippedImage(data, false, true);
        },
        horizontalFlip: function (data) {
            return w.flash.getFlippedImage(data, true, false);
        },
        bothFlip: function (data) {
            return w.flash.getFlippedImage(data, true, true);
        }
    };

    p = ImageLoader.prototype = new DisplayObject();

    p.cloneOptionsObject = function () {
        var objectToAdd = cloneObject(this.options);
        return this.cleanOptionsObjectFromModifiers(objectToAdd);
    }

    p.cleanOptionsObjectFromModifiers = function (obj) {
        for (var i in this.options) {
            for (var k in ImageLoader.modifiers) {
                if (i === k) {
                    obj[i] = undefined;
                }
            }
        }
        return obj;
    }

    p.addModifiedVersions = function () {
        for (var i in this.options) {
            for (var k in ImageLoader.modifiers) {
                if (i === k && this.options[i] !== undefined) {
                    var modifiedVersion = this.cloneOptionsObject();
                    modifiedVersion.id = modifiedVersion.id + '_' + i;
                    modifiedVersion.appliedModifiers = [];
                    modifiedVersion.appliedModifiers.push(i);
                    modifiedVersion.callback = function (data) {
                        for (var i = 0; i < this.appliedModifiers.length; i++) {
                            this.data = ImageLoader.modifiers[this.appliedModifiers[i]].apply(this, [this.data]);
                        }
                        ;
                    }
                    this.modifiedVersions.push(modifiedVersion);
                }
            }
        }

        this.context.add(this.modifiedVersions);
    }

    p.modifyCallBack = function () {
        if (this.options.appliedModifiers !== undefined) {
            this._callback = this.callback;
            this.callback = function (data) {
                for (var i = 0; i < this.options.appliedModifiers.length; i++) {
                    data = ImageLoader.modifiers[this.options.appliedModifiers[i]].apply(this, [data.target]);
                }
                ;
                this._callback();
            }
        }
    }

    w.flash.cloneToNamespaces(ImageLoader, 'ImageLoader');
})(window);