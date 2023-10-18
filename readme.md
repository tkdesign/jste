# JavaScript Text Editor (JS TE)

JavaScript Text Editor (JS TE) is a versatile JavaScript library for creating text editors in web applications. It empowers you to transform a simple HTML container into a rich WYSIWYG (What You See Is What You Get) text editor, similar to the classic TinyMCE, without the need for extensive frameworks or dependencies.

## Features

- Seamless integration with modern and old browsers.
- No complex frameworks or dependencies required.
- Employs the intuitive WYSIWYG editing model.

## Quick Start

Using JS TE is a breeze. You can get started with a single line of code:

```javascript
jste(htmlSelector);
```

For instance, if you have an HTML `div` or `span` container with an `id` of "editor," simply use the following to initialize JS TE:

```javascript
jste("#editor");
```

Of course, you can use different selectors as needed.

## Installation

To use JS TE, you can download the distributable library from the [GitHub repository](https://github.com/tkdesign/jste) or clone the entire JS TE project to your local environment. Then, follow these steps:

1. In your project directory, install the required dependencies by running:

   ```bash
   npm install --save-dev
   ```

2. Once the dependencies are installed, generate the distributable version of the library using:

   ```bash
   npm run dist
   ```

   This process will compile the source code from the `src` directory, producing a distribution that can be used in various environments.

3. Include the library in your project by adding the following lines to your HTML:

   ```html
   <link type="text/css" rel="stylesheet" href="jste.css" />
   <script type="text/javascript" src="jste.min.js"></script>
   ```

4. Create an HTML container within the `<body>` tags where you want to embed the text editor:

   ```html
   <span id="editor">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium ad alias amet, commodi earum, ex illum maiores neque nostrum nulla quae repellat repellendus repudiandae rerum suscipit, totam ut voluptate. Eligendi!</span>
   ```

5. Finally, initialize JS TE using the following code:

   ```html
   <script>
     const editor = jste('#editor');
   </script>
   ```

That's it! You now have a functional WYSIWYG text editor on your web page.

## Contribution and Support

If you'd like to contribute to the development of JS TE or report issues, please visit the GitHub repository at [https://github.com/tkdesign/jste](https://github.com/tkdesign/jste). You can also reach out for support or discussions there.

## License

JS TE is an open-source library available under the [MIT License](LICENSE.md). You are encouraged to use it in your projects and modify it to suit your needs.

Feel free to adapt this description further and make it more detailed if necessary.