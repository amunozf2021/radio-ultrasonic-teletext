const FREQS = [16000, 16500, 16800, 17200, 17600];

function detectFrequencies(data, sampleRate, fftSize) {
  const binHz = sampleRate / fftSize;
  let out = "";

  for (const f of FREQS) {
    const i = Math.round(f / binHz);
    out += `${(f/1000).toFixed(1)} kHz: ${data[i].toFixed(1)} dB\n`;
  }

  document.getElementById("screen").innerText = out;
}