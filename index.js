/*
 * Require Node Modules
 */
var fs = require('fs');
var path = require('path');

/*
 * Require Tools Modules
 */
var mkdirp = require('mkdirp');
var async = require('async');

/*
 * Require Build Modules
 */
var HtmlMinify = require('html-minifier').minify;
var CleanCSS = require('clean-css');
var UglifyJS = require('uglify-js');

var Imagemin = require('imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');

/*
 * Base Function
 */
function emptyFunction() {};

function isFunction(func) {
    return typeof func == "function";
}

function isDirSync(path) {
    return fs.statSync(path).isDirectory();
}

/*
 * HTML
 */
exports.minifyHTML = function (str, options, callback) {
    (callback || emptyFunction)(null, HtmlMinify(str, options));
};

exports.minifyHTMLFile = function (inFile, outFile, options, callback) {
    var outDir = path.dirname(outFile);
    mkdirp(outDir, function (err) {
        fs.readFile(inFile, 'utf-8', function (err, data) {
            fs.writeFile(outFile, HtmlMinify(data, options), 'utf-8', callback);
        });
    });
};

/* 
 * JS
 */

/**
 * Minify JavaScript Code
 *
 * minifyJavaScript(string, [options], callback)
 *
 * callback(err, data, instance)
 */
exports.minifyJavaScript = (function f(str, options, callback) {
    if (isFunction(options)) {
        f(str, {}, callback);
    } else {
        var result = UglifyJS.minify(str, options);
        (callback || emptyFunction)(null, result.code, result);
    }
});

/**
 * Minify JS File
 *
 * minifyJSFile(src, dest, [options], callback)
 *
 * callback(err, instance)
 */
exports.minifyJSFile = (function f(src, dest, options, callback) {
    options = options || {};
    if (isFunction(options)) {
        f(src, dest, {}, options);
    } else if (isDirSync(src)) {
        //  TODO
        if (isDirSync(dest)) {
            
        }
        else {
            
        }
        
    } else {
        // Src is file
        
        if(isDirSync(dest)) {
            // Dest is Dir
            dest = dest + '/' + path.basename(src);
        }
        
        mkdirp(path.dirname(dest), function (err) {
            var result = UglifyJS.minify(src, options);
            fs.writeFile(dest, result.code, 'utf-8', function (err) {
                if (options.outSourceMap) {
                    // Output map file
                    fs.writeFile(options.outSourceMap, result.map, function (err) {
                        (callback || emptyFunction)(err, result);
                    });
                } else {
                    (callback || emptyFunction)(err, result);
                }
            });
        });
    }

    return this;
});

/*
 * CSS
 */
exports.minifyCSS = function (str, options, callback) {
    new CleanCSS(options).minify(str, function (error, minified) {
        (callback || emptyFunction)(error, minified.styles);
    });
};

exports.minifyCSSFile = function (inFile, outFile, options, callback) {
    var outDir = path.dirname(outFile);
    mkdirp(outDir, function (err) {
        fs.readFile(inFile, 'utf-8', function (err, data) {
            new CleanCSS(options).minify(data, function (error, minified) {
                fs.writeFile(outFile, minified.styles, 'utf-8', callback);
            });
        });
    });
}

/*
* Image
*/

/**
 * Minify PNG File
 *
 * 
 */
exports.minifyPNG = function (src, dest, option, calllback) {

}

/**
 * Minify JPEG File
 *
 * minifyJPEG(src, dest, [option], [callback]);
 *
 * src
 * Type: string
 * 
 *
 * Use imagemin-mozjpeg
 * 
 * Option see Github: <a href="https://github.com/imagemin/imagemin-mozjpeg">imagemin-mozjpeg<a/>
 */
exports.minifyJPEG = (function f(src, dest, option, callback) {
    if (isFunction(option)) {
        return f(src, dest, null, option);
    }

    //    var imageMin = new Imagemin().use(imageminMozjpeg(option));
    console.log(src, isDirSync(src), dest, option);

    if (isDirSync(src)) {
        new Imagemin()
            .src(src + '/*.jpg')
            .dest(dest)
            .use(imageminMozjpeg(option))
            .run(function (err, files) {
                callback(err);
            });
    } else {
        console.log(src);
        new Imagemin()
            .src(src)
            .use(imageminMozjpeg(option))
            .run(function (err, files) {
                console.log(2);
                if (err) {
                    throw err;
                }
                console.log(1);
                console.log(err, files);
                fs.createWriteStream(dest).on('open', function (fd) {
                    fs.write(fd, files[0].contents, 0, files[0].contents.length, 0, function (err) {
                        fs.close(fd, function () {
                            (callback || emptyFunction)(err);
                        });
                    });
                });
            });
    }
});