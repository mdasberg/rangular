"use strict";

/*global require, module, done, process */
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
var path = require('path');

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
                    port: 12000,
                    https: false,
                    changeOrigin: true
                }
            ],
            options: {
                port: serverPort,
                hostname: hostname
            },
            livereload: {
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
        express: {
            options: {
                port: 12000,
                hostname: '*'
            },
            livereload: {
                options: {
                    server: path.resolve('./server/server'),
                    bases: ['src']
                }
            }
        },
        clean: {
            files: [
                'results',
                'instrumented'
            ]
        }
    });

    grunt.registerTask('default', function () {
        grunt.task.run([
            'clean',
            'configureProxies',
            'express:livereload',
            'connect:livereload',
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
