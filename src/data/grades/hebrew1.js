// Grade 1 Hebrew (כיתה א' — 2026 language & literacy program): formal decoding with niqqud.
// The child links a spoken word to its first written syllable (letter + vowel sign), recognises vowel signs
// that sound the same, and READS niqqud words and short sentences (no audio for the word itself —
// reading is the task). Reuses the gan word bank (src/data/age5/hebrew.js).
import { HEBREW_VOCABULARY_BANK } from '../age5/hebrew.js';
import { mixRound } from './roundUtils.js';
import { shuffle } from '../../engine/random.js';

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---- Niqqud helpers ----
const MARKS = /[֑-ׇ]/;
const DAGESH = 'ּ', SHIN_DOT = 'ׁ', SIN_DOT = 'ׂ', HOLAM = 'ֹ', HIRIQ = 'ִ';
const VOWEL_CLASS = {
  'ָ': 'a', 'ַ': 'a', 'ֲ': 'a', // kamatz, patach, hataf patach
  'ֶ': 'e', 'ֵ': 'e', 'ֱ': 'e', // segol, tsere, hataf segol
  'ִ': 'i',                               // hiriq
  'ֹ': 'o', 'ֺ': 'o', 'ֳ': 'o', // holam, hataf kamatz
  'ֻ': 'u'                                // qubuts
};
const VOWEL_NAMES = { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u' };

// Splits off the first consonant+vowel unit of a word: { unit, consonant, vowelClass, rest }
// (e.g. קוֹף → קוֹ, פִּיל → פִּי, דֹּב → דֹּ). Returns null when the first vowel is a shva (ambiguous).
export function firstSyllable(word) {
  const chars = [...word];
  let i = 1;
  const marks = [];
  while (i < chars.length && MARKS.test(chars[i])) marks.push(chars[i++]);
  if (marks.includes('ְ')) return null; // shva
  const consonant = chars[0] + marks.filter(m => m === DAGESH || m === SHIN_DOT || m === SIN_DOT).join('');
  let vowelClass = marks.map(m => VOWEL_CLASS[m]).find(Boolean) || null;
  let unit = chars[0] + marks.join('');

  // Mater lectionis: וֹ (holam male), וּ (shuruk), and י after hiriq (hiriq male)
  const next = chars[i];
  const nextMarks = [];
  let j = i + 1;
  while (j < chars.length && MARKS.test(chars[j])) nextMarks.push(chars[j++]);
  if (!vowelClass && next === 'ו' && nextMarks.includes(HOLAM)) { vowelClass = 'o'; unit += next + nextMarks.join(''); i = j; }
  else if (!vowelClass && next === 'ו' && nextMarks.length === 1 && nextMarks[0] === DAGESH) { vowelClass = 'u'; unit += next + DAGESH; i = j; }
  else if (vowelClass === 'i' && next === 'י' && nextMarks.length === 0) { unit += 'י'; i = j; }

  if (!vowelClass) return null;
  return { unit, consonant, vowelClass, rest: chars.slice(i).join('') };
}

// The same consonant with each vowel class written in its most common form
function syllableForms(consonant) {
  return {
    a: consonant + 'ָ',
    e: consonant + 'ֶ',
    i: consonant + HIRIQ,
    o: consonant + 'ו' + HOLAM,
    u: consonant + 'ו' + DAGESH
  };
}

const DECODABLE = HEBREW_VOCABULARY_BANK.filter(w => firstSyllable(w.word));

// 1. Picture + spoken word → which written syllable does it start with? (דָּג → דָּ / דִּ / דּוּ)
export function generateGrade1FirstSyllable() {
  const target = pickRandom(DECODABLE);
  const syl = firstSyllable(target.word);
  const forms = syllableForms(syl.consonant);
  const others = shuffle(Object.keys(forms).filter(c => c !== syl.vowelClass)).slice(0, 2);
  const options = shuffle([
    { id: syl.unit, emoji: '', label: syl.unit },
    ...others.map(c => ({ id: forms[c], emoji: '', label: forms[c] }))
  ]);
  return {
    id: `heb_g1_firstsyl_${target.word}`,
    category: 'hebrew',
    type: 'image_word_match',
    showOptionLabels: true,
    bigLabels: true,
    title: 'ההברה הראשונה',
    instructionHebrew: 'הקשיבו למילה. באיזו הברה היא מתחילה?',
    targetWordVocalized: target.emoji,
    soundCue: target.sound,
    correctOptionId: syl.unit,
    feedbackNote: `${target.emoji} ${target.word}`,
    options
  };
}

// 2. Vowel signs that sound the same: לָ = לַ, לֶ = לֵ, לִ = לִי, לֹ = לוֹ, לֻ = לוּ
const SAME_SOUND_VOWELS = {
  a: [l => l + 'ָ', l => l + 'ַ'],
  e: [l => l + 'ֶ', l => l + 'ֵ'],
  i: [l => l + HIRIQ, l => l + HIRIQ + 'י'],
  o: [l => l + HOLAM, l => l + 'ו' + HOLAM],
  u: [l => l + 'ֻ', l => l + 'ו' + DAGESH]
};
const PLAIN_LETTERS = ['מ', 'ל', 'ס', 'נ', 'ר', 'ג', 'ז'];

export function generateGrade1SameSound() {
  const letter = pickRandom(PLAIN_LETTERS);
  const vowel = pickRandom(Object.keys(SAME_SOUND_VOWELS));
  const [shownForm, answerForm] = shuffle(SAME_SOUND_VOWELS[vowel]);
  const shown = shownForm(letter);
  const answer = answerForm(letter);
  const otherVowels = shuffle(Object.keys(SAME_SOUND_VOWELS).filter(v => v !== vowel)).slice(0, 2);
  const options = shuffle([
    { id: answer, emoji: '', label: answer },
    ...otherVowels.map(v => { const form = pickRandom(SAME_SOUND_VOWELS[v])(letter); return { id: form, emoji: '', label: form }; })
  ]);
  return {
    id: `heb_g1_samesound_${letter}_${vowel}`,
    category: 'hebrew',
    type: 'image_word_match',
    showOptionLabels: true,
    bigLabels: true,
    hideWordAudio: true,
    title: 'ניקוד: אותו צליל',
    instructionHebrew: 'איזו הברה נשמעת בדיוק אותו דבר?',
    targetWordVocalized: shown,
    correctOptionId: answer,
    feedbackNote: `${shown} = ${answer} (${VOWEL_NAMES[vowel]})`,
    options
  };
}

// 3. Read a niqqud word (no audio) and choose the picture
export function generateGrade1ReadWord() {
  const target = pickRandom(HEBREW_VOCABULARY_BANK);
  const distractors = shuffle(HEBREW_VOCABULARY_BANK.filter(w => w.word !== target.word)).slice(0, 2);
  return {
    id: `heb_g1_read_${target.word}`,
    category: 'hebrew',
    type: 'image_word_match',
    hideWordAudio: true,
    title: 'קוראים מילים',
    instructionHebrew: 'קראו את המילה בעצמכם ובחרו את התמונה המתאימה:',
    targetWordVocalized: target.word,
    soundCue: target.sound,
    correctOptionId: target.word,
    options: shuffle([target, ...distractors]).map(w => ({ id: w.word, emoji: w.emoji }))
  };
}

// 4. Reading carefully: which spelling matches the picture? (דָּג / דֶּג / רָג)
const LOOKALIKE_FIRST = { 'ב': 'כ', 'כ': 'ב', 'ד': 'ר', 'ר': 'ד', 'ה': 'ח', 'ח': 'ה', 'ת': 'ח', 'ס': 'ט', 'ט': 'ס', 'ג': 'נ', 'נ': 'ג', 'ו': 'ז', 'ז': 'ו' };
const NO_DAGESH = ['א', 'ה', 'ח', 'ע', 'ר'];
const BANK_WORDS = new Set(HEBREW_VOCABULARY_BANK.map(w => w.word));

export function generateGrade1ReadCarefully() {
  const target = pickRandom(DECODABLE);
  const syl = firstSyllable(target.word);
  const forms = syllableForms(syl.consonant);
  const variants = new Set();
  // Vowel changed in the first syllable
  for (const c of shuffle(Object.keys(forms).filter(c => c !== syl.vowelClass))) variants.add(forms[c] + syl.rest);
  // First letter swapped for a look-alike (keeping the vowel)
  const base = [...target.word][0];
  const swap = LOOKALIKE_FIRST[base];
  if (swap) {
    const keep = [...syl.unit].slice(1).filter(m => m !== SHIN_DOT && m !== SIN_DOT && !(m === DAGESH && NO_DAGESH.includes(swap)));
    variants.add(swap + keep.join('') + syl.rest);
  }
  const wrong = [...variants].filter(v => v !== target.word && !BANK_WORDS.has(v));
  // Prefer one look-alike letter and one vowel change when both exist
  const lookalike = swap ? wrong.find(v => [...v][0] === swap) : null;
  const picked = (lookalike ? [lookalike, wrong.find(v => v !== lookalike)] : wrong.slice(0, 2)).filter(Boolean);
  const options = shuffle([target.word, ...picked]).map(w => ({ id: w, emoji: '', label: w }));
  return {
    id: `heb_g1_careful_${target.word}`,
    category: 'hebrew',
    type: 'image_word_match',
    showOptionLabels: true,
    bigLabels: true,
    hideWordAudio: true,
    title: 'קוראים בעיון',
    instructionHebrew: 'איזו מילה כתובה נכון לתמונה?',
    targetWordVocalized: target.emoji,
    correctOptionId: target.word,
    feedbackNote: `${target.emoji} ${target.word}`,
    options
  };
}

// 5. Read a short sentence and choose the picture ("יֵשׁ לִי כֶּלֶב.") — no gender agreement needed
const SENTENCES = [w => `יֵשׁ לִי ${w}.`, w => `הִנֵּה ${w}!`];

export function generateGrade1Sentence() {
  const target = pickRandom(HEBREW_VOCABULARY_BANK);
  const distractors = shuffle(HEBREW_VOCABULARY_BANK.filter(w => w.word !== target.word)).slice(0, 2);
  const sentence = pickRandom(SENTENCES)(target.word);
  return {
    id: `heb_g1_sentence_${target.word}`,
    category: 'hebrew',
    type: 'image_word_match',
    hideWordAudio: true,
    title: 'קוראים משפט',
    instructionHebrew: 'קראו את המשפט בעצמכם ובחרו את התמונה המתאימה:',
    targetWordVocalized: sentence,
    correctOptionId: target.word,
    options: shuffle([target, ...distractors]).map(w => ({ id: w.word, emoji: w.emoji }))
  };
}

export function getHebrewGrade1Exercises(count = 20) {
  return mixRound(count, [
    generateGrade1FirstSyllable,
    generateGrade1ReadWord,
    generateGrade1SameSound,
    generateGrade1ReadCarefully,
    generateGrade1Sentence
  ]);
}
