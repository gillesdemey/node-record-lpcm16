'use strict';

var _        = require('lodash-node'),
    spawn    = require('child_process').spawn,
    stream   = require('stream');

// returns a Readable stream
exports.record = function (options) {

  var recording = new stream.Readable(); // Create the readable audio stream

  var defaults = {
    sampleRate : 16000,
    compress   : false,
    threshold  : 0.1
  };

  options = _.extend(defaults, options);

  // Capture audio stream
  var cmd = 'rec';
  var cmdArgs = [
    '-q',                     // show no progress
    '-r', '16000',            // sample rate
    '-c', '1',                // channels
    '-e', 'signed-integer',   // sample encoding
    '-b', '16',               // precision (bits)
    '-t', 'wav',              // audio type
    '-',                      // pipe
                              // end on silence
    'silence', '1','0.1', options.threshold + '%',
               '1','1.0', options.threshold + '%'
  ];

  console.log('Recording with sample rate', options.sampleRate + '...');

  // Spawn audio capture command
  var rec = spawn(cmd, cmdArgs);

  // Set stdout to binary encoding
  rec.stdout.setEncoding('binary');

  // Fill recording stream with stdout
  rec.stdout.on('data', function (data) {
    console.log('Recording...', data.length);
    recording.push(new Buffer(data, 'binary')); // convert to binary buffer
  });

  // Verbose ending
  rec.stdout.on('end', function () {
    console.log('done');
  });

  recording._read = function () {

  };

  return recording;

};