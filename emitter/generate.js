import fs from "fs";
import * as WavEncoder from "wav-encoder";

const sampleRate = 44100;
const bitDuration = 0.1;
const f0 = 12500;
const f1 = 14500;
const volume = 0.3;

// ---------- CRC-8 ----------
function crc8(str) {
  let crc = 0x00;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i);
    for (let b = 0; b < 8; b++) {
      crc = (crc & 0x80) ? ((crc << 1) ^ 0x07) : (crc << 1);
      crc &= 0xff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(2, "0");
}

// ---------- TONE ----------
function tone(freq, duration) {
  const samples = Math.floor(sampleRate * duration);
  const buffer = new Float32Array(samples);
  for (let i = 0; i < samples; i++) {
    buffer[i] = Math.sin(2 * Math.PI * freq * (i / sampleRate)) * volume;
  }
  return buffer;
}

// ---------- CONCAT ----------
function concatFloat32(buffers) {
  let total = 0;
  for (const b of buffers) total += b.length;

  const result = new Float32Array(total);
  let offset = 0;
  for (const b of buffers) {
    result.set(b, offset);
    offset += b.length;
  }
  return result;
}

// ---------- ENCODE ----------
function encode(text) {
  const chunks = [];

  chunks.push(tone(f1, 0.5)); // preámbulo

  for (const c of text) {
    const bits = c.charCodeAt(0).toString(2).padStart(8, "0");
    for (const b of bits) {
      chunks.push(tone(b === "1" ? f1 : f0, bitDuration));
    }
  }

  chunks.push(tone(f0, 0.3)); // fin
  return concatFloat32(chunks);
}

// ---------- MAIN ----------
async function main() {
  fs.mkdirSync("tones", { recursive: true });

  const payload = "P120";
  const frame = `${payload}|${crc8(payload)}`;
  const audio = encode(frame);

  console.log("Samples:", audio.length);
  console.log("Duration:", (audio.length / sampleRate).toFixed(2), "s");

  const wavData = {
    sampleRate,
    channelData: [audio]   // 🔴 ESTA ES LA CLAVE
  };

  const buffer = await WavEncoder.encode(wavData);
  fs.writeFileSync("tones/P120.wav", Buffer.from(buffer));

  console.log("✔ WAV generado correctamente");
}

main().catch(console.error);
