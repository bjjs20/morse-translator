# 🟦 Morse Translator Chrome Extension

This Chrome extension lets you:
- 🔁 Translate text ↔ Morse code
- 🎞️ Display a random Morse-themed image that changes every 5 seconds with a smooth fade effect

---

## 🔧 How to Install (Unpacked Extension)

1. Download or clone this repository:
   ```
   git clone https://github.com/bjjs20/morse-translator.git
   ```
   or [Download ZIP](https://github.com/bjjs20/morse-translator/archive/refs/heads/main.zip)

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** (top right)

4. Click **Load unpacked**

5. Select the `morse-translator` folder

You should now see the Morse Translator icon in your Chrome toolbar 🎉

---

## 🗂️ Folder Structure

```
morse-translator/
├── popup.html       # Main popup UI
├── popup.js         # Handles image transitions + UI logic
├── morse.js         # Morse ↔ text conversion logic
├── style.css        # Styling for the popup
├── manifest.json    # Extension configuration
├── icon.png         # Toolbar icon
└── morses/          # Image folder (1.png to 8.png)
```

---

## ✅ Features

- Bidirectional Morse code translation
- Smooth random image animation every 5 seconds
- Lightweight, no internet required

---

## 🧑‍💻 Developer Notes

This is a static Chrome Extension, meaning:
- No server/backend required
- No external permissions or tracking
- Images are bundled locally

---

## 📄 License

MIT License

---

## 👤 Author

Made with 💛 by [bjjs20](https://github.com/bjjs20)
