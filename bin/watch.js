#!/usr/bin/env node

var dirName = process.cwd() + '/bloqs';
var fs = require("fs");
var finder = require("findit").find(dirName);
var exec = require('child_process').exec;

console.log('Watching for bloq changes in ' + dirName);

function watchit(filename) {
  return fs.watchFile(filename, function(curr, prev) {
    if (curr.mtime > prev.mtime) {
      process.stdout.write('Running oextract...');
      return exec('oextract', function() {
        return console.log('done');
      });
    }
  });
};

finder.on('file', watchit);
