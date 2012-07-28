/*
 * obloq extract
 * https://github.com/dethe/obloq
 *
 * Copyright (c) 2012 Dethe Elza
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 *
 * This is a Grunt (https://github.com/cowboy/grunt) task to extract code
 * blocks from Markdown documents. Code blocks can be either normal markdown
 * code blocks (indented four or more spaces) or github-flavoured fenced blocks.
 * Github fenced blocks will get automatic file destinations (which can be
 * over-ridden), but traditional code blocks will need to have a comment in
 * the first line of the block of the form "filename: [destination]". The destination
 * will be relative to the Grunt config destination, so if Grunt is targetting
 * ~/Sites/example/build and the code block has a comment on the first line of 
 * "// filename: server/util.js" then the block will be extracted to a file named
 * ~/Sites/example/build/server/util.js.
 * 
 * Code blocks are always appended to the target file, so before extract is called, 
 * all target files should be deleted.
 */

module.exports = function(grunt) {
    var rs = require('robotskirt'),
        cheerio = require('cheerio'),
        fs = require('fs'),
        path = require('path');
        
    var langmap = {
        javascript: 'js',
        markdown: 'md',
        python: 'py',
        ruby: 'rb'
    };

    grunt.registerMultiTask('extract', 'Extract code blocks from markdown documents', function(){
        console.log('extracting files');
        var files = grunt.file.expandFiles(this.file.src);
        var destfolder = this.file.dest;
        files.forEach(function(src){
            extractBlocksFromFile(src, function(code, dest){
                appendToPath(path.join(destfolder, dest), code);
            });
        });
    });
    
    grunt.registerMultiTask('doc', 'Build documentation from markdown documents', function(){
        console.log('building docs');
        var files = grunt.file.expandFiles(this.file.src);
        var destfolder = this.file.dest;
        var paths = [];
        files.forEach(function(src){
            var markdown = fs.readFileSync(src, 'utf8');
            markdownToHtml(markdown, function(html){
                var prefix = getNestedPath(src);
                var filename = path.basename(src, '.md') + '.' + 'html';
                var dest = path.join(destfolder, prefix, filename);
                paths.push(dest);
                console.log('saving %s', dest);
                appendToPath(dest, html);
            });
        });
        var index;
        try{
            index = fs.readFileSync('lib/index.template', 'utf8');
        }catch(e){
            index = fs.readFileSync('node_modules/obloq/lib/index.template', 'utf8');
        }
        var $ = cheerio.load(index);
        var holder = $('#menu ul');
        holder.empty();
        paths.forEach(function(src){
            var name = getNamedPath(src);
            holder.append('<li><a href="#' + name + '">' + name + '</a></li>');
        });
        appendToPath(path.join(destfolder, 'index.html'), $.html());
    });
    
    // We can write a file to a directory that doesn't exist yet
    // This is how we make sure that it does
    function ensurePath(relpath){
        var parts = relpath.split("/");
        parts.pop();
        var buildpath = ""
        while(parts.length){
            buildpath = path.join(buildpath, parts.shift());
            if (!fs.existsSync(buildpath)){
                fs.mkdirSync(buildpath, "0755");
            }
        }
    }
    
    function appendToPath(path, data){
        ensurePath(path);
        fs.appendFileSync(path, data, 'utf8');
    }
    
    function extractPrefix(line){
        return line.match(/prefix:\s*(\S+)/)[1];
    }

    function extractFilename(line){
        return line.match(/filename:\s*(\S+)/)[1];
    }

    function markdownToHtml(markdown, callback){
        //console.log('markdownToHtml');
        var flags = ~0;
        var html = rs.toHtmlSync(markdown, flags);
        callback(html.toString());
    }
    
    function htmlToCodeBlocks(html, callback){
        //console.log('htmlToCodeBlocks');
        var $ = cheerio.load(html);
        var code = $('code');
        for (var i = 0; i < code.length; i++){ 
            var codeblock = code.eq(i);
            var language = codeblock.attr('class');
            if (!language) continue;
            var ext = langmap[language] || language;
            var text = codeblock.text().split('\n');
            var opts = {};
            var first = text[0];
            if (first.indexOf('prefix:') > -1){
                opts.prefix = extractPrefix(first);
                text.shift();
            }else if (first.indexOf('filename:') > -1){
                opts.filename = extractFilename(first);
                text.shift();
            }
            callback(text.join('\n'), ext, opts);
        }
    }
    
    function capitalize(name){
        return name[0].toUpperCase() + name.slice(1);
    }
    
    function getNamedPath(pathname){
        var dirs = path.dirname(pathname).split(path.sep);
        dirs.shift();
        dirs.push(path.basename(pathname, '.html'));
        for (var i = 0; i < dirs.length; i++){
            dirs[i] = capitalize(dirs[i]);
        }
        return dirs.join(path.sep);
    }
    
    function getNestedPath(pathname){
        var dirs = path.dirname(pathname).split(path.sep);
        dirs.shift(); // throw away the first directory of nesting
        return dirs.join(path.sep);
    }
    
    function extractBlocksFromFile(src, callback){
        //console.log('extractBlocksFromFile');
        var markdown = fs.readFileSync(src, 'utf8');
        markdownToHtml(markdown, function(html){
            //console.log('markdownToHtml callback');
            htmlToCodeBlocks(html, function(code, ext, opts){
                //console.log('htmlToCodeBlocks callback');
                var prefix = opts.prefix || getNestedPath(src);
                var filename = path.basename(src, '.md') + '.' + ext;
                var dest = opts.dest || path.join(prefix, filename);
                console.log('src: %s, dest: %s', src, dest);
                callback(code, dest);
            });
        });
    }
};
