const FREQ = 13000;
const BIT_MS = 120;
const MIN_DB = -50;

let lastTime = 0;
let bits = "";

function detectFrequencies(data, sampleRate, fftSize) {
  const now = performance.now();
  if (now - lastTime < BIT_MS) return;
  lastTime = now;

  const bin = sampleRate / fftSize;
  const power = data[Math.round(FREQ / bin)];

  const bit = power > MIN_DB ? "1" : "0";
  bits += bit;

  document.getElementById("screen").innerText = bits;
}
