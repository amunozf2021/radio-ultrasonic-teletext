const F0 = 12500;
const F1 = 14500;
const THRESHOLD = -50;
const BIT_MS = 120;   // ventana estable

let lastSampleTime = 0;
let bits = "";

function detectFrequencies(data, sampleRate, fftSize) {
  const now = performance.now();
  if (now - lastSampleTime < BIT_MS) return;
  lastSampleTime = now;

  const bin = sampleRate / fftSize;
  const p0 = data[Math.round(F0 / bin)];
  const p1 = data[Math.round(F1 / bin)];

  let bit = null;
  if (p1 > THRESHOLD && p1 > p0 + 6) bit = "1";
  else if (p0 > THRESHOLD && p0 > p1 + 6) bit = "0";
  else return;

  bits += bit;
  document.getElementById("screen").innerText = bits;
}
