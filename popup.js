document.addEventListener("DOMContentLoaded", () => {
  const image = document.getElementById("randomIcon");

  function updateImage() {
    image.classList.add("fade-out");
    setTimeout(() => {
      const randomNum = Math.floor(Math.random() * 8) + 1;
      image.src = chrome.runtime.getURL(`morses/${randomNum}.png`);
      image.classList.remove("fade-out");
      image.classList.add("fade-in");
      setTimeout(() => {
        image.classList.remove("fade-in");
      }, 400);
    }, 400);
  }

  updateImage();
  setInterval(updateImage, 5000); // change every 5 seconds
  updateIconsState();
});

const playIconInput = document.getElementById("playMorseInput");
const saveIconInput = document.getElementById("saveMorseInput");
const playIconOutput = document.getElementById("playMorseOutput");
const saveIconOutput = document.getElementById("saveMorseOutput");

const input = document.getElementById("input");
const output = document.getElementById("output");
  
document.getElementById("playMorseInput").addEventListener("click", () => {
    const morse = document.getElementById("input").value;
    playMorse(morse);
});
  
document.getElementById("playMorseOutput").addEventListener("click", () => {
    const morse = document.getElementById("output").value;
    playMorse(morse);
});
  
document.getElementById("saveMorseInput").addEventListener("click", () => {
    const morse = document.getElementById("input").value;
    if (morse) saveMorseAsWav(morse);
});
  
document.getElementById("saveMorseOutput").addEventListener("click", () => {
    const morse = document.getElementById("output").value;
    if (morse) saveMorseAsWav(morse);
});

document.getElementById("toMorse").addEventListener("click", () => {
    const result = textToMorse(input.value);
    output.value = result;
    copyToClipboard(result);
    updateIconsState();
});

document.getElementById("toText").addEventListener("click", () => {
    const result = morseToText(input.value);
    output.value = result;
    copyToClipboard(result);
    updateIconsState();
});

function copyToClipboard(text) {
  if (isValidMorse(text)) {
    navigator.clipboard.writeText(text).then(() => {
      console.log("Copied to clipboard!");
    }).catch(err => {
      console.error("Clipboard error:", err);
    });
  } else {
    console.log("Not Morse – not copied.");
  }
}

function updateIconsState() {
  const inputValue = input.value.trim();
  const inputIsMorse = isValidMorse(inputValue);
  playIconInput.style.opacity = inputIsMorse ? 1 : 0.3;
  playIconInput.style.pointerEvents = inputIsMorse ? 'auto' : 'none';
  saveIconInput.style.opacity = inputIsMorse ? 1 : 0.3;
  saveIconInput.style.pointerEvents = inputIsMorse ? 'auto' : 'none';
  playIconInput.title = inputIsMorse ? "Play Morse" : "Output is not Morse";
  saveIconInput.title = inputIsMorse ? "Save Morse as WAV" : "Output is not Morse";
  
  const outputValue = output.value.trim();
  const outputIsMorse = isValidMorse(outputValue);
  playIconOutput.style.opacity = outputIsMorse ? 1 : 0.3;
  playIconOutput.style.pointerEvents = outputIsMorse ? 'auto' : 'none';
  saveIconOutput.style.opacity = outputIsMorse ? 1 : 0.3;
  saveIconOutput.style.pointerEvents = outputIsMorse ? 'auto' : 'none';
  playIconOutput.title = outputIsMorse ? "Play Morse" : "Output is not Morse";
  saveIconOutput.title = outputIsMorse ? "Save Morse as WAV" : "Output is not Morse";  
  
}

function isValidMorse(text) {
  return /^[.\-\/\s]+$/.test(text.trim());
}

function playMorse(morseCode) {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  let time = context.currentTime;

  const unit = 0.08; // seconds per dot

  for (const symbol of morseCode) {
    if (symbol === '.') {
      playBeep(context, time, unit);
      time += unit * 2;
    } else if (symbol === '-') {
      playBeep(context, time, unit * 3);
      time += unit * 4;
    } else if (symbol === ' ') {
      time += unit * 2;
    } else if (symbol === '/') {
      time += unit * 6;
    }
  }
}

function playBeep(context, startTime, duration) {
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(600, startTime); // 600 Hz

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

function saveMorseAsWav(morseCode) {
  const sr = 44100, unit = 0.08, samples = [];
  const beep = d => { let l = sr * d | 0;
    for (let i=0;i<l;i++) samples.push(Math.sin(2*Math.PI*600*i/sr)); };
  const sil = d => { let l = sr * d | 0;
    for (let i=0;i<l;i++) samples.push(0); };
  for (const s of morseCode) {
    if (s === '.') beep(unit), sil(unit);
    else if (s === '-') beep(unit*3), sil(unit);
    else if (s === ' ') sil(unit*2);
    else if (s === '/') sil(unit*6);
  }
  const b = new ArrayBuffer(44 + samples.length*2), v = new DataView(b);
  const wr = (o,s) => s.split('').forEach((c,i)=>v.setUint8(o+i,c.charCodeAt(0)));
  wr(0,"RIFF"); v.setUint32(4,36+samples.length*2,true); wr(8,"WAVEfmt ");
  v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true);
  v.setUint32(24,sr,true); v.setUint32(28,sr*2,true); v.setUint16(32,2,true);
  v.setUint16(34,16,true); wr(36,"data"); v.setUint32(40,samples.length*2,true);
  samples.forEach((s,i)=>v.setInt16(44+i*2,Math.max(-1,Math.min(1,s))*32767,true));
  const blob = new Blob([b],{type:"audio/wav"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "morse.wav"; a.click();
  URL.revokeObjectURL(url);
}
