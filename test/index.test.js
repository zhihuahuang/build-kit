var buildKit = require('../index.js');

describe('minifyJPEG', function() {
   

    it('minifyJPEG',  function(){
        var src = './test/images/a.jpg';
        var dest = './test/test.jpg';
    
        console.log('start');
    
        buildKit.minifyJPEG(src, dest, {quality: 90}, function(){
            console.log('finish');
        });
    });
    
//    src = 'test/images/';
//    dest = 'test/build/images';
//    
//    it('minifyJPEG '+src+' to '+dest, function(){
//        buildKit.minifyJPEG(src, dest, {quality: 90}, function(){
//        });
//    });
});

//
//        
//    var src = './test/images/a.jpg';
//    var dest = './test/test.jpg';
//    
//    buildKit.minifyJPEG(src, dest, {quality: 90}, function(){
//        });