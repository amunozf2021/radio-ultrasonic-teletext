const FREQS = [12500, 13000, 13500, 14000, 14500];

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
