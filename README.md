# buildkit
A Front-End Build Kit.

## API
it's easy to use.



### HTML

```javascript
minifyHTMLFile(src, dest, [options], [callback])

//Example
minifyHTMLFile('index.html', 'index.min.html');
```

**src**

>  Type: string

The src file or directory.

**dest**

> Type: string

The dest file or directory.

**options**

> Type: object

See [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference).