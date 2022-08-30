What is JS TE?
==================

JS Text Editor is a JavaScript Text Editor library. It is a simple HTML editor for modern browsers without frameworks and other dependecies. And it works with WYSIWYG model.

Most importantly, it can be integrated into your system in 1 minute. And you can modify it as you want in terms of interface. Even you can change the css classes.

Everything is as simple as the following:  
**jste(htmlSelector).init();**

For example, if you have created a div or span container and the value of id, such as “editor”
used with the **jste(“#editor”);** will be enough to write script.

Of course you can also use a different selector.

Usage
-----

First download and include te.min.js, polyfills.min.js and te.css (inside to head tags). Next, download jste-skin/te.png.

``` html
<script type="text/javascript" src="jste.min.js"></script>
<script type="text/javascript" src="polyfills.min.js"></script>
<link type="text/css" rel="stylesheet" href="jste.css" charset="utf-8" />
```

After than, create a html-container inside to body tags:

``` html
<span id="editor"></span>
```

Finally, run this code:
``` html
<script>
	let elem = jste('#editor');
	elem.init();
</script>
```

That's it!
