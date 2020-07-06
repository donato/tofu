var _ = require('lodash');
var path = require('path')
var webpack = require('webpack')

module.exports = function(grunt) {

    var user_config = grunt.file.readJSON('user_config.json');

    var paths = {
        header : 'src/greasemonkey_header.js',
        globals : [
            'src/core/utils/gm_wrappers.js',
            'src/core/utils/js_utils.js'
        ],
        dest : 'bin/tofu.user.js'
    };

    function prependFile() {
        var header = grunt.file.read(paths.header);
        var globals = _.map(paths.globals, grunt.file.read);
        var bin = grunt.file.read(paths.dest);

        grunt.file.write(paths.dest, header + globals.join(' ') + bin);
    }

    function copyFile() {
        if (user_config.output_file !== '') {
            grunt.file.copy(paths.dest, user_config.output_file);
        }
    }

    // webpack plugins are objects with an apply method
    var afterWebpackBuild = {
        apply: function (compiler) {
            compiler.plugin('done', function () {
                prependFile();
                copyFile();
            })
        }
    };

  grunt.initConfig({
        'gm-header': {
            options : {
                dest: 'bin/tofu.user.js'
            }
        },
    copy: {
      main: {
        src: 'src/tofu-dev.user.js',
        dest: 'bin/tofu-dev.user.js',
      },
    },
    jshint: {
      options: {
        jshintrc: 'src/.jshintrc'
      },
      beforeconcat : ['Gruntfile.js', 'src/includes/*.js', 'src/includes/**/*.js']
      //afterconcat : ['tofu.user.js']
    },
    less: {
      options: {
        report:'min'
        // paths: ['server/css']
      },
      development: {
        files: {
          'server/css/default.css' : 'server/css/default.less'
        }
      }
    },
        webpack: {
            options : {
                resolve : {
                    alias : {
                        utils: path.resolve(__dirname, 'src/core/utils'),
                        libs: path.resolve(__dirname, 'src/assets/libs'),
                        templates: path.resolve(__dirname, 'src/templates'),
                        plugins: path.resolve(__dirname, 'src/plugins_disabled'),
                        underscore : 'lodash'
                    },
                    modules: [
                      'node_modules',
                      'src',
                    ]
                }
            },
            devel : {
                entry : {
                    tofu : './src/main.js'
                },
                plugins: [
                  new webpack.LoaderOptionsPlugin({
                         debug: true
                       })
                ],
                output: {
                    path: path.resolve(__dirname, 'bin'),
                    filename: '[name].user.js'
                },
                mode: "development",
            },
            watch : {
                entry : {
                    tofu : './src/main.js'
                },
                plugins: [
                  new webpack.LoaderOptionsPlugin({
                         debug: true
                       })
                ],
                  output: {
                    path: path.resolve(__dirname, 'bin'),
                    filename: '[name].user.js'
                },
                mode: "development",

                plugins : [ afterWebpackBuild ],
                watch: true,
                failOnError: false,
                keepalive: true
            }
        }
  });


  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('gm-header', prependFile);
  grunt.registerTask('update-local', copyFile);

  grunt.registerTask('default', ['copy', 'webpack',  'gm-header', 'update-local']);
};
