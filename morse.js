const morseCode = {
  "A": ".-", "B": "-...", "C": "-.-.", "D": "-..",
  "E": ".", "F": "..-.", "G": "--.", "H": "....",
  "I": "..", "J": ".---", "K": "-.-", "L": ".-..",
  "M": "--", "N": "-.", "O": "---", "P": ".--.",
  "Q": "--.-", "R": ".-.", "S": "...", "T": "-",
  "U": "..-", "V": "...-", "W": ".--", "X": "-..-",
  "Y": "-.--", "Z": "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--",
  "4": "....-", "5": ".....", "6": "-....", "7": "--...",
  "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", " ": "/",
  "!": "-.-.--", "@": ".--.-.", ":": "---...", ";": "-.-.-.",
  "=": "-...-", "+": ".-.-.", "-": "-....-", "/": "-..-.",
  "(": "-.--.", ")": "-.--.-", "'": ".----.", "\"": ".-..-.",
  "$": "...-..-", "&": ".-...", "_": "..--.-"
};

const reverseMorse = Object.fromEntries(
  Object.entries(morseCode).map(([k, v]) => [v, k])
);

function textToMorse(text) {
  const cleanText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\r\n|\r|\n/g, " ");
  return [...cleanText].map(c => {
    const key = /[a-z]/i.test(c) ? c.toUpperCase() : c;
    return morseCode[key] || '';
  }).join(' ');
}

function morseToText(code) {
  // Remplace les retours à la ligne par des slashes
  const cleanedCode = code.replace(/\r\n|\r|\n/g, ' / ');
  return cleanedCode
    .trim()
    .split(/\s+/) // Séparation par espaces ou slashs insérés
    .map(m => reverseMorse[m] || '')
    .join('');
}

function isValidMorse(text) {
  return /^[.\-\/\s]+$/.test(text.trim());
}
