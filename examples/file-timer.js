'use strict';

var record = require('../index.js'),
    fs     = require('fs');

var file = fs.createWriteStream('test.wav', { encoding: 'binary' });

record.start();

// Stop recording after three seconds and write to file
setTimeout(function () {
  record.stop().pipe(file);
}, 3000);
