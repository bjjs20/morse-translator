document.addEventListener("DOMContentLoaded", () => {
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
  
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      console.log("Copied to clipboard!");
    }).catch(err => {
      console.error("Clipboard error:", err);
    });
  }

  document.getElementById("toMorse").addEventListener("click", () => {
    const result = textToMorse(input.value);
    output.value = result;
    copyToClipboard(result);
  });

  document.getElementById("toText").addEventListener("click", () => {
    const result = morseToText(input.value);
    output.value = result;
    copyToClipboard(result);
  });

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
});

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
