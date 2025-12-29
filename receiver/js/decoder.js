const F0 = 12500;
const F1 = 14500;
const THRESHOLD = -45;
const MIN_CHANGE_MS = 80;

let lastTone = null;
let lastChange = 0;
let bits = "";

function detectFrequencies(data, sampleRate, fftSize) {
  const now = performance.now();
  const bin = sampleRate / fftSize;

  const p0 = data[Math.round(F0 / bin)];
  const p1 = data[Math.round(F1 / bin)];

  let tone = null;
  if (p1 > THRESHOLD && p1 > p0 + 6) tone = "1";
  else if (p0 > THRESHOLD && p0 > p1 + 6) tone = "0";
  else return;

  // solo registrar cambio de tono
  if (tone !== lastTone && now - lastChange > MIN_CHANGE_MS) {
    bits += tone;
    lastTone = tone;
    lastChange = now;
  }

  document.getElementById("screen").innerText = bits;
}
