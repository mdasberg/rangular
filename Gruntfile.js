"use strict";

/*global require, module, done, process */
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    require('time-grunt')(grunt);

    var serverPort = grunt.option('serverPort') || 11000;
    var reloadPort = grunt.option('reloadPort') || 9999;
    var hostname = grunt.option('hostname') || '0.0.0.0';

    grunt.initConfig({
        config: {},
        shell: {
            options: {
                stdout: true
            },
            protractor_install: {
                command: 'node ./node_modules/protractor/bin/webdriver-manager update'
            }
        },
        watch: {
            livereload: {
                options: {
                    port: reloadPort
                },
                files: [
                    'src/{,*/}*.html',
                    'src/{,*/}*.js'
                ]
            }
        },
        connect: {
            proxies: [
                {
                    context: '/api',
                    host: 'localhost',
                    port: 28017,
                    https: false,
                    changeOrigin: true,
                    rewrite: {
                        '^/api/participants/': '/rangular/participants/'
                    }
                }
            ],
            options: {
                port: serverPort,
                hostname: hostname
            },
            runtime: {
                options: {
                    middleware: function (connect) {
                        return [
                            proxySnippet,
                            lrSnippet,
                            mountFolder(connect, 'instrumented'),
                            mountFolder(connect, 'src')
                        ];
                    }
                }
            }
        },
        clean: {
            files: [
                'results',
                'instrumented'
            ]
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-junit-reporter'),
                reporterOutput: 'results/jshint/jshint.xml'
            }, files: {
                src: ['src/**/*.js']
            }
        },
        karma: {
            options: {
                singleRun: true,
                reporters: ['progress', 'coverage', 'junit']
            },
            unit: {
                configFile: 'config/karma.conf.js'
            }
        },
        instrument: {
            files: 'src/**/*.js',
            options: {
                lazy: true,
                basePath: "instrumented"
            }
        },
        protractor_coverage: {
            options: {
                keepAlive: true,
                noColor: false,
                coverageDir: 'results/e2e/coverage',
                args: {
                    baseUrl: 'http://<%= connect.options.hostname %>:' + serverPort
                }
            },
            chrome: {
                options: {
                    configFile: 'config/protractor-chrome.conf.js'
                }
            },
            phantomjs: {
                options: {
                    configFile: 'config/protractor-phantomjs.conf.js'
                }
            }
        },
        code_quality_report: {
            options: {
                dir: 'results'
            },
            js: {
                results: {
                    junit: {
                        file: 'results/junit/junit.xml'
                    },
                    e2e: {
                        files: 'results/e2e/e2e-*.xml'
                    },
                    coverage: 'results/coverage/*.json',
                    jshint: 'results/jshint/jshint.xml'
                }
            }
        },
        makeReport: {
            src: 'results/e2e/coverage/*.json',
            options: {
                type: 'lcov',
                dir: 'results/coverage/e2e'
            }
        }
    });

    grunt.registerTask('default', function () {
        grunt.task.run([
            'clean',
            'configureProxies',
            'connect:runtime',
            'watch'
        ]);
    });

    grunt.registerTask('build', function () {
        grunt.task.run([
            'clean',
            'jshint',
            'karma',
            'instrument',
            'configureProxies',
            'connect:runtime',
            'shell:protractor_install',
            'protractor_coverage:phantomjs',
            'code_quality_report',
            'makeReport'
        ]);
    });
};
