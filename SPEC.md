# לומדים בכיף — Product & Technical Specification

> Reverse-engineered from the code as of 2026-10-15. Where the code and this document disagree, update one of them deliberately.
> Status labels: **[Implemented]**, **[Partial]**, **[Gap]** (needed for curriculum alignment but not built).

---

## 1. Product summary

An offline-first, installable web app (PWA) for Israeli children to practice **Hebrew (עברית)**, **Math (חשבון)** and **English (אנגלית)**, with content chosen by the child's age group and intended to follow the Israeli Ministry of Education (משרד החינוך) curriculum.

| | |
|---|---|
| Users | Children (primary), parents (secondary – progress report) |
| UI language | Hebrew, RTL. English exercise cards are LTR. |
| Age groups | `'5'` — גן חובה (kindergarten, age 5–6) · `'8-9'` — כיתות ג׳–ד׳ (grades 3–4) |
| Platforms | Any modern browser; installable on Android/iOS as PWA; optional Capacitor APK |
| Backend | None. No accounts, no server, no network calls at runtime (except TTS fallback, §7.2) |

### 1.1 Principles
1. **Deterministic, client-side checking** – every answer is validated in `src/engine/validator.js`; no AI/LLM or server calls.
2. **Learn from mistakes** – a wrong answer is marked red, the correct answer is highlighted green, and the app auto-advances after 2 s (or on tap). There is no retry on the same question.
3. **Non-reader friendly** – instructions and target words have 🔊 buttons (text-to-speech in he-IL / en-US).
4. **Infinite practice** – most age-5 content and age-8-9 arithmetic are generated procedurally, so each round is different.
5. **Positive reinforcement** – a star per correct answer, sound effects, a victory modal with confetti at the end of a round.

---

## 2. User flows

### 2.1 Child
1. App opens on the active profile (a default profile "איתי", age 5, is created on first launch).
2. Child picks a subject tab: עברית / חשבון / English.
3. A **round of ~10 exercises** is loaded (`getExercisesForProfile(profile, subject)`), with a progress bar "תרגיל X מתוך N".
4. For each exercise: read/listen → choose → immediate feedback → next.
5. After the last exercise: the session is saved, the victory modal shows the stars earned, and "play again" loads a new round.
6. Switching subject or profile discards the current round (an unfinished round is **not** saved).

### 2.2 Profiles **[Implemented]**
- Create profile: name, age group (`5` or `8-9`), avatar (10 emoji avatars).
- Switch / delete profile. Each profile has its own stars, stats and session history.

### 2.3 Parent dashboard (📊 להורים) **[Implemented]**
- Accuracy per subject, overall totals.
- "Problem areas" (תחומים לחיזוק): topics (= exercise `title`) with mistakes, with a pedagogical tip per topic (`getPedagogicalTip`).
- Session log: last 50 sessions per child, each with every question, the child's answer, the correct answer and correctness.
- Note: the dashboard is not protected by a PIN/password (the code comments call it "secured", but there is no lock). **[Gap]**

---

## 3. Curriculum content (what is implemented)

### 3.1 Age 5 — גן חובה

| Subject | Topic (card title) | Exercise type | Source | Details |
|---|---|---|---|---|
| Hebrew | מילים ותמונות | `image_word_match` | generated | Vocalized (מנוקד) word → pick 1 of 3 pictures. Bank of 45 words (animals, objects, food, nature). |
| Hebrew | צליל פותח | `image_word_match` | generated | "Which picture starts with letter X?" — distractors never start with the same letter **or the same sound** (כּ/ק, א/ע, ת/ט, ס/שׂ). |
| Hebrew | הברות | `image_word_match` | generated | Picture + word (spoken) → choose how many claps: 3 consecutive choices with 👏 icons. Feedback shows the split (בַּ – לּוֹן). 38 bank words have a syllable split; words with an ambiguous count (initial shva, patah genuva) are left out. |
| Hebrew | חרוזים | `image_word_match` | generated | "Which word rhymes with X?" — 3 labelled pictures; the answer comes from the same rhyme family, distractors from other families (8 families). |
| Hebrew | שמות האותיות | `image_word_match` | generated | "Where is the letter גִּימֶל?" — 3 big letters, one a look-alike when there is one (ב/כ/פ, ד/ר/ה, ו/ז/י, ס/ט/מ, ע/צ, ג/נ). 22 letters, no final forms. |
| Hebrew | יחיד ורבים | `image_word_match` | generated | Hear a word in singular or plural (כֶּלֶב / כְּלָבִים) → pick one item or many (🐶 vs 🐶🐶🐶); the trap is the same item in the other number. 29 plurals incl. irregular (בָּתִּים, נֵרוֹת, דְּבוֹרִים). |
| Hebrew | צליל סוגר | `image_word_match` | generated | "Which picture ends with the letter ל?" — final forms count as their base letter (ן = נ); words ending in a vowel sound (ה, ו, א, ע, י) are never the target; wrong options never end with the same sound (incl. כ/ח, ב/ו at the end). |
| Math | השוואת כמויות | `comparison_drill` | generated | Two groups of 1–9 items, choose `<`, `>` or `=` (25% equal). No numbers on the picture (the child counts); the counts are shown in the feedback after answering. |
| Math | סופרים ומחברים | `visual_addition` | generated | Two groups (1–5 + 1–4), choose the total (max 9). No numbers on the picture; the equation is shown in the feedback. |
| Math | חיבור או חיסור? | `operator_choice` | generated | Picture equation, choose `+` or `−` (results within 0–9). No numbers on the picture; the equation is shown in the feedback. |
| Math | סופרים ומזהים | `visual_counting` | generated | Count 1–20 items (half the questions up to 10), shown in rows of 5; choose the number. |
| Math | כמה נשארו? | `visual_subtraction` | generated | 3–10 items, some crossed out with ✕ ("they went away"); choose how many are left. The equation is shown in the feedback. |
| Math | מספרים סודרים | `ordinal_line` | generated | 6 different animals in a line behind a 🏁 (front of the line on the right); "who is third?" — tap the animal. Ordinals רִאשׁוֹן to שִׁשִּׁי. |
| Math | מיקום במרחב | `image_word_match` | generated | "In which picture is the cat above the box?" — 3 scenes (above / below / beside / inside), built from two emojis placed with CSS (`src/engine/spatial.js`). No right/left. |
| Math | צורות | `image_word_match` | generated | "Where is the triangle?" — 3 SVG shapes (circle, ellipse, half circle, triangle, square, rectangle, pentagon, hexagon) in random colour, size and rotation (`src/engine/shapes.js`). Square and rectangle never appear together. |
| Math | גופים | `image_word_match` | generated | Two styles: "Which object looks like a cube?" (everyday objects: sphere, cube, box, cylinder) and "Where is the pyramid?" (drawn 3D solids: cube, box, cylinder, cone, pyramid, prism, sphere). Cube and box never appear together. |
| Math | מטבעות | `image_word_match` | generated | "Where is the 5-shekel coin?" — 3 coin pictures (10 agorot, ½, 1, 2, 5, 10 ₪) from `public/coins/`. A look-alike is included when there is one (10 agorot ↔ 10 ₪, ½ ↔ 1 ₪). |
| Math | קונים בחנות | `image_word_match` | generated | "The lollipop costs 2 ₪ — which coin pays?" — exact price with one whole-shekel coin (1, 2, 5, 10). |
| English | Colors, Fruits, Vegetables, Animals, Food, My Body, Clothes, Toys & Home, Transport, Nature & Weather, Shapes, Numbers, Actions, Feelings, Greetings | `image_word_match` | generated | English word shown + spoken → pick 1 of 3 pictures **from the same topic**. 15 topics / 153 words. Feedback shows the Hebrew meaning (e.g. `BANANA = בננה`). |
| English | Alphabet Letters (אותיות ABC) | `image_word_match` | generated | Uppercase → choose lowercase; distractors prefer confusable letters (b/d/p/q, m/n…). |

Round composition (20 questions, `ROUND_SIZE` in `src/data/index.js`; the same question never appears twice in a round): Hebrew cycles word-picture → initial sound → syllables → rhyme → letter names → plural → final sound (about 3 each); Math cycles comparison → addition → operator → counting → subtraction → ordinal → spatial → shapes/solids → coins (2–3 each; the shapes slot rotates flat shapes / drawn solids / object solids, the coins slot rotates recognise / buy, each starting at a random point); English mixes topics (no topic repeats until all are used, no word repeats in a round) with a letter question every 5th position.

**English topic picker (age 5):** a row of topic buttons above the English exercise — "הכל" (mixed), "אותיות" (letters only, no letter repeats) or one of the 15 topics (goes through all its words before repeating) — and a "רק להקשיב" toggle (listen-only: the word is hidden and spoken automatically, then revealed in the feedback). The choice is saved per child (`englishTopic`, `englishListenOnly` on the profile); changing it starts a new round. Component: `src/components/englishTopicPicker.js`.

### 3.2 Age 8–9 — כיתות ג׳–ד׳

| Subject | Topic | Exercise type | Source | Details |
|---|---|---|---|---|
| Hebrew | Reading comprehension (הבנת הנקרא) | `reading_comprehension_question` | curated | 3 passages (Ben-Gurion, Dead Sea, Eliezer Ben-Yehuda) × 4 questions. |
| Hebrew | לשון: מציאת שורש | `image_word_match` | curated | Find the 3-letter root (כ-ת-ב, ל-מ-ד, ש-מ-ר …). |
| Math | לוח הכפל | `arithmetic_choice` | generated | a × b, 2–10. |
| Math | השלמת גורם חסר | `arithmetic_choice` | generated | a × ? = product. |
| Math | חילוק עד 100 | `arithmetic_choice` | generated | Division without remainder. |
| Math | Word problems, money, fractions (½ ¼ ⅓) | `numeric_input`, `image_word_match` | curated | 5 fixed items. |
| English | Sentence completion, have/has, is/are/am, Odd One Out, Opposites, Q&A | `fill_in_blank`, `image_word_match` | curated | 13 fixed items. |

Round composition: Hebrew – all 17 items (12 reading questions + 5 grammar) in random order; Math – 20: the 5 curated items spread between 15 generated drills (multiplication, missing factor, division) with no repeated formula; English – all 13 items in random order. The fixed Hebrew and English lists are shorter than `ROUND_SIZE`, so their rounds are shorter until more content is added.

---

## 4. Exercise data model

All exercises are plain JS objects. Common fields:

| Field | Required | Meaning |
|---|---|---|
| `id` | ✔ | Unique id. Recorded in `completedExercises` and session logs. |
| `ageGroup` | ✔ | `'5'` or `'8-9'` |
| `category` | ✔ | `'hebrew' \| 'math' \| 'english'` (English → LTR card + English TTS) |
| `type` | ✔ | One of the types in §4.1 |
| `title` | ✔ | Topic label on the card; **also the topic key in the parent report** — keep it identical across items of the same topic. |
| `instructionHebrew` | ✔ | Instruction (spoken by 🔈) |
| `instructionEnglish` | | Secondary English instruction |
| `soundCue` | | Text spoken by the 🔊 button (falls back to `targetWordVocalized`) |
| `correctAnswerHebrew` | | Hebrew meaning shown in the feedback banner (English vocabulary) |

### 4.1 Types and their validation (`validator.js`)

| Type | Extra fields | Correct when |
|---|---|---|
| `image_word_match` | `targetWordVocalized`, `options[{id, emoji, label?}]` (`emoji` may be inline SVG), `showOptionLabels?`, `correctOptionId`, `feedbackNote?` (shown after answering) | chosen `id === correctOptionId` |
| `visual_counting` | `emoji`, `count`, `options`, `correctOptionId` | same |
| `visual_addition` | `emoji`, `numA`, `numB`, `options`, `correctOptionId` | same |
| `arithmetic_choice` | `formula`, `options`, `correctOptionId` | same |
| `comparison_drill` | `emoji`, `leftVal`, `rightVal` | symbol matches the comparison |
| `operator_choice` | `emoji`, `numA`, `numB`, `result`, `correctOperator` | `+`/`−` matches |
| `numeric_input` | `storyText`, `hint`, `expectedAnswer` | number equals `expectedAnswer` (on-screen keypad, max 5 digits) |
| `fill_in_blank` | `sentenceBefore`, `sentenceAfter`, `options`, `expectedAnswer` | case-insensitive match |
| `reading_comprehension_question` | `passageTitle`, `passageText`, `prompt`, `options`, `correctIndex` | index matches |

Curated reading passages are stored as `reading_comprehension_set` and flattened into one question per exercise in `src/data/index.js`.

---

## 5. Storage (`src/storage.js`)

- `localStorage` key `edu_kids_app_data_v1`:
  ```
  { profiles: [ { id, name, ageGroup, avatar, createdAt, stars,
                  completedExercises: [id], sessionLogs: [session] (max 50),
                  stats: { hebrew, math, english, totalAnswered, totalCorrect, totalIncorrect } } ],
    activeProfileId, settings: { sound, speech } }
  ```
- Session: `{ id, timestamp, subject, ageGroup, totalQuestions, correctCount, incorrectCount, questions: [{ exerciseId, title, topic, category, prompt, userAnswer, correctAnswer, isCorrect, timestamp }] }`
- Data stays on the device only; clearing browser data deletes it. No export/backup. **[Gap]**
- Known issue: procedurally generated Hebrew/Math exercises use `Date.now()` ids, so `completedExercises` grows without bound. (English age-5 ids are stable, e.g. `eng_5_fruits_banana`.)

---

## 6. Architecture

```
index.html ─► src/app.js (LearningApp: state, round flow, session logging)
                ├─ components/  header, subjectNav, profileModal, parentModal, exerciseCard, victoryModal
                ├─ data/index.js ─► data/age5/*, data/age8_9/*   (curriculum content & generators)
                ├─ engine/      validator.js, procedural_math.js
                ├─ audio/       sfx.js (Web Audio synth), speech.js (TTS)
                └─ storage.js   (localStorage)
sw.js       – cache-first service worker (bump CACHE_NAME on every release!)
manifest.json – PWA manifest
```
- Vanilla ES modules, no build step. Tailwind via CDN (**note:** the CDN script is not cached by the service worker, so styling depends on the first online load). **[Gap]**
- Run locally: `python -m http.server 8080`.

---

## 7. Audio

### 7.1 Sound effects – synthesized with Web Audio API (click, success, error, star, fanfare); toggle in header.
### 7.2 Speech – Web Speech API with native voice when available; otherwise an online audio-stream fallback via the unofficial Google Translate TTS endpoint (needed on Windows without a Hebrew voice). Nikkud is stripped before speaking. The endpoint rejects requests that carry a Referer header, so `index.html` sets `<meta name="referrer" content="no-referrer">`. Long texts are split at sentence/comma boundaries into ≤180-character chunks and played in sequence. ⚠️ The fallback requires internet and an unofficial endpoint that may stop working, so speech is not fully offline. Installing a Hebrew voice on the device (Windows: Settings → Time & Language → Speech → Add voices → Hebrew), or using Microsoft Edge, which has built-in online Hebrew voices, makes the app use the native voice instead.

---

## 8. Ministry of Education alignment

> Researched 2026-10-15 from the Ministry's own documents (meyda.education.gov.il / pop.education.gov.il), listed in §8.5.
> Legend: ✅ covered by the app · 🟡 partly / above or below level · ❌ not covered.

### 8.1 Which official documents apply

| Age group | Subject | Official document | Notes |
|---|---|---|---|
| 5 (גן חובה) | Hebrew | **תוכנית לימודים להוראת השפה והאוריינות בעברית ברצף שבין הגן לכיתות א–ב** (תשפ"ו / 2026) | New program; replaces the older separate gan literacy framework. Domains: כשירות תקשורתית, רכישת הקריאה והכתיבה, הבנה והפקה של טקסטים. |
| 5 | Math | **תוכנית לימודים במתמטיקה לחינוך הקדם־יסודי** (draft, תשס"ח / 2008) | Goals are written as "היעד בסיום גן חובה – הילד ידע…", with extension goals "הגננת תעודד…". Three topics: מושג המספר, תחושה מרחבית וגיאומטריה, מושגים כמותיים בחיי היום יום. |
| 5 | English | — | **There is no Ministry English curriculum for gan.** The English Curriculum 2020 starts at grade 3. Age-5 English in this app is enrichment. |
| 8–9 (ג׳–ד׳) | Hebrew | **תוכנית הלימודים בחינוך לשוני: עברית – שפה, ספרות ותרבות** (התשס"ג / 2003) | Achievements are defined at three checkpoints: end of grade 2, **end of grade 4**, end of grade 6. |
| 8–9 | Math | **תכנית לימודים במתמטיקה לכיתות א–ו** (topic lists per grade) | Yearly "מיקוד" documents from the math inspectorate can shift topics between grades. |
| 8–9 | English | **English Curriculum 2020 for Elementary School** (Sept 2019) | CEFR-based levels with vocabulary bands. |

### 8.2 Age 5 — גן חובה

#### Hebrew (language & literacy program, 2026)
What the program expects around the end of gan:
- **Phonological awareness** develops from big sound units to small ones. Ages 4–5 work at the **syllable** level (בלון → ב–לון). Ages 6–7 (end of gan and grade 1) split words into **sub-syllable units**: a consonant+vowel unit plus a single consonant (פי–ל, ב–לו–ן). The consonant+vowel unit is the most natural sound unit in Hebrew.
- **Linking sounds to letters starts in gan chova**, e.g. "think of words that start with the sound /r/, that is, with the letter ר". The program warns that letters with the same sound (כ/ק, ת/ט) can confuse young children.
- **Letter names**: the program expects children to know **at least some** letter names when they start grade 1. The RAMA grade-1 reading test opens with a letter-name task.
- **Partial alphabetic reading** (recognising some letters and guessing the word from context) and **phonetic ("invented") writing** are typical of gan chova. Full decoding is acquired in grade 1.
- Also covered: oral language and vocabulary, discourse skills, story comprehension, rhyme, and early **morphological awareness** (gan chova is named as an important stage for it).

| Expectation | App status |
|---|---|
| Initial sound linked to a letter (צליל פותח) | ✅ "צליל פותח" (distractors never share the target's first sound, incl. כּ/ק and א/ע) |
| Syllable segmentation (הברות) | ✅ "הברות" (clap count, 1–4) |
| Sub-syllable units / final sound | 🟡 Final sound ✅ "צליל סוגר"; splitting into sub-syllable units (פִּי–ל) not built |
| Rhyme (חריזה) | ✅ "חרוזים" |
| Letter names and shapes | ✅ "שמות האותיות" (hear the name → find the letter) |
| Reading vocalized words | 🟡 Above gan level (full decoding is a grade-1 goal). Fine as enrichment because the 🔊 button speaks the word. |
| Vocabulary (word ↔ picture) | ✅ "מילים ותמונות" (45 words) |
| Morphology (e.g. singular/plural: כלב–כלבים) | ✅ "יחיד ורבים" |

#### Math (preschool math program; end-of-gan-chova goals)
- **Number concept**: count from 1 to **30** (extension: beyond 30, by 10s to 100, by 2s and 5s); count backwards from **10**; count objects up to **20**; one-to-one correspondence; compare groups by counting; ordinal numbers up to **sixth (שישי/שישית)**; estimate a quantity; recognise and represent numerals **0–10** (extension: 20); split and join concrete quantities up to 10; **add and subtract up to 10 in concrete situations** (extension: larger numbers); share up to 10 objects equally.
- **Spatial sense & geometry**: spatial language (מעל/מתחת, לפני/מאחורי, בין, ימין/שמאל…), simple maps (age 5–6); 2D shapes (triangles, quadrilaterals, pentagons, hexagons, circle, ellipse, half circle); 3D solids (cube, box, prism, pyramid, cylinder, cone, sphere); symmetry. Shapes should be shown in different colours, sizes **and orientations**.
- **Everyday quantitative concepts**: direct comparison of length, weight and volume; measuring with units; the clock as a tool for time; recognising coins and "buying"; sorting and classifying; answering simple questions from a diagram.
- **Symbols:** the number chapter does not mention `<` `>` `=`. Comparison in gan is by counting and in words (יותר / פחות / שווה).

| Expectation | App status |
|---|---|
| Counting objects | ✅ 1–20 in rows of 5 (reciting to 30 is oral, not covered) |
| Comparing groups | ✅ Covered with `< > =` symbols (above gan level; kept by product decision §8.4) |
| Add/subtract within 10 with objects | ✅ Visual addition (max 9), "כמה נשארו?" subtraction, operator choice |
| Numeral recognition 0–10 | 🟡 Implicit only (numbers appear as answers) |
| Ordinal numbers to "sixth" | ✅ "מספרים סודרים" |
| Shapes & solids | ✅ "צורות" (8 shapes, varied colour/size/orientation) and "גופים" (7 solids: drawn, plus everyday objects) |
| Spatial language | ✅ "מיקום במרחב" (above / below / beside / inside; no right/left) |
| Coins and buying | ✅ "מטבעות" (recognise a coin by its name) and "קונים בחנות" (pay an exact price with one coin) |
| Measurement comparison, clock | ❌ |
| Sorting / patterns | ❌ |

#### English (enrichment — no gan curriculum)
The closest official reference is the first level of the English Curriculum 2020 (**Pre-A1, "Pre Band I", grade 3**). Several of its can-do statements describe exactly what the new age-5 English module does, only orally:
- "Can demonstrate understanding of a word by matching it to a picture" ✅
- "Can recognize a range of basic everyday nouns and adjectives (e.g. colors, numbers, classroom objects)" ✅ (12 topics, 127 words)
- "Can recognize the letters of the alphabet in upper and lower case" ✅ (letter matching)
- Basic action words, greetings and polite words, feelings ✅ (topics Actions, Greetings, Feelings).

Because there is no gan curriculum for English, the right approach is listening and pictures, with no reading or writing demands. The app already works this way: the word is spoken and the answer is a picture.

### 8.3 Age 8–9 — grades 3–4

#### Math (official topic lists)
- **Grade 3:** numbers up to **10,000** (place value, ×10 and ×100); addition and subtraction in columns; the commutative, associative and distributive laws; **completing and consolidating the multiplication table** (multiplication and division); multiplying by whole tens and hundreds; divisibility by 2, 5 and 10; column multiplication by a one-digit number; **division within 100 with remainder** (one-digit divisor); order of operations and brackets; **two-step word problems**; **unit fractions (שבר יסודי)**; data; geometry (angles, perpendicular and parallel lines, triangles, quadrilaterals); measurement of length, weight (g, kg, ton), volume and time units.
- **Grade 4:** **fractions** (numerator, denominator, fraction line, mixed numbers, fractions greater than 1, equivalent names, first operations); numbers up to **1,000,000**; number line; column multiplication by a multi-digit number; long division; estimation; divisibility by 3, 6 and 9; prime numbers; powers; polygons and diagonals; rectangle area and perimeter; box volume; calendar and time calculations.
- Note: a recent math-inspectorate focus document (מיקוד) recommends postponing unit fractions to grade 4.

| Topic | App status |
|---|---|
| Multiplication table, missing factor, division within 100 | ✅ |
| Division with remainder | ❌ |
| Two-step word problems | ✅ 1 curated item (more needed) |
| Unit fractions / simple fractions | 🟡 2 curated items (½, ¼, ⅓). No numerator/denominator, mixed numbers or equivalent fractions. |
| Place value up to 10,000 / 1,000,000 | ❌ |
| Order of operations | ❌ |
| Geometry (angles, triangles, quadrilaterals), area and perimeter | ❌ |
| Measurement units (g/kg, time) | ❌ |

#### Hebrew (2003 curriculum, end-of-grade-4 achievements)
- **Fluent, accurate oral reading** of texts studied in class, with full mastery of the alphabetic code and understanding of what is read.
- Identify the **main ideas** of a text and tell important details from unimportant ones.
- Independent reading of **at least 20 more books** (after 30 by the end of grade 2).
- Poetry: rhyme, rhythm, sound, line division and repetition, linked to meaning; explicit and hidden meanings; main themes and messages.
- Writing with **correct spelling and legible handwriting**; focused listening, including interpretation and taking a position.
- Language topics are listed for the whole elementary school, not per grade. They include: **gender and number in nouns (singular / plural / dual)**; gender and number agreement between nouns and verbs, adjectives and number words (שלושה בנים / חמש רכבות); **סמיכות** (construct state); basic noun patterns (מקטל, תקטיל…); adjectives; personal pronouns; alphabet order and **gematria** (letters as numbers). Gematria is also a grade-3 math topic.

| Expectation | App status |
|---|---|
| Reading comprehension of informational texts | ✅ 3 passages × 4 questions |
| Main idea vs. details | 🟡 Depends on the question; worth adding explicit "what is the main idea?" questions |
| Literary texts / poetry | ❌ |
| Roots (שורש) | ✅ 3 items |
| Singular/plural/dual, gender agreement, number words | ❌ (the README mentions singular/plural, but it is not implemented) |
| סמיכות, noun patterns | ❌ |
| Spelling | ❌ |

#### English (English Curriculum 2020)
- Levels by grade: **Pre-A1 ("Pre-foundation", Pre Band I) — grade 3 and/or the first months of grade 4**; **A1 ("Foundation", Band I Core I) — grade 4 to mid-grade 5**; A2 (Band I Core II) — mid-grade 5 to the end of grade 6.
- Vocabulary targets: **Pre Band I ≈ 200 words** (receptive and productive); A1 adds ≈ 1,200 receptive / 1,000 productive. The official word lists are published in a separate Excel file ("English Curriculum 2020 Lexical Bands").
- Pre-A1 can-dos: recognise Pre Band I words, numbers, days and simple instructions; match words to pictures; read **upper- and lower-case letters**; read sentences made of Pre Band I words; understand full stops, question marks and capital letters; greet people, introduce yourself ("My name's…") and ask "What is it?"; recite rhymes and sing songs; trace and copy letters and words, write your own name, copy short sentences.
- A1 adds: describing yourself and your daily life in a series of sentences, simple illustrated stories, and writing simple phrases and sentences.

| Expectation | App status |
|---|---|
| Word ↔ picture, odd one out, opposites | ✅ |
| Q&A about yourself ("What's your name?" / "How old are you?") | ✅ 3 items |
| Grammar: have/has, there is/are | 🟡 Closer to A1 (grade 4). The app labels its grade 3–4 content "Band I", but grade 3 is officially **Pre Band I**. |
| Alphabet and phonics for grade 3 | ❌ No letter or phonics tasks for age 8–9 |
| Vocabulary taken from the official Pre Band I / Band I lists | ❌ Not checked against the Excel lists yet |

### 8.4 Product decisions
- **Rounds are 20 questions (2026-10-15)** for every subject and age, without repeating a question inside a round.
- **Coins (2026-10-15):** first dropped, then added once real coin pictures were supplied (`public/coins/`, cut from `coins.jpg`).
- **Age 5 keeps its current difficulty (2026-10-15):** reading niqqud words and the `< > =` symbols stay, even though both are above the gan program. New age-5 content adds missing skills; it does not make existing exercises easier.

### 8.5 Main conclusions
1. **Age 5 Hebrew** covers the core gan skills: initial and final sound, **syllables, rhyme, letter names, singular/plural**, plus vocabulary. Not built: splitting words into sub-syllable units. Reading niqqud words is above gan level (kept on purpose).
2. **Age 5 math** covers counting to 20, adding and subtracting, ordinal numbers, spatial words, **shapes, solids and coins**. Not built: measurement (length/weight comparison), the clock, sorting/patterns. The `< > =` symbols are above gan level but kept on purpose.
3. **Age 5 English** is enrichment. The new vocabulary module matches the official Pre-A1 can-dos (word–picture matching, colours, numbers, letters).
4. **Age 8–9** covers only a small part of each grade 3–4 program. The biggest gaps are division with remainder, place value, geometry and measurement in math; grammar (gender, number, סמיכות) in Hebrew; and an official word list in English.
5. The app has one group "8–9" for both grade 3 and grade 4. The official programs differ a lot between these grades (for example, fractions and numbers up to a million are grade 4). Consider splitting it into "grade 3" and "grade 4".

### 8.6 Sources
- [תוכנית לימודים להוראת השפה והאוריינות בעברית ברצף שבין הגן לכיתות א–ב (תשפ"ו)](https://meyda.education.gov.il/files/Pop/0files/ivrit_hinuch_leshoni/Yesodi/tohnit-limudim-safa.pdf)
- [תשתית קריאה וכתיבה בגן – פורטל עובדי הוראה](https://pop.education.gov.il/kindergarten/magar-ganey-yeladim/tashtit-kria)
- Preschool math program (תשס"ח draft), chapters: [overview](https://meyda.education.gov.il/files/Tochniyot_Limudim/KdamYesodi/Math1.pdf) · [number concept](https://meyda.education.gov.il/files/Tochniyot_Limudim/KdamYesodi/Math2.pdf) · [geometry](https://meyda.education.gov.il/files/Tochniyot_Limudim/KdamYesodi/Math3.pdf) · [quantitative concepts](https://meyda.education.gov.il/files/Tochniyot_Limudim/KdamYesodi/Math4.pdf)
- Elementary math program: [grade 3](https://meyda.education.gov.il/files/Tochniyot_Limudim/Math/Yesodi/kita3.pdf) · [grade 4](https://meyda.education.gov.il/files/Tochniyot_Limudim/Math/Yesodi/kita4.pdf) · [מיקוד תשפ"ג](https://meyda.education.gov.il/files/Pop/0files/matmatika/Yesodi/inspector-desk/mikud-tashpag.pdf)
- [תוכנית הלימודים בחינוך לשוני – עברית, שפה, ספרות ותרבות (התשס"ג)](https://meyda.education.gov.il/files/Curriculum/hebrew-1-6.pdf)
- [English Curriculum 2020 for Elementary School](https://meyda.education.gov.il/files/Mazkirut_Pedagogit/English/curriculum2020Elementary.pdf) · [English Curriculum 2020 (full)](https://meyda.education.gov.il/files/Mazkirut_Pedagogit/English/Curriculum2020.pdf) · [Pre-Foundation can-do guidelines](https://meyda.education.gov.il/files/Mazkirut_Pedagogit/English/prefoundationcando.pdf)

---

## 9. Backlog (derived from §8)

### 9.1 Open

**Age 5 (all planned items are done; possible additions)**
- Splitting words into sub-syllable units (פִּי–ל).
- Measurement comparison (longer/heavier), the clock, sorting and patterns.
- Right/left (left out on purpose for now).

**Age 8–9**
1. Content to reach 20-question rounds: Hebrew has 17 items and English 13, so their rounds are shorter than `ROUND_SIZE`.
2. Math: division with remainder, place value, order of operations, more two-step problems, fractions (numerator and denominator, equivalents), angles, shapes, area and perimeter, units.
3. Hebrew: singular/plural/dual, gender and number agreement, number words (שלושה / שלוש), סמיכות, main-idea questions, a short poem with comprehension questions.
4. English: check the word lists against the official Pre Band I / Band I Excel; add alphabet and phonics for grade 3.
5. Split the "8–9" group into grade 3 and grade 4; add grades 1–2.

**Platform**
6. Parent PIN; data export/backup; stable ids for generated exercises; cache Tailwind locally for true offline use.
7. Reduce dependence on the unofficial Google TTS fallback (e.g. pre-recorded audio for fixed words).

**To check on real devices**
- TTS reads "איפה האות ג?" as the letter name.
- The README steps for installing a Hebrew voice (Android, Chrome on Windows).

### 9.2 Done (2026-10-15)
- English age 5: 12 vocabulary topics (127 words), letter matching, Hebrew meaning in the feedback.
- Hebrew age 5: syllables, rhyme, letter names; initial-sound wrong options never share the target's first sound (`SAME_SOUND_GROUPS`).
- Math age 5: flat shapes and solids; coins (recognise + buy, pictures in `public/coins/`); no numbers on the comparison, addition and +/− pictures — the counts are shown in the feedback.
- All rounds are 20 questions without repeats (`ROUND_SIZE`).
- Hebrew read-aloud fixed (no-referrer for the Google fallback) and long passages read in full (chunked).
- Service worker re-caches with `cache: 'reload'`, so updates reach installed devices.
- Age 5 completed: singular/plural, final sound, counting to 20 in rows of 5, subtraction, ordinal numbers, spatial words, drawn solids (cone, pyramid, prism…), English topics Actions/Feelings/Greetings, English topic picker and listen-only mode.
- Product decisions recorded in §8.4 (age 5 keeps its difficulty, 20-question rounds, coins).