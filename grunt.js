module.exports = function(grunt){
    grunt.initConfig({
        clean: {
            // Clean will recursively delete entire directories. Be careful
            all: ['build']
        },
        extract: {
            build: ['bloqs/*.md', 'bloqs/**/*.md']
        },
        lint: {
            all: ['build/*.js', 'build/**/*.js']
        },
        jshint: {
            options: {
                browser: true
            }
        }
    });
    
    // load extract task
    grunt.loadTasks('tasks');
    grunt.registerTask('default', 'clean extract');
};
