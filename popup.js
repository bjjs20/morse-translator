document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("input");
  const output = document.getElementById("output");
  
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
  setInterval(updateImage, 7000); // change every 7 seconds
});
