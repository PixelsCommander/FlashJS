module.exports = function (grunt) {
    grunt.initConfig({
        meta: {
            version: '0.9.0',
            banner: '/*! FlashJS - v<%= meta.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* http://flashjs.com/\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
                'Denis Radin Licensed MIT */'
        },
        concat: {
            canvas: {
                src: [
                    './utils/CoreUtils.js',
                    './geom/Matrix2D.js',
                    './display-canvas/DisplayObject.js',
                    './display-canvas/DisplayList.js',
                    './display-canvas/Stage.js',
                    './display-canvas/SpriteSheet.js',
                    './display-canvas/SpriteAnimation.js',
                    './events/Event.js',
                    './events/TouchEvent.js',
                    './events/AccelerationEvent.js',
                    './media/APISound.js',
                    './media/PhonegapSound.js',
                    './media/Sound.js',
                    './utils/CollisionManager.js',
                    './loading/ImageLoader.js',
                    './loading/AnimationLoader.js',
                    './loading/SoundLoader.js',
                    './loading/Loader.js',
                    './loading/AssetsList.js',
                    './utils/ImageUtils.js',
                    './utils/ActionScriptTagExecutor.js'
                ],
                dest: '../flash.js'
            },
            dom: {
                src: [
                    './utils/CoreUtils.js',
                    './geom/Matrix2D.js',
                    './display-dom/DisplayObject.js',
                    './display-dom/DisplayList.js',
                    './display-dom/Stage.js',
                    './display-dom/SpriteSheet.js',
                    './display-dom/SpriteAnimation.js',
                    './events/Event.js',
                    './events/TouchEvent.js',
                    './events/AccelerationEvent.js',
                    './media/APISound.js',
                    './media/PhonegapSound.js',
                    './media/Sound.js',
                    './utils/CollisionManager.js',
                    './loading/ImageLoader.js',
                    './loading/AnimationLoader.js',
                    './loading/SoundLoader.js',
                    './loading/Loader.js',
                    './loading/AssetsList.js',
                    './utils/ActionScriptTagExecutor.js'
                ],
                dest: '../flashdom.js'
            }
        },
        min: {
            canvas: {
                src: ['../flash.js'],
                dest: '../lib/flash.min.js'
            },
            dom: {
                src: ['../flashdom.js'],
                dest: '../lib/flashdom.min.js'
            }
        }
    });

    grunt.registerTask('default', 'concat:canvas min:canvas concat:dom min:dom');
    grunt.registerTask('canvas', 'concat:canvas min:canvas');
    grunt.registerTask('dom', 'concat:dom min:dom');

};