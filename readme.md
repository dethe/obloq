# oBloq literate programming tool

oBloq is a system designed to solve several problems I've encountered in years of developing complex web sites and web applications. One problem is getting the system documented well. I've experimented with literate programming languages before, but none of them seemed like a good fit for web programming. Another, and possibly more pressing problem, is locality of reference. What I mean is how to keep related code close together when it is scattered across HTML, CSS, Javascript, database, server-side controllers, etc. Relatedly, how do we develop a consistent vocabulary between all of the participants in a project, as well as all the components of the project? Another nice to have would be to gather this all in a text-based format that is easily diff'd and kept in version control.

That might sound like a lot to ask for one tool, but oBloq is standing on the shoulders of giants. By leveraging Node.js, Markdown formatting, Stylus for CSS, and JSON it can organize all the relevant information for your web site or webapp, including wireframes, in a simple, readable text format. It can easily be extended to support the tools of your choice (it already supports Coffeescript in addition to Javascript, and Mustache for templates). oBloq works best if design and development is based on CSS more than on Photoshop, but it can work either way.

oBloq isn't finished. I am working to add support for visually testing layouts and modules, a tool for watching files and rebuilding them as needed, and a server for distributed editing of the oBloq files. It's already handy for creating documentation and extracting the files needed to build an app. Soon it will also support concatenating and compressing the resulting files for production, as well as control over how the files are build (building different production files for editing than for viewers, for instance). Development is progressing quickly and I am currently seeking feedback on the ideas captured in oBloq.

## How to use oBloq

Once you've forked the project and cloned a local copy there are a few things to know to get started.

Most of the magic comes from code blocks in the markdown files. Each code block expects to have the first line in the format:

    file: filename.ext
    
followed by a blank line, then the contents of the expected file. This line is used for creating files, for triggering post-processing (stylus -> css, markdown -> html). Currently supported extensions are .html, .css, .js, .markdown, .md (same as .markdown), .stylus, .mustache, and .coffee. The filename part is usually the same as the markdown filename that is being processed, but it doesn't have to be. All the markdown files in the .bloqs directory will be processed at once and all the code blocks with the same filename will be concatenated. Code blocks containing markdown files will be processed and concatenated with html content with the same base filename. Likewise .stylus will be processed and concatenated with .css, and .coffee will be processed and concatenated with .js.

### Dependencies

Beside Node and NPM, node modules needed are coffee-script, markdown, mustache, stylus, and nib.

### File organization and the Extract command

When you run extract it looks for a folder named "bloqs" in the current directory, then searches that folder recursively for markdown files (*.md or *.markdown). Extracted files are put into a "build" directory. HTML files for documentation are built for each markdown file found, and are placed in matching subdirectories (so a bloqs/sub/folder/file.md will end up in build/sub/folder/file.html). Files extracted from code blocks are not organized hierchically, but put in the build directory directly.

### Text-based wireframes

Code blocks whose file extension is .sketch are preserved and converted in-browser. Other types are formatted in-browser for syntax highlighting, but .sketch blocks are converted to line drawings using Raphael.js and a plugin for Raphael called Sketchy.js. Sketchy is still in development in parallel with oBloq, but the commands recognized in oBloq at the time of writing this are below. Arguments x, y, w, and h are all assumed to be integers, text is any string following them. Text strings do not have to be quoted. The offset of strings is a little wonky, that's something I'm looking into. Comments are not supported by the sketchy syntax, but #comments below are used to describe the results.

    size w h # REQUIRED, sets the size of the canvas to sketch into. I plan to make this calculated from the sketch commands at some point.
    

## Todo

* Package as a Node module
