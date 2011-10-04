# oBloq Button

This is an example of an oBloq example file. It is an intentionally simple example used in order to show what oBloq is capable of.

## Style

Here is where we can provide CSS which is specific to the widget. Style can also be in stylus format (encouraged) and reference global styles. Stylus can provide namespacing, I believe.

    file: button.css

    button{
        border-radius: 20px;
        color: green;
    }

## Structure

This is the template of a widget. Some notion of data content is implied. More thought needed on data models. Perhaps the data should also be namespaced?

    file: button.mustache

    <button class="{{class}}>{{title}}</button>

## Events

What events does the fire? What events does the widget respond to? Namespaces can be used here as well.

    file: button.js

    $('click', function(){
        alert('Aaargh, you got me');
    });

## Wireframe

We can include text descriptions of wireframes, which will automatically be rendered using the sketchy plugin for documentation purposes. For pre-generated wireframes you can just include the png here instead, but text-based are preferred (images are nice for comparing with Photoshop comps as needed).

    file: button.sketch

    size 150 30
    rect 0 0 150 30 Button
    
## Data models

What data is needed for this module?

## Permissions

Who should see this module? Who can edit it? Under what conditions?

## Tests

Here we can describe the tests desired. Layout tests are generally: layout, card, bar, or button. Other types can be added as needed. Not sure how to add unit, performance, or event testing yet.
