'use strict';

var _        = require('lodash'),
    spawn    = require('child_process').spawn,
    stream   = require('stream');


var recording, // Will hold our passthrough audio stream
    rec;       // Recording process

// returns a Readable stream
exports.start = function (options) {
  recording = new stream.PassThrough(); // Create the passthrough audio stream
  rec = null; // Empty out possibly dead recording process

  var defaults = {
    sampleRate : 16000,
    compress   : false,
    threshold  : 0.5,
    verbose    : false
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

  if (options.verbose)
    console.log('Recording with sample rate', options.sampleRate + '...');

  // Spawn audio capture command
  rec = spawn(cmd, cmdArgs);

  if (options.verbose)
    console.time('End Recording');

  // Set stdout to binary encoding
  rec.stdout.setEncoding('binary');

  // Fill recording stream with stdout
  rec.stdout.on('data', function (data) {

    if (options.verbose)
      console.log('Recording %d bytes', data.length);

    recording.write(new Buffer(data, 'binary')); // convert to binary buffer
  });

  // Verbose ending
  rec.stdout.on('end', function () {

    if (options.verbose)
      console.timeEnd('End Recording');

    recording.end();
  });

  return recording;

};

exports.stop = function () {
  if (typeof rec === 'undefined')
  {
    console.log('Please start a recording first');
    return false;
  }

 rec.kill(); // Exit the spawned process, exit gracefully
 return recording;
};