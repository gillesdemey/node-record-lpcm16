'use strict'

var record = require('../')
var fs = require('fs')

var file = fs.createWriteStream('test.wav', { encoding: 'binary' })

record.start({
  sampleRate: 44100,
  verbose: true
})
.pipe(file)
