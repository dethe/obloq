module.exports = function(grunt){
    grunt.initConfig({
        clean: {
            // Clean will recursively delete entire directories. Be careful
            all: ['build','docs']
        },
        extract: {
            build: ['bloqs/*.md', 'bloqs/**/*.md']
        },
        doc: {
            docs: ['bloqs/*.md', 'bloqs/**/*.md']
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
    try{
        grunt.loadTasks('tasks');
    }catch(e){
        grunt.loadNpmTasks('obloq/tasks');
    }
    grunt.registerTask('default', 'clean extract doc');
};
