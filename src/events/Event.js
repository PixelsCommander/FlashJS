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