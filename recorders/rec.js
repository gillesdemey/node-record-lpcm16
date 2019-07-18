module.exports = (options) => {
  const args = [
    '-q', // show no progress
    '-r', options.sampleRate, // sample rate
    '-c', options.channels, // channels
    '-e', 'signed-integer', // sample encoding
    '-b', '16', // precision (bits)
    '-t', 'wav', // audio type
    '-', // pipe
    // end on silence
    'silence', '1', '0.1', options.thresholdStart || options.threshold + '%',
    '1', options.silence, options.thresholdEnd || options.threshold + '%'
  ]

  return args
}
