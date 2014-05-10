var _   = require('lodash-node'),
 zlib   = require('zlib'),
 fs     = require('fs'),
 exec   = require('child_process').exec,
 format = require('wheatley-formatters');

exports.record = function (options, callback) {

  var defaults = {
    bits: 16,
    sampleRate: 16000,
    compress: false
  };

  options = _.merge(options, defaults);

  // capture audio stream
  var cmd = 'rec --encoding signed-integer --bits 16 --channels 1 --rate 16000 -p silence 1 0.50 0.1% 1 00:01 0.1% | sox -p --encoding signed-integer --bits 16 -t wav - ';
  // cmd = util.format(cmd, options.bits, options.sampleRate, file);

  console.log('Recording...');

  exec(cmd, function (err, stdout, stderr) {

    if (err) callback(err);

    // TODO: make sure not to pass the 15 seconds threshold

    var buff = new Buffer(stdout);
    console.log('Uncompressed buffer size:', format.bytes(buff.length));

    var shouldCompress = options.compress;

    if (!shouldCompress) {
      callback(null, buff);
      return;
    }

    exports.compress(buff, function (err, compressed) {
      if (err) callback(err);
      callback(null, compressed);
    });

  });

};

exports.compress = function (input, callback) {

  console.log('Compressing...');
  console.time('Compressed');

  zlib.gzip(input, function (err, result) {

    console.timeEnd('Compressed');
    console.log('Compressed size:', format.bytes(result.length));

    if (err) callback(err);

    callback(null, result);

  });

};