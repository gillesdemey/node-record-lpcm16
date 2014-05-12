'use strict';

var rec = require('../index.js'),
    fs  = require('fs');

var file = fs.createWriteStream('test.wav', { encoding: 'binary' });

rec.record({ sampleRate: 44100, verbose: true }).pipe(file);