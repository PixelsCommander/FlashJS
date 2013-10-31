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

        scaleX = scaleX || 1;
        scaley = scaley || 1;

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