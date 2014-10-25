module.exports = function(grunt) {

  grunt.initConfig({
    jasmine: {
      test: {
        src: 'build/main.js',
        options: {
          specs: 'build/test.js',
          outfile: 'build/test/SpecRunner.html'
        }
      }
    },
	
	copy: {
		manifest: {
			src: 'manifest.json',
			dest: 'build/'
		}
	},
    
    browserify: {
      release: {
        src: 'scripts/**/*.js',
        dest: 'build/main.js'
      },
      debug: {
        src: ['vendor/**/*.js', 'scripts/**/*.js', 'scripts/**/*.hbs'],
        dest: 'build/main.js'
      },
      test: {
        src: 'test/**/*.js',
        dest: 'build/test.js',
        options: {
          bundleOptions: {
            debug: true
          }
        }
      }
    },
    
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'manifest.json', 'vendor/**/*.js', 'scripts/**/*.js', 'scripts/**/*.hbs', 'test/**/*.js'],
        tasks: ['copy', 'browserify:debug', 'browserify:test', 'jasmine'],
        options: {
          spawn: false
        }
      },
    },
    
    shell: {
      debug: {
        command: "open build/test/SpecRunner.html"
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  grunt.registerTask('test', ['browserify:test', 'jasmine']);
  grunt.registerTask('test:debug', ['browserify:test', 'jasmine:test:build', 'shell:debug']);
  grunt.registerTask('build', ['copy', 'browserify:release']);
  
};
