'use strict'

var spawn = require('child_process').spawn

var cp // Recording process

// returns a Readable stream
exports.start = function (options) {
  cp = null // Empty out possibly dead recording process

  var defaults = {
    sampleRate: 16000,
    compress: false,
    threshold: 0.5,
    verbose: false,
    recordProgram: 'rec'
  }

  options = Object.assign(defaults, options)

  // Capture audio stream
  var cmd, cmdArgs, cmdOptions
  switch (options.recordProgram) {
    // On some Windows machines, sox is installed using the "sox" binary
    // instead of "rec"
    case 'sox':
    case 'rec':
    default:
      cmd = options.recordProgram
      cmdArgs = [
        '-q',                     // show no progress
        '-r', options.sampleRate, // sample rate
        '-c', '1',                // channels
        '-e', 'signed-integer',   // sample encoding
        '-b', '16',               // precision (bits)
        '-t', 'wav',              // audio type
        '-',                      // pipe
            // end on silence
        'silence', '1', '0.1', options.threshold + '%',
        '1', '1.0', options.threshold + '%'
      ]
      break
    // On some systems (RasPi), arecord is the prefered recording binary
    case 'arecord':
      cmd = 'arecord'
      cmdArgs = [
        '-q',                     // show no progress
        '-r', options.sampleRate, // sample rate
        '-c', '1',                // channels
        '-t', 'wav',              // audio type
        '-f', 'S16_LE',           // Sample format
        '-'                       // pipe
      ]
      if (options.device) {
        cmdArgs.unshift('-D', options.device)
      }
      break
  }

  // Spawn audio capture command
  cmdOptions = { encoding: 'binary' }
  if (options.device) {
    cmdOptions.env = Object.assign({}, process.env, { AUDIODEV: options.device })
  }
  cp = spawn(cmd, cmdArgs, cmdOptions)
  var rec = cp.stdout

  if (options.verbose) {
    console.log('Recording with sample rate', options.sampleRate + '...')
    console.time('End Recording')

    rec.on('data', function (data) {
      console.log('Recording %d bytes', data.length)
    })

    rec.on('end', function () {
      console.timeEnd('End Recording')
    })
  }

  return rec
}

exports.stop = function () {
  if (!cp) {
    console.log('Please start a recording first')
    return false
  }

  cp.kill() // Exit the spawned process, exit gracefully
  return cp
}
