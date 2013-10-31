/*
 * Core utils are a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2010 - 2012 pixelsresearch.com,
 */

if (Function.prototype.bind === undefined) {
    Function.prototype.bind = function () {
        var fn = this,
            args = [].slice.call(arguments),
            object = args.shift();

        return function () {
            return fn.apply(object, args.concat([].slice.call(arguments)));
        };
    };
}

if (Array.prototype.remove === undefined) {
    Array.prototype.remove = function (s) {
        for (var i = 0; i < this.length; i++) {
            if (s === this[i]) this.splice(i, 1);
        }
    }
}

function replaceAll(txt, replace, with_this) {
    return txt.replace(new RegExp(replace, 'g'), with_this);
}

function getFileExtension(filename) {
    var result = (/[.]/.exec(filename))[0] ? /[^.]+$/.exec(filename)[0] : '';
    if (result === filename.replace('.', '')) {
        result = '';
    }
    return result;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cloneObject(obj) {
    if (obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for (var key in obj)
        temp[key] = cloneObject(obj[key]);
    return temp;
}

function defineGetterSetter(variableParent, variableName, getterFunction, setterFunction) {
    if (Object.defineProperty) {
        Object.defineProperty(variableParent, variableName, {
            get: getterFunction,
            set: setterFunction
        });
    }
    else if (document.__defineGetter__) {
        variableParent.__defineGetter__(variableName, getterFunction);
        variableParent.__defineSetter__(variableName, setterFunction);
    }

    variableParent["get" + variableName] = getterFunction;
    variableParent["set" + variableName] = setterFunction;
}

(function (w) {
    //Namespace initialization
    w.flash = w.flash || {};
    w.flash.currentId = 0;

    //UID functions to have unique id for all DisplayObjects
    var UID = function () {
        return w.flash.currentId++;
    }

    var ajax = function (URL, callback, errorCallback) {
        if (w.XMLHttpRequest) {
            var xmlhttp = new XMLHttpRequest()
        } else if (w.ActiveXObject) {
            var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200 || xmlhttp.status == 0) {
                    callback(JSON.parse(xmlhttp.response || xmlhttp.responseText));
                } else {
                    errorCallback(xmlhttp.response || xmlhttp.responseText);
                }
            }
        };

        xmlhttp.open("GET", URL, true);
        xmlhttp.send(null);
    }

    w.flash.extend = function (destination, source) {
        if (destination === undefined) destination = new Object();
        if (destination !== undefined) {
            for (var k in source) {
                if (source.hasOwnProperty(k)) {
                    destination[k] = source[k];
                }
            }
        } else {
            destination = source;
        }

        return destination;
    }

    var requestAnimFrame = (function () {
        return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var onEnterFrame = function () {

        if (w.flash.stages !== undefined) {
            var now = Date.now();
            for (var i in w.flash.stages) {
                var delta = now - w.flash.stages[i].lastFrameTime;
                if (w.flash.stages[i].enabled === true && delta > w.flash.stages[i].interval) {
                    if (w.flash.stages[i].onEnterFrame) {
                        var timesRepeat = Math.floor(delta / w.flash.stages[i].interval);
                        timesRepeat = Math.min(timesRepeat, 50);
                        for (timesRepeat; timesRepeat > 0; timesRepeat--) {
                            w.flash.stages[i].onEnterFrame();
                        }
                    }
                    w.flash.stages[i].lastFrameTime = Date.now();
                    w.flash.stages[i].render();
                }
            }

        }

        if (w.flash.hooks.length > 0) {
            var hooksLength = w.flash.hooks.length;
            for (var i = 0; i < hooksLength; i++) {
                w.flash.hooks[i]();
            }
        }

        window.requestAnimFrame(w.onEnterFrame);

        //TO DO flash.stage.trigger({type: flash.events.Event.ENTER_FRAME});
    }

    w.flash.subscribeToEnterFrame = function (handler) {
        for (var i = 0; i < w.flash.hooks.length; i++) {
            if (w.flash.hooks[i] === handler) {
                return;
            }
        }
        w.flash.hooks.push(handler);
    }

    w.flash.unsubscribeFromEnterFrame = function (handler) {
        w.flash.hooks.remove(handler);
    }

    //Function to clone object into needed namespaces, every class description have to ends with this
    w.flash.cloneToNamespaces = function (obj, name) {
        w[name] = w.flash[name] = obj;
    }

    w.flash.hooks = [];

    var showBrowserIsNotSupportedWindow = function (container) {
        container.style.backgroundColor = '#ffffff';
        container.color = '#000000'
        container.innerHTML = "<div style='margin: 45px 45px 45px 45px; font-weight: bold; font-family: Arial; font-size: 40px; line-height: 36px;'>" +
            "YOUR BROWSER<br>IS NOT SUPPORTED" +
            "<p style='font-size: 24px;'>TRY ONE OF THESE:</p>" +
            "<p style='font-size: 24px;'><a href='https://www.google.com/intl/en/chrome/browser/'>Chrome</a>," +
            " <a href='http://windows.microsoft.com/en-US/internet-explorer/downloads/ie-9/worldwide-languages'>Internet explorer 9</a>, " +
            "<a href='http://support.apple.com/downloads/#safari'>Safari</a>, " +
            "<a href='http://www.mozilla.org/'>Firefox</a></p>" +
            "</div>";

    }

    w.flash.cloneToNamespaces(showBrowserIsNotSupportedWindow, 'showBrowserIsNotSupportedWindow');
    w.flash.cloneToNamespaces(navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false, 'iOS');
    w.flash.cloneToNamespaces(navigator.userAgent.match(/(iPad)/i) ? true : false, 'iPad');
    w.flash.cloneToNamespaces(navigator.userAgent.match(/(iPhone)/i) ? true : false, 'iPhone')
    w.flash.cloneToNamespaces(navigator.userAgent.match(/(iPod)/i) ? true : false, 'iPod');
    w.flash.cloneToNamespaces(navigator.userAgent.match(/(iPad)/i) && (window.devicePixelRatio) && (window.devicePixelRatio >= 2) ? true : false, 'iPad3');
    w.flash.cloneToNamespaces(navigator.userAgent.toLowerCase().indexOf("android") > -1 ? true : false, 'Android');
    w.flash.cloneToNamespaces(ajax, 'ajax');
    w.flash.cloneToNamespaces(UID, 'UID');
    w.flash.cloneToNamespaces(requestAnimFrame, 'requestAnimFrame');
    w.flash.cloneToNamespaces(onEnterFrame, 'onEnterFrame');

    w.flash.onWindowFocus = function () {
        clearInterval(w.flash.checkFocusInterval);
        for (var i in w.flash.stages) {
            w.flash.stages[i].lastFrameTime = Date.now();
        }
    }

    w.addEventListener('blur', function () {
        w.flash.windowFocusLeft = true;
        w.flash.checkFocusInterval = setInterval(w.flash.onWindowFocus, 1000);
    })

    w.onEnterFrame();

})(window);