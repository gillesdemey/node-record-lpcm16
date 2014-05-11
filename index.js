var _      = require('lodash-node'),
    zlib   = require('zlib'),
    spawn  = require('child_process').spawn;

exports.record = function (options, callback) {

  var recording = '';

  var defaults = {
    sampleRate: 16000,
    compress: false
  };

  options = _.merge(options, defaults);

  // capture audio stream
  var cmd = 'sox';
  var cmdArgs = [
    '-q',
    '-b','16',
    '-d','-t','wav','-',
    'rate','16000','channels','1',
    'silence','1','0.1',(options.threshold || '0.1')+'%','1','1.0',(options.threshold || '0.1')+'%'
  ];

  console.log('Recording...');

  var rec = spawn(cmd, cmdArgs, 'pipe');

  // process stdout
  rec.stdout.setEncoding('binary');
  rec.stdout.on('data', function (data) {
    console.log('Receiving data...');
    recording += data;
  });

  // exit recording
  rec.on('close', function (code) {
    var buff = new Buffer(recording, 'binary');
    callback(null, buff);
  });

};

exports.compress = function (input, callback) {

  console.log('Compressing...');
  console.time('Compressed');

  zlib.gzip(input, function (err, result) {

    console.timeEnd('Compressed');
    console.log('Compressed size:', result.length, 'bytes');

    if (err) callback(err);

    callback(null, result);

  });

};