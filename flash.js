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
    return (/[.]/.exec(filename))[0] ? /[^.]+$/.exec(filename)[0] : '';
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
/*
 * Matrix2D
 * Visit http://createjs.com/ for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

(function (ns) {

    /**
     * Represents an affine transformation matrix, and provides tools for constructing and concatenating matrixes.
     * @class Matrix2D
     * @constructor
     * @param {Number} a Specifies the a property for the new matrix.
     * @param {Number} b Specifies the b property for the new matrix.
     * @param {Number} c Specifies the c property for the new matrix.
     * @param {Number} d Specifies the d property for the new matrix.
     * @param {Number} tx Specifies the tx property for the new matrix.
     * @param {Number} ty Specifies the ty property for the new matrix.
     **/
    var Matrix2D = function (a, b, c, d, tx, ty) {
        this.initialize(a, b, c, d, tx, ty);
    }
    var p = Matrix2D.prototype;

// static public properties:

    /**
     * An identity matrix, representing a null transformation. Read-only.
     * @property identity
     * @static
     * @type Matrix2D
     **/
    Matrix2D.identity = null; // set at bottom of class definition.

    /**
     * Multiplier for converting degrees to radians. Used internally by Matrix2D. Read-only.
     * @property DEG_TO_RAD
     * @static
     * @final
     * @type Number
     **/
    Matrix2D.DEG_TO_RAD = Math.PI / 180;


// public properties:
    /**
     * Position (0, 0) in a 3x3 affine transformation matrix.
     * @property a
     * @type Number
     **/
    p.a = 1;

    /**
     * Position (0, 1) in a 3x3 affine transformation matrix.
     * @property b
     * @type Number
     **/
    p.b = 0;

    /**
     * Position (1, 0) in a 3x3 affine transformation matrix.
     * @property c
     * @type Number
     **/
    p.c = 0;

    /**
     * Position (1, 1) in a 3x3 affine transformation matrix.
     * @property d
     * @type Number
     **/
    p.d = 1;

    /**
     * Position (2, 0) in a 3x3 affine transformation matrix.
     * @property atx
     * @type Number
     **/
    p.tx = 0;

    /**
     * Position (2, 1) in a 3x3 affine transformation matrix.
     * @property ty
     * @type Number
     **/
    p.ty = 0;

    /**
     * Property representing the alpha that will be applied to a display-canvas object. This is not part of matrix
     * operations, but is used for operations like getConcatenatedMatrix to provide concatenated alpha values.
     * @property alpha
     * @type Number
     **/
    p.alpha = 1;

    /**
     * Property representing the shadow that will be applied to a display-canvas object. This is not part of matrix
     * operations, but is used for operations like getConcatenatedMatrix to provide concatenated shadow values.
     * @property shadow
     * @type Shadow
     **/
    p.shadow = null;

    /**
     * Property representing the compositeOperation that will be applied to a display-canvas object. This is not part of
     * matrix operations, but is used for operations like getConcatenatedMatrix to provide concatenated
     * compositeOperation values. You can find a list of valid composite operations at:
     * <a href="https://developer.mozilla.org/en/Canvas_tutorial/Compositing">https://developer.mozilla.org/en/Canvas_tutorial/Compositing</a>
     * @property compositeOperation
     * @type String
     **/
    p.compositeOperation = null;

// constructor:
    /**
     * Initialization method.
     * @method initialize
     * @protected
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.initialize = function (a, b, c, d, tx, ty) {
        if (a != null) {
            this.a = a;
        }
        this.b = b || 0;
        this.c = c || 0;
        if (d != null) {
            this.d = d;
        }
        this.tx = tx || 0;
        this.ty = ty || 0;
        return this;
    }

// public methods:
    /**
     * Concatenates the specified matrix properties with this matrix. All parameters are required.
     * @method prepend
     * @param {Number} a
     * @param {Number} b
     * @param {Number} c
     * @param {Number} d
     * @param {Number} tx
     * @param {Number} ty
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.prepend = function (a, b, c, d, tx, ty) {
        var tx1 = this.tx;
        if (a != 1 || b != 0 || c != 0 || d != 1) {
            var a1 = this.a;
            var c1 = this.c;
            this.a = a1 * a + this.b * c;
            this.b = a1 * b + this.b * d;
            this.c = c1 * a + this.d * c;
            this.d = c1 * b + this.d * d;
        }
        this.tx = tx1 * a + this.ty * c + tx;
        this.ty = tx1 * b + this.ty * d + ty;
        return this;
    }

    /**
     * Appends the specified matrix properties with this matrix. All parameters are required.
     * @method append
     * @param {Number} a
     * @param {Number} b
     * @param {Number} c
     * @param {Number} d
     * @param {Number} tx
     * @param {Number} ty
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.append = function (a, b, c, d, tx, ty) {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;

        this.a = a * a1 + b * c1;
        this.b = a * b1 + b * d1;
        this.c = c * a1 + d * c1;
        this.d = c * b1 + d * d1;
        this.tx = tx * a1 + ty * c1 + this.tx;
        this.ty = tx * b1 + ty * d1 + this.ty;
        return this;
    }

    /**
     * Prepends the specified matrix with this matrix.
     * @method prependMatrix
     * @param {Matrix2D} matrix
     **/
    p.prependMatrix = function (matrix) {
        this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        this.prependProperties(matrix.alpha, matrix.shadow, matrix.compositeOperation);
        return this;
    }

    /**
     * Appends the specified matrix with this matrix.
     * @method appendMatrix
     * @param {Matrix2D} matrix
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.appendMatrix = function (matrix) {
        this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        this.appendProperties(matrix.alpha, matrix.shadow, matrix.compositeOperation);
        return this;
    }

    /**
     * Generates matrix properties from the specified display-canvas object transform properties, and prepends them with this matrix.
     * For example, you can use this to generate a matrix from a display-canvas object: var mtx = new Matrix2D();
     * mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
     * @method prependTransform
     * @param {Number} x
     * @param {Number} y
     * @param {Number} scaleX
     * @param {Number} scaleY
     * @param {Number} rotation
     * @param {Number} skewX
     * @param {Number} skewY
     * @param {Number} regX Optional.
     * @param {Number} regY Optional.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.prependTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        if (rotation % 360) {
            var r = rotation * Matrix2D.DEG_TO_RAD;
            var cos = Math.cos(r);
            var sin = Math.sin(r);
        } else {
            cos = 1;
            sin = 0;
        }

        if (regX || regY) {
            // append the registration offset:
            this.tx -= regX;
            this.ty -= regY;
        }
        if (skewX || skewY) {
            // TODO: can this be combined into a single prepend operation?
            skewX *= Matrix2D.DEG_TO_RAD;
            skewY *= Matrix2D.DEG_TO_RAD;
            this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
            this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
        } else {
            this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
        }
        return this;
    }

    /**
     * Generates matrix properties from the specified display-canvas object transform properties, and appends them with this matrix.
     * For example, you can use this to generate a matrix from a display-canvas object: var mtx = new Matrix2D();
     * mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
     * @method appendTransform
     * @param {Number} x
     * @param {Number} y
     * @param {Number} scaleX
     * @param {Number} scaleY
     * @param {Number} rotation
     * @param {Number} skewX
     * @param {Number} skewY
     * @param {Number} regX Optional.
     * @param {Number} regY Optional.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.appendTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        if (rotation % 360) {
            var r = rotation * Matrix2D.DEG_TO_RAD;
            var cos = Math.cos(r);
            var sin = Math.sin(r);
        } else {
            cos = 1;
            sin = 0;
        }

        if (skewX || skewY) {
            // TODO: can this be combined into a single append?
            skewX *= Matrix2D.DEG_TO_RAD;
            skewY *= Matrix2D.DEG_TO_RAD;
            this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
        } else {
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
        }

        if (regX || regY) {
            // prepend the registration offset:
            this.tx -= regX * this.a + regY * this.c;
            this.ty -= regX * this.b + regY * this.d;
        }
        return this;
    }

    /**
     * Applies a rotation transformation to the matrix.
     * @method rotate
     * @param {Number} angle The angle in degrees.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.rotate = function (angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        var a1 = this.a;
        var c1 = this.c;
        var tx1 = this.tx;

        this.a = a1 * cos - this.b * sin;
        this.b = a1 * sin + this.b * cos;
        this.c = c1 * cos - this.d * sin;
        this.d = c1 * sin + this.d * cos;
        this.tx = tx1 * cos - this.ty * sin;
        this.ty = tx1 * sin + this.ty * cos;
        return this;
    }

    /**
     * Applies a skew transformation to the matrix.
     * @method skew
     * @param {Number} skewX The amount to skew horizontally in degrees.
     * @param {Number} skewY The amount to skew vertically in degrees.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.skew = function (skewX, skewY) {
        skewX = skewX * Matrix2D.DEG_TO_RAD;
        skewY = skewY * Matrix2D.DEG_TO_RAD;
        this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
        return this;
    }

    /**
     * Applies a scale transformation to the matrix.
     * @method scale
     * @param {Number} x
     * @param {Number} y
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.scale = function (x, y) {
        this.a *= x;
        this.d *= y;
        this.tx *= x;
        this.ty *= y;
        return this;
    }

    /**
     * Translates the matrix on the x and y axes.
     * @method translate
     * @param {Number} x
     * @param {Number} y
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.translate = function (x, y) {
        this.tx += x;
        this.ty += y;
        return this;
    }

    /**
     * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
     * @method identity
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.identity = function () {
        this.alpha = this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        this.shadow = this.compositeOperation = null;
        return this;
    }

    /**
     * Inverts the matrix, causing it to perform the opposite transformation.
     * @method invert
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     **/
    p.invert = function () {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        var tx1 = this.tx;
        var n = a1 * d1 - b1 * c1;

        this.a = d1 / n;
        this.b = -b1 / n;
        this.c = -c1 / n;
        this.d = a1 / n;
        this.tx = (c1 * this.ty - d1 * tx1) / n;
        this.ty = -(a1 * this.ty - b1 * tx1) / n;
        return this;
    }

    /**
     * Returns true if the matrix is an identity matrix.
     * @method isIdentity
     * @returns Boolean
     **/
    p.isIdentity = function () {
        return this.tx == 0 && this.ty == 0 && this.a == 1 && this.b == 0 && this.c == 0 && this.d == 1;
    }

    /**
     * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that this these values
     * may not match the transform properties you used to generate the matrix, though they will produce the same visual
     * results.
     * @method decompose
     * @param {Object} target The object to apply the transform properties to. If null, then a new object will be returned.
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.decompose = function (target) {
        // TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation
        // even when scale is negative
        if (target == null) {
            target = {};
        }
        target.x = this.tx;
        target.y = this.ty;
        target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
        target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);

        var skewX = Math.atan2(-this.c, this.d);
        var skewY = Math.atan2(this.b, this.a);

        if (skewX == skewY) {
            target.rotation = skewY / Matrix2D.DEG_TO_RAD;
            if (this.a < 0 && this.d >= 0) {
                target.rotation += (target.rotation <= 0) ? 180 : -180;
            }
            target.skewX = target.skewY = 0;
        } else {
            target.skewX = skewX / Matrix2D.DEG_TO_RAD;
            target.skewY = skewY / Matrix2D.DEG_TO_RAD;
        }
        return target;
    }

    /**
     * Reinitializes all matrix properties to those specified.
     * @method appendProperties
     * @param {Number} a
     * @param {Number} b
     * @param {Number} c
     * @param {Number} d
     * @param {Number} tx
     * @param {Number} ty
     * @param {Number} alpha desired alpha value
     * @param {Shadow} shadow desired shadow value
     * @param {String} compositeOperation desired composite operation value
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.reinitialize = function (a, b, c, d, tx, ty, alpha, shadow, compositeOperation) {
        this.initialize(a, b, c, d, tx, ty);
        this.alpha = alpha || 1;
        this.shadow = shadow;
        this.compositeOperation = compositeOperation;
        return this;
    }

    /**
     * Appends the specified visual properties to the current matrix.
     * @method appendProperties
     * @param {Number} alpha desired alpha value
     * @param {Shadow} shadow desired shadow value
     * @param {String} compositeOperation desired composite operation value
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.appendProperties = function (alpha, shadow, compositeOperation) {
        this.alpha *= alpha;
        this.shadow = shadow || this.shadow;
        this.compositeOperation = compositeOperation || this.compositeOperation;
        return this;
    }

    /**
     * Prepends the specified visual properties to the current matrix.
     * @method prependProperties
     * @param {Number} alpha desired alpha value
     * @param {Shadow} shadow desired shadow value
     * @param {String} compositeOperation desired composite operation value
     * @return {Matrix2D} This matrix. Useful for chaining method calls.
     */
    p.prependProperties = function (alpha, shadow, compositeOperation) {
        this.alpha *= alpha;
        this.shadow = this.shadow || shadow;
        this.compositeOperation = this.compositeOperation || compositeOperation;
        return this;
    }

    /**
     * Returns a clone of the Matrix2D instance.
     * @method clone
     * @return {Matrix2D} a clone of the Matrix2D instance.
     **/
    p.clone = function () {
        var mtx = new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
        mtx.shadow = this.shadow;
        mtx.alpha = this.alpha;
        mtx.compositeOperation = this.compositeOperation;
        return mtx;
    }

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of the instance.
     **/
    p.toString = function () {
        return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]";
    }

    // this has to be populated after the class is defined:
    Matrix2D.identity = new Matrix2D(1, 0, 0, 1, 0, 0);

    ns.Matrix2D = Matrix2D;
}(window));
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

        this.canvas = typeof selector == 'string' ? document.querySelector(selector) : selector;

        if (this.canvas.getContext === undefined) {
            w.flash.showBrowserIsNotSupportedWindow(this.canvas.parentNode);
        }

        this.context = this.canvas.getContext('2d');

        //TODO delete after TextField and onClick/HitTest would be implemented
        if (this.canvas.leftOffset) this.leftOffset = this.canvas.leftOffset;

        this.baseWidth = baseWidth || 480;
        this.baseHeight = baseHeight || 320;

        //this.options.multiResolution === undefined condition is here for backward compatibility
        if (this.options.multiResolution === true || this.options.multiResolution === undefined) {
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

        this.width = this.canvas.width = this.baseWidth * this.pixelScale;
        this.height = this.canvas.height = this.baseHeight * this.pixelScale;

        this.lastFrameTime = Date.now();

        this.init();

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
        this.enabled = true;
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
    p.maxzindex = 1;

    p.setFrameRate = function (frameRate) {
        this.interval = 1000 / frameRate;
    }

    p.render = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0; i < this.maxzindex; i++) {
            this.context.save();
            this.updateContext(this.context, undefined, i);
            this.draw(this.context, undefined, i);
            this.context.restore();
        }
    };

    p.resize = function () {
        var containerWidth = window.innerWidth;
        var containerHeight = window.innerHeight;
        var scaleToFitX = containerWidth / this.baseWidth;
        var scaleToFitY = containerHeight / this.baseHeight;

        var currentScreenRatio = containerWidth / containerHeight;
        var optimalRatio = Math.min(scaleToFitX, scaleToFitY);
        this.scale = this.canvas.scale = optimalRatio;

        //this.options.scaleToScreen === undefined condition is here for backward compatibility
        if (this.options.scaleToScreen === true || this.options.scaleToScreen === undefined) {
            if (currentScreenRatio >= 1.77 && currentScreenRatio <= 1.79) {
                this.canvas.style.width = containerWidth + "px";
                this.canvas.style.height = containerHeight + "px";
            }
            else {
                this.canvas.style.width = this.baseWidth * optimalRatio + "px";
                this.canvas.style.height = this.baseHeight * optimalRatio + "px";
            }
        }

        var leftOffset = (window.innerWidth - this.baseWidth * optimalRatio) / 2;
        this.leftOffset = this.canvas.leftOffset = leftOffset;

        //Calculating canvas offset
        var parentNode = this.canvas, offsetX = 0, offsetY = 0;
        do {
            if (parentNode.offsetLeft !== undefined) {
                offsetX += parentNode.offsetLeft;
                offsetY += parentNode.offsetTop;
                2
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
/*
 * SpriteSheet is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
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

    p = SpriteSheet.prototype;

    p.data = {};

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
    }

    w.flash.cloneToNamespaces(SpriteSheet, 'SpriteSheet');
})(window);
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
/*
 * Event is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {

    w.jqMouseEventToFlashMouseEvent = function (e) {
        e.localX = e.clientX;
        e.localY = e.clientY;
        e.stageX = flash.stage.mouseX;
        e.stageY = flash.stage.mouseY;
        e.delta = e.wheelDelta;
        return e;
    }

    var events = {
        MouseEvent: {
            CLICK: "click",
            MOUSE_MOVE: "mousemove",
            MOUSE_DOWN: "mousedown",
            MOUSE_UP: "mouseup",
            MOUSE_OUT: "mouseout",
            MOUSE_OVER: "mouseover"
        },

        KeyboardEvent: {
            KEY_DOWN: 'keydown',
            KEY_UP: 'keyup',
            UP_CODE: 38,
            DOWN_CODE: 40,
            LEFT_CODE: 37,
            RIGHT_CODE: 39,
            SPACEBAR_CODE: 32
        },

        Event: {
            COMPLETE: 'load',
            ENTER_FRAME: 'enterframe',
            RESIZE: 'resize'
        },

        IOErrorEvent: {
            IO_ERROR: 'ioerror'
        },

        normalizeEvent: function (e) {
            if (e.clientX === undefined || e.clientY === 0) {
                if ((e.touches !== undefined) && (e.touches[0]) !== undefined) {
                    var element = e.target, offsetX = 0, offsetY = 0;

                    if (element.offsetParent) {
                        do {
                            offsetX += element.offsetLeft;
                            offsetY += element.offsetTop;
                        } while ((element = element.offsetParent));
                    }

                    mx = e.touches[0].pageX - offsetX;
                    my = e.touches[0].pageY - offsetY;

                    return {
                        target: e.target,
                        offsetX: mx / e.target.scale,
                        offsetY: my / e.target.scale
                    };
                }
            }

            if (e.offsetX === undefined) {
                var layerX = e.layerX;
                if (e.target.leftOffset !== undefined) {
                    layerX = e.layerX - e.target.leftOffset;
                }
            }

            return {
                target: e.target,
                offsetX: (e.offsetX || layerX || 0) / e.target.scale,
                offsetY: (e.offsetY || e.layerY || 0) / e.target.scale
            };
        }
    }

    //If some event type need to be transformed before handling - preHandler have to be added here
    var preHandlers = {
        keydown: function (e, handler) {

        }
    };

    w.flash.cloneToNamespaces(events, "events");

    w.flash.extend(window.Event, flash.events.Event);
    w.flash.extend(window.IOErrorEvent, flash.events.IOErrorEvent);
    w.flash.extend(window.LoadingManagerEvent, flash.events.LoadingManagerEvent);
    w.flash.extend(window.MouseEvent, flash.events.MouseEvent);
    w.flash.extend(window.KeyboardEvent, flash.events.KeyboardEvent);

})(window);
/*
 * TouchEvent is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var initTouch = function (stage) {

        var tapInterval = 500;
        var tapDistance = 5 * stage.pixelScale;

        stage._fireClickClosure = function (e) {
            if ((Date.now() - stage.tapStartTime) < tapInterval) {
                var deltaX = Math.abs(stage.tapStartX - stage.mouseX);
                var deltaY = Math.abs(stage.tapStartY - stage.mouseY);
                if ((deltaX + deltaY) < tapDistance) {
                    stage.clickClosure(e);
                }
            }
        }

        w.flash.events.hasTouch = 'ontouchstart' in window;
        w.flash.events.startEvent = w.flash.events.hasTouch ? 'touchstart' : 'mousedown';
        w.flash.events.moveEvent = w.flash.events.hasTouch ? 'touchmove' : 'mousemove';
        w.flash.events.endEvent = w.flash.events.hasTouch ? 'touchend' : 'mouseup';
        w.flash.events.cancelEvent = w.flash.events.hasTouch ? 'touchcancel' : 'mouseup';

        stage.canvas.addEventListener(w.flash.events.moveEvent, function (e) {
            stage.mouseMoveClosure(e);
        });

        stage.canvas.addEventListener(w.flash.events.startEvent, function (e) {
            stage.tapStartTime = Date.now();
            stage.tapStartX = stage.mouseX;
            stage.tapStartY = stage.mouseY;
            stage.onDownClosure(e);
        });

        stage.canvas.addEventListener(w.flash.events.endEvent, function (e) {
            stage._fireClickClosure(e);
            stage.onUpClosure(e);
        });

        if (w.flash.events.hasTouch) {
            stage.canvas.addEventListener(w.flash.events.cancelEvent, function (e) {
                stage._fireClickClosure(e);
                stage.onUpClosure(e);
            });
        }

        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
    }

    w.flash.cloneToNamespaces(initTouch, "initTouch");
})(window);
/*
 * AccelerationEvent is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    if (w.DeviceMotionEvent !== undefined && w.flash.iOS === true) {
        w.flash.accelerometer = w.flash.accelerometer || {};
        w.flash.accelerometer.noiseBarrier = 0.2;
        w.addEventListener('devicemotion', function (e) {
            w.flash.accelerometer.oldX = w.flash.accelerometer.x;
            w.flash.accelerometer.oldY = w.flash.accelerometer.y;
            w.flash.accelerometer.oldZ = w.flash.accelerometer.z;

            w.flash.accelerometer.x = event.accelerationIncludingGravity.x;
            w.flash.accelerometer.y = event.accelerationIncludingGravity.y;
            w.flash.accelerometer.z = event.accelerationIncludingGravity.z;

            w.flash.accelerometer.deltaX = Math.abs(w.flash.accelerometer.x) - Math.abs(w.flash.accelerometer.oldX);
            w.flash.accelerometer.deltaY = Math.abs(w.flash.accelerometer.y) - Math.abs(w.flash.accelerometer.oldY);
            w.flash.accelerometer.deltaZ = Math.abs(w.flash.accelerometer.z) - Math.abs(w.flash.accelerometer.oldZ);

            w.flash.accelerometer.noisyX = w.flash.accelerometer.deltaX > w.flash.accelerometer.noiseBarrier ? false : true;
            w.flash.accelerometer.noisyY = w.flash.accelerometer.deltaY > w.flash.accelerometer.noiseBarrier ? false : true;
            w.flash.accelerometer.noisyZ = w.flash.accelerometer.deltaZ > w.flash.accelerometer.noiseBarrier ? false : true;

            if (window.orientation === -90 || window.parentOrientation === -90) {
                w.flash.accelerometer.y = w.flash.accelerometer.y * -1;
            }

            if (window.orientation === 90 || window.parentOrientation === 90) {
                w.flash.accelerometer.x = w.flash.accelerometer.x * -1;
            }
        })

        w.setOrientation = w.setOrientation || function (orientationArg) {
            w.parentOrientation = orientationArg;
        }

        if (w.parent != w && w.setOrientation) w.setOrientation(w.parent.orientation);
    }
})(window);
/*
 * APISound is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var APISound = function (dataOrURL) {
        if (w.flash.iOS === true) {
            w.flash.APISound.sounds.push(this);
        }

        this.codec = 'mp3';
        this.loop = false;
        this.context = w.flash.APISound.getAudioContext();
        this.audio = this.context.createBufferSource();
        this.gain = this.context.createGainNode();
        this.audio.connect(this.gain);
        this.gain.connect(this.context.destination);
        this.onload = this.onload || {};

        if (dataOrURL !== undefined) {
            if (typeof dataOrURL === 'string') {
                this.URL = dataOrURL;
            } else {
                this.buffer = dataOrURL;
                this.audio.buffer = this.buffer;
            }
        }
    }

    var p = APISound.prototype;

    p.load = function () {
        this.changeCodecTo('mp3');
        var request = new XMLHttpRequest();
        request.open('GET', this.URL, true);
        request.responseType = 'arraybuffer';
        request.onload = this.onsoundloaded.bind(this);
        request.send();
    }

    p.onsoundloaded = function (e) {
        this.buffer = this.context.createBuffer(e.target.response, false);
        this.audio.buffer = this.buffer;
        if (this.onload !== undefined) {
            this.onload();
        }
    }

    p.onerror = function () {
        throw new Error("Playback error of sound " + this.URL);
    }

    p.play = function () {
        if (flash.soundMuted === true) {
            return;
        }

        this.audio = this.context.createBufferSource();
        this.gain = this.context.createGainNode();
        this.audio.connect(this.gain);
        this.gain.connect(this.context.destination);
        this.audio.buffer = this.buffer;
        this.audio.loop = this.loop;
        this.audio.noteOn(0);
    }

    p.stop = function () {
        this.audio.noteOff(0);
    }

    p.setVolume = function (volume) {
        this.gain.gain.value = volume;
    }

    p.getVolume = function () {
        return this.gain.gain.value;
    }

    p.changeCodecTo = function (codecType) {
        this.URL = replaceAll(this.URL, 'mp3', codecType);
        this.URL = replaceAll(this.URL, 'ogg', codecType);
        this.URL = replaceAll(this.URL, 'wav', codecType);
    }

    APISound.getAudioContext = function () {
        if (this.audioContext !== undefined) {
            return this.audioContext;
        } else {
            if ('AudioContext' in w) {
                this.audioContext = new AudioContext();
            } else if ('webkitAudioContext' in w) {
                this.audioContext = new webkitAudioContext();
            } else {
                this.audioContext = false;
            }
        }

        return this.audioContext;
    }

    defineGetterSetter(p, 'volume', p.getVolume, p.setVolume);

    if (w.flash.iOS === true) {
        APISound.initAPI = function () {
            var soundToPlay = APISound.getFirstReadySound();
            if (soundToPlay !== undefined) {
                var tempVolume = soundToPlay.volume;
                soundToPlay.volume = 0;
                soundToPlay.play();
                soundToPlay.volume = tempVolume;
                w.removeEventListener('touchstart', APISound.initAPI);
            }
        }

        APISound.sounds = [];

        APISound.getFirstReadySound = function () {
            for (var i = 0; i < APISound.sounds.length; i++) {
                if (APISound.sounds[i].buffer !== undefined) {
                    return APISound.sounds[i];
                }
            }
            return undefined;
        }
        w.addEventListener('touchstart', APISound.initAPI);
    }

    w.flash.cloneToNamespaces(APISound, 'APISound');
})(window);
/*
 * PhoneGapSound is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var PhonegapSound = function (URL) {
        this.loop = false;
        if (URL !== undefined) {
            this.audio = new Media(URL, this.onsoundended, this.onerror);
        }
        this.URL = URL;
        this.onload = this.onload || {};
    }

    var p = PhonegapSound.prototype;

    p.load = function () {
        if (this.audio !== undefined) {
            this.audio.release();
        }

        this.audio = new Media(URL, this.onsoundended, this.onerror);
        this.onload();
    }

    p.onsoundended = function (e) {
        if (this.loop === true) {
            this.audio.play();
        }
    }

    p.onerror = function () {
        throw new Error("Playback error of sound " + this.URL);
    }

    p.play = function () {
        if (flash.soundMuted === true) {
            return;
        }
        this.audio.play();
    }

    p.stop = function () {
        this.audio.noteOff(0);
    }

    p.setVolume = function (volume) {
        console.log('No volume control for this API yet.');
    }

    p.getVolume = function () {
        console.log('No volume control for this API yet.');
    }

    defineGetterSetter(p, 'volume', p.getVolume, p.setVolume);

    w.flash.cloneToNamespaces(PhonegapSound, 'PhonegapSound');
})(window);
/*
 * Sound is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var Sound = function (data) {
        if (data !== undefined) {
            this._audio = data;
        } else {
            this._audio = new Audio();
        }
        this.codec = 'mp3';
        this.loop = false;
    }

    var p = Sound.prototype;

    p.load = function () {
        if (this.URL === undefined) {
            throw new Error("Trying to load Sound without URL");
        }

        this.codec = 'mp3';

        this._audio.autobuffer = true;
        this._audio.preload = 'auto';
        this._audio.autoplay = false;

        if ((this._audio).canPlayType("audio/mpeg")) {
            this.codec = 'mp3';
        } else if ((this._audio).canPlayType("audio/ogg; codecs=vorbis")) {
            this.codec = 'ogg';
        } else {
            //If we are in old Android
            this.codec = 'mp3';
            this._audio = document.createElement("video");
            this._audio.preload = 'auto';
            this._audio.autobuffer = true;
            this.onload();
        }

        this.changeCodecTo(this.codec);

        if (this.onload !== undefined) {
            var tempLoadHandler = this.onload;

            this.onload = function () {
                tempLoadHandler();
                this._audio.removeEventListener('canplaythrough', this.onload);
                this._audio.removeEventListener('load', this.onload, false);
            }

            this.onload = this.onload.bind(this);

            this._audio.addEventListener('canplaythrough', this.onload, false);
            this._audio.addEventListener('load', this.onload, false);
        }

        if (w.flash.iOS === true) {
            this.onload();
        }

        this._audio.src = this.URL;
    }

    p.changeCodecTo = function (codecType) {
        this.URL = replaceAll(this.URL, 'mp3', codecType);
        this.URL = replaceAll(this.URL, 'ogg', codecType);
        this.URL = replaceAll(this.URL, 'wav', codecType);
    }

    p.play = function () {
        if (flash.soundMuted === true) {
            return;
        }
        this._audio.loop = this.loop;
        if (this._audio.paused) {
            if (this._audio.loop && this.codec === 'ogg') {
                this._audio.addEventListener('ended', function () {
                    this.currentTime = 0;
                    this.play();
                }, false);
            }
            this._audio.play();
        } else {
            var tempSound = this.clone();
            tempSound.play();
        }
    }

    p.stop = function () {
        this._audio.stop();
    }

    p.clone = function () {
        var clonedAudio = new Audio();
        clonedAudio.src = this._audio.src;
        clonedAudio.loop = this.loop;
        clonedAudio.volume = this.volume;

        var clonedSound = new Sound(clonedAudio);
        clonedSound.loop = this.loop;
        clonedSound.codec = this.codec;
        return clonedSound;
    }

    p.setVolume = function (volume) {
        this._audio.volume = volume;
    }

    p.getVolume = function () {
        return this._audio.volume;
    }

    defineGetterSetter(p, 'volume', p.getVolume, p.setVolume);

    w.flash.cloneToNamespaces(Sound, 'Sound');
})(window);
/*
 * CollisionManager is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var CollisionManager = function () {

    }

    var p = CollisionManager.prototype;

    p.checkCollision = function (objectA, objectB, callback, scaleX, scaleY) {
        var matrixA = objectA.getConcatenatedMatrix();
        var matrixB = objectB.getConcatenatedMatrix();

        var virtualWidthA = objectA.width * scaleX;
        var virtualHeightA = objectA.height * scaleY;
        var AX1 = matrixA.tx + ((objectA.width - virtualWidthA) * 0.5);
        var AY1 = matrixA.ty + ((objectA.height - virtualHeightA) * 0.5);
        var virtualWidthB = objectB.width * scaleX;
        var virtualHeightB = objectB.height * scaleY;
        var BX1 = matrixB.tx + ((objectB.width - virtualWidthB) * 0.5);
        var BY1 = matrixB.ty + ((objectB.height - virtualHeightB) * 0.5);

        var AX2 = AX1 + virtualWidthA;
        var AY2 = AY1 + virtualHeightA;
        var BX2 = BX1 + virtualWidthB;
        var BY2 = BY1 + virtualHeightB;

        if (AX1 < BX2 && AX2 > BX1 && AY1 < BY2 && AY2 > BY1) {
            callback(objectA, objectB);
        }
    }

    w.flash.cloneToNamespaces(CollisionManager, 'CollisionManager');

})(window);
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
/*
 * AnimationLoader is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var AnimationLoader = function (URL, options, callback, errorCallback, context) {

        this.url = URL || w.webkitURL;
        this.options = options;
        this.callback = callback;
        this.spriteSheet = new SpriteSheet(undefined, options.width * options.scale, options.height * options.scale, options.framesTotal, options.animations);
        this.context = context;
        this.frames = [];

        if (URL[URL.length - 1] === "/") {
            this.addAssetsToLoader();
        } else {
            this.loadSpritesheet();
        }

        return this.spriteSheet;
    }

    p = AnimationLoader.prototype;

    p.loadSpritesheet = function () {
        this.image = new Image();

        if (false) {
            this.image.src = w.webkitURL.createObjectURL(this.url);
        } else {
            this.image.src = this.url;
        }

        this.image.onload = this.onSpritesheetLoad.bind(this);

        this.image.onerror = function (arg) {
            if (errorCallback !== undefined) errorCallback(arg);
        }
    }

    p.onSpritesheetLoad = function (arg) {
        this.spriteSheet.data = this.image;
        this.spriteSheet.fillFramesFromSpritesheet();
        this.spriteSheet.fillFlippedFrames();
        if (this.callback !== undefined) this.callback(arg);
    }

    p.addAssetsToLoader = function () {
        this.framesToLoad = 0;
        for (var i = 0; i < this.options.framesTotal; i++) {
            var numberString = i + (this.options.startFrame + 0);
            numberString = this.getFileNameByFrameNumber(numberString);
            var objectToAdd = {id: this.options.id + '_' + i, url: this.url + numberString + '.png', callback: this.frameLoaded.bind(this), frameNumber: i};
            this.context.add(objectToAdd);
            this.framesToLoad++;
        }
    }

    p.getFileNameByFrameNumber = function (frameNumber) {
        var frameNumberString = frameNumber + '';
        var fileName = '';
        var neededLength = this.options.fileNameNumbers || 5;
        var zerosToAdd = neededLength - frameNumberString.length;

        for (var i = 0; i < zerosToAdd; i++) {
            fileName += '0';
        }

        fileName += frameNumberString;
        return fileName;
    }

    p.frameLoaded = function (item) {
        this.framesToLoad--;
        this.frames[item.frameNumber] = item.data;

        if (this.framesToLoad === 0) {
            this.spriteSheet.data = this.frames;
            this.spriteSheet.fillFramesFromImagesArray();
            this.spriteSheet.fillFlippedFrames();
            this.callback();
        }
    }

    AnimationLoader.checkLoaderType = function (URL, options) {
        return ((getFileExtension(URL) === '') || (options.animations !== undefined));
    }

    w.flash.cloneToNamespaces(AnimationLoader, 'AnimationLoader');
})(window);
/*
 * SoundLoader is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var SoundLoader = function (URL, options, callback, errorCallback, context) {
        this.URL = URL;
        this.loop = options.loop || false;
        this.volume = options.volume || 1;
        this.callback = callback;
        this.errorCallback = errorCallback;
        this.context = context;

        var sound = undefined;

        if (w.flash.APISound.getAudioContext() !== false && navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
            sound = new APISound();
        } else if ((window.phonegap !== undefined || window.cordova !== undefined || window.Phonegap !== undefined) && window.Media !== undefined) {
            sound = new PhonegapSound();
        } else {
            sound = new Sound();
        }

        sound.URL = this.URL;
        sound.loop = this.loop;
        sound.volume = this.volume;
        sound.onload = this.callback;
        sound.onerror = this.callback;
        sound.load();

        return sound;
    }

    p = SoundLoader.prototype;

    SoundLoader.checkLoaderType = function (URL, options) {
        var extension = (getFileExtension(URL));
        if ((extension === 'ogg') || (extension === 'mp3') || (extension === 'wav')) {
            return true;
        }
    }

    w.flash.cloneToNamespaces(SoundLoader, 'SoundLoader');
})(window);
/*
 * Loader is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var Loader = function (URL, options, callback, errorCallback, context) {
        var particularLoader = Loader.getLoader(URL, options);
        return new particularLoader(URL, options, callback, errorCallback, context);
    }

    Loader.getLoader = function (URL, options) {
        for (var i = 0; i < Loader.loaders.length; i++) {
            if (Loader.loaders[i].checkLoaderType(URL, options)) {
                return Loader.loaders[i];
            }
        }
    }

    Loader.loaders = [AnimationLoader, ImageLoader, SoundLoader];

    w.flash.cloneToNamespaces(Loader, 'Loader');
})(window);
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
(function (w) {
    var getFlippedImage = function (imageData, flipHorizontally, flipVertically) {
        var horizontalScale = flipHorizontally ? -1 : 1;
        var verticalScale = flipVertically ? -1 : 1;
        var deltaX = flipHorizontally ? -imageData.width : 0;
        var deltaY = flipVertically ? -imageData.height : 0;

        var canvas = document.createElement("canvas");
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        var context = canvas.getContext("2d");

        var newCanvas = document.createElement("canvas");
        newCanvas.width = imageData.width;
        newCanvas.height = imageData.height;
        var newContext = newCanvas.getContext("2d");

        context.save();
        context.scale(horizontalScale, verticalScale);
        context.drawImage(imageData, deltaX, deltaY);
        newContext.drawImage(canvas, 0, 0);
        context.restore();

        return newCanvas;
    }

    w.flash.cloneToNamespaces(getFlippedImage, 'getFlippedImage');
})(window);
/*
 * ActionScriptTagExecutor is a part of FlashJS engine
 *
 * http://flashjs.com
 *
 * Copyright (c) 2011 - 2012 pixelsresearch.com,
 */

(function (w) {
    var executeActionScriptTags = function () {
        var tags = w.document.getElementsByTagName('actionscript');
        for (var i = 0; i < tags.length; i++) {
            var astag = tags[i];
            var scriptText = replaceAll(astag.innerHTML, "&lt;", '<');
            scriptText = replaceAll(scriptText, "&gt;", '>');
            var width = astag.getAttribute('width');
            var height = astag.getAttribute('height');
            var scaleToScreen = astag.getAttribute('scaleToScreen');
            var canvas = w.document.createElement('canvas');
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
            canvas.id = 'flashjs' + UID();
            astag.parentNode.appendChild(canvas);
            astag.parentNode.removeChild(astag);

            var stage = new Stage('#' + canvas.id, parseInt(width), parseInt(height));
            stage.scaleToScreen = scaleToScreen;

            //Execute scriptText and pass stage there

            scriptText = '(function(stage, canvas, window){' + scriptText + '})(window.flash.stages[' + stage.id + '], window.document.getElementById("' + canvas.id + '"), window)';

            var scriptNode = document.createElement('script');
            scriptNode.innerHTML = scriptText;

            var headNode = w.document.getElementsByTagName('head')[0];
            headNode.appendChild(scriptNode);
        }
    }

    w.flash.cloneToNamespaces(executeActionScriptTags, 'executeActionScriptTags');
})(window);

window.addEventListener('load', flash.executeActionScriptTags);