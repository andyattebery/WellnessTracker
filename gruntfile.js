module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['app/scripts/*.js', 'app/scripts/controllers/*.js', 'app/scripts/models/*.js', 'app/scripts/objects/*.js', 'app/scripts/services/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          Clemetine: true
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'app/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      files: ['app/scripts/*.js', 'app/scripts/controllers/*.js', 'app/scripts/models/*.js', 'app/scripts/objects/*.js', 'app/scripts/services/*.js'],
      tasks: ['jshint']
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Default task(s).
  grunt.registerTask('default', ['jshint']);
  
  // Server task
  grunt.registerTask('server', 'Start a custom web server.', function() {
    var connect = require('connect');
    var done = this.async();
    grunt.log.writeln('Starting web server on port 8000.');
    var spawn = require('child_process').spawn;
    spawn('open', ['http://localhost:8000']);
    connect(connect.static('app')).listen(8000).on('close', done);
  });

};