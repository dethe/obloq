Raphael.fn.line = function(x1,y1, x2,y2){
    var path = new Path()
        .moveto(x1, y1)
        .lineto(x2, y2);
    return this.path(path);
};
Raphael.fn.background = function(color){
    this.rect(0,0,this.width,this.height).attr('fill', background);
};
Raphael.fn.blueprint = function(spacing){
    this.background('#3459B3');
    this.grid('#486DBC', spacing);
};
Raphael.fn.grid = function(color, spacing){
    if (spacing === undefined){
        spacing = 10;
    }
    var lineattrs = {stroke: color, 'stroke-width': 0.5};
    $u.iterrange(0, this.width, spacing, function(x){
        self.line(x, 0, x, this.height).attr(lineattrs);
    });
    $u.iterrange(0, this.height, spacing, function(y){
        self.line(0, y, this.width, y).attr(lineattrs);
    });
};

jQuery.fn.extend({
    sketch: function(){
        this.each(function(){
            var self = $(this);
            var elem = this;
            var lines = $.trim(self.text()).split('\n').slice(2).map(function(item){ return $.trim(item).split(/\s+/);});
            var w,h;
            // get height and width
            for (var i = 0; i < lines.length; i++){
                if (lines[i][0] === 'size'){
                    w = parseInt(lines[i][1]);
                    h = parseInt(lines[i][2]);
                    lines.splice(i,1);
                    break;
                }
            }
            var canvas = $('<div></div>');
            self.closest('pre').replaceWith(canvas);
            var sketch = new Sketch(canvas[0], w, h);
            $.each(lines, function(idx, line){
                var words = line;
                var cmd = words[0];
                switch(cmd){
                    case 'line':
                    case 'rect':
                    case 'arrow':
                    case 'img':
                    case 'ellipse':
                    case 'crossellipse':
                    case 'fatarrowleft':
                    case 'fatarrowright':
                    case 'fatarrowdown':
                    case 'fatarrowup':
                    case 'avatar':
                    case 'options':
                        var args = $u.intarray(words.slice(1,5));
                        args.push(words.slice(5).join(' ')); // text for rect
                        sketch[cmd].apply(sketch, args);
                        break;
                    case 'text':
                    case 'ltext':
                    case 'rtext':
                        var x = parseInt(words[1], 10),
                            y = parseInt(words[2], 10),
                            text = words.slice(3).join(' ');
                        sketch[cmd].call(sketch,x,y,text);
                        break;
                    default:
                        console.log('%s is not a recognized sketchy command', cmd);
                        break;
                }
                if (sketch){
                    sketch.draw();
                }
            });
        });
    }
});
// Utility methods I usually need

function Path(){
    this._path = [];
}
Path.prototype.moveto = function(x, y){
    this._path.push('M' + x + ' ' + y);
    return this;
};
Path.prototype.moveby = function(x, y){
    this._path.push('m' + x + ' ' + y);
    return this;
};
Path.prototype.lineto = function(x, y){
    this._path.push('L' + x + ' ' + y);
    return this;
};
Path.prototype.lineby = function(x, y){
    this._path.push('l' + x + ' ' + y);
    return this;
};
Path.prototype.closepath = function(){
    this._path.push('Z');
    return this;
};
Path.prototype.horizontalto = function(x){
    this._path.push('H' + x);
    return this;
};
Path.prototype.horizontalby = function(x){
    this._path.push('h' + x);
    return this;
};
Path.prototype.verticalto = function(y){
    this._path.push('V' + y);
    return this;
};
Path.prototype.verticalby = function(y){
    this._path.push('v', + y);
    return this;
};
Path.prototype.beziercurveto = function(cx1, cy1, cx2, cy2, x, y){
    this._path.push('C' + [cx1, cy1, cx2, cy2, x, y].map(function(p){return Math.round(p);}).join(' '));
    return this;
};
Path.prototype.beziercurveby = function(cx1, cy1, cx2, cy2, x, y){
    this._path.push('c' + [cx1, cy1, cx2, cy2, x, y].join(' '));
    return this;
};
// Can add smooth and quadratic beziers and elliptical arcs as needed
Path.prototype.toString = function(){
    return this._path.join(' ');
};
Path.prototype.curve = function(vertArray, tightness){
// Catmull-Rom curve, approximated with beziers
    if (vertArray.length > 3) {
        var b = [],
            curTightness = tightness || 0,
            s = 1 - curTightness;
        this.moveto(vertArray[1][0], vertArray[1][1]);
         /*
         * Matrix to convert from Catmull-Rom to cubic Bezier
         * where t = curTightness
         * |0         1          0         0       |
         * |(t-1)/6   1          (1-t)/6   0       |
         * |0         (1-t)/6    1         (t-1)/6 |
         * |0         0          0         0       |
         */
         for (var i = 1; (i+2) < vertArray.length; i++) {
             b[0] = [vertArray[i][0], vertArray[i][1]];
             b[1] = [vertArray[i][0] + (s * vertArray[i+1][0] - s * vertArray[i-1][0]) / 6,
                vertArray[i][1] + (s * vertArray[i+1][1] - s * vertArray[i-1][1]) / 6];
             b[2] = [vertArray[i+1][0] + (s * vertArray[i][0] - s * vertArray[i+2][0]) / 6,
                vertArray[i+1][1] + (s * vertArray[i][1] - s * vertArray[i+2][1]) / 6];
             b[3] = [vertArray[i+1][0], vertArray[i+1][1]];
             this.beziercurveto(b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]);
         }
         return this;
     }
 };

function Sketch(elem, width,height){
    this._paper = Raphael(elem, width, height);
    window.paper = this._paper;
    $(elem).addClass('nobp');
    this._path = new Path();
}
Sketch.prototype.line = function(x1, y1, x2, y2){
    var random = $u.random;
    var dx = (x2 - x1) / 3;
    var dy = (y2 - y1) / 3;
    var splitline = [[x1,y1],[x1,y1],[x1+dx,y1+dy],[x1+dx*2,y1+dy*2],[x2,y2],[x2,y2]];
    var overlines = $u.choice([1,1,1,1,1,1,1,2,2,2,3]);
    for (var i = 0; i < overlines; i++){
        this._path.curve(splitline.map($u.nudge));
        // this._path.curve($.map(splitline, $u.nudge));
    }
    return this;
};
Sketch.prototype.rect = function(x, y, w, h, text){
    this.line(x,y,x,y+h);
    this.line(x,y,x+w,y);
    this.line(x+w,y,x+w,y+h);
    this.line(x,y+h,x+w,y+h);
    if (text !== undefined){
        this.text(x+w/2,y+h/2+6,text);
    }
    return this;
};
Sketch.prototype.text = function(x, y, text, align){
    var t = this._paper.text(x,y,text);
    var n = t.node;
    n.removeAttribute('style');
    n.removeAttribute('font');
    n.removeAttribute('fill');
    n.setAttribute('class', 'wftext');
    if (align){
        t.attr('text-anchor', align);
    }
    return this;
};
Sketch.prototype.ltext = function(x,y,text){
    console.log('ltext');
    this.text(x,y,text,'start');
};
Sketch.prototype.rtext = function(x,y,text){
    this.text(x,y,text,'end');
};
Sketch.prototype.arrow = function(x1,y1,x2,y2){
    var angle = Raphael.angle(x1,y1,x2,y2);
    var x3,y3,x4,y4;
    x3 = $u.dcos(angle + 45) * 10 + x2;
    y3 = $u.dsin(angle + 45) * 10 + y2;
    x4 = $u.dcos(angle - 45) * 10 + x2;
    y4 = $u.dsin(angle - 45) * 10 + y2;
    this.line(x1,y1,x2,y2);
    this.line(x2,y2,x3,y3);
    this.line(x2,y2,x4,y4);
    return this;
};
Sketch.prototype.img = function(x,y,w,h){
    this.rect(x,y,w,h);
    this.line(x,y,x+w,y+h);
    this.line(x+w,y,x,y+h);
    return this;
};
Sketch.prototype.ellipse = function(x,y,w,h,text){
    var points = $u.ellipse(x,y,w,h, 8);
    var count = $u.random(3, 19);
    $u.range(count).forEach(function(i){
        points.push(points[i % 8]);
    });
    if (text !== undefined){
        this.text(x+w/2,y+h/2+6,text);
    }
    this._path.curve(points.map($u.nudge));
    return this;
};
Sketch.prototype.crossellipse = function(x,y,w,h){
    var points = $u.ellipse(x,y,w,h, 8);
    this.line(points[1][0],points[1][1],points[5][0],points[5][1]);
    this.line(points[3][0],points[3][1],points[7][0],points[7][1]);
    var count = $u.random(3, 19);
    $u.range(count).forEach(function(i){
        points.push(points[i % 8]);
    });
    this._path.curve(points.map($u.nudge));
    return this;
};
Sketch.prototype.fatarrowright = function(x,y,w,h){
    var dW = w/3, // vertical inset for body of arrow
        dH = h/5,  // horizontal inset for point of arrow
        x2 = x+w-dW, x3=x+w,
        y2 = y+dH, y3 = y+h/2, y4 = y+h-dH, y5 = y+h;
    this.line(x,y2,x2,y2).line(x2,y2,x2,y).line(x2,y,x3,y3)
        .line(x3,y3,x2,y5).line(x2,y5,x2,y4).line(x2,y4,x,y4)
        .line(x,y4,x,y2);
    return this;
};
Sketch.prototype.fatarrowleft = function(x,y,w,h){
    x=x+w; // draw from right to left
    var dW = w/3, // vertical inset for body of arrow
        dH = h/5,  // horizontal inset for point of arrow
        x2 = x-w+dW, x3=x-w,
        y2 = y+dH, y3 = y+h/2, y4 = y+h-dH, y5 = y+h;
    this.line(x,y2,x2,y2).line(x2,y2,x2,y).line(x2,y,x3,y3)
        .line(x3,y3,x2,y5).line(x2,y5,x2,y4).line(x2,y4,x,y4)
        .line(x,y4,x,y2);
    return this;
};
Sketch.prototype.fatarrowup = function(x,y,w,h){
    y=y+h // draw from down to up
    var dW = w/5, // vertical inset for body of arrow
        dH = h/3,  // horizontal inset for point of arrow
        x2 = x+dW, x3 = x+w/2, x4 = x+w-dW, x5 = x+w,
        y2 = y-h+dH, y3=y-h;
    this.line(x2,y,x2,y2).line(x2,y2,x,y2).line(x,y2,x3,y3)
        .line(x3,y3,x5,y2).line(x5,y2,x4,y2).line(x4,y2,x4,y)
        .line(x4,y,x2,y);
    return this;
};
Sketch.prototype.fatarrowdown = function(x,y,w,h,text){
    var dW = w/5, // vertical inset for body of arrow
        dH = h/3,  // horizontal inset for point of arrow
        x2 = x+dW, x3 = x+w/2, x4 = x+w-dW, x5 = x+w,
        y2 = y+h-dH, y3=y+h;
    this.line(x2,y,x2,y2).line(x2,y2,x,y2).line(x,y2,x3,y3)
        .line(x3,y3,x5,y2).line(x5,y2,x4,y2).line(x4,y2,x4,y)
        .line(x4,y,x2,y);
    return this;
}
Sketch.prototype.avatar = function(x,y,w,h){
    var dW = w/6,
        dH = h/9,
        x2 = x+dW, x3 = x + dW*2, x4 = x + dW*3, x5 = x + dW*4, x6 = x + dW*5,
        y2 = y+dH, y3 = y + dH*2, y4 = y + dH*3, y5 = y + dH*3.5, y6 = y + dH * 4, y7 = y + dH*4.5, y8 = y + dH*5, y9 = y + h - dH;
    this.rect(x,y,w,h)
        .ellipse(x3,y2,dW*3,dW*3) // head
        .ellipse(x4-2,y3-2,4,4) // left eye
        .ellipse(x5-2,y3-2,4,4) // right eye
        .line(x4,y7,x2,y9)  // left shoulder
        .line(x5,y7,x6,y9) // right shoulder
        .line(x4,y4,x4+2,y5).line(x4+2,y5,x5-2,y5).line(x5-2,y5,x5,y4); // smile
    return this;
}
Sketch.prototype.triangledown = function(x,y,w,h){
    return this.line(x,y,x+w,y).line(x+w,y,x+w/2,y+h).line(x+w/2,y+h,x,y);
};
Sketch.prototype.options = function(x,y,w,h,text){
    if (!text.length){
        text = 'options';
    }
    this.rect(x,y,w-h,h,text);
    this.rect(x+w-h,y,h,h);
    var off=8;
    this.triangledown(x+w-h+off,y+off,h-off*2,h-off*2);
    return this;
};
Sketch.prototype.draw = function(){
    var node = this._paper.path(this._path).node;
    node.removeAttribute('stroke');
    node.setAttribute('class', 'wfline');
    return this;
};

var $u = {
    removeItem: function(list, item){
        list.splice(list.indexOf(item), 1);
    },
    dcos: function(degrees){
        return Math.cos(Raphael.rad(degrees));
    },
    dsin: function(degrees){
        return Math.sin(Raphael.rad(degrees));
    },
    random: function(a,b){
        // 'Returns an integer between a and b, inclusive';
        // 'If b is not specified, returns an integer between 0 and a';
        if (b === undefined){
            b = a;
            a = 0;
        }
        return Math.floor(Math.random() * (b-a + 1)) + a;
    },
    choice: function(list){
        // This is an exclusive, or mutating choice that
        // picks a random item from a list and removes that
        // item before returning it
        var idx = $u.random(0, list.length - 1);
        var item = list[idx];
        list.splice(idx, 1); // remove item from list
        return item;
    },
    range: function(start, stop, step){
        // similar to Python's range function
        // should be extended to handle negative steps
        if (stop === undefined){
            stop = start;
            start = 0;
        }
        if (step === undefined){
            step = 1;
        }
        var r = [], i;
        for(i = start; i < stop; i += step){
            r.push(i);
        }
        return r;
    },
    iterrange: function(start, stop, step, func){
        var r = $u.range(start, stop, step);
        for (var i in r){
            func(r[i]);
        }
    },
    intarray: function(array){
        return $.map(array, $u.integ);
    },
    integ: function(str){
        return parseInt(str, 10);
    },
    nudge: function(pt){
        return [pt[0] + $u.random(-2,2), pt[1] + $u.random(-2, 2)];
    },
    ellipse: function(x,y,w,h,steps){
    /*
    * This functions returns an array containing points to draw an
    * ellipse in the rect defined by x,y,w,h
    */
        w = w/2;
        h = h/2;
        x = x + w;
        y = y + h;
        if (steps === undefined){
            steps = 36;
        }
        var points = [];
        var a = w, // semi-major axis
            b = h, // semi-minor axis
            beta = 0;
        if (w > h){
            a = h;
            b = w;
            beta = -Math.PI / 2;
        }
        var sinbeta = Math.sin(beta);
        var cosbeta = Math.cos(beta);
        var i, alpha, sinalpha, cosalpha,X,Y;
        for (i = 0; i < 360; i += 360 / steps) {
            alpha = i * (Math.PI / 180) ;
            sinalpha = Math.sin(alpha);
            cosalpha = Math.cos(alpha);
            X = x + (a * cosalpha * cosbeta - b * sinalpha * sinbeta);
            Y = y + (a * cosalpha * sinbeta + b * sinalpha * cosbeta);

            points.push([X,Y]);
        }
        return points;
        }
};
// Raphael cheat sheet:
// paper.circle(x,y,radius)
// paper.rect(x,y,width,height[,corner_radius])
// paper.ellipse(x,y,h_radius,y_radius)
// paper.image(src,x,y,width,height)
// paper.set() // used for grouping elements
// paper.text(x,y,txt)
// paper.path(svg_path_string)
// paper.clear() // clears all elements from canvas
// element.node() // gives access to DOM object
// element.remove()
// element.hide()
// element.show()
// element.rotate(degrees, isAbsolute)
// element.rotate(degrees, origin_x, origin_y)
// element.translate(dx, dy)
// element.scale(xtimes, ytimes, [centerx, centery])
// element.attr(name,value)
// element.attr({parameters})
// element.attr(name) // returns current value
// element.attr([names]) // array of names, returns array of values
// element.attr() // returns all names
// ATTRIBUTES:
//     clip-rect: comma or space separated x, y, width, height as string
//     cursor: name of cursor as string
//     cx: number
//     cy: number
//     fill: colour or gradient
//         linear gradient: "<angle>-<color>[-<color:offset>]-<color>"
//         radial gradient: "r[(<fx>,<fy>)]<color>[-<color>[:offset]]-<color>"
//         Focal coordinates are from 0..1
//         Radial gradients can only be applied to circles and ellipses
//     fill-opacity: number
//     font: string
//     font-family: string
//     font-size: number
//     font-weight: string
//     height: number
//     href: string (url, turns element into hyperlink)
//     opacity: number
//     path: pathString
//     r: number
//     rotation: number
//     rx: number
//     ry: number
//     scale: string
//     src: string (url)
//     stroke: color
//     stroke-dasharray: string
//     stroke-linecap: ["butt", "square", "round"]
//     stroke-linejoin: ["bevel", "round", "miter"]
//     stroke-miterlimit: number
//     stroke-opacity: number
//     stroke-width: number
//     target: string (used with href)
//     text-anchor: ["start", "middle", "end"]
//     title: string
//     translation: string
//     width: number
//     x: number
//     y: number
// element.animate({newattrs}, ms, callback)
// element.animate({newattrs}, ms, easing, callback)
// element.animate({keyframes}, ms)
// ATTRIBUTES THAT CAN BE ANIMATED
//     clip-rect: string
//     cx: number
//     cy: number
//     fill: color
//     fill-opacity: number
//     font-size: number
//     height: number
//     opacity: number
//     path: pathstring
//     r: number
//     rotation: string
//     rx: number
// element.animateWith([same as animate, but first argument is an element to synchronize with])
// element.animateAlong(pathobject|pathstring, ms, rotateFlag, callback)
// element.animateAlongBack(pathobject|pathstring, ms, rotateFlag, callback)
// element.onAnimation(func)
// element.getBBox()
// element.toFront()
// element.toBack()
// element.insertBefore(elem)
// element.insertAfter(elem)
// element.clone()
// path.getTotalLength()
// path.getPointAtLength()
// path.getSubpath(from_px, to_px)
// paper.setSize(width, height)
// Raphael.getRGB(colorstring)
// Raphael.angle(x1, y1, x2, y2[, x3, y3])
// Raphael.rad(degrees)
// Raphael.deg(radians)
// Raphael.snapTo(values, value[, tolerance])
// Raphael.getColor()
// Raphael.getColor.reset()
// Raphael.registerFont(font)
// paper.getFont(family[, weight][, style][, stretch])
// paper.print(x, y, text, font, font_size)


// Code goes here
// var sketch = new Sketch($('.canvas')[0], WIDTH, HEIGHT, true)
//     .arrow( 150, 150, 200,200)
//     .arrow( 150,90, 180,65)
//     .rect(70,90,70,50,'Baz')
//     .rect(210,180,60,90,'Foo')
//     .rect(190,40,80,50,'Bar')
//     .draw();
$(function(){
    $('code').sketch();
});
