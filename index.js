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
 ***********
 * Options *
 ***********
 */

var defaultCSSOptions = {

};

var defaultJSOptions = {

};

var defaultHTMLOptions = {
    collapseWhitespace: true,
    minifyJS: defaultJSOptions,
    minifyCSS: defaultCSSOptions,
    removeComments: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    removeStyleLinkTypeAttributes: true,
    removeScriptTypeAttributes: true,
    useShortDoctype: true,
};

/*
 ********
 * Tool *
 ********
 */

exports.mkdirp = mkdirp;

/*
 ********
 * HTML *
 ********
 */

exports.minifyHTML = function (str, options, callback) {
    (callback || emptyFunction)(null, HtmlMinify(str, options));
    return this;
};

exports.minifyHTMLFile = (function f(src, dest, options, callback) {
    if (isFunction(options)) {
        return f(src, dest, null, options);
    }

    options = options || defaultHTMLOptions;

    if (isDirSync(src)) {
        fs.readdir(src, function (err, files) {
            // Filter JS File
            var taskQueue = [];

            files.filter(function (file) {
                return /\.html?$/.test(file);
            }).forEach(function (file) {
                taskQueue.push(function (cb) {
                    f(src + path.sep + file, dest + path.sep + file, options, cb);
                });
            });
            async.parallel(taskQueue, callback);
        });
    } else {
        // Src is File
        mkdirp(path.dirname(dest), function (err) {
            fs.readFile(src, 'utf-8', function (err, data) {
                fs.writeFile(dest, HtmlMinify(data, options), 'utf-8', callback);
            });
        });
    }
    return this;
});

/*
 ******
 * JS *
 ******
 */

/**
 * Minify JavaScript Code
 *
 * minifyJavaScript(string, [options], callback)
 *
 * callback(err, data, instance)
 */
exports.minifyJS = (function f(str, options, callback) {
    options = options || defaultJSOptions;
    if (isFunction(options)) {
        f(str, null, options);
    } else {
        options.fromString = true;
        var result = UglifyJS.minify(str, options);
        (callback || emptyFunction)(null, result.code, result);
    }
});

/**
 * Write JS File
 *
 * writeJSFile(result, dest, options, callback)
 */
function writeJSFile(result, dest, options, callback) {
    mkdirp(path.dirname(dest), function (errr) {
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

/**
 * Minify JS File
 *
 * minifyJSFile(src, dest, [options], [callback])
 *
 * callback(err, instance)
 */
exports.minifyJSFile = (function f(src, dest, options, callback) {
    options = options || defaultJSOptions;
    if (isFunction(options)) {
        f(src, dest, null, options);
    } else if (isDirSync(src)) {
        // Src is dir
        fs.readdir(src, function (err, files) {
            // Filter JS File
            files = files.filter(function (file) {
                return /\.js$/.test(file);
            });
            if (fs.existsSync(dest) && isDirSync(dest)) {
                // Dest is dir
                var taskQueue = [];
                files.forEach(function (file) {
                    taskQueue.push(function (cb) {
                        writeJSFile(UglifyJS.minify(src + path.sep + file, options), dest + path.sep + file, options, cb);
                    });
                });
                async.parallel(taskQueue, callback);

            } else {
                // Dest is file
                files = files.map(function (file) {
                    return src + path.sep + file;
                });
                writeJSFile(UglifyJS.minify(files, options), dest, options, callback);
            }
        });

    } else {
        // Src is file, dest must be file.
        if (fs.existsSync(dest) && isDirSync(dest)) {
            // Dest is Dir
            dest = dest + path.sep + path.basename(src);
        }
        writeJSFile(UglifyJS.minify(src, options), dest, options, callback);
    }

    return this;
});

/*
 *******
 * CSS *
 *******
 */
exports.minifyCSS = function (source, options, callback) {
    new CleanCSS(options).minify(source, function (error, minified) {
        (callback || emptyFunction)(error, minified.styles, minified);
    });
    return this;
};

exports.minifyCSSFile = (function f(src, dest, options, callback) {
    options = options || defaultCSSOptions;

    if (isFunction(options)) {
        return f(src, dest, null, options);
    }
    if (isDirSync(src)) {
        fs.readdir(src, function (err, files) {
            // Filter CSS File
            files = files.filter(function (file) {
                return /\.css$/.test(file);
            });
            if (fs.existsSync(dest) && isDirSync(dest)) {
                // Dest is dir
                var taskQueue = [];
                files.forEach(function (file) {
                    taskQueue.push(function (cb) {
                        f(src + path.sep + file, dest + path.sep + file, options, cb);
                    });
                });
                async.parallel(taskQueue, callback);

            } else {
                // Dest is file
                var source = '';
                files.forEach(function(file) {
                    source += fs.readFileSync(src + path.sep + file, 'utf-8');
                });
                
                new CleanCSS(options).minify(source, function (error, minified) {
                    if (error) {
                        throw error;
                    }
                    fs.writeFile(dest, minified.styles, 'utf-8', callback);
                });
            }
        });
    } else {
        // Src is File
        mkdirp(path.dirname(dest), function (err) {
            fs.readFile(src, 'utf-8', function (err, data) {
                new CleanCSS(options).minify(data, function (error, minified) {
                    if (error) {
                        throw error;
                    }
                    fs.writeFile(dest, minified.styles, 'utf-8', callback);
                });
            });
        });
    }
    return this;
});