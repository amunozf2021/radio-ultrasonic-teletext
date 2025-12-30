import fs from "fs";
import * as WavEncoder from "wav-encoder";

// ================== CONFIGURACIÓN ==================
const sampleRate = 44100;
const bitDuration = 0.12;     // 120 ms por bit (DEBE coincidir con el decoder)
const freq = 13000;           // frecuencia única (ASK)
const volume = 0.8;           // alto para pruebas

// ================== GENERADORES ==================
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
  for (const b of buffers) total += b.length;

  const out = new Float32Array(total);
  let offset = 0;
  for (const b of buffers) {
    out.set(b, offset);
    offset += b.length;
  }
  return out;
}

// ================== ENCODER ==================
function encode(text) {
  const chunks = [];

  // -------- PREÁMBULO (6 bits de "1") --------
  for (let i = 0; i < 6; i++) {
    chunks.push(tone(bitDuration));
  }

  // -------- DATOS ASCII --------
  for (const c of text) {
    const bits = c.charCodeAt(0).toString(2).padStart(8, "0");
    for (const b of bits) {
      if (b === "1") chunks.push(tone(bitDuration));
      else chunks.push(silence(bitDuration));
    }
  }

  // -------- FIN (3 ceros) --------
  for (let i = 0; i < 3; i++) {
    chunks.push(silence(bitDuration));
  }

  return concat(chunks);
}

// ================== MAIN ==================
async function main() {
  fs.mkdirSync("tones", { recursive: true });

  // 🔤 MENSAJE A EMITIR
  const payload = "P120";   // cambia aquí el comando
  const audio = encode(payload);

  console.log("Samples:", audio.length);
  console.log(
      "Duration:",
      (audio.length / sampleRate).toFixed(2),
      "s"
  );

  const wavBuffer = await WavEncoder.encode({
    sampleRate,
    channelData: [audio]
  });

  fs.writeFileSync("tones/output.wav", Buffer.from(wavBuffer));
  console.log("✔ WAV generado: tones/output.wav");
}

main().catch(console.error);
