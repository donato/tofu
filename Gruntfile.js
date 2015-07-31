module.exports = function(grunt) {

	grunt.initConfig({
        'gm-header': {
            options : {
                header : 'src/greasemonkey_header.js',
                globals : 'src/include/gm_wrappers.js',
                dest: 'bin/tofu.user.js'
            }
        },
		jshint: {
			options: {
				jshintrc: 'src/.jshintrc'
			},
			beforeconcat : ['Gruntfile.js', 'src/includes/*.js', 'src/includes/**/*.js'],
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
                        underscore : 'lodash'
                        //underscore : 'underscore/underscore.js',
                        //jquery : 'jquery/jquery.js'
                    },
                    moduleDirectories: [
                        'src/',
                    ]
                }
            },
            devel : {
                entry : {
                    tofu : './src/main.js'
                },
                debug: true,
                output: {
                    path: 'bin/',
                    filename: '[name].user.js'
                }
            }
        }
	});

    grunt.registerTask('gm-header', function() {
        var options = this.options();
        var header = grunt.file.read(options.header);
        var globals = grunt.file.read(options.globals);
        var bin = grunt.file.read(options.dest);

        grunt.file.write(options.dest, header + globals + bin);
    });

	grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['webpack', 'gm-header']);

};
