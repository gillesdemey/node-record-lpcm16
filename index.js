'use strict'

const assert = require('assert')
const debug = require('debug')('record')
const { spawn } = require('child_process')

class Recording {
  constructor (options = {}) {
    const defaults = {
      sampleRate: 16000,
      channels: 1,
      compress: false,
      threshold: 0.5,
      thresholdStart: null,
      thresholdEnd: null,
      silence: '1.0',
      recordProgram: 'rec'
    }

    this.options = options = Object.assign(defaults, options)

    // Capture audio stream
    let cmd, cmdArgs, cmdOptions

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
          '-c', options.channels,   // channels
          '-e', 'signed-integer',   // sample encoding
          '-b', '16',               // precision (bits)
          '-t', 'wav',              // audio type
          '-',                      // pipe
          // end on silence
          'silence', '1', '0.1', options.thresholdStart || options.threshold + '%',
          '1', options.silence, options.thresholdEnd || options.threshold + '%'
        ]
        break
      // On some systems (RasPi), arecord is the prefered recording binary
      case 'arecord':
        cmd = 'arecord'
        cmdArgs = [
          '-q',                     // show no progress
          '-r', options.sampleRate, // sample rate
          '-c', options.channels,   // channels
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

    this.cmd = cmd
    this.cmdArgs = cmdArgs
    this.cmdOptions = cmdOptions

    debug(`Started recording`)
    debug(this.options)
    debug(` ${cmd} ${cmdArgs.join(' ')}`)

    return this.start()
  }

  start () {
    const { cmd, cmdArgs, cmdOptions } = this

    const cp = spawn(cmd, cmdArgs, cmdOptions)
    const rec = cp.stdout

    this.process = cp // expose child process
    this._stream = rec // expose output stream

    rec.on('data', chunk => {
      debug(`Recording ${chunk.length} bytes`)
    })

    rec.on('end', () => {
      debug('Recording ended')
    })

    return this
  }

  stop () {
    assert(this.process, 'Recording not yet started')

    this.process.kill()
  }

  pause () {
    assert(this.process, 'Recording not yet started')

    this.process.kill('SIGSTOP')
    this._stream.pause()
    debug('Paused recording')
  }

  resume () {
    assert(this.process, 'Recording not yet started')

    this.process.kill('SIGCONT')
    this._stream.resume()
    debug('Resumed recording')
  }

  isPaused () {
    assert(this.process, 'Recording not yet started')

    return this._stream.isPaused()
  }

  stream () {
    assert(this._stream, 'Recording not yet started')

    return this._stream
  }
}

module.exports = {
  record: (...args) => new Recording(...args)
}
