'use strict';

var record = require('../index.js'),
    fs     = require('fs');

record.start({
  sampleRate: 44100
}, function (err, buffer) {
  fs.writeFile('test.wav', buffer, { encoding: 'binary' });
});
