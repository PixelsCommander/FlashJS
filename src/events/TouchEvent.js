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