'use strict'

var record = require('../')
var fs = require('fs')

var file = fs.createWriteStream('test.wav', { encoding: 'binary' })

record.start().pipe(file)

// Stop recording after three seconds and write to file
setTimeout(function () {
  record.stop()
}, 3000)
