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
  
  const cleanedText = cleanText(text);
  return [...cleanedText].map(c => {
    const key = /[a-z]/i.test(c) ? c.toUpperCase() : c;
    return morseCode[key] || '';
  }).join(' ');
}

function morseToText(code) {
  return cleanMorseCode(code)
    .split(/\s+/) // Séparation par espaces ou slashs insérés
    .map(m => reverseMorse[m] || '')
    .join('');
}

function isValidMorse(text) {
  return /^[.\-\/\s]+$/.test(text.trim());
}

/**
 * Clean up a raw Morse string by:
 * 1) Converting all line-breaks to " / "
 * 2) Turning runs of 2+ spaces into " / "
 * 3) Collapsing any sequence of slashes (with/without spaces) into " / "
 * 4) Collapsing stray whitespace to single spaces
 * 5) Trimming leading/trailing spaces
 *
 * @param {string} code – Raw Morse input
 * @returns {string} – Normalized Morse, with exactly " / " as word separators
 */
function cleanMorseCode(code) {
  return code
    // 1) Normalize newlines → " / "
    .replace(/\r\n|\r|\n/g, ' / ')
    // 2) 2+ spaces → " / "
    .replace(/ {2,}/g, ' / ')
    // 3) Collapse any sequence of "/" (and surrounding spaces) → " / "
    .replace(/(?:\s*\/+\s*)+/g, ' / ')
    // 4) Collapse multiple spaces → single space
    .replace(/\s+/g, ' ')
    // 5) Trim ends
    .trim();
}

/**
 * Clean up a raw text string by:
 * 1) Decomposing accented characters into base letter + diacritic marks (NFD form)
 * 2) Stripping out all diacritic marks (e.g. accents)
 * 3) Converting any line-breaks (CR, LF, CRLF) into a single space
 * 4) Collapsing any sequence of whitespace into a single space
 * 5) Trimming leading and trailing spaces
 *
 * @param {string} text – The input string to clean
 * @returns {string} The cleaned, un-accented, single-line string
 */
function cleanText(text) {
  return text
    // 1) Normalize to “NFD” so accents decompose into separate code points
    .normalize('NFD')
    // 2) Remove all combining diacritical marks (Unicode U+0300–U+036F)
    .replace(/[\u0300-\u036f]/g, '')
    // 3) Replace any CR, LF or CRLF line breaks with a single space
    .replace(/\r\n|\r|\n/g, ' ')
    // 4) Collapse runs of whitespace (spaces, tabs, etc.) into one space
    .replace(/\s+/g, ' ')
    // 5) Trim leading and trailing spaces
    .trim();
}
