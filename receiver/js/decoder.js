const F0 = 12500;
const F1 = 14500;
const THRESHOLD = -45;
const BIT_MS = 120;

let last = 0;
let bits = "";

function detectFrequencies(data, sampleRate, fftSize) {
  const now = performance.now();
  if (now - last < BIT_MS) return;

  const bin = sampleRate / fftSize;
  const p0 = data[Math.round(F0 / bin)];
  const p1 = data[Math.round(F1 / bin)];

  if (p1 > THRESHOLD && p1 > p0 + 6) bits += "1";
  else if (p0 > THRESHOLD && p0 > p1 + 6) bits += "0";

  last = now;
  document.getElementById("screen").innerText = bits;
}
