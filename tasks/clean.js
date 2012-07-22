/*
 * obloq clean
 * https://github.com/dethe/obloq
 *
 * Copyright (c) 2012 Dethe Elza
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 *
 * This is a Grunt (https://github.com/cowboy/grunt) task to delete generated code blocks before building
 * 
 * Code blocks are always appended to the target file, so before extract is called, 
 * all target files should be deleted.
 */

module.exports = function(grunt) {
    var rimraf = require('rimraf');
    
    grunt.registerMultiTask('clean', 'Delete generated files before extracting code blocks', function(){
        var files = grunt.file.expandFiles(this.file.src);
        files.forEach(function(path){
            rimraf.sync(path);
        });
    });
    
};
