var uglify = require('uglify-js');
var fs = require('fs');

function compressJS() {
  new Promise((resolve, reject) => {
    fs.stat('app.js', function(err) {
      const prefix = err ? 'client/app/js/' : '';

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

      Promise.all([
        new Promise((res, rej) => {
          fs.writeFile('app.min.js', result.code.toString(), function(err) {
            if (err) {
              console.log('Error:', err);
              rej();
            } else {
              console.log('Javascript Successfully Compressed!');
              res();
            }
          });
        }),

        new Promise((res, rej) => {
          fs.writeFile(
            'app.min.js.map',
            result.map.toString().replace(/public/g, ''),
            function(err) {
              if (err) {
                console.log('Error:', err);
                rej();
              } else {
                console.log('Map Successfully Output!');
                res();
              }
            }
          );
        })
      ])
        .then(resolve)
        .catch(reject);
    });
  });
}

compressJS();
