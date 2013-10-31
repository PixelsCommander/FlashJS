/*
 * AssetsList is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var AssetsList = function (urlProperties, assetsList, loadCallback) {
        this.urlProperties = urlProperties;

        if (assetsList !== undefined) {
            if (typeof(assetsList) == 'string') {
                this.getFromJSON(assetsList, loadCallback);
            } else {
                for (var i = 0; i < assetsList.length; i++) {
                    this.add(assetsList[i]);
                }
            }
        }

        this.toProceed = 0;
        this.items = {};
        this.loadedItems = 0;
        this.newItemsCount = 0;
    }

    p = AssetsList.prototype;

    p.getFromJSON = function (JSON, callback) {
        if (typeof(JSON) == 'string') {
            this.loadCallback = callback;
            flash.ajax(JSON, this.getFromJSON.bind(this));
            return;
        } else {
            var jsonObject = JSON.assetsData;
        }

        this.add(jsonObject);

        if (this.loadCallback !== undefined) {
            this.load(this.loadCallback);
        }
    }

    p.add = function (asset, callback) {
        if (asset !== undefined) {
            if (asset.constructor == Array) {
                for (var i = 0; i < asset.length; i++) {
                    this.add(asset[i]);
                }
            } else {
                this.toProceed++;
                this.newItemsCount++;
                this.items[asset.id] = asset;
                this.items[asset.id].url = this.fixURL(this.items[asset.id].url);
                this.items[asset.id].callback = this.items[asset.id].callback;
            }
        }
    }

    p.fixURL = function (url) {
        for (var propertyName in this.urlProperties) {
            url = replaceAll(url, '%' + propertyName + '%', this.urlProperties[propertyName]);
        }
        return url;
    }

    p.remove = function (assetID) {
        delete(this.items[assetID]);
    }

    p.get = function (assetID) {
        if (this.items[assetID] !== undefined) {
            return this.items[assetID].data;
        } else {
            for (var propertyName in this.items) {
                if (this.items[propertyName].url === assetID) {
                    return this.items[propertyName].data;
                }
            }
        }
    }

    p.finishLoading = function (callback) {
        this.newItemsCount = 0;
        if (callback !== undefined) {
            callback.apply(this, []);
            this.loadCallback = undefined;
        }
        if (this.onFinish !== undefined) {
            this.onFinish.apply(this, []);
        }
    }

    p.load = function (callback) {
        if (this.onStart !== undefined) {
            this.onStart.apply(this, []);
        }

        var self = this;

        if (this.toProceed === 0) {
            this.finishLoading();
        }

        var propertyName = this.getFirstUnprocessedItem();
        while (propertyName !== undefined) {
            var temporaryCallback = (function (pn) {
                return function () {
                    self.toProceed--;

                    if (self.onProgress !== undefined) {
                        self.percentLeft = (100 - (self.toProceed / self.newItemsCount) * 100);
                        self.onProgress(self);
                    }

                    if (self.toProceed === 0) {
                        self.finishLoading(callback);
                    }

                    if (self.items[pn].callback !== undefined) {
                        self.items[pn].callback(self.items[pn]);
                    }
                }
            })(propertyName);

            if (this.urlProperties !== undefined) {
                this.items[propertyName].startFrame = this.urlProperties.startFrame || 0;
                this.items[propertyName].scale = this.urlProperties.scale || 1;
            } else {
                this.items[propertyName].startFrame = 0;
                this.items[propertyName].scale = 1;
            }
            this.items[propertyName].data = new Loader(this.items[propertyName].url, self.items[propertyName], temporaryCallback, temporaryCallback, self);
            this.items[propertyName].processed = true;
            propertyName = this.getFirstUnprocessedItem();
        }
    }

    p.getFirstUnprocessedItem = function () {
        for (var propertyName in this.items) {
            if (this.items[propertyName].processed === undefined) {
                return propertyName;
            }
        }
        return undefined;
    }

    p.clean = function () {
        this.items = [];
    }

    p.onProgress = undefined;
    p.onFinish = undefined;
    p.onError = undefined;

    w.flash.cloneToNamespaces(AssetsList, 'AssetsList');
})(window);