
module.exports = (options) => {
  const cmd = 'ffmpeg';

  // FFmpeg input configuration
  // On Windows, we use DirectShow (dshow)
  // On Linux/macOS, you might use alsa or avfoundation instead.
  const inputFormat = process.platform === 'win32' ? 'dshow' :
                      process.platform === 'darwin' ? 'avfoundation' :
                      'alsa';

  // Choose the default microphone input name
  // You can override with options.device if needed
  const inputDevice = process.platform === 'win32'
    ? `audio=${options.device || 'Microphone (Realtek(R) Audio)'}`
    : options.device || 'default';

  let args = [
    '-f', inputFormat,       // input format
    '-i', inputDevice,       // input device
    '-ar', options.sampleRate.toString(), // sample rate (e.g., 16000)
    '-ac', options.channels.toString(),   // number of channels (1 for mono)
    '-acodec', 'pcm_s16le',  // 16-bit signed PCM
    '-f', options.audioType || 'wav',     // output format
    'pipe:1'                 // output to stdout (pipe)
  ];

  // Optional silence detection (only works for offline files)
  if (options.endOnSilence) {
    args = args.concat([
      '-af', `silencedetect=noise=${options.thresholdStart || options.threshold}dB:d=${options.silence || 1.0}`
    ]);
  }

  // FFmpeg doesn’t usually need special spawnOptions,
  // but we can still define it for consistency
  const spawnOptions = { stdio: ['ignore', 'pipe', 'pipe'] };

  return { cmd, args, spawnOptions };
};
