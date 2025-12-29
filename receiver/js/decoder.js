const F0 = 18500;
const F1 = 19500;
const THRESHOLD = -65;
const BIT_MS = 50;

let state = "idle";
let bits = "";
let lastBitTime = 0;
let lastCommand = "";
let lastCommandTime = 0;

function crc8(str) {
  let crc = 0x00;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i);
    for (let b = 0; b < 8; b++) {
      crc = (crc & 0x80) ? ((crc << 1) ^ 0x07) : (crc << 1);
      crc &= 0xFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(2, "0");
}

function detectFrequencies(data, sampleRate, fftSize) {
  const now = performance.now();
  if (now - lastBitTime < BIT_MS) return;

  const bin = sampleRate / fftSize;
  const i0 = Math.round(F0 / bin);
  const i1 = Math.round(F1 / bin);

  const p0 = data[i0];
  const p1 = data[i1];

  let bit = null;
  if (p1 > THRESHOLD && p1 > p0 + 8) bit = "1";
  if (p0 > THRESHOLD && p0 > p1 + 8) bit = "0";
  if (!bit) return;

  lastBitTime = now;

  if (state === "idle") {
    if (bit === "1") {
      bits = "1";
      state = "preamble";
    }
    return;
  }

  bits += bit;

  if (state === "preamble" && bits.endsWith("111111")) {
    bits = "";
    state = "sync";
    return;
  }

  if (state === "sync" && bits.length === 8) {
    if (bits === "10101010") {
      bits = "";
      state = "data";
    } else {
      reset();
    }
    return;
  }

  if (state === "data" && bits.length >= 48) {
    decodeBits(bits);
    reset();
  }
}

function decodeBits(bitstream) {
  let text = "";
  for (let i = 0; i < bitstream.length; i += 8) {
    const byte = bitstream.slice(i, i + 8);
    text += String.fromCharCode(parseInt(byte, 2));
  }
  handleCommandSafe(text.trim());
}

function handleCommandSafe(cmd) {
  const parts = cmd.split("|");
  if (parts.length !== 2) return;
  const payload = parts[0];
  if (crc8(payload) !== parts[1]) return;

  const now = Date.now();
  if (payload === lastCommand && now - lastCommandTime < 3000) return;

  lastCommand = payload;
  lastCommandTime = now;
  handleCommand(payload);
}

function reset() {
  bits = "";
  state = "idle";
}
