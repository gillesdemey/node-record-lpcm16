module.exports = (options) => {
  const args = [
    '--default-device',
    '--no-show-progress', // show no progress
    '--rate', options.sampleRate, // sample rate
    '--channels', options.channels, // channels
    '--encoding', 'signed-integer', // sample encoding
    '--bits', '16', // precision (bits)
    '--type', 'wav', // audio type
    '-', // pipe
    // end on silence
    'silence', '1', '0.1', options.thresholdStart || options.threshold + '%',
    '1', options.silence, options.thresholdEnd || options.threshold + '%'
  ]

  return args
}
