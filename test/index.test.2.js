var buildKit = require('../index.js');

// buildKit JS

buildKit.minifyJSFile(__dirname + '/src/jquery.js', __dirname + '/build/jquery.min.js', function () {
    // File to File
    console.log('minifyJSFile: File to File Done!');
});

buildKit.minifyJSFile(__dirname + '/src/zepto', __dirname + '/build/zepto.min.js', function () {
    // Dir to File
    console.log('minifyJSFile: Dir to File Done!');
});

// Dir to Dir
buildKit.mkdirp(__dirname + '/build/zepto', function () {
    buildKit.minifyJSFile(__dirname + '/src/zepto', __dirname + '/build/zepto', function () {
        console.log('minifyJSFile: Dir to Dir Done!');
    });
});

// buildKit HTML
buildKit.minifyHTMLFile(__dirname + '/src/index.html', __dirname + '/build/index.html', function () {
    console.log('minifyHTMLFile Done');
});

buildKit.minifyHTMLFile(__dirname + '/src/html', __dirname + '/build/html', function () {
    console.log('minifyHTMLFile Done');
});

buildKit.minifyCSSFile(__dirname + '/src/bootstrap.css', __dirname + '/build/bootstrap.min.css', function() {
    console.log('minifyCSSFile Done');
});

buildKit.minifyCSSFile(__dirname + '/src/bootstrap', __dirname + '/build/bootstrap', function() {
    console.log('minifyCSSFile Done');
});