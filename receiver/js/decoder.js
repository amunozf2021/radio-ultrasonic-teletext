const FREQ = 13000;
const BIT_MS = 120;

const MIN_DB = -50;        // tono presente
const NOISE_DB = -80;      // ruido máximo permitido

let lastTime = 0;
let bits = "";
let carrier = false;

function detectFrequencies(data, sampleRate, fftSize) {
  const now = performance.now();
  if (now - lastTime < BIT_MS) return;
  lastTime = now;

  const bin = sampleRate / fftSize;
  const power = data[Math.round(FREQ / bin)];

  // 🚫 NO SIGNAL: ruido puro
  if (power < NOISE_DB) {
    carrier = false;
    return;
  }

  // 📡 PORTADORA DETECTADA
  carrier = true;

  // decidir bit
  const bit = power > MIN_DB ? "1" : "0";
  bits += bit;

  document.getElementById("screen").innerText = bits;
}
