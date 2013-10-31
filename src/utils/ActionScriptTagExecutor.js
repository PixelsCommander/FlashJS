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