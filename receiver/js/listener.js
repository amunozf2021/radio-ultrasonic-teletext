let ctx, analyser, buffer;

document.getElementById("start").onclick = async () => {
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const src = ctx.createMediaStreamSource(stream);
  analyser = ctx.createAnalyser();
  analyser.fftSize = 16384;
  analyser.smoothingTimeConstant = 0;
  src.connect(analyser);
  buffer = new Float32Array(analyser.frequencyBinCount);
  listen();
};

function listen() {
  analyser.getFloatFrequencyData(buffer);
  detectFrequencies(buffer, ctx.sampleRate, analyser.fftSize);
  requestAnimationFrame(listen);
}
