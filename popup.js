document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("input");
  const output = document.getElementById("output");

  document.getElementById("toMorse").addEventListener("click", () => {
    output.value = textToMorse(input.value);
  });

  document.getElementById("toText").addEventListener("click", () => {
    output.value = morseToText(input.value);
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