var uglify = require('uglify-js');
var fs = require('fs');
const prefix = fs.statSync('app.js') ? '' : 'client/app/js/';

function compressJS() {
  var result = uglify.minify(
    [
      prefix + 'app.js',
      prefix + 'services/*',
      prefix + 'controllers/*',
      prefix + 'interceptors/*'
    ],
    {
      outSourceMap: prefix + 'app.min.js.map'
    }
  );

  fs.writeFile('app.min.js', result.code.toString(), function(err) {
    if (err) {
      console.log('Error:', err);
    } else {
      console.log('Javascript Successfully Compressed!');
    }
  });

  fs.writeFile(
    'app.min.js.map',
    result.map.toString().replace(/public/g, ''),
    function(err) {
      if (err) {
        console.log('Error:', err);
      } else {
        console.log('Map Successfully Output!');
      }
    }
  );
}

compressJS();
