var buildKit = require('../index.js');

console.log(__dirname);

buildKit.minifyJSFile(__dirname+'/src/jquery/jquery.js', __dirname+'/build/jquery/jquery.min.js');