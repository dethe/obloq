# oBloq Card

A generic "card" or rectangle of content on the page.

## Template

This is the framework of the card in html.

``` moustache
<div class="card">
    {{#header}}
        <div class="header">{{header}}</div>
    {{/header}}
    <div class="content">{{content}}</div>
    {{#footer}}
        <div class="footer">{{footer}}</div>
    {{/footer}}
</div>
```

## Stylesheet

Default styling for a card

``` css
.card {
    border-radius: 10px;
    background-color: #666;
    color: #000;
}
/* Namespace styles to this block */
.card .header {
    background-color: #000;
    color: #333;
    font-family: sans-serif;
    font-size: 1.2em;
    font-weight: bold;
}
.card .footer {
    background-color: #000;
    color: #333;
    font-size: 0.8em;
}
```
