// Default oBloq Grunt Tasks
// Modify to suit your project
// Requires grunt and grunt-contrib npm modules
// Todo: support server and globals separation
// Todo: default tasks for handlebars, stylus
//
// Note: expects to find oBloq files in bloqs subdirectory
// Will build (and erase each time) directories 'build', 'docs', and 'web'


module.exports = function(grunt){
    grunt.initConfig({
        clean: {
            // Clean will recursively delete entire directories. Be careful
            all: ['build','docs','web']
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
        },
        coffee:{
            compile: {
                files: {
                    'build/*.js': ['build/*.coffee', 'build/**/*.coffee'],
                }
            }
        },
        less: {
            development: {
                options: {
                    paths: ['build']
                },
                files: {
                    'build/*.css': 'build/*.less'
                }
            },
            production: {
                options: {
                    paths: ['build'],
                    yuicompress: true
                },
                files: {
                    'build/*.css': 'build/*.less'
                }
            }
        },
        copy: {
            dist: {
                files: {
                    'web/views/': ['build/*.html', 'build/**/*.html']
                }
            }
        },
        concat: {
            js: {
                src: ['build/*.js', 'build/**/*.js'],
                dest: 'web/script.js'
            },
            css: {
                src: ['build/*.css', 'build/**.css'],
                dest: 'web/style.css'
            }
        },
        min: {
            dist:{
                src: 'web/script.js',
                dest: 'web/script.min.js'
            }
        }
    });
    
    grunt.loadNpmTasks('obloq');
    grunt.loadNpmTasks('grunt-contrib');
    
    grunt.registerTask('default', 'clean extract doc less coffee lint concat min');
};
