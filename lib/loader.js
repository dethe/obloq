function elem(name, attrs){
    var e = document.createElement(name);
    for (var key in attrs){
        e.setAttribute(key, attrs[key]);
    }
    return e;
}
var head = document.getElementsByTagName('head')[0];
var body = document.body;

head.appendChild(elem('link', {rel: 'stylesheet', href: 'http://dethe.github.com/obloq/lib/obloq.css'}));
body.appendChild(elem('script', {src: 'http://dethe.github.com/obloq/lib/raphael_152.js'}));
body.appendChild(elem('script', {src: 'http://dethe.github.com/obloq/lib/sketchy.js'}));

