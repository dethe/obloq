# oBloq: Polyglot Literate Programming

oBloq is a system designed to solve several problems I've encountered in years of developing complex web sites and web applications. One problem is getting the system documented well. I've experimented with literate programming languages before, but none of them seemed like a good fit for web programming. Another, and possibly more pressing problem, is locality of reference. What I mean is how to keep related code close together when it is scattered across HTML, CSS, Javascript, database, server-side controllers, etc. Relatedly, how do we develop a consistent vocabulary between all of the participants in a project, as well as all the components of the project? Another nice to have would be to gather this all in a text-based format that is easily diff'd and kept in version control.

That might sound like a lot to ask for one tool, but oBloq is standing on the shoulders of giants. By leveraging Node.js, Markdown formatting, Grunt.js, and the Sketchy graphics utility, all of your application code (including wireframes), can exist in a simple, readable text format.

oBloq isn't finished. I am working to add support for visually testing layouts and modules, a library of re-usable components, and experimenting with other features, but it has already been used to create a full-featured commercial web application.

## About the name

oBloq was developed around the idea of "card-based programming," which is that most web sites and web applications have roughly modular, often rectangular types of content which can be designed and assembled as components. These are then, "bloqs." Also, it reminds me of the great Dr. Seuss book on web programming, "Bartholemew and the Ooblek."

## How to use oBloq

1. Install grunt: `npm install -g grunt`
2. In your webapp directory, install the obloq grunt tasks: `npm install https://github.com/dethe/obloq/tarball/unstable`
3. Copy the sample grunt task: `cp node_modules/obloq/lib/grunt.example grunt.js`
4. Create a `bloqs` subdirectory for your markdown files
5. Copy the js and styles for documentation files: `cp -r node_modules/obloq/lib .`
6. To support Less, Handlebars, Stylus, Coffescript, Jade, and more, install the grunt-contrib tasks: `npm install grunt-contrib`
7. Run `grunt` to extract code blocks to a `build` directory, documentation to `docs`, templates and concatenated, minified files to `web`.

**Warning** The default grunt task will erase all files in `docs`, `build`, and `web` each time it is run. Only use these directories for generated files! The default task also assumes grunt-contrib is installed, although it isn't strictly required for oBloq.

You can edit the `grunt.js` file to suit the needs of your project.

## Text-based wireframes

Code blocks whose file extension is .sketch are preserved and converted in-browser. Other types are formatted in-browser for syntax highlighting, but .sketch blocks are converted to line drawings using Raphael.js and a plugin for Raphael called Sketchy.js. Sketchy lets you draw line which are rough and resemble hand-drawn (and not with a particularly steady hand) and is still in development in parallel with oBloq, but the commands recognized in oBloq at the time of writing this are below. Arguments x, y, w, and h are all assumed to be integers, text is any string following them. Text strings do not have to be quoted. The offset of strings is a little wonky, that's something I'm looking into. Comments are not supported by the sketchy syntax, but #comments below are used to describe the results.

``` text
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
```
    
For example (example works on [Github page](http://dethe.github.com/obloq/), but not in code view):

``` text
size 400 200
img 10 10 180 180
text 300 10 Title
rect 210 30 180 100 Article
rect 210 110 180 80 Article
```

becomes

``` sketch
size 400 200
img 10 10 180 180
text 300 10 Title
rect 210 30 180 100 Article
rect 210 110 180 80 Article
```

### Testing

* Build visual tests into the docs, including tools to check with various data (for overflow), state (loggged in?), and block size (for responsive design). Seeing the visual tests update while you're in the oBloq editor would be pretty nifty.

    
<script src="http://dethe.github.com/obloq/lib/loader.js"></script>
