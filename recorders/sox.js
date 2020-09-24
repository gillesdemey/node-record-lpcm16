module.exports = (options) => {
  let cmd = 'sox'

  if (options.binPath) {
    cmd = options.binPath;
  }

  let args = [
    '--default-device',
    '--no-show-progress', // show no progress
    '--rate', options.sampleRate, // sample rate
    '--channels', options.channels, // channels
    '--encoding', 'signed-integer', // sample encoding
    '--bits', '16', // precision (bits)
    '--type', options.audioType, // audio type
    '-' // pipe
  ]

  if (options.bufferSize) {
    args.push('--buffer', options.bufferSize);
  }

  if (options.endOnSilence) {
    args = args.concat([
      'silence', '1', '0.1', options.thresholdStart || options.threshold + '%',
      '1', options.silence, options.thresholdEnd || options.threshold + '%'
    ])
  }

  if (options.arguments) {
    args = args.concat(options.arguments);
  }

  const spawnOptions = { }

  if (options.device) {
    spawnOptions.env = { ...process.env, AUDIODEV: options.device }
  }

  return { cmd, args, spawnOptions }
}
