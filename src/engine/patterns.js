// Patterns (גן חובה: חוקיות — "הילד יזהה חוקיות בסדרה וימשיך אותה"). A row of pictures repeats a unit
// (AB, AAB, ABB, ABC, AABB); the child picks the picture that comes next. The row reads right to left,
// like Hebrew, so the ❓ is at the left end.
import { shuffle } from './random.js';

const THEMES = [
  ['🔴', '🔵', '🟢', '🟡'],
  ['🍎', '🍌', '🍇', '🍓'],
  ['🐱', '🐶', '🐰', '🐸'],
  ['⭐', '❤️', '🔺', '🔷'],
  ['🚗', '🚌', '🚲', '✈️'],
  ['☀️', '🌙', '☁️', '🌈']
];

const UNITS = { AB: [0, 1], AAB: [0, 0, 1], ABB: [0, 1, 1], ABC: [0, 1, 2], AABB: [0, 0, 1, 1] };

// Longest row shown, so it fits a phone screen
const MAX_SHOWN = 8;

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// units: which pattern kinds to use (gan: the simple ones; grade 1 adds AABB)
export function generatePattern(units = ['AB', 'AAB', 'ABB', 'ABC']) {
  const unitName = pickRandom(units);
  const theme = shuffle(pickRandom(THEMES));
  const unit = UNITS[unitName].map(i => theme[i]);

  // Two full repeats, sometimes part of a third, then ❓
  const shown = Math.min(MAX_SHOWN, unit.length * 2 + Math.floor(Math.random() * unit.length));
  const row = Array.from({ length: shown }, (_, i) => unit[i % unit.length]);
  const answer = unit[shown % unit.length];

  // Wrong answers: the pattern's other pictures first (the tempting mistake), then one from outside it
  const inPattern = [...new Set(unit)];
  const wrong = [
    ...shuffle(inPattern.filter(p => p !== answer)),
    ...shuffle(theme.filter(p => !inPattern.includes(p)))
  ].slice(0, 2);

  return {
    id: `math_pattern_${unitName}_${row.join('')}`,
    category: 'math',
    type: 'image_word_match',
    hideWordAudio: true,
    title: 'חוקיות',
    instructionHebrew: 'מה בא אחר כך? המשיכו את הסדרה:',
    soundCue: 'מה בא אחר כך? המשיכו את הסדרה.',
    // Long rows (7–8 pictures) are drawn smaller so the row fits a phone screen
    targetWordVocalized: `<span dir="rtl" style="font-size:${row.length >= 7 ? '0.6em' : '0.8em'}">${row.join('')}❓</span>`,
    correctOptionId: answer,
    feedbackNote: `החוק: <span dir="rtl">${unit.join('')}</span> חוזר שוב ושוב`,
    options: shuffle([answer, ...wrong]).map(p => ({ id: p, emoji: p }))
  };
}
