// Grade 1 Math generators (new math program, כיתה א'): numbers to 100 (counting, sequences, comparing
// in words — no < > = symbols in grade 1), addition/subtraction within 20, whole tens, the analog clock in
// whole hours, comparing lengths.
import { numberChoices, choiceExercise } from './procedural_math.js';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Number sequences: "41, 42, ?, 44" — steps of 1, 2, 5, 10 (also counting back by 1 and 10)
export function generateGrade1Sequence() {
  const step = pickRandom([1, 2, 5, 10]);
  const down = (step === 1 || step === 10) && Math.random() < 0.3;
  const length = 4;
  // Steps of 5 and 10 start on a multiple (as counted in class); all terms stay within 0–100
  let start = step >= 5 ? step * randInt(0, Math.floor(100 / step) - length) : randInt(0, 100 - step * (length - 1));
  if (down) start += step * (length - 1);
  const terms = Array.from({ length }, (_, i) => start + (down ? -1 : 1) * step * i);
  const missingAt = randInt(1, length - 1);
  const correct = terms[missingAt];
  const shown = terms.map((n, i) => (i === missingAt ? '?' : n)).join(', ');

  return choiceExercise({
    idPrefix: 'math_g1_seq',
    title: 'סדרות מספרים',
    instructionHebrew: 'איזה מספר חסר בסדרה?',
    formula: shown,
    soundCue: 'איזה מספר חסר בסדרה?',
    correct,
    choices: numberChoices(correct, [-step, step, -1, 1, 10, -10], 4, 0),
    feedbackNote: `<span dir="ltr">${terms.join(', ')}</span>`
  });
}

// Comparing numbers in words: "מה גדול יותר: 47 או 74?" (often the same digits swapped — place value)
export function generateGrade1CompareWords() {
  const askBigger = Math.random() < 0.5;
  let a, b;
  if (Math.random() < 0.5) {
    const tens = randInt(1, 9), ones = randInt(1, 9);
    if (tens === ones) return generateGrade1CompareWords();
    a = tens * 10 + ones;
    b = ones * 10 + tens;
  } else {
    a = randInt(1, 100);
    b = randInt(1, 100);
    if (a === b) return generateGrade1CompareWords();
  }
  const correct = askBigger ? Math.max(a, b) : Math.min(a, b);
  const word = askBigger ? 'גדול' : 'קטן';
  return choiceExercise({
    idPrefix: 'math_g1_cmp',
    title: 'השוואת מספרים',
    instructionHebrew: `איזה מספר ${word} יותר?`,
    formula: `<span dir="rtl">${a} או ${b}?</span>`,
    soundCue: `איזה מספר ${word} יותר, ${a} או ${b}?`,
    correct,
    choices: shuffle([a, b])
  });
}

// Addition and subtraction within 20, including a missing addend ("7 + ? = 12")
export function generateGrade1AddSub20() {
  const kind = pickRandom(['add', 'sub', 'missing']);
  let formula, correct, soundCue;
  if (kind === 'add') {
    const a = randInt(2, 15), b = randInt(1, 20 - a);
    correct = a + b; formula = `${a} + ${b} = ?`; soundCue = `כמה זה ${a} ועוד ${b}?`;
  } else if (kind === 'sub') {
    const a = randInt(5, 20), b = randInt(1, a - 1);
    correct = a - b; formula = `${a} - ${b} = ?`; soundCue = `כמה זה ${a} פחות ${b}?`;
  } else {
    const a = randInt(1, 12), c = randInt(a + 1, 20);
    correct = c - a; formula = `${a} + ? = ${c}`; soundCue = `${a} ועוד כמה שווה ${c}?`;
  }
  return choiceExercise({
    idPrefix: 'math_g1_as20',
    title: 'חיבור וחיסור עד 20',
    instructionHebrew: 'פתרו את התרגיל:',
    formula,
    soundCue,
    correct,
    choices: numberChoices(correct, [-2, -1, 1, 2, 10, -10], 4, 0)
  });
}

// Whole tens within 100: "30 + 20", "70 - 40"
export function generateGrade1Tens() {
  const add = Math.random() < 0.5;
  const a = 10 * randInt(1, 8);
  const b = add ? 10 * randInt(1, (100 - a) / 10) : 10 * randInt(1, a / 10);
  const correct = add ? a + b : a - b;
  return choiceExercise({
    idPrefix: 'math_g1_tens',
    title: 'עשרות שלמות',
    instructionHebrew: 'פתרו את התרגיל:',
    formula: `${a} ${add ? '+' : '-'} ${b} = ?`,
    soundCue: `כמה זה ${a} ${add ? 'ועוד' : 'פחות'} ${b}?`,
    correct,
    choices: numberChoices(correct, [-10, 10, -20, 20, -1, 1], 4, 0)
  });
}

// Analog clock (whole hours)
export function clockSvg(hour, minute = 0) {
  const numbers = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    const angle = (n * 30 - 90) * Math.PI / 180;
    return `<text x="${(50 + 35 * Math.cos(angle)).toFixed(1)}" y="${(50 + 35 * Math.sin(angle) + 4).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">${n}</text>`;
  }).join('');
  const hand = (angle, length, width, color) => {
    const rad = (angle - 90) * Math.PI / 180;
    return `<line x1="50" y1="50" x2="${(50 + length * Math.cos(rad)).toFixed(1)}" y2="${(50 + length * Math.sin(rad)).toFixed(1)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
  };
  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  return `<svg viewBox="0 0 100 100" width="150" height="150" style="display:inline-block;vertical-align:middle" aria-hidden="true">` +
    `<circle cx="50" cy="50" r="46" fill="#fff" stroke="#312e81" stroke-width="3"/>${numbers}` +
    hand(hourAngle, 20, 4.5, '#1e293b') + hand(minute * 6, 31, 2.5, '#dc2626') +
    `<circle cx="50" cy="50" r="2.5" fill="#1e293b"/></svg>`;
}

export function generateGrade1Clock() {
  const hour = randInt(1, 12);
  const label = h => `${h}:00`;
  const wrap = h => ((h - 1 + 12) % 12) + 1;
  // Typical mistakes: an hour off, and reading the long (minute) hand as the hour → 12:00
  const wrong = shuffle([wrap(hour + 1), wrap(hour - 1), 12, wrap(hour + 6)].filter(h => h !== hour)).slice(0, 3);
  const choices = shuffle([hour, ...new Set(wrong)]);
  return {
    id: `math_g1_clock_${Date.now()}_${Math.random()}`,
    category: 'math',
    type: 'arithmetic_choice',
    title: 'מה השעה?',
    instructionHebrew: 'מה השעה בשעון? (המחוג הקצר מראה את השעה)',
    formula: clockSvg(hour),
    soundCue: 'מה השעה בשעון?',
    expectedAnswer: hour,
    correctOptionId: String(hour),
    feedbackNote: `<span dir="ltr">${label(hour)}</span>`,
    options: choices.map(h => ({ id: String(h), label: label(h) }))
  };
}

// Comparing lengths: "איזה עיפרון הכי ארוך?" — 3 pencils of different lengths
function pencilSvg(length, color) {
  return `<svg viewBox="0 0 130 30" width="210" height="48" style="display:inline-block" aria-hidden="true">` +
    `<rect x="4" y="8" width="${length}" height="14" rx="2" fill="${color}" stroke="#1e293b" stroke-width="2"/>` +
    `<polygon points="${length + 4},8 ${length + 18},15 ${length + 4},22" fill="#fcd34d" stroke="#1e293b" stroke-width="2"/></svg>`;
}

export function generateGrade1Length() {
  const lengths = shuffle([30, 55, 80, 100]).slice(0, 3);
  const colors = shuffle(['#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f97316']);
  const askLongest = Math.random() < 0.5;
  const target = askLongest ? Math.max(...lengths) : Math.min(...lengths);
  return {
    id: `math_g1_len_${askLongest ? 'long' : 'short'}`,
    category: 'math',
    type: 'image_word_match',
    title: 'מדידת אורך',
    instructionHebrew: askLongest ? 'איזה עיפרון הכי ארוך?' : 'איזה עיפרון הכי קצר?',
    targetWordVocalized: askLongest ? 'הֲכִי אָרֹךְ' : 'הֲכִי קָצָר',
    soundCue: askLongest ? 'איזה עיפרון הכי ארוך?' : 'איזה עיפרון הכי קצר?',
    correctOptionId: String(target),
    options: lengths.map((len, i) => ({ id: String(len), emoji: pencilSvg(len, colors[i]) }))
  };
}
