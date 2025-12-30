import fs from "fs";
import * as WavEncoder from "wav-encoder";

const sampleRate = 44100;
const bitDuration = 0.12;
const freq = 13000;
const volume = 0.8;

function tone(duration) {
  const samples = Math.floor(sampleRate * duration);
  const buffer = new Float32Array(samples);
  for (let i = 0; i < samples; i++) {
    buffer[i] = Math.sin(2 * Math.PI * freq * (i / sampleRate)) * volume;
  }
  return buffer;
}

function silence(duration) {
  return new Float32Array(Math.floor(sampleRate * duration));
}

function concat(buffers) {
  let total = 0;
  buffers.forEach(b => total += b.length);
  const out = new Float32Array(total);
  let off = 0;
  buffers.forEach(b => {
    out.set(b, off);
    off += b.length;
  });
  return out;
}

function encode(bits) {
  const chunks = [];

  // PREÁMBULO: 5 unos
  for (let i = 0; i < 5; i++) chunks.push(tone(bitDuration));

  for (const b of bits) {
    if (b === "1") chunks.push(tone(bitDuration));
    else chunks.push(silence(bitDuration));
  }

  return concat(chunks);
}

async function main() {
  fs.mkdirSync("tones", { recursive: true });

  const payload = "10101010";
  const audio = encode(payload);

  console.log("Duration:", (audio.length / sampleRate).toFixed(2), "s");

  const buffer = await WavEncoder.encode({
    sampleRate,
    channelData: [audio]
  });

  fs.writeFileSync("tones/test.wav", Buffer.from(buffer));
  console.log("✔ WAV generado");
}

main().catch(console.error);
