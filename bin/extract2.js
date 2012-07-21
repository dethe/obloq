var rs = require('robotskirt'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    path = require('path');

function markdownToHtml(markdown, callback){
    //console.log('markdownToHtml');
    var flags = ~0;
    var html = rs.toHtmlSync(markdown, flags);
    callback(html.toString());
}

var langmap = {
    javascript: 'js',
    markdown: 'md',
    python: 'py',
    ruby: 'rb'
};

function extractPrefix(line){
    return line.match(/prefix:\s*(\S+)/)[1];
}

function extractFilename(line){
    return line.match(/filename:\s*(\S+)/)[1];
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

function extractBlocksFromFile(src, callback){
    //console.log('extractBlocksFromFile');
    fs.readFile(src, 'utf8', function(err, markdown){
        markdownToHtml(markdown, function(html){
            //console.log('markdownToHtml callback');
            htmlToCodeBlocks(html, function(code, ext, opts){
                //console.log('htmlToCodeBlocks callback');
                if (opts && opts.filename){
                    dest = opts.filename;
                }else if (opts && opts.prefix){
                    dest = opts.prefix + '/' + path.basename(src, '.md') + '.' + ext;
                }else{
                    dest = path.basename(src, '.md') + '.' + ext;
                }
                callback(code, dest);
            });
        });
    });
}

function test(){
    extractBlocksFromFile('bloqs/bar.md', function(code, dest){
        console.log('Block to write to %s', dest);
        console.log(code);
    });
}

test();
