const FREQ = 13000;
const BIT_MS = 120;

const MIN_DB = -50;
const NOISE_DB = -80;

let lastTime = 0;
let bits = "";
let state = "idle";

function bitsToAscii(bitString) {
  let out = "";
  for (let i = 0; i + 7 < bitString.length; i += 8) {
    const byte = bitString.slice(i, i + 8);
    out += String.fromCharCode(parseInt(byte, 2));
  }
  return out;
}

function reset() {
  bits = "";
  state = "idle";
}

function detectFrequencies(data, sampleRate, fftSize) {
  const now = performance.now();
  if (now - lastTime < BIT_MS) return;
  lastTime = now;

  const bin = sampleRate / fftSize;
  const power = data[Math.round(FREQ / bin)];

  // 🚫 sin señal
  if (power < NOISE_DB) {
    reset();
    return;
  }

  const bit = power > MIN_DB ? "1" : "0";

  // ---------- MÁQUINA DE ESTADOS ----------
  if (state === "idle") {
    bits += bit;
    if (bits.endsWith("111111")) {
      bits = "";
      state = "data";
    }
    return;
  }

  if (state === "data") {
    bits += bit;

    // cada byte completo
    if (bits.length % 8 === 0) {
      const text = bitsToAscii(bits);
      document.getElementById("screen").innerText = text;
    }
  }
}
