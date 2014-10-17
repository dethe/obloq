# Bar bloq

A bar is a bloq that stretches across the parent container, usually containing links or controls.

## Bar template

This is the html template we use to build a bar
``` html
<div class="bar">{{content}}</bar>
```

## Bar stylesheet

Stylesheet can be css, stylus, sass, less, etc.

``` stylus
.bar{
    display: block;
    background-color: black;
    color: white;
    width: 100%;
    height: 1.2em;
}
```

## Bar Handler (client-side)

Files get default names based on the markdown filename. This block will end up as `bar.js`. Multiple blocks which end up with the same file names will be concatenated together.

``` javascript
$('.bar').on('click', 'button', barButtonHandler);
```

## Bar Handler (server-side)

Each block can over-ride its default name in a couple of ways. If the first line of the block contains the exact word "prefix:" or "filename:" it will be stripped from the results and the resulting filename will be the default name with that prefix, or the exact filename specified. The following block will be named `server/bar.js`.

``` javascript
// prefix: server
app.get('bar/:handler', function(req, res, next){
    res.json({handler: req.params.handler});
});
```

## Bar Test

Sometimes filenames need more than a prefix, they need to end up in an exact location or use a specific naming convention. In that case you can use the "filename:" specifier. In this case the block will end up in a file named `test/bar_test.js`. Even though these lines are stripped out of the results, you should comment them out so as not to confuse syntax highlighting, on github for example.

``` javascript
// filename: test/bar_test.js
mocha.expect(bar, isEqual, baz);
```
