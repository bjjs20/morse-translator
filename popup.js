let playContext = null;    // will hold your AudioContext when playing
let playTimeouts = [];     // references to any scheduled stops

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

const loadBtn = document.getElementById('loadWav');
const fileInput = document.getElementById('wavInput');
  
loadBtn.onclick = () => fileInput.click();
fileInput.addEventListener('change', async () => {
    await decodeWav();
    const result = morseToText(input.value);
    output.value = result;
    updateIconsState();
});

wpm.addEventListener('click', async () => {
    await decodeWav();
    const result = morseToText(input.value);
    output.value = result;
    updateIconsState();
});

  
  
document.getElementById("playMorseInput").addEventListener("click", () => {
    const morse = document.getElementById("input").value;
  if (playContext) {
    // already playing → stop it
    stopMorse();
  } else {
    // not playing → start it
    playMorseToggle(morse);
  }
});
  
document.getElementById("playMorseOutput").addEventListener("click", () => {
    const morse = document.getElementById("output").value;
  if (playContext) {
    // already playing → stop it
    stopMorse();
  } else {
    // not playing → start it
    playMorseToggle(morse);
  }
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

document.getElementById("input").addEventListener('input', () => {
    updateIconsState();
    const inputValue = input.value.trim();
    const inputIsMorse = isValidMorse(inputValue);
        
    fileInput.value = '';          // reset file selection
    stopMorse(); // stop playing current morse
    
    if(inputIsMorse){
      const result = morseToText(input.value);
      output.value = result;
      updateIconsState();
    } else {
      const result = textToMorse(input.value);
      output.value = result;
      copyToClipboard(result);
      updateIconsState();
    }
});


document.getElementById("toText").addEventListener("click", () => {
    const result = morseToText(input.value);
    output.value = result;
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
  const file = document.getElementById('wavInput').files[0];
  
  wpmBlock.style.opacity = file ? 1 : 0.3;
  wpmBlock.style.pointerEvents = file ? 'auto' : 'none';
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

function playMorseToggle(code) {
  const ctx  = new (window.AudioContext || window.webkitAudioContext)();
  playContext = ctx;

  let t = ctx.currentTime;
  const unit = 0.08;

  // schedule each beep and remember the node & stop timeout
  for (const c of code) {
    if (c === '.') {
      scheduleBeep(ctx, t, unit);
      t += unit * 2;
    } else if (c === '-') {
      scheduleBeep(ctx, t, unit * 3);
      t += unit * 4;
    } else if (c === ' ') {
      t += unit * 2;
    } else if (c === '/') {
      t += unit * 6;
    }
  }

  // when the last beep is done, clear context automatically
  playTimeouts.push(setTimeout(() => stopMorse(), (t - ctx.currentTime) * 1000 + 50));
}

function scheduleBeep(ctx, start, duration) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.setValueAtTime(600, start);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration);

  // remember to force‐stop this oscillator if user clicks “stop”
  playTimeouts.push({ osc, stopTime: start + duration });
}

/**
 * Stop all scheduled beeps & close the AudioContext.
 */
function stopMorse() {
  // clear any scheduled JS timeouts
  playTimeouts.forEach(to => {
    if (to instanceof Object && to.osc) {
      // stop any oscillators that haven't fired
      try { to.osc.stop(); } catch(e){/*ignore*/} 
    } else {
      clearTimeout(to);
    }
  });
  playTimeouts = [];

  // shut down the context
  if (playContext) {
    playContext.close();
    playContext = null;
  }
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

async function decodeWav() {
  const file = document.getElementById('wavInput').files[0];
  if (!file) return;
  const arrayBuffer = await file.arrayBuffer();
  const ctx = new (window.AudioContext||window.webkitAudioContext)();
  const audioBuf = await ctx.decodeAudioData(arrayBuffer);
  const data = audioBuf.getChannelData(0), sr = audioBuf.sampleRate;
  // RMS envelope
  const winSize = Math.floor(0.010*sr), hopSize = Math.floor(winSize/2);
  const env = [];
  for (let i=0; i+winSize<=data.length; i+=hopSize) {
    let sum=0; for (let j=0; j<winSize; j++) sum += data[i+j]*data[i+j];
    env.push(Math.sqrt(sum/winSize));
  }
  // threshold on first 5s
  const firstFrames = Math.min(env.length, Math.floor((5*sr)/hopSize));
  const subset = env.slice(0, firstFrames);
  const mean = subset.reduce((a,b)=>a+b,0)/subset.length;
  const std = Math.sqrt(subset.reduce((a,b)=>a+(b-mean)**2,0)/subset.length);
  const thr = mean + 0.5*std;
  const sig = env.map(v=>v>thr?1:0);
  // runs
  const runs=[]; let cur=sig[0],cnt=1;
  for (let i=1;i<sig.length;i++){
    if (sig[i]===cur) cnt++;
    else { runs.push({v:cur,l:cnt}); cur=sig[i]; cnt=1; }
  }
  runs.push({v:cur,l:cnt});
  // determine dotFrames
  const toneRuns = runs.filter(r=>r.v===1).map(r=>r.l);
  let dotFrames;
  const wpmInput = parseFloat(document.getElementById('wpm').value);
  if (wpmInput>0) {
    const dotSec = 1.2/wpmInput;
    dotFrames = Math.max(1, Math.round(dotSec*sr/hopSize));
  } else {
    dotFrames = Math.max(1, Math.min(...toneRuns));
    const dotSec = (dotFrames*hopSize)/sr;
    const detected = 1.2/dotSec;
    document.getElementById('detectedWPM').innerText = '(Detected: '+detected.toFixed(1)+' WPM)';
  }
  const letterGap = 3*dotFrames, wordGap = 7*dotFrames;
  const minRun = Math.max(1, Math.floor(dotFrames/2));
  const clean = runs.map(r=>{ if(r.v===0&&r.l<minRun) r.v=1; return r; }).filter(r=>r.l>=minRun);
  let morse='', letter='';
  clean.forEach(r=>{
    if (r.v===1) letter += r.l<dotFrames*2?'.':'-';
    else {
      if(r.l>=wordGap){ morse+=letter+' / '; letter=''; }
      else if(r.l>=letterGap){ morse+=letter+' '; letter=''; }
    }
  });
  morse+=letter;
  document.getElementById('input').value = morse.trim();
}
