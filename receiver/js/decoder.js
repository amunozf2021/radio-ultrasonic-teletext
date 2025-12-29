const FREQS = [8000, 10000, 12000, 12500, 13500, 14500];

function detectFrequencies(data, sampleRate, fftSize) {
  const binHz = sampleRate / fftSize;
  let out = "";

  for (const f of FREQS) {
    const i = Math.round(f / binHz);
    out += `${(f/1000).toFixed(1)} kHz : ${data[i].toFixed(1)} dB\n`;
  }

  document.getElementById("screen").innerText = out;
}
