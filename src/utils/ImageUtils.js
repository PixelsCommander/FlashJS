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