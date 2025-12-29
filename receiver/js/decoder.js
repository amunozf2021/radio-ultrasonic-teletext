const F0 = 12500;
const F1 = 14500;

const BIT_MS = 120;
const WINDOW = 5;

const MIN_RATIO = 1.4;      // diferencia entre tonos
const MIN_POWER_DB = -55;   // nivel mínimo absoluto (GATE)

let lastSampleTime = 0;
let windowBits = [];
let bits = "";

function detectFrequencies(data, sampleRate, fftSize) {
  const now = performance.now();
  if (now - lastSampleTime < BIT_MS / WINDOW) return;
  lastSampleTime = now;

  const bin = sampleRate / fftSize;

  const p0db = data[Math.round(F0 / bin)];
  const p1db = data[Math.round(F1 / bin)];

  // 🚫 GATE: si no hay señal suficiente, IGNORAR
  if (p0db < MIN_POWER_DB && p1db < MIN_POWER_DB) {
    return;
  }

  // pasar de dB a potencia lineal
  const p0 = Math.pow(10, p0db / 10);
  const p1 = Math.pow(10, p1db / 10);

  let sample = null;
  if (p1 / p0 > MIN_RATIO) sample = "1";
  else if (p0 / p1 > MIN_RATIO) sample = "0";
  else return; // indeciso

  windowBits.push(sample);

  if (windowBits.length === WINDOW) {
    const ones = windowBits.filter(b => b === "1").length;
    const zeros = WINDOW - ones;

    if (ones > zeros) bits += "1";
    else if (zeros > ones) bits += "0";

    windowBits = [];
    document.getElementById("screen").innerText = bits;
  }
}
