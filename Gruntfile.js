/**
 * @author Maciej Zasada maciejzsd@gmail.com
 * @copyright Maciej Zasada maciejzsd@gmail.com
 * Date: 2013/07/04
 */

module.exports = function (grunt) {
    'use strict';

    var NAME = 'poof.js',
        VERSION = 0,
        REVISION = 4,
        BUILD = 4,
        VERSION_STRING = VERSION + '.' + REVISION + '.' + BUILD,
        AUTHOR = 'Maciej Zasada maciejzsd@gmail.com',
        COPYRIGHT = '2013 Maciej Zasada',

        $jsClasses = [
            'src/PoofObject.js',
            'src/Poof.js',
            'src/Class.js',
            'src/AbstractClass.js',
            'src/SingletonClass.js',
            'src/Interface.js',
            'src/Import.js'

        ],

        $jsGlobals = [];

    $jsClasses.forEach(function (url) {
        $jsGlobals.push(url.substring(url.lastIndexOf('/') + 1, url.indexOf('.js')));
    });

    grunt.initConfig({

        clean: {

            build: ['build']

        },

        jslint: {

            files: [
                'src/**/*.js'
            ],

            options: {
                junit: 'log/junit.xml',
                log: 'log/lint.log',
                jslintXml: 'log/jslint_xml.xml',
                errorsOnly: false,
                failOnError: false,
                shebang: true,
                checkstyle: 'log/checkstyle.xml'
            },

            directives: {

                bitwise: true,
                browser: true,
                debug: false,
                node: false,
                plusplus: true,
                predef: $jsGlobals.concat([
                ])
            }

        },

        jshint: {

            gruntfile: ['Gruntfile.js']

        },

        concat: {

            options: {

                separator: '\n\n',
                banner: '/**' +
                    '\n * ' +
                    NAME +
                    '\n * @author ' + AUTHOR +
                    '\n * @copyright ' + COPYRIGHT +
                    '\n * @version ' + VERSION_STRING +
                    '\n * @date ' + '<%= grunt.template.today("yyyy/mm/dd HH:MM:ss") %>' +
                    '\n */\n\n',

                process: function (src, filepath) {

                    return '/* ---------- Source: ' + filepath + ' ---------- */\n\n' + src.replace(/\{\{VERSION\}\}/g, VERSION).replace(/\{\{REVISION\}\}/g, REVISION).replace(/\{\{BUILD\}\}/g, BUILD);

                }

            },

            js: {

                src: $jsClasses,
                dest: 'build/poof-' + VERSION_STRING + '.js'

            }

        },


        uglify: {

            options: {
                wrap: true
            },

            main: {
                files: {
                    'build/poof.min.js': ['build/poof-' + VERSION_STRING + '.js']
                }
            }

        },

        copy: {

            js: {

                files: [
                    {
                        expand: true,
                        cwd: 'build',
                        src: ['poof-' + VERSION_STRING + '.js'],
                        dest: 'test/vendor',
                        rename: function(dest, src) {
                            return dest + '/poof.js';
                        }
                    }
                ]

            }

        },

        exec: {

            increment_build_number: {
                command: '[[ `cat Gruntfile.js` =~ (BUILD = ([0-9]+)) ]] && sed "s/BUILD = [[:digit:]]*,/BUILD = $((${BASH_REMATCH[2]} + 1)),/g" Gruntfile.js > Gruntfile.tmp && cat Gruntfile.tmp > Gruntfile.js && rm Gruntfile.tmp && echo BUILD = $((${BASH_REMATCH[2]} + 1))',
                stdout: true,
                stderr: true
            }

        },

        notify: {

            debug: {
                options: {
                    title: 'Build Complete [DEBUG]',
                    message: 'Poof.js debug build completed successfully'
                }
            },

            release: {
                options: {
                    title: 'Build Complete [RELEASE]',
                    message: 'Poof.js release build completed successfully'
                }
            }

        },

        watch: {

            grunt: {

                files: ['Gruntfile.js'],
                tasks: ['debug']

            },

            js: {

                files: ['src/**/*.js'],
                tasks: ['debug']

            }

        }

    });

    // Grunt plugins.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('debug', ['jshint', 'clean', 'jslint', 'concat:js', 'copy:js', 'notify:debug']);
    grunt.registerTask('release', ['clean', 'debug', 'uglify', 'exec:increment_build_number', 'notify:release']);
    grunt.registerTask('default', ['debug']);

};