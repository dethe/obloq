# oBloq literate programming tool

oBloq is a system designed to solve several problems I've encountered in years of developing complex web sites and web applications. One problem is getting the system documented well. I've experimented with literate programming languages before, but none of them seemed like a good fit for web programming. Another, and possibly more pressing problem, is locality of reference. What I mean is how to keep related code close together when it is scattered across HTML, CSS, Javascript, database, server-side controllers, etc. Relatedly, how do we develop a consistent vocabulary between all of the participants in a project, as well as all the components of the project? Another nice to have would be to gather this all in a text-based format that is easily diff'd and kept in version control.

That might sound like a lot to ask for one tool, but oBloq is standing on the shoulders of giants. By leveraging Node.js, Markdown formatting, Stylus for CSS, and JSON it can organize all the relevant information for your web site or webapp, including wireframes, in a simple, readable text format. It can easily be extended to support the tools of your choice (it already supports Coffeescript in addition to Javascript, and Mustache for templates). oBloq works best if design and development is based on CSS more than on Photoshop, but it can work either way.

oBloq isn't finished. I am working to add support for visually testing layouts and modules, a tool for watching files and rebuilding them as needed, and a server for distributed editing of the oBloq files. It's already handy for creating documentation and extracting the files needed to build an app. Soon it will also support concatenating and compressing the resulting files for production, as well as control over how the files are build (building different production files for editing than for viewers, for instance). Development is progressing quickly and I am currently seeking feedback on the ideas captured in oBloq.

## About the name

oBloq was developed around the idea of "card-based programming," which is that most web sites and web applications have roughly modular, often rectangular types of content which can be designed and assembled as components. These are then, "bloqs." Also, it reminds me of the great Dr. Seuss book on web programming, "Bartholemew and the Ooblek."

## How to use oBloq

Once you've forked the project and cloned a local copy there are a few things to know to get started.

Most of the magic comes from code blocks in the markdown files. Each code block expects to have the first line in the format:

    file: filename.ext

followed by a blank line, then the contents of the expected file. This line is used for creating files, for triggering post-processing (stylus -> css, markdown -> html). Currently supported extensions are .html, .css, .js, .markdown, .md (same as .markdown), .stylus, .mustache, and .coffee. The filename part is usually the same as the markdown filename that is being processed, but it doesn't have to be. All the markdown files in the .bloqs directory will be processed at once and all the code blocks with the same filename will be concatenated. Code blocks containing markdown files will be processed and concatenated with html content with the same base filename. Likewise .stylus will be processed and concatenated with .css, and .coffee will be processed and concatenated with .js.

## Dependencies

Beside Node and NPM, node modules needed are coffee-script, markdown, mustache, stylus, and nib.

## File organization and the Extract command

When you run extract it looks for a folder named "bloqs" in the current directory, then searches that folder recursively for markdown files (*.md or *.markdown). Extracted files are put into a "build" directory. HTML files for documentation are built for each markdown file found, and are placed in matching subdirectories (so a bloqs/sub/folder/file.md will end up in build/sub/folder/file.html). Files extracted from code blocks are not organized hierchically, but put in the build directory directly.

Currently you have to edit the index.html document to create links to the generated documents in the build directory (by adding hash tags based on the examples given). At some point it would be nice to autogenerate those.

## Text-based wireframes

Code blocks whose file extension is .sketch are preserved and converted in-browser. Other types are formatted in-browser for syntax highlighting, but .sketch blocks are converted to line drawings using Raphael.js and a plugin for Raphael called Sketchy.js. Sketchy lets you draw line which are rough and resemble hand-drawn (and not with a particularly steady hand) and is still in development in parallel with oBloq, but the commands recognized in oBloq at the time of writing this are below. Arguments x, y, w, and h are all assumed to be integers, text is any string following them. Text strings do not have to be quoted. The offset of strings is a little wonky, that's something I'm looking into. Comments are not supported by the sketchy syntax, but #comments below are used to describe the results.

    size w h # REQUIRED, sets the size of the canvas to sketch into. I plan to make this calculated from the sketch commands at some point.
    line x1 y1 x2 y2 # draws a line from the point x1 y2 to the point x2 y2
    arrow x1 y1 x2 y2 # like line, but puts an arrowhead at x2 y2
    rect x y w h text # draws a rectangle with its upper-left-hand corner at x y and the dimensions w h. The text argument is optional and will be centered in the rectangle.
    img x y w h # draws a rect with an x across it, to represent an image
    ellipse x y w h text # draws an ellipse inside the rect described by x y w h, optionally with text centered in the ellipse
    crossellipse x y w h # draws an ellipse, and a cross inside it. Useful for things like close buttons
    fatarrowright x y w h # draws an outlined arrow to fit inside the rect defined by x y w h
    fatarrowleft x y w h
    fatarrowdown x y w h
    fatarrowup x y w h
    triangleright x y w h # draws a triangle pointing right, useful for disclosure triangles
    triangleleft x y w h
    triangledown x y w h
    triangleup x y w h
    text x y text # draws text centered on x y in the "dadhand" handwriting font
    ltext x y text # draws text left justified starting at x y
    rtext x y text # draws text right justified and ending at x y
    avatar x y w h # draws a rectangle with a very rough sketch of a person. Needs work.

## Other uses

There is no specific support, but oBloq can be used to document Ajax paths, URL patterns, Events generated or listened for, APIs, permissions,  reasons for hacks and work-arounds, problems encountered, etc. Essentially, all development-related documentation (and most code) should be able to be fit into readable oBloq documents.

## Todo

### oBloq 3.0

* Revert to not use Grunt
* Have default filename targets
* Use gfm fenced code blocks with file types to mark html, css, js sections
* Have a way to define variables independent of file type?
* Don't mix in server code
* Generate a custom element from each file (1:1)
* No alternate file names
* Build an editor based on CodeMirror (http://codemirror.net/doc/manual.html)
* More example code
* Code clean up and commenting

### Generated docs

* Generate links to documentation automatically
* Build list of classes used and in which bloqs (need to parse html templates)
* Build list of IDs used and in which bloqs (ditto)
* Build list of events emitted and in which bloqs (need to parse JS: use Escrima?)
* Build list of events listened for and in which bloqs (ditto)
* Build list of functions defined and in which bloqs (ditto)
* Build list of functions called? (ditto)
* Syntax highlighting (stylus was missing)

### Testing

* Validate / lint / hint all files (side effect of moving to Grunt)
* Build visual tests into the docs, including tools to check with various data (for overflow), state (loggged in?), and block size (for responsive design). Seeing the visual tests update while you're in the oBloq editor would be pretty nifty.

### Sketchy

* Fix offset of text in sketchy
* Different units for sketches (grid-based?)
* Convert sketchy to build dom objects for layout where applicable
* Determine sketch size automatically from content (this would avoid the need to give room for sketchy lines to overflow, done manually now
* Reduce the "nudge" factor in small sketches
* Smoothing: keep each point's nudge factor within 2px of last nudge
* Make sketch components clickable links to docs for those items (interpage linking)
* New component: rich text
* New component: text
* New component: tab view
* New component: social noise
* New component: video player


