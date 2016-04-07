# buildkit
A Front-End Build Kit.

## API
it's easy to use.

### HTML
#### minifyHTMLFile(src, dest, [options], [callback])

**src**

> Type: string

The source file or directory.

**dest**

> Type: string

The destination file or directory.

**options**

> Type: object

See [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference) options.

**callback**

>  Type: function

```javascript
/*! Example */
// Minify File
minifyHTMLFile('index.html', 'index.min.html')
// Minify Directory
minifyHTMLFile('src/', 'build/');
```

### CSS

#### minifyCSSFile(src, dest, [options], [callback])

src**

> Type: string

The source file or directory.

**dest**

> Type: string

The destination file or directory.

**options**

> Type: object

See [clean-css](https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-api) options.

**callback**

> Type: function

```javascript
/*! Example */
// Minify file
minifyCSSFile('style.js', 'style.min.js')
// Merge and minify multi files
minifyCSSFile('css/', 'style.min.js')
// Minify directory
minifyCSSFile('src/css/', 'build/css/');
```

### JS

#### minifyJSFile(src, dest, [options], [callback])

src**

> Type: string

The source file or directory.

**dest**

> Type: string

The destination file or directory.

**options**

> Type: object

See [UglifyJS2](https://github.com/mishoo/UglifyJS2#compressor-options) options.

**callback**

> Type: function

```javascript
/*! Example */
// Minify file
minifyJSFile('script.js', 'script.min.js')
// Merge and minify multi files
minifyJSFile('scr/js/', 'script.min.js')
// Minify directory
minifyJSFile('src/js/', 'build/js/')
```
