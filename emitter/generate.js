import fs from "fs";
import * as WavEncoder from "wav-encoder";

const sampleRate = 44100;
const bitDuration = 0.12;
const f0 = 12500;
const f1 = 14500;
const volume = 0.8;

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
function encode(bitString) {
  const chunks = [];

  // PREÁMBULO: 6 bits de "1"
  for (let i = 0; i < 6; i++) {
    chunks.push(tone(f1, bitDuration));
  }

  // DATOS (bits directos, NO ASCII)
  for (const b of bitString) {
    chunks.push(tone(b === "1" ? f1 : f0, bitDuration));
  }

  // FIN: 3 bits de 0
  for (let i = 0; i < 3; i++) {
    chunks.push(tone(f0, bitDuration));
  }

  return concatFloat32(chunks);
}

// ---------- MAIN ----------
async function main() {
  fs.mkdirSync("tones", { recursive: true });

  // PRUEBA CONTROLADA
  const payload = "10101010";
  const audio = encode(payload);

  console.log("Samples:", audio.length);
  console.log("Duration:", (audio.length / sampleRate).toFixed(2), "s");

  const wavData = {
    sampleRate,
    channelData: [audio]
  };

  const buffer = await WavEncoder.encode(wavData);
  fs.writeFileSync("tones/test.wav", Buffer.from(buffer));

  console.log("✔ WAV generado correctamente");
}

main().catch(console.error);
