#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var marked = require("marked");
var finder = require("findit")(process.cwd() + "/bloqs");

var setAside = {
    html: [],
    css: [],
    js: []
}

/* Setup Markdown parsing */

marked.setOptions({
    sanitize: false
});

var renderer = new marked.Renderer();

renderer.heading = function markdownHeading(text, level) {
  var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

  return '<h' + level + '><a name="' +
                escapedText +
                 '" class="anchor" href="#' +
                 escapedText +
                 '"><span class="header-link"></span></a>' +
                  text + '</h' + level + '>';
};

renderer.code = function markdownCodeblock(code, language){
    if (language === 'javascript'){
        language = 'js';
    }
    if (setAside[language]){
        setAside[language].push(code);
    }
    return '<pre><code class="language-' + language + '">' + code + '</code></pre>';
};


/* Utility Functions */

// function relative(infilename) {
//     if (infilename[0] === '/') {
//         return 'docs' + infilename.split(process.cwd() + '/bloqs')[1];
//     }
//     return infilename;
// };

// function ensurepath(relpath) {
//     var parts = relpath.split("/");
//     parts.pop();
//     var buildpath = "";
//     var _results = [];
//     while (parts.length) {
//         buildpath = path.join(buildpath, parts.shift());
//         if (!path.existsSync(buildpath)) {
//             _results.push(fs.mkdirSync(buildpath, "0755"));
//         } else {
//             _results.push(void 0);
//         }
//     }
//     return _results;
// }


function extract(filename) {
    var ext = path.extname(filename);
    if (ext === ".md" || ext === ".markdown") {
        console.log('processing %s', filename);
        var text = fs.readFileSync(filename, 'utf8');
        var basefile = path.basename(filename, ext);
        var dirname = path.dirname(filename);
        var html = marked(text, {renderer: renderer});
        console.log('writing %s', basefile + '.html');
        fs.writeFileSync(path.join('dist/docs', basefile + '.html'), html);
        console.log('writing %s', basefile + '.js');
        fs.writeFileSync(path.join('dist/components', basefile + '.js'), buildComponent());
    }
}

function buildComponent(){
    var componentText = htmlToTemplate(setAside.html.join('\n')) + '\n' +
                        cssToStylesheet(setAside.css.join('\n')) + '\n' +
                        setAside.js.join('\n') + '\n';
    setAside = {
        html: [],
        css: [],
        js: []
    }
    return componentText;
}

function htmlToTemplate(html){
    return 'var template = [\'' + html.split('\n').join('\'],\n[\'') + '\'].join(\'\');\n\n';
}

function cssToStylesheet(css){
    return 'var cssText = [\'' + css.split('\n').join('\'],\n[\'') + '\'].join(\'\');\n' +
        'some function to insert a new stylesheet';
}

var processor = {
    sketch: function(filename, contents) {},
    html: function(filename, contents) {
        return contents;
    },
    css: function(filename, contents) {
        return contents;
    },
    js: function(filename, contents) {
        return contents;
    }
};

// Trigger processing
finder.on("file", extract);
// finder.on("end", writefiles);
