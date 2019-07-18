'use strict'

const recorder = require('../')
const fs = require('fs')

const file1 = fs.createWriteStream('test.sox.wav', { encoding: 'binary' })
const file2 = fs.createWriteStream('test.rec.wav', { encoding: 'binary' })

const sox = recorder.record({ recorder: 'sox' })
const rec = recorder.record({ recorder: 'rec' })

sox.stream()
  .pipe(file1)

rec.stream()
  .pipe(file2)

// Stop recording after three seconds and write to file
setTimeout(() => {
  sox.stop()
  rec.stop()
}, 2000)
