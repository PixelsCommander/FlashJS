$(document).ready(function () {
    var colors = [
        '#ffffff',
        '#eeeeee',
        '#dddddd',
        '#cccccc',
        '#bbbbbb',
        '#aaaaaa',
        '#999999',
        '#888888',
        '#777777',
        '#666666',
        '#555555',
        '#444444',
        '#333333',
        '#222222',
        '#111111',
        '#000000',
        '#0033ff',
        '#0000ff',
        '#3300ff',
        '#6600ff'
    ];

    var colorNumber = 0;
    var top = 0;

    for (var row = 0; row < 4; row++) {
        var left = 0;
        for (var column = 0; column < 5; column++) {
            var item = $('<div class="box"></div>');
            $('.wrapper').append(item);
            item.css('background-color', colors[colorNumber]);
            item.css('left', left + '%')
            item.css('top', top + '%')
            item[0].oldLeft = item.css('left');
            item[0].oldTop = item.css('top');
            item.on('webkitTransitionEnd', function () {
                restoreItemState(this);
            })
            colorNumber++;
            left += 20;
        }
        top += 25;
    }

    $('.box').on('mousedown', function () {
        $(this).css('width', '100%');
        $(this).css('height', '100%');
        $(this).css('z-index', '10000');
        $(this).css('left', '0px');
        $(this).css('top', '0px');
    })

    function restoreItemState(element) {
        element.style.top = element.oldTop;
        element.style.left = element.oldLeft;
        element.style.zIndex = 0;
        element.style.width = '20%';
        element.style.height = '25%';

    }
});

(function (w) {

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var Particle = function () {
        var particle = new DisplayObject(assetList.get('particle' + getRandomInt(1, 4)))
        return particle;
    }

    p = Particle.prototype = new DisplayObject();

    p.update = function () {
        this.x
    }

    w.createParticle = function (e) {
        oldMouseX = mouseX;
        oldMouseY = mouseY;
        mouseX = e.offsetX;
        mouseY = e.offsetY;
        mouseSpeedX = mouseX - oldMouseX;
        mouseSpeedY = mouseY - oldMouseY;

        if (particles.length <= particlesLimit) {
            var particle = new Particle();
            particles.push(particle);
        } else {
            particle = particles[currentParticle];
            if (currentParticle < particlesLimit) {
                currentParticle++;
            } else {
                currentParticle = 0;
            }

        }

        stage.addChild(particle);

        particle.x = e.offsetX - particle.width / 2;
        particle.y = e.offsetY - particle.height / 2;

        console.log(particle.width);

        particle.speedX = mouseSpeedX;
        particle.speedY = mouseSpeedY;
    }

    w.updateParticles = function () {
        for (var i = 0; i < particles.length; i++) {
            var particle = particles[i];

            particle.speedX = particle.speedX * particleAccX;
            particle.speedY = particle.speedY + gravity;

            particle.x += particle.speedX;
            particle.y += particle.speedY;
        }
    }

    w.addListeners = function () {
        var mycanvas = $('#particlescanvas')[0];

        stage.onmousemove = createParticle;
        stage.onEnterFrame = updateParticles;
        document.body.addEventListener('touchmove', function (e) {
            e.offsetX = e.pageX;
            e.offsetY = e.pageY;
            var event = w.flash.events.normalizeEvent(e);
            event.offsetX = e.pageX / stage.scale;
            event.offsetY = e.pageY / stage.scale;
            createParticle(event);
        });

        document.body.addEventListener('mousemove', function (e) {
            e.offsetX = e.pageX;
            e.offsetY = e.pageY;
            var event = w.flash.events.normalizeEvent(e);
            event.offsetX = e.pageX / stage.scale;
            event.offsetY = e.pageY / stage.scale;
            createParticle(event);
        });
    }

    var stage = new Stage('#particlescanvas');
    var particles = [];
    var assetList = new AssetsList({scale: stage.pixelScale}, 'assets.json', addListeners);
    var oldMouseX, oldMouseY, mouseX, mouseY, mouseSpeedX, mouseSpeedY = 0;
    var particleAccX = 0.999;
    var particleAccY = 1.001;
    var gravity = 0.3;
    var currentParticle = 0;
    var particlesLimit = 550;

})(window)
