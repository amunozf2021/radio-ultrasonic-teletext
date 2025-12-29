import fs from "fs";
import wav from "wav";

const sampleRate = 44100;
const bitDuration = 0.07;
const f0 = 18500;
const f1 = 19500;

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

function tone(freq, duration) {
  const samples = Math.floor(sampleRate * duration);
  const buffer = new Float32Array(samples);
  for (let i = 0; i < samples; i++) {
    buffer[i] = Math.sin(2 * Math.PI * freq * (i / sampleRate)) * 0.25;
  }
  return buffer;
}

function encode(text) {
  let data = [];
  data.push(tone(f1, 0.5));
  for (const c of text) {
    const bits = c.charCodeAt(0).toString(2).padStart(8, "0");
    for (const b of bits) {
      data.push(tone(b === "1" ? f1 : f0, bitDuration));
    }
  }
  data.push(tone(f0, 0.3));
  return Float32Array.from(data.flat());
}

const payload = "P120";
const frame = `${payload}|${crc8(payload)}`;

const writer = new wav.FileWriter("tones/P120.wav", {
  sampleRate,
  channels: 1,
  bitDepth: 16
});

const audio = encode(frame);
audio.forEach(s => writer.write(Buffer.from(Int16Array.of(s * 32767).buffer)));
writer.end();
