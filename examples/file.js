'use strict';

var record = require('../index.js'),
    fs     = require('fs');

record.start({
  sampleRate : 44100,
  verbose : true
}, function (err, buffer) {
  fs.writeFile('test.wav', buffer, { encoding: 'binary' });
});