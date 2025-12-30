const F0 = 12500;
const F1 = 14500;

const BIT_MS = 120;
const MIN_POWER_DB = -55;
const MIN_RATIO = 1.15;

let state = "idle";
let bits = "";
let lastBitTime = 0;

const GAIN_0 = 1.0;   // para 12.5 kHz
const GAIN_1 = 1.8;   // para 14.5 kHz (más atenuada)

function detectFrequencies(data, sampleRate, fftSize) {
  const now = performance.now();
  const bin = sampleRate / fftSize;

  const p0db = data[Math.round(F0 / bin)];
  const p1db = data[Math.round(F1 / bin)];

  // GATE: si no hay señal, reset
  if (p0db < MIN_POWER_DB && p1db < MIN_POWER_DB) {
    if (state !== "idle") reset();
    return;
  }

  // decidir bit dominante
  const p0 = Math.pow(10, p0db / 10) * GAIN_0;
  const p1 = Math.pow(10, p1db / 10) * GAIN_1;

  let bit = null;
  if (p1 / p0 > MIN_RATIO) bit = "1";
  else if (p0 / p1 > MIN_RATIO) bit = "0";
  else return;

  // ⏱️ muestrear SOLO una vez por BIT
  if (now - lastBitTime < BIT_MS) return;
  lastBitTime = now;

  // ----- MÁQUINA DE ESTADOS -----
  if (state === "idle") {
    if (bit === "1") {
      bits = "1";
      state = "preamble";
    }
    return;
  }

  if (state === "preamble") {
    bits += bit;
    if (bits.endsWith("111111")) {
      bits = "";
      state = "data";
    }
    return;
  }

  if (state === "data") {
    bits += bit;
    document.getElementById("screen").innerText = bits;
  }
}

function reset() {
  state = "idle";
  bits = "";
  lastBitTime = 0;
}
