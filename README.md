Record 16-bit WAVE audio with Node.js
===============

## Description

Records a 16-bit signed-integer linear pulse modulation code WAV audio file.

This module uses Node.js streams to minimize memory usage and optimize speed, perfect for embedded devices and "the internet of things".

These audio files are fully compatible with both the [Google Speech to Text API (v2)](https://github.com/gillesdemey/google-speech-v2) and the [Wit.ai Speech API](https://wit.ai/docs/api#span-classtitle-verb-postspeech).

Don't like streams? Nostalgic for Ye Olde Callbacks?

Check out the [no-streams branch](https://github.com/gillesdemey/node-record-lpcm16/tree/no-streams) for all your callback needs.

## Installation

`npm install node-record-lpcm16`

## Dependencies

Generally, running `npm install` should suffice.

This module however, requires you to install [SoX](http://sox.sourceforge.net).

### For Mac OS
`brew install sox`

### For most linux disto's
`sudo apt-get install sox libsox-fmt-all`

### For Windows
[download the binaries](http://sourceforge.net/projects/sox/files/latest/download)

## Options

```
sampleRate : 16000, // audio sample rate
threshold  : 0.5,   // silence threshold
verbose    : false  // log info to the console
```

## Usage

```javascript
var record = require('node-record-lpcm16'),
    fs     = require('fs');

var file = fs.createWriteStream('test.wav', { encoding: 'binary' });

record.start({
  sampleRate : 44100,
  verbose : true
})
.pipe(file);
```

The library will automatically attempt to stop when it encounters silence, if not you can stop the recording manually.

```javascript
var record = require('../index.js'),
    fs     = require('fs');

var file = fs.createWriteStream('test.wav', { encoding: 'binary' });

record.start();

// Stop recording after three seconds and write to file
setTimeout(function () {
  record.stop().pipe(file);
}, 3000);
```
This module uses Node.js streams, if you're unfamiliar with them I'd suggest reading Substack's excellent [stream handbook](https://github.com/substack/stream-handbook).

## Example

Here's how you can write your own Siri in just 10 lines of code.

```javascript
var rec       = require('node-record-lpcm16'),
    request   = require('request');

var witToken = process.env.WIT_TOKEN; // get one from wit.ai!

exports.parseResult = function (err, resp, body) {
  console.log(body);
};

rec.start().pipe(request.post({
  'url'     : 'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json',
  'headers' : {
    'Accept'        : 'application/vnd.wit.20160202+json',
    'Authorization' : 'Bearer ' + witToken,
    'Content-Type'  : 'audio/wav'
  }
}, exports.parseResult));
```
