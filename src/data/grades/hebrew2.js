// Grade 2 Hebrew (כיתה ב' — 2026 language & literacy program): toward the "first watershed" at the end of
// grade 2 — fluent reading of niqqud text with comprehension, spelling of same-sound letters, morphology
// (plurals, word families with a shared root).
import { HEBREW_VOCABULARY_BANK, HEBREW_PLURALS } from '../age5/hebrew.js';
import { mixRound } from './roundUtils.js';

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

const MARKS = /[֑-ׇ]/;
const DAGESH = 'ּ', SIN_DOT = 'ׂ';
const BANK_WORDS = new Set(HEBREW_VOCABULARY_BANK.map(w => w.word));

// Splits a word into letters with their marks: [{ base, marks: [...] }]
function letters(word) {
  const out = [];
  for (const ch of word) {
    if (MARKS.test(ch) && out.length) out[out.length - 1].marks.push(ch);
    else out.push({ base: ch, marks: [] });
  }
  return out;
}
const join = parts => parts.map(p => p.base + p.marks.join('')).join('');

// ---- 1. Spelling of same-sound letters (כתיב נכון) ----
// Each rule turns a letter (with its marks) into the same-sounding letter, or returns null when it doesn't apply.
const withoutDagesh = marks => marks.filter(m => m !== DAGESH);
const SPELLING_SWAPS = [
  // ט ↔ ת (/t/)
  p => (p.base === 'ת' ? { base: 'ט', marks: withoutDagesh(p.marks) } : null),
  p => (p.base === 'ט' ? { base: 'ת', marks: p.marks } : null),
  // כּ (with dagesh) ↔ ק (/k/)
  p => (p.base === 'כ' && p.marks.includes(DAGESH) ? { base: 'ק', marks: withoutDagesh(p.marks) } : null),
  p => (p.base === 'ק' ? { base: 'כ', marks: [DAGESH, ...p.marks] } : null),
  // ח ↔ כ without dagesh (/x/)
  p => (p.base === 'ח' ? { base: 'כ', marks: p.marks } : null),
  p => (p.base === 'כ' && !p.marks.includes(DAGESH) ? { base: 'ח', marks: p.marks } : null),
  // ס ↔ שׂ (/s/)
  p => (p.base === 'ס' ? { base: 'ש', marks: [SIN_DOT, ...p.marks] } : null),
  p => (p.base === 'ש' && p.marks.includes(SIN_DOT) ? { base: 'ס', marks: p.marks.filter(m => m !== SIN_DOT) } : null),
  // א ↔ ע
  p => (p.base === 'א' ? { base: 'ע', marks: p.marks } : null),
  p => (p.base === 'ע' ? { base: 'א', marks: p.marks } : null)
];

// All misspellings of a word made by swapping ONE letter for a same-sounding letter
export function misspellings(word) {
  const parts = letters(word);
  const out = new Set();
  parts.forEach((p, i) => {
    for (const swap of SPELLING_SWAPS) {
      const replaced = swap(p);
      if (!replaced) continue;
      // A כ at the end of a word would have to be the final ך — skip that swap (e.g. תַּפּוּחַ)
      if (i === parts.length - 1 && replaced.base === 'כ') continue;
      const variant = join([...parts.slice(0, i), replaced, ...parts.slice(i + 1)]);
      if (variant !== word && !BANK_WORDS.has(variant)) out.add(variant);
    }
  });
  return [...out];
}

const SPELLABLE = HEBREW_VOCABULARY_BANK.filter(w => misspellings(w.word).length >= 2);

export function generateGrade2Spelling() {
  const target = pickRandom(SPELLABLE);
  const wrong = shuffle(misspellings(target.word)).slice(0, 2);
  return {
    id: `heb_g2_spell_${target.word}`,
    category: 'hebrew',
    type: 'image_word_match',
    showOptionLabels: true,
    bigLabels: true,
    title: 'כתיב נכון',
    instructionHebrew: 'הקשיבו למילה. איך כותבים אותה נכון?',
    targetWordVocalized: target.emoji,
    soundCue: target.sound,
    correctOptionId: target.word,
    feedbackNote: `${target.emoji} ${target.word}`,
    options: shuffle([target.word, ...wrong]).map(w => ({ id: w, emoji: '', label: w }))
  };
}

// ---- 2. Short stories with comprehension questions (niqqud text) ----
export const GRADE2_STORIES = [
  {
    id: 'heb_g2_story_dog',
    title: 'הַכֶּלֶב שֶׁל נֹעָה',
    text: 'לְנֹעָה יֵשׁ כֶּלֶב קָטָן. הַכֶּלֶב אוֹהֵב לָרוּץ בַּגִּנָּה. בַּבֹּקֶר נֹעָה נוֹתֶנֶת לוֹ מַיִם וְאֹכֶל.',
    questions: [
      { prompt: 'מָה אוֹהֵב הַכֶּלֶב לַעֲשׂוֹת?', options: ['לָרוּץ בַּגִּנָּה', 'לִישֹׁן בַּבַּיִת', 'לִשְׂחוֹת בַּיָּם'], correctIndex: 0 },
      { prompt: 'מָה נֹעָה נוֹתֶנֶת לַכֶּלֶב בַּבֹּקֶר?', options: ['כַּדּוּר', 'מַיִם וְאֹכֶל', 'סֵפֶר'], correctIndex: 1 },
      { prompt: 'אֵיזֶה כֶּלֶב יֵשׁ לְנֹעָה?', options: ['גָּדוֹל', 'שָׁחֹר', 'קָטָן'], correctIndex: 2 }
    ]
  },
  {
    id: 'heb_g2_story_rain',
    title: 'יוֹם גֶּשֶׁם',
    text: 'בַּחוּץ יוֹרֵד גֶּשֶׁם. דָּנִי לוֹבֵשׁ מְעִיל וְלוֹקֵחַ מִטְרִיָּה. אַחֲרֵי הַגֶּשֶׁם הוּא רוֹאֶה קֶשֶׁת בַּשָּׁמַיִם.',
    questions: [
      { prompt: 'מָה יוֹרֵד בַּחוּץ?', options: ['שֶׁלֶג', 'גֶּשֶׁם', 'עָלִים'], correctIndex: 1 },
      { prompt: 'מָה דָּנִי לוֹקֵחַ?', options: ['מִטְרִיָּה', 'כּוֹבַע', 'תִּיק'], correctIndex: 0 },
      { prompt: 'מָה דָּנִי רוֹאֶה אַחֲרֵי הַגֶּשֶׁם?', options: ['שֶׁמֶשׁ', 'יָרֵחַ', 'קֶשֶׁת'], correctIndex: 2 }
    ]
  },
  {
    id: 'heb_g2_story_race',
    title: 'הַצָּב וְהָאַרְנָב',
    text: 'הָאַרְנָב רָץ מַהֵר, וְהַצָּב הוֹלֵךְ לְאַט. הֵם עָשׂוּ תַּחֲרוּת. הָאַרְנָב נִרְדַּם בַּדֶּרֶךְ, וְהַצָּב נִצַּח!',
    questions: [
      { prompt: 'מִי הוֹלֵךְ לְאַט?', options: ['הָאַרְנָב', 'הַצָּב', 'הַכֶּלֶב'], correctIndex: 1 },
      { prompt: 'מָה קָרָה לָאַרְנָב בַּדֶּרֶךְ?', options: ['הוּא נִרְדַּם', 'הוּא אָכַל גֶּזֶר', 'הוּא חָזַר הַבַּיְתָה'], correctIndex: 0 },
      { prompt: 'מִי נִצַּח בַּתַּחֲרוּת?', options: ['אַף אֶחָד', 'הָאַרְנָב', 'הַצָּב'], correctIndex: 2 }
    ]
  }
];

function storyQuestions() {
  return GRADE2_STORIES.flatMap(story => story.questions.map((q, i) => ({
    id: `${story.id}_q${i + 1}`,
    category: 'hebrew',
    type: 'reading_comprehension_question',
    title: `הבנת הנקרא: ${story.title.replace(/[֑-ׇ]/g, '')} (שאלה ${i + 1}/${story.questions.length})`,
    passageTitle: story.title,
    passageText: story.text,
    instructionHebrew: 'קראו את הסיפור וענו על השאלה:',
    prompt: q.prompt,
    options: q.options.map((label, idx) => ({ id: String(idx), label })),
    correctIndex: q.correctIndex
  })));
}

// ---- 3. Plurals as written words: סֵפֶר → סְפָרִים / סְפָרוֹת / סֵפֶרוֹת ----
// Wrong answers: the other plural ending, and the "regular" ending added to the singular.
const HIRIQ = 'ִ', HOLAM = 'ֹ';
function swapEnding(plural) {
  if (plural.endsWith('ים')) {
    const parts = letters(plural.slice(0, -2));
    parts[parts.length - 1].marks = parts[parts.length - 1].marks.filter(m => m !== HIRIQ);
    return join(parts) + 'וֹת';
  }
  if (plural.endsWith('וֹת')) {
    return plural.slice(0, -3) + HIRIQ + 'ים';
  }
  return null;
}
// Final letters become regular letters when an ending is added (שָׁעוֹן → שָׁעוֹנוֹת, not שָׁעוֹןוֹת)
const REGULAR_FORM = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };

function naivePlural(singular, correct) {
  const parts = letters(singular);
  const last = parts[parts.length - 1];
  last.base = REGULAR_FORM[last.base] || last.base;
  last.marks = last.marks.filter(m => m === DAGESH || m === 'ׁ' || m === SIN_DOT); // drop the last vowel
  const ending = correct.endsWith('ים') ? 'וֹת' : 'ים';
  return join(parts) + (ending === 'ים' ? HIRIQ + 'ים' : 'וֹת');
}

const PLURAL_ITEMS = Object.entries(HEBREW_PLURALS)
  .filter(([singular]) => !singular.endsWith('ה')) // feminine -ה words need more than a simple ending change
  .map(([singular, plural]) => ({ singular, plural, wrong: [...new Set([swapEnding(plural), naivePlural(singular, plural)])].filter(w => w && w !== plural) }))
  .filter(item => item.wrong.length === 2);

export function generateGrade2Plural() {
  const item = pickRandom(PLURAL_ITEMS);
  const emoji = HEBREW_VOCABULARY_BANK.find(w => w.word === item.singular)?.emoji || '';
  return {
    id: `heb_g2_plural_${item.singular}`,
    category: 'hebrew',
    type: 'image_word_match',
    showOptionLabels: true,
    bigLabels: true,
    hideWordAudio: true,
    title: 'יחיד ורבים',
    instructionHebrew: 'מהי צורת הרבים הנכונה של המילה?',
    targetWordVocalized: `${emoji} ${item.singular}`,
    correctOptionId: item.plural,
    feedbackNote: `${item.singular} – ${item.plural}`,
    options: shuffle([item.plural, ...item.wrong]).map(w => ({ id: w, emoji: '', label: w }))
  };
}

// ---- 4. Word families (shared root): כָּתַב → מִכְתָּב ----
export const WORD_FAMILIES = [
  ['כָּתַב', 'מִכְתָּב', 'כְּתִיבָה'],
  ['לָמַד', 'תַּלְמִיד', 'לִמּוּד'],
  ['שָׁמַר', 'שׁוֹמֵר', 'מִשְׁמָר'],
  ['סִפֵּר', 'סִפּוּר', 'סֵפֶר'],
  ['אָכַל', 'אֹכֶל', 'מַאֲכָל'],
  ['יָשַׁב', 'מוֹשָׁב', 'יְשִׁיבָה'],
  ['רָקַד', 'רִקּוּד', 'רַקְדָן'],
  ['צִיֵּר', 'צִיּוּר', 'צַיָּר'],
  ['שָׂחָה', 'שְׂחִיָּה', 'שַׂחְיָן']
];

export function generateGrade2WordFamily() {
  const family = pickRandom(WORD_FAMILIES);
  const [shown, answer] = shuffle(family);
  const others = shuffle(WORD_FAMILIES.filter(f => f !== family)).slice(0, 2).map(f => pickRandom(f));
  return {
    id: `heb_g2_family_${shown}`,
    category: 'hebrew',
    type: 'image_word_match',
    showOptionLabels: true,
    bigLabels: true,
    hideWordAudio: true,
    title: 'משפחת מילים',
    instructionHebrew: 'איזו מילה שייכת לאותה משפחה (אותו שורש)?',
    targetWordVocalized: shown,
    correctOptionId: answer,
    feedbackNote: family.join(' • '),
    options: shuffle([answer, ...others]).map(w => ({ id: w, emoji: '', label: w }))
  };
}

export function getHebrewGrade2Exercises(count = 20) {
  // The 9 story questions are spread through the round; generated questions fill the rest
  const stories = shuffle(storyQuestions()).slice(0, Math.min(6, count));
  return mixRound(count, [generateGrade2Spelling, generateGrade2Plural, generateGrade2WordFamily], stories);
}
