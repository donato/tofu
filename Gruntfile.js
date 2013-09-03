module.exports = function(grunt) {

	grunt.initConfig({
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
		uglify: {
			options: {
				compress: false
			},
			build: {
				src: ['src/tofu.user.js'],
				dest: 'build/tofu.user.js'
			}
		},
		requirejs: {
			compile: {
				options: {
					almond:true,
					name:'node_modules/almond/almond',
					baseUrl: '.',
					include: 'src/main.js',
					out: 'tofu-min.user.js',
					paths: {
						'include' : 'src/includes',
						'jQuery' : 'bower_components/jquery/jquery',
						'underscore' : 'bower_components/underscore/underscore',
					},
					wrap: {
						// Note: the minifier strips the needed comments so we cannot use this currently
						// startFile: 'src/greasemonkey_header.js',
					}
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	
	grunt.registerTask('default', ['uglify']);

};
