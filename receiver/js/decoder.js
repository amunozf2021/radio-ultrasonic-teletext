const FREQS = [14000, 15000, 16000, 16500, 16800, 17200, 17600];

function detectFrequencies(data, sampleRate, fftSize) {
  const binHz = sampleRate / fftSize;
  let out = "";

  for (const f of FREQS) {
    const i = Math.round(f / binHz);
    const v = data[i];
    out += `${(f/1000).toFixed(1)} kHz : ${v.toFixed(1)} dB\n`;
  }

  document.getElementById("screen").innerText = out;
}
