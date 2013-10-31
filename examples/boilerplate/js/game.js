(function (w) {
    var Game = function () {
        this.stage = new Stage('#gameCanvas');
        this.assets = new AssetsList({scale: this.stage.pixelScale, startFrame: 1}, "./assets/main-assets.json", this.loadCallback.bind(this));

        this.assets.onProgress = function (arg) {
            console.log(arg.percentLeft + '% loaded');
        }
    }

    p = Game.prototype;

    p.loadCallback = function () {
        var player = new SpriteAnimation(this.assets.get('player'));
        player.setAnimation('tornado', true);
        this.stage.addChild(player);
    }

    w.Game = Game;
})(window)
