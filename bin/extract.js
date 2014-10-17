#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var markdown = require("markdown").markdown;
var finder = require("findit")(process.cwd() + "/bloqs");

var output_files = {};
var rcount = 0;
var wcount = 0;

function relative(infilename) {
    if (infilename[0] === '/') {
        return 'docs' + infilename.split(process.cwd() + '/bloqs')[1];
    }
    return infilename;
};

function outfilename(infilename, ext) {
    var outpath;
    var relativepath = relative(infilename);
    var base = relativepath.split(path.extname(relativepath))[0];
    switch (ext) {
        case '.css':
            outpath = 'public/css/mystyles/' + base + ext;
            break;
        case '.js':
            outpath = 'public/js/mylibs/' + base + ext;
            break;
        case '.html':
            outpath = base + ext;
            break;
        default:
            outpath = "build/" + base + ext;
    }
    return outpath;
};

function ensurepath(relpath) {
    var parts = relpath.split("/");
    parts.pop();
    var buildpath = "";
    var _results = [];
    while (parts.length) {
        buildpath = path.join(buildpath, parts.shift());
        if (!path.existsSync(buildpath)) {
            _results.push(fs.mkdirSync(buildpath, "0755"));
        } else {
            _results.push(void 0);
        }
    }
    return _results;
};

function toHTMLTree(filename) {
    var e, html, outpath, text, tree;
    try {
        rcount++;
        text = fs.readFileSync(filename, "utf-8");
        tree = markdown.toHTMLTree(text);
        html = markdown.toHTML(text);
        walk(tree, codeExcerpt);
        outpath = outfilename(filename, ".html");
        ensurepath(outpath);
        return writeIfChanged(outpath, html);
    } catch (_error) {
        e = _error;
        console.log("There was a problem processing file %s", filename);
        throw e;
    }
};

function writeIfChanged(outpath, text) {
    wcount++;
    return fs.writeFileSync(outpath, text);
};

function writefiles() {
    var contents, ext, outpath, output_path, outtext;
    var concatenated_js = [];
    var concatenated_css = [];
    for (output_path in output_files) {
        outtext = output_files[output_path];
        ext = path.extname(output_path);
        outpath = outfilename(output_path, ext);
        contents = output_files[output_path].join("\n\n");
        if (ext === ".sketch") {
            fs.writeFile(outpath, contents);
            processor[ext.slice(1)](outpath, contents);
        }
    }
    for (output_path in output_files) {
        outtext = output_files[output_path];
        ext = path.extname(output_path);
        outpath = outfilename(output_path, ext);
        contents = output_files[output_path].join("\n\n");
        if (ext === ".html" || ext === ".css" || ext === ".js") {
            writeIfChanged(outpath, processor[ext.slice(1)](outpath, contents));
            if (ext === '.js') {
                concatenated_js.push(contents);
            }
            if (ext === '.css') {
                concatenated_css.push(contents);
            }
        }
    }
    writeIfChanged('public/js/script.js', concatenated_js.join('\n\n'));
    writeIfChanged('public/css/style.css', concatenated_css.join('\n\n'));
    return console.log('oextract read %s files and wrote %s files', rcount, wcount);
};

function ttype(obj) {
    var t;
    t = typeof obj;
    if (Array.isArray(obj)) {
        t = "array";
    }
    return t;
};

function walk(tree, fn) {
    var key, _results;
    switch (ttype(tree)) {
        case "object":
            _results = [];
            for (key in tree) {
                fn(key, tree[key]);
                _results.push(walk(tree[key], fn));
            }
            return _results;
            break;
        case "array":
            if (tree.length === 2) {
                fn(tree[0], tree[1]);
                return walk(tree[1], fn);
            } else {
                return tree.forEach(function(subtree) {
                    return walk(subtree, fn);
                });
            }
            break;
    }
};

function stashFragment(filename, fragment, processed) {
    if (!processed) {
        fragment = fragment.split("\n").slice(2).join("\n");
    }
    if (!output_files[filename]) {
        output_files[filename] = [];
    }
    return output_files[filename].push(fragment);
};

function codeExcerpt(name, text) {
    var base, ext, filename, outpath;
    if (/.*code.*/.test(name)) {
        var lines = text.trim().split("\n");
        var parsedline = lines[0].match(/file\: +(.*)/);
        if (!parsedline) {
            throw new Error("no filename found for " + lines.length + " lines of code");
        }
        var filenames = parsedline[1];
        var _ref = filenames.split(',');
        var _results = [];
        for (var _i = 0, _len = _ref.length; _i < _len; _i++) {
            filename = _ref[_i];
            filename = filename.trim();
            ext = path.extname(filename);
            base = path.basename(filename, ext);
            outpath = base + ext;
            _results.push(stashFragment(outpath, text));
        }
        return _results;
    }
};

function extract(filename) {
    var ext = path.extname(filename);
    if (ext === ".md" || ext === ".markdown") {
        return toHTMLTree(filename);
    }
};

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
finder.on("end", writefiles);
