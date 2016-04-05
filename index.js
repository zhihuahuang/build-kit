var fs = require('fs');

var HtmlMinify = require('html-minifier').minify;
var CleanCSS = require('clean-css');
var UglifyJS = require('uglify-js');

var Imagemin = require('imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');

var async = require('async');

function emptyFunction() {};

function isFunction(func) {
    return typeof func == "function";
}

function isDirSync(path) {
    return fs.statSync(path).isDirectory();
}

/**
 * Minify JavaScript Code
 *
 * minifyJavaScript(string, [option], callback)
 */
exports.minifyJavaScript = function (string, option, callback) {

}

/**
 * Minify JS File
 *
 * 
 */
exports.minifyJS = (function f(src, dest, option, callback) {
    if (isFunction(option)) {
        f(src, dest, null, option);
    } else {
        var result = UglifyJS.minify(src, option);

        // Output js file
        var task = [function (cb) {
            fs.writeFile(dest, result.code, callback);
        }];

        // Output map file
        if (option.outSourceMap) {
            task.push(function (cb) {
                fs.writeFile(option.outSourceMap, result.map, cb);
            });
        }

        async.parallel(task, callback);
    }
});

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