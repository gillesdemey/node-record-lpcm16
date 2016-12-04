var rec = require('../')
var request = require('request')

var witToken = process.env.WIT_TOKEN // get one from wit.ai!

exports.parseResult = function (err, resp, body) {
  if (err) console.error(err)
  console.log(body)
}

rec.start({
  verbose: true,
  recordProgram: 'arecord'
}).pipe(request.post({
  'url': 'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json',
  'headers': {
    'Accept': 'application/vnd.wit.20160202+json',
    'Authorization': 'Bearer ' + witToken,
    'Content-Type': 'audio/wav'
  }
}, exports.parseResult))

setTimeout(function () { rec.stop() }, 3000) // Stop after 2 seconds of recording
