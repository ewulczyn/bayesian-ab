module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.initConfig({
    concat: {
      dist: {
        src: [
            'source/head.js',
            'source/rate_comparison.js'
            ],
        dest: './index.js' 
      }
    }
  });

  // Default task.
  grunt.registerTask('default', [
    'concat',
  ]);
};
