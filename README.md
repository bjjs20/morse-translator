# 🐶🤖 Morse Translator Chrome Extension

This Chrome extension lets you:
- 🔁 Translate text ↔ Morse code
- 🔊 Play the Morse code as sound
- 💾 Save your sound morse as wav file
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
- Auto-copy the output text to clipboard if Morse code
- Generate a Morse code that you can listen and / or save as WAV file
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
Want to support me? [deposit on Mitosis Expedition with my ref Code](https://app.mitosis.org?referral=43RWUK)

---

## 🙏 Special thanks to

MurinXDA for the Morse tools linked in the app [MurinXDA](https://x.com/murinXDA)
Kumatycoon for the Morse analytics link on Dune [Kumatycoon](https://x.com/chockymilkLLC)
Eddy for the Morse ranking link on Dune [Eddy](https://x.com/0xEddy1)
