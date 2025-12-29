const TARGET_FREQS = [18000, 18500, 19000, 19500];

function detectFrequencies(data, sampleRate, fftSize) {
  const binHz = sampleRate / fftSize;

  let output = "";

  for (const f of TARGET_FREQS) {
    const index = Math.round(f / binHz);
    const power = data[index];
    output += `${f / 1000}kHz: ${power.toFixed(1)} dB\n`;
  }

  document.getElementById("screen").innerText = output;
}
