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