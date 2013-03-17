(function() {

  var ORG_SCALE = 32,
      svg2png = require('svg2png'),

  convertToPng = function(fileConvertInfo) {
    var fileName = fileConvertInfo.fileName;

    fileConvertInfo.scales.forEach(function(scale) {
      var inFile = fileName + '.svg',
          outFile = [fileName, '-', Math.round(ORG_SCALE*scale), '.png'].join('');

      svg2png(inFile, outFile, scale, function(err) {
        if (err) {
          console.error('Error converting to png:', err);
          return;
        }

        console.log('Converted %s to %s',inFile, outFile);
      });
    });

  };

  [{
    fileName: 'icons/file-js',
    scales: [1/2 /*16px*/, 1.5 /*48px*/, 4 /*128px*/]
  }]
  .forEach(convertToPng);

}());
