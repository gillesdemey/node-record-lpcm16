'use strict'

const assert = require('assert')
const debug = require('debug')('record')
const { spawn } = require('child_process')

const recorders = {
  rec: require('./recorders/rec'),
  sox: require('./recorders/sox')
}

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
    let cmdOptions

    // Spawn audio capture command
    cmdOptions = { encoding: 'binary' }
    if (options.device) {
      cmdOptions.env = Object.assign({}, process.env, { AUDIODEV: options.device })
    }

    this.cmd = options.recordProgram
    this.cmdArgs = recorders[options.recordProgram](this.options)
    this.cmdOptions = cmdOptions

    debug(`Started recording`)
    debug(this.options)
    debug(` ${this.cmd} ${this.cmdArgs.join(' ')}`)

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
