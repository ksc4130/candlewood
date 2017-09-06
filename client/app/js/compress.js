var uglify = require('uglify-js');
var fs = require('fs');

function compressJS() {
  var result = uglify.minify([
    "app.js",
    "services/*",
    "controllers/*",
    'interceptors/*'
  ], {
      outSourceMap: "app.min.js.map"
    });


  fs.writeFile('app.min.js', result.code.toString(), function (err) {
    if (err) {
      console.log('Error:', err);
    } else {
      console.log('Javascript Successfully Compressed!');
    }
  });

  fs.writeFile('app.min.js.map', result.map.toString().replace(/public/g, ''), function (err) {
    if (err) {
      console.log('Error:', err);
    } else {
      console.log('Map Successfully Output!');
    }
  });
}

compressJS();
