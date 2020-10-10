var path = require('path')
var webpack = require('webpack')

module.exports = function (grunt) {

  var user_config = grunt.file.readJSON('user_config.json');

  var paths = {
    header: 'src/greasemonkey_header.js',
    dest: 'bin/tofu.user.js'
  };

  // TODO(): avoid using prepends for gm wrapper and jsutils
  function prependFile() {
    var header = grunt.file.read(paths.header);
    var bin = grunt.file.read(paths.dest);

    grunt.file.write(paths.dest, header + bin);
  }

  // webpack plugins are objects with an apply method
  var afterWebpackBuild = {
    apply: function (compiler) {
      compiler.plugin('done', function () {
        prependFile();
      })
    }
  };

  grunt.initConfig({
    'gm-header': {
      options: {
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
      beforeconcat: ['Gruntfile.js', 'src/includes/*.js', 'src/includes/**/*.js']
      //afterconcat : ['tofu.user.js']
    },
    webpack: {
      options: {
        resolve: {
          alias: {
            utils: path.resolve(__dirname, 'src/core/utils'),
            libs: path.resolve(__dirname, 'src/assets/libs'),
            templates: path.resolve(__dirname, 'src/templates'),
            plugins: path.resolve(__dirname, 'src/plugins_disabled'),
          },
          modules: [
            'node_modules',
            'src',
          ]
        }
      },
      devel: {
        entry: {
          tofu: './src/main.js'
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
        devtool: "source-map",
        module: {
          rules: [
            {
              test: /\.(png|svg|jpg|gif)$/,
              use: [
                'base64-inline-loader',
              ],
            },
          ],
        },
        mode: "production",
      },
      watch: {
        entry: {
          tofu: './src/main.js'
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
        module: {
          rules: [
            {
              test: /\.(png|svg|jpg|gif)$/,
              use: [
                'base64-inline-loader',
              ],
            },
          ]
        },

        plugins: [afterWebpackBuild],
        watch: true,
        failOnError: false,
        keepalive: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('gm-header', prependFile);
  // grunt.registerTask('release', ['webpack:devel']);
  grunt.registerTask('release', ['webpack:devel', 'gm-header']);
  grunt.registerTask('default', ['copy', 'webpack:watch' ]);
};
