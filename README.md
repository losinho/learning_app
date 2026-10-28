# לומדים בכיף (Learn with Fun) 🎓🌟
### Educational Learning App for Israeli Children (Ages 4–10)
**Aligned with the Israeli Ministry of Education (*משרד החינוך*) Curriculum**

---

## 🌟 Overview
**לומדים בכיף** is a self-contained, offline-first, child-friendly learning app designed to practice **Hebrew (עברית)**, **Mathematics (חשבון)**, **English (אנגלית)** and basic **Russian (רוסית)**.

### Core Principles:
1. **100% Self-Contained (Deterministic):** All exercises evaluate answers instantly in the client code without any runtime API calls to LLMs or servers.
2. **Ministry of Education Curriculum:**
   - **Age 5 (גן חובה):** Phonological awareness, initial sounds (צליל פותח), vocalized sight words (מילים מנוקדות), quantity comparison (`< > =`), visual addition/subtraction, English visual words & letter matching.
   - **Age 8–9 (כיתות ג'-ד'):** Reading comprehension (הבנת הנקרא) with educational texts on Israeli history (Ben-Gurion, Ilan Ramon) and nature/science (Dead Sea, Hoopoe bird), Hebrew grammar (שורשים ויחיד/רבים), times tables (לוח הכפל), multi-step word problems (בעיות מילוליות), fractions (שברים פשוטים), and English Band I sentence completion.
3. **Advance on Error with Educational Feedback:** On a mistake, the app highlights the error in red, reveals the correct answer in green so the child learns from the error, and automatically advances to the next question (or allows instant manual tap).
4. **Parent Analytics & Session Logs (דוח הורים):** Every learning session is logged per child with exact questions, answers, and accuracy. Parents can open the secured **Parent Dashboard (📊 להורים)** to view accuracy by subject, identify problem areas (תחומים לחיזוק), inspect detailed question-by-question logs, and read pedagogical tips.
5. **Multi-Child Profiles:** Kids can create their own profiles with fun avatars (🦁, 🐬, 🚀, 🦄, 🐼), choose their age, and track stars and progress independently.
6. **Child-Friendly Audio Feedback:**
   - Real-time text-to-speech (Hebrew & English) so non-readers can listen to questions and words.
   - Joyful synthesized sound effects (fanfares, chimes, star pickup) using the Web Audio API without needing external sound downloads.
7. **Installable PWA / Android Ready:** Works in any browser and can be installed directly to Android tablets and phones as a full-screen offline application.

---

## 🚀 Running the App Locally

The app requires no build steps or heavy node dependencies to get started. It runs directly with Python's built-in web server:

```bash
# Navigate to the project directory
cd d:\code\learning_app

# Start the local server
python -m http.server 8080
```

Open your browser and navigate to:
👉 **[http://localhost:8080](http://localhost:8080)**

To run on an Android tablet or phone connected to the same Wi-Fi, open:
👉 `http://<YOUR_PC_LOCAL_IP>:8080`

---

## 📱 How to Install on Android Devices

The app is published on GitHub Pages: **https://losinho.github.io/learning_app/** (repo → Settings → Pages → branch `main`, folder `/ (root)`). Every push to `main` updates it, and installed copies pick up the new version automatically.

> Installing and offline mode need **https**. Opening `http://<YOUR_PC_IP>:8080` on a phone works for a quick look, but Android will not install it or keep it offline.

### Option A: Install from Chrome (PWA) — no APK needed
1. Open **https://losinho.github.io/learning_app/** in Chrome on the phone or tablet.
2. Tap the **3 dots menu (⋮)** → **"Add to Home screen" / "Install app"**.
3. The app opens full-screen from its own icon and works offline.

### Option B: APK file with PWABuilder (no Android Studio needed)
1. Go to **https://www.pwabuilder.com** and enter `https://losinho.github.io/learning_app/`.
2. Choose **Package for stores → Android** and download the zip.
3. The zip contains:
   - an **`.apk`** to install directly on a device (allow "install unknown apps" for the browser/file manager you open it with),
   - an **`.aab`** for uploading to the Google Play Store,
   - a **signing key** — keep it safe; every future update of the app must be signed with the same key.
4. The APK shows the web app from GitHub Pages, so content updates arrive with a normal push (no new APK needed).
   The first launch needs internet; after that the service worker keeps the app working offline.

#### Hiding the address bar in the APK (Digital Asset Links)
The APK hides Chrome's address bar only after Android checks that the site "owns" the app. It looks for
**`https://losinho.github.io/.well-known/assetlinks.json`** — at the root of the domain, which this project
(served under `/learning_app/`) cannot provide. It needs the user-site repository:
1. On GitHub create a public repository named exactly **`losinho.github.io`**.
2. Add two files to it:
   - **`.nojekyll`** (empty) — without it GitHub Pages skips folders that start with a dot, like `.well-known`;
   - **`.well-known/assetlinks.json`** — take it from the PWABuilder zip (it already contains the package name and
     the signing key's SHA-256 fingerprint). It looks like this:
     ```json
     [{
       "relation": ["delegate_permission/common.handle_all_urls"],
       "target": {
         "namespace": "android_app",
         "package_name": "<package id from PWABuilder>",
         "sha256_cert_fingerprints": ["<SHA-256 fingerprint of the signing key>"]
       }
     }]
     ```
3. Settings → Pages → branch `main`, folder `/ (root)`. Check that the file opens in a browser at the address above.
4. Reopen the APK (clear its data once if it still shows the bar). If the app is on Google Play, add the Play
   Console's **App signing key** SHA-256 fingerprint to the same list too, since Play re-signs the app.

### Option C: Native build with Capacitor + Android Studio
For an APK that contains all files itself: install Android Studio, copy the app files (everything except `.git`, `node_modules`, `android`) into a `www/` folder, then:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "לומדים בכיף" "com.learning.kids" --web-dir www
npx cap add android
npx cap open android
# Build → Build APK(s) in Android Studio
```

### Styling (Tailwind) — rebuild after adding new CSS classes
The styles are pre-built into `css/tailwind.css` (no CDN, so the app is styled offline). After adding Tailwind classes that weren't used before, rebuild it:
```bash
npx --yes tailwindcss@3.4.17 -c tailwind.config.js -i css/tailwind.input.css -o css/tailwind.css --minify
```

---

## 🔊 Hebrew Read-Aloud: Installing a Local Hebrew Voice

The 🔊 / 🔈 buttons read words, instructions and passages aloud. The app picks a voice in this order:

1. **A local Hebrew voice on the device** (best): works offline, starts instantly, and doesn't depend on any outside service.
2. **Online fallback:** if the device has no Hebrew voice, the app streams audio from Google Translate's speech service. This needs internet, and it is an unofficial service that may stop working. **Offline + no local voice = no Hebrew sound.**

English and Russian work the same way. Almost every device already has an English voice; for the **Russian** tab, install a Russian voice the same way as the Hebrew one below (choose Русский / Russian instead of Hebrew).

### Android (phones & tablets)
Most Android devices already include Google's Hebrew voice. To check or install it:
1. **Settings → Accessibility (or System / General management) → Text-to-speech output**. The exact menu names differ between manufacturers.
2. Set the **Preferred engine** to **Speech Services by Google**.
3. Tap ⚙️ next to the engine → **Install voice data** → **עברית (Hebrew)** → download it.
4. Close and reopen the app.

### Windows 10 / 11
1. **Settings → Time & Language → Speech → Manage voices → Add voices**.
2. Choose **Hebrew (Israel)** and install it. This adds the voice "Microsoft Asaf".
3. Restart the browser.

> **Tip:** Microsoft Edge comes with natural-sounding Hebrew voices, so opening the app in Edge usually works without installing anything. Chrome on Windows may not show a newly added Windows voice. If Hebrew still uses the online voice in Chrome, use Edge.

### iPhone / iPad / Mac
A Hebrew voice ("Carmit") is built in. For better quality, download an enhanced version:
- **iOS/iPadOS:** Settings → Accessibility → Spoken Content → Voices → Hebrew.
- **macOS:** System Settings → Accessibility → Spoken Content → System voice → Manage Voices → Hebrew.

### How to check it's working
1. Open the app once while online so it's saved for offline use, then turn on airplane mode (or disconnect from Wi-Fi).
2. Open the app and press 🔊 on a Hebrew word.
3. If you hear the word, the local voice is working. If there's silence, the device has no Hebrew voice and was relying on the online fallback.

---

## 📁 Project Architecture & Directory Structure

```
learning_app/
├── index.html                   # HTML5 entry point with responsive mobile viewport
├── manifest.json                # PWA manifest for Android home-screen installation
├── sw.js                        # Service Worker providing 100% offline caching
├── css/
│   └── app.css                  # Kid-friendly typography, 3D tactile buttons, RTL styling
├── public/
│   ├── icon.svg                 # Scalable app vector icon
│   ├── icon-192.png             # Android home screen icon (192x192)
│   └── icon-512.png             # Android splash icon (512x512)
└── src/
    ├── app.js                   # Application state manager & view orchestrator
    ├── storage.js               # Multi-child profiles & star progress (localStorage)
    ├── audio/
    │   ├── sfx.js               # Web Audio API sound synthesizer (zero audio downloads)
    │   └── speech.js            # Web Speech API pronunciation (he-IL & en-US)
    ├── engine/
    │   ├── validator.js         # Deterministic offline evaluation engine (zero LLM calls)
    │   └── procedural_math.js   # Dynamic infinite math generator (< > =, + -, times tables)
    ├── components/
    │   ├── header.js            # Active profile badge, stars counter, parent report, audio toggles
    │   ├── subjectNav.js        # Subject switcher tabs (עברית, חשבון, אנגלית)
    │   ├── profileModal.js      # Child profile creator & switcher modal
    │   ├── parentModal.js       # Parent analytics dashboard, problem areas & session logs
    │   ├── exerciseCard.js      # Unified exercise viewport & on-screen keypad
    │   └── victoryModal.js      # Celebratory fanfare modal with animated confetti
    └── data/
        ├── index.js             # Curriculum repository coordinator
        ├── age5/
        │   ├── hebrew.js        # Vocalized words + picture matching & initial sound drills
        │   ├── math.js          # Quantity comparisons & visual object addition/subtraction
        │   └── english.js       # Visual vocabulary, colors, alphabet letter matching
        └── age8_9/
            ├── hebrew.js        # Reading passages (Ben-Gurion, Ilan Ramon, Dead Sea) & roots
            ├── math.js          # Word problems (בעיות מילוליות), fractions, multiplication
            └── english.js       # Band I sentence completion & grammar
```

---

## 🧩 Adding New Exercises

To add new exercises, simply append items to the respective data file in `src/data/age5/` or `src/data/age8_9/`.

### Example: Adding a Reading Passage
In `src/data/age8_9/hebrew.js`:
```javascript
{
  id: 'heb_8_new_story',
  ageGroup: '8-9',
  category: 'hebrew',
  type: 'reading_comprehension_set',
  title: 'הציפור הלאומית: הדוכיפת',
  passageTitle: 'הַדּוּכִיפַת שֶׁל יִשְׂרָאֵל',
  passageText: 'הַדּוּכִיפַת נִבְחֲרָה לַצִּפּוֹר הַלְּאֻמִּית...',
  questions: [
    {
      id: 'q1',
      prompt: 'בְּאֵיזוֹ שָׁנָה נִבְחֲרָה הַדּוּכִיפַת?',
      options: ['שְׁנַת 2008', 'שְׁנַת 1948', 'שְׁנַת 2020'],
      correctIndex: 0
    }
  ]
}
```
Validation is 100% automatic and deterministic!
