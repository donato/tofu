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

		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	
	grunt.registerTask('default', ['uglify']);

};
