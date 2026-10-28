// Grade 2 Math generators (new math program, כיתה ב'): numbers to 1,000 (place value, comparing with
// < > =), addition/subtraction within 100, the meaning of multiplication (equal groups), mastery of the
// ×2, ×4, ×5, ×10 facts and matching division, "half" (linked to ÷2), the clock in whole and half hours.
import { numberChoices, choiceExercise, placeValue } from './procedural_math.js';
import { clockSvg } from './grade1_math.js';
import { shuffle } from './random.js';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const FACT_TABLES = [2, 4, 5, 10];
const GROUP_EMOJIS = ['🍎', '⭐', '🎈', '🐟', '🍓', '⚽'];

// Place value up to 1,000: "מהי ספרת העשרות במספר 482?"
export function generateGrade2PlaceValue() {
  return placeValue(3, 'math_g2_place');
}

// Comparing numbers up to 1,000 with < > = (symbols start in grade 2)
export function generateGrade2CompareSymbols() {
  let a = randInt(10, 999), b;
  const kind = Math.random();
  if (kind < 0.2) b = a;                                   // equal
  else if (kind < 0.6) {                                    // same digits, different order (place value)
    const digits = shuffle(String(a).split(''));
    b = Number(digits.join(''));
    if (b === a || String(b).length !== String(a).length) b = a + pickRandom([-10, 10, -100, 100]);
  } else b = randInt(10, 999);
  if (b < 1 || b > 999) b = a;
  const correct = a < b ? '<' : a > b ? '>' : '=';
  return {
    id: `math_g2_cmp_${Date.now()}_${Math.random()}`,
    category: 'math',
    type: 'arithmetic_choice',
    title: 'השוואת מספרים',
    instructionHebrew: 'איזה סימן מתאים: גדול (>), קטן (<) או שווה (=)?',
    formula: `${a} ? ${b}`,
    soundCue: `איזה סימן מתאים בין ${a} ל-${b}?`,
    expectedAnswer: correct,
    correctOptionId: correct,
    feedbackNote: `<span dir="ltr">${a} ${correct} ${b}</span>`,
    options: ['<', '=', '>'].map(s => ({ id: s, label: s }))
  };
}

// Addition and subtraction within 100, often with carrying / borrowing
export function generateGrade2AddSub100() {
  const add = Math.random() < 0.5;
  let a, b;
  if (add) {
    a = randInt(11, 89);
    b = randInt(5, 100 - a);
  } else {
    a = randInt(20, 100);
    b = randInt(5, a - 1);
  }
  const correct = add ? a + b : a - b;
  return choiceExercise({
    idPrefix: 'math_g2_as100',
    title: 'חיבור וחיסור עד 100',
    instructionHebrew: 'פתרו את התרגיל:',
    formula: `${a} ${add ? '+' : '-'} ${b} = ?`,
    soundCue: `כמה זה ${a} ${add ? 'ועוד' : 'פחות'} ${b}?`,
    correct,
    // ±10 is the classic carrying/borrowing mistake
    choices: numberChoices(correct, [-10, 10, -1, 1, -2, 2], 4, 0)
  });
}

// Multiplication and division facts of 2, 4, 5 and 10
export function generateGrade2Facts() {
  const table = pickRandom(FACT_TABLES);
  const other = randInt(1, 10);
  const product = table * other;
  if (Math.random() < 0.65) {
    const [x, y] = Math.random() < 0.5 ? [table, other] : [other, table];
    return choiceExercise({
      idPrefix: 'math_g2_mult',
      title: 'עובדות הכפל',
      instructionHebrew: 'פתרו את תרגיל הכפל:',
      formula: `${x} × ${y} = ?`,
      soundCue: `כמה זה ${x} כפול ${y}?`,
      correct: product,
      choices: numberChoices(product, [-table, table, -other, other, 1, -1], 4, 1)
    });
  }
  return choiceExercise({
    idPrefix: 'math_g2_div',
    title: 'עובדות החילוק',
    instructionHebrew: 'פתרו את תרגיל החילוק:',
    formula: `${product} ÷ ${table} = ?`,
    soundCue: `כמה זה ${product} לחלק ל-${table}?`,
    correct: other,
    choices: numberChoices(other, [-1, 1, -2, 2, 3], 4, 1),
    feedbackNote: `<span dir="ltr">${table} × ${other} = ${product}</span>`
  });
}

// Multiplication as equal groups: 3 groups of 4 → 3 × 4
export function generateGrade2Groups() {
  const groups = randInt(2, 5);
  const each = randInt(2, 5);
  const emoji = pickRandom(GROUP_EMOJIS);
  const picture = Array.from({ length: groups }, () =>
    `<span style="display:inline-block;border:2px dashed #a5b4fc;border-radius:12px;padding:2px 6px;margin:3px;font-size:28px;line-height:1.2">${emoji.repeat(each)}</span>`
  ).join('');
  const correct = groups * each;
  return choiceExercise({
    idPrefix: 'math_g2_groups',
    title: 'כפל כקבוצות שוות',
    instructionHebrew: `יש ${groups} קבוצות, ובכל קבוצה ${each}. כמה יש בסך הכל?`,
    formula: `<span style="display:inline-block;max-width:360px;white-space:normal">${picture}</span>`,
    soundCue: `יש ${groups} קבוצות, ובכל קבוצה ${each}. כמה יש בסך הכל?`,
    correct,
    choices: numberChoices(correct, [-each, each, -1, 1, groups + each - correct], 4, 1),
    feedbackNote: `<span dir="ltr">${groups} × ${each} = ${correct}</span>`
  });
}

// Half of an even number (linked to ÷ 2)
export function generateGrade2Half() {
  const whole = 2 * randInt(2, 25);
  const correct = whole / 2;
  return choiceExercise({
    idPrefix: 'math_g2_half',
    title: 'חצי',
    instructionHebrew: 'כמה זה חצי מהמספר?',
    formula: `<span dir="rtl">חצי מ-${whole} = ?</span>`,
    soundCue: `כמה זה חצי מ-${whole}?`,
    correct,
    choices: numberChoices(correct, [-1, 1, -2, 2, correct], 4, 1),
    feedbackNote: `<span dir="ltr">${whole} ÷ 2 = ${correct}</span>`
  });
}

// Analog clock in whole and half hours
export function generateGrade2Clock() {
  const hour = randInt(1, 12);
  const half = Math.random() < 0.6;
  const wrap = h => ((h - 1 + 12) % 12) + 1;
  const fmt = (h, m) => `${h}:${m === 0 ? '00' : '30'}`;
  const correct = fmt(hour, half ? 30 : 0);
  // Mistakes: reading the hour hand (between two numbers) as the next hour; mixing up :00 and :30
  const wrong = half
    ? [fmt(wrap(hour + 1), 30), fmt(hour, 0), fmt(wrap(hour + 1), 0), fmt(6, hour === 6 ? 0 : 30)]
    : [fmt(hour, 30), fmt(wrap(hour - 1), 30), fmt(12, 0), fmt(wrap(hour + 1), 0)];
  const choices = shuffle([correct, ...shuffle([...new Set(wrong)].filter(w => w !== correct)).slice(0, 3)]);
  return {
    id: `math_g2_clock_${Date.now()}_${Math.random()}`,
    category: 'math',
    type: 'arithmetic_choice',
    title: 'מה השעה?',
    instructionHebrew: 'מה השעה בשעון? (המחוג הקצר מראה את השעה, הארוך את הדקות)',
    formula: clockSvg(hour, half ? 30 : 0),
    soundCue: 'מה השעה בשעון?',
    expectedAnswer: correct,
    correctOptionId: correct,
    feedbackNote: `<span dir="ltr">${correct}</span>`,
    options: choices.map(c => ({ id: c, label: c }))
  };
}
