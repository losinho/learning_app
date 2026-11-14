// Grade 4 Math generators for the new math program (כיתה ד'): numbers to 1,000,000 (rounding, comparing),
// multiplying two-digit numbers and estimating products, properties of 0 and 1 (no dividing by 0),
// fractions (parts of a shape, on the number line, comparing, adding/subtracting with equal denominators,
// a whole number times a fraction), quadrilaterals, parallel/perpendicular lines, the calendar, pie charts.
// Every generator also returns `explanation` (steps) and `mistakes` (hints per wrong option) — see explain.js.
import { numberChoices, choiceExercise } from './procedural_math.js';
import { mistakesFor } from './explain.js';
import { shuffle } from './random.js';
import { randInt, pickRandom, ltr, fmt, word, rtlText, roundingExercise, compareExercise, dataExercise } from './grade3_math.js';

// ---------------- Fraction display ---------------- //

// A stacked fraction (numerator over denominator), as in the textbooks
export function frac(n, d) {
  return `<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1.05;font-size:.8em;margin:0 2px">` +
    `<span>${n}</span><span style="border-top:3px solid currentColor;align-self:stretch;text-align:center">${d}</span></span>`;
}
// n/d as a whole, a fraction, or a mixed number (1 ²⁄₅)
export function fracValue(n, d) {
  const q = Math.floor(n / d), r = n % d;
  if (r === 0) return String(q);
  return q === 0 ? frac(r, d) : `${q}&nbsp;${frac(r, d)}`;
}
const fracId = (n, d) => `${n}/${d}`;

function fractionChoice({ idPrefix, title, instructionHebrew, formula, soundCue, correct, wrong, explanation, mistakes }) {
  // correct / wrong: [n, d] pairs; the option id is "n/d", shown as a fraction or mixed number
  const all = [correct, ...wrong.filter(([n, d], k, arr) => n > 0 && d > 1 && fracId(n, d) !== fracId(...correct) && arr.findIndex(x => fracId(...x) === fracId(n, d)) === k)].slice(0, 4);
  const shown = all.slice(1).map(x => fracId(...x));
  // Keep only hints for wrong options that are actually on screen
  mistakes = Object.fromEntries(Object.entries(mistakes || {}).filter(([id]) => shown.includes(id)));
  return {
    id: `${idPrefix}_${Date.now()}_${Math.random()}`,
    category: 'math',
    type: 'arithmetic_choice',
    title,
    instructionHebrew,
    formula,
    soundCue,
    expectedAnswer: fracId(...correct),
    correctOptionId: fracId(...correct),
    explanation,
    mistakes,
    options: shuffle(all).map(([n, d]) => ({ id: fracId(n, d), label: fracValue(n, d) }))
  };
}

// A circle or bar split into d equal parts with `shaded` parts colored
function fractionShapeSvg(d, shaded, kind) {
  if (kind === 'bar') {
    const w = Math.min(44, Math.floor(260 / d));
    const cells = Array.from({ length: d }, (_, i) =>
      `<rect x="${2 + i * w}" y="2" width="${w}" height="44" fill="${i < shaded ? '#818cf8' : '#fff'}" stroke="#312e81" stroke-width="2.5"/>`).join('');
    return `<svg viewBox="0 0 ${d * w + 4} 48" width="${d * w + 4}" height="48" style="display:inline-block" aria-hidden="true">${cells}</svg>`;
  }
  const r = 60, c = 64;
  const pt = a => [c + r * Math.sin((a * Math.PI) / 180), c - r * Math.cos((a * Math.PI) / 180)];
  const slices = Array.from({ length: d }, (_, i) => {
    const [x1, y1] = pt((360 / d) * i), [x2, y2] = pt((360 / d) * (i + 1));
    return `<path d="M${c},${c} L${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2} Z" fill="${i < shaded ? '#818cf8' : '#fff'}" stroke="#312e81" stroke-width="2.5"/>`;
  }).join('');
  return `<svg viewBox="0 0 128 128" width="128" height="128" style="display:inline-block" aria-hidden="true">${slices}</svg>`;
}

// "What part is colored?" — unit fractions, fractions smaller than 1, and the whole (d/d = 1)
export function generateGrade4FractionShape() {
  const d = pickRandom([2, 3, 4, 5, 6, 8]);
  const n = Math.random() < 0.1 ? d : randInt(1, d - 1);
  const kind = d <= 8 && Math.random() < 0.5 ? 'circle' : 'bar';
  const wrong = [[d - n || 1, d], [n, d + 1], [n, d - n || d + 2], [d, n], [n, d + 2], [n + 1, d + 2]]
    .filter(([a, b]) => b > 0 && a > 0 && !(a === n && b === d));
  return fractionChoice({
    idPrefix: 'math_g4_fshape',
    title: 'מהו השבר?',
    instructionHebrew: 'איזה חלק מהצורה צבוע?',
    formula: fractionShapeSvg(d, n, kind),
    soundCue: 'איזה חלק מהצורה צבוע?',
    correct: [n, d],
    wrong,
    explanation: [
      `סופרים לכמה חלקים שווים חילקו את הצורה: ${d} → זה המכנה (למטה).`,
      `סופרים כמה חלקים צבועים: ${n} → זה המונה (למעלה).`,
      `${frac(n, d)}${n === d ? ' = 1 (כל הצורה צבועה)' : ''}`
    ],
    mistakes: {
      [fracId(d - n || 1, d)]: 'ספרתם את החלקים הלבנים. סופרים את החלקים הצבועים!',
      [fracId(n, d - n || d + 2)]: 'המכנה הוא מספר כל החלקים (צבועים ולבנים יחד), לא רק הלבנים.',
      [fracId(d, n)]: 'הפכתם: למעלה כמה צבועים, למטה כמה חלקים יש בסך הכל.',
      [fracId(n, d + 1)]: `ספרו שוב את כל החלקים: יש ${d}.`
    }
  });
}

// A point on a number line from 0 to 1 split into d parts
export function generateGrade4FractionNumberLine() {
  const d = pickRandom([2, 3, 4, 5, 6, 8, 10]);
  const n = randInt(1, d);
  const W = 300, x0 = 20, x1 = 280;
  const ticks = Array.from({ length: d + 1 }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / d;
    return `<line x1="${x}" y1="${i === 0 || i === d ? 30 : 34}" x2="${x}" y2="${i === 0 || i === d ? 60 : 56}" stroke="#312e81" stroke-width="3"/>`;
  }).join('');
  const px = x0 + ((x1 - x0) * n) / d;
  const svg = `<svg dir="ltr" viewBox="0 0 ${W} 86" width="250" height="72" style="display:inline-block;max-width:100%" aria-hidden="true">` +
    `<line x1="${x0}" y1="45" x2="${x1}" y2="45" stroke="#312e81" stroke-width="3"/>${ticks}` +
    `<text x="${x0}" y="80" text-anchor="middle" font-size="16" font-weight="bold">0</text>` +
    `<text x="${x1}" y="80" text-anchor="middle" font-size="16" font-weight="bold">1</text>` +
    `<path d="M${px - 9},12 L${px + 9},12 L${px},28 Z" fill="#ef4444"/></svg>`;
  return fractionChoice({
    idPrefix: 'math_g4_fline',
    title: 'שבר על ישר המספרים',
    instructionHebrew: 'איזה שבר מסמן החץ?',
    formula: svg,
    soundCue: 'איזה שבר מסמן החץ על ישר המספרים?',
    correct: [n, d],
    wrong: [[n, d + 1], [n + 1, d], [n - 1 || n + 2, d], [n, d - 1 || d + 2]],
    explanation: [
      `הקטע מ-0 עד 1 מחולק ל-${d} חלקים שווים (ספרו את הרווחים, לא את הקווים!) → כל חלק הוא ${frac(1, d)}.`,
      `החץ נמצא אחרי ${n} חלקים → ${frac(n, d)}${n === d ? ' = 1' : ''}`
    ],
    mistakes: {
      [fracId(n, d + 1)]: `ספרתם את הקווים (${d + 1}). סופרים את הרווחים ביניהם: ${d}.`,
      [fracId(n + 1, d)]: 'ספרתם גם את הקו של 0. מתחילים לספור קפיצות מ-0.',
      [fracId(n - 1 || n + 2, d)]: 'ספרו שוב כמה קפיצות יש מ-0 עד החץ.'
    }
  });
}

// Compare two fractions with the same denominator, the same numerator, or one of them 1/2
export function generateGrade4FractionCompare() {
  const kind = pickRandom(['sameD', 'sameN', 'sameN']);
  let a, b, why;
  if (kind === 'sameD') {
    const d = randInt(3, 10);
    a = [randInt(1, d - 1), d]; b = [randInt(1, d - 1), d];
    why = `המכנים שווים (${d}): החלקים באותו גודל, אז משווים כמה חלקים יש – המונים.`;
  } else {
    const n = randInt(1, 4);
    const d1 = randInt(n + 1, 10), d2 = randInt(n + 1, 10);
    a = [n, d1]; b = [n, d2];
    why = 'המונים שווים: לוקחים אותו מספר חלקים. ככל שמחלקים ליותר חלקים (מכנה גדול) – כל חלק קטן יותר!';
  }
  const va = a[0] / a[1], vb = b[0] / b[1];
  const correct = va < vb ? '<' : va > vb ? '>' : '=';
  const bars = `<div>${fractionShapeSvg(a[1], a[0], 'bar')}</div><div>${fractionShapeSvg(b[1], b[0], 'bar')}</div>`;
  const reversedHint = kind === 'sameN'
    ? 'שימו לב: מכנה גדול יותר = חלקים קטנים יותר. למשל, רבע קטן מחצי!'
    : 'הסימן הפוך. הפה הפתוח פונה אל השבר הגדול.';
  return {
    id: `math_g4_fcmp_${Date.now()}_${Math.random()}`,
    category: 'math',
    type: 'arithmetic_choice',
    title: 'השוואת שברים',
    instructionHebrew: 'איזה סימן מתאים: גדול (>), קטן (<) או שווה (=)?',
    formula: `${frac(...a)} ? ${frac(...b)}`,
    soundCue: `איזה סימן מתאים בין ${a[0]} חלקי ${a[1]} ל-${b[0]} חלקי ${b[1]}?`,
    expectedAnswer: correct,
    correctOptionId: correct,
    explanation: [why, bars, `${frac(...a)} ${correct} ${frac(...b)}`],
    mistakes: Object.fromEntries(['<', '=', '>'].filter(x => x !== correct).map(x => [x, x === '=' ? 'השברים לא שווים – הסתכלו על הרצועות.' : correct === '=' ? 'השברים שווים בדיוק.' : reversedHint])),
    options: ['<', '=', '>'].map(s => ({ id: s, label: s }))
  };
}

// Adding / subtracting fractions with the same denominator (results may be mixed numbers)
export function generateGrade4FractionAddSub() {
  const d = randInt(3, 10);
  const add = Math.random() < 0.6;
  let a, b;
  if (add) { a = randInt(1, d - 1); b = randInt(1, d - 1); }
  else { a = randInt(2, 2 * d - 1); b = randInt(1, a - 1); }
  const n = add ? a + b : a - b;
  const sign = add ? '+' : '-';
  return fractionChoice({
    idPrefix: 'math_g4_fadd',
    title: add ? 'חיבור שברים' : 'חיסור שברים',
    instructionHebrew: 'פתרו (המכנים שווים):',
    formula: `${fracValue(a, d)} ${sign} ${frac(b, d)} = ?`,
    soundCue: `כמה זה ${a} חלקי ${d} ${add ? 'ועוד' : 'פחות'} ${b} חלקי ${d}?`,
    correct: [n, d],
    wrong: [[n, add ? 2 * d : d], [n + 1, d], [n - 1 || n + 2, d], [add ? a * b : n + 2, d]],
    explanation: [
      `המכנה אומר מה גודל החלקים: כאן כולם ${frac(1, d)}. גודל החלקים לא משתנה!`,
      `${add ? 'מחברים' : 'מחסרים'} רק את מספר החלקים (המונים): ${ltr(`${a} ${sign} ${b} = ${n}`)}`,
      `→ ${frac(n, d)}${n >= d ? ` = ${fracValue(n, d)}` : ''}`
    ],
    mistakes: add ? { [fracId(n, 2 * d)]: `חיברתם גם את המכנים. אבל החלקים נשארים בגודל ${frac(1, d)} – מחברים רק את המונים.` } : {}
  });
}

// Whole number × fraction as repeated addition: 3 × 2/5 = 2/5 + 2/5 + 2/5 = 6/5 = 1 1/5
export function generateGrade4WholeTimesFraction() {
  const d = randInt(3, 8), n = randInt(1, d - 1), k = randInt(2, 5);
  const p = k * n;
  return fractionChoice({
    idPrefix: 'math_g4_fmul',
    title: 'כפל שלם בשבר',
    instructionHebrew: 'פתרו (כפל הוא חיבור חוזר):',
    formula: `${k} × ${frac(n, d)} = ?`,
    soundCue: `כמה זה ${k} כפול ${n} חלקי ${d}?`,
    correct: [p, d],
    wrong: [[p, k * d], [k + n, d], [n, k * d], [p + n, d]],
    explanation: [
      `${k} × ${frac(n, d)} = ${Array(k).fill(frac(n, d)).join(' + ')}`,
      `מחברים את המונים: ${ltr(`${Array(k).fill(n).join(' + ')} = ${p}`)} → ${frac(p, d)}${p >= d ? ` = ${fracValue(p, d)}` : ''}`
    ],
    mistakes: {
      [fracId(p, k * d)]: `כפלתם גם את המכנה. ${k} פעמים ${frac(n, d)} – החלקים נשארים בגודל ${frac(1, d)}.`,
      [fracId(k + n, d)]: `חיברתם ${k} למונה במקום לכפול.`
    }
  });
}

// ---------------- Multiplication, estimation, 0 and 1 ---------------- //

// Two-digit × two-digit with the extended distributive law: 23 × 14 = 23 × 10 + 23 × 4
export function generateGrade4Mult2Digit() {
  if (Math.random() < 0.3) {
    const a = 10 * randInt(2, 9), b = 10 * randInt(2, 9);
    const correct = a * b;
    const choices = numberChoices(correct, [correct * 9, -correct * 0.9, 100, -100], 4, 1).filter(Number.isInteger);
    while (choices.length < 4) choices.push(correct + 1000 * choices.length);
    return choiceExercise({
      idPrefix: 'math_g4_tt',
      title: 'כפל עשרות בעשרות',
      instructionHebrew: 'פתרו בעל פה:',
      formula: `${a} × ${b} = ?`,
      soundCue: `כמה זה ${a} כפול ${b}?`,
      correct,
      choices: shuffle(choices),
      explanation: [`${ltr(`${a / 10} × ${b / 10} = ${(a * b) / 100}`)}`, `ובכל אחד מהמספרים יש 0 → מוסיפים שני אפסים: ${ltr(fmt(correct))}`],
      mistakes: mistakesFor(choices, correct, c => (c * 10 === correct ? 'חסר אפס: יש אפס גם ב-' + a + ' וגם ב-' + b + '.' : c === correct * 10 ? 'יש אפס אחד יותר מדי.' : ''))
    });
  }
  const a = randInt(12, 49), b = randInt(11, 29);
  const bt = b - (b % 10), bo = b % 10;
  const correct = a * b;
  const forgot = a * bt + bo;                                       // forgot to multiply the ones
  const partial = (a - (a % 10)) * bt + (a % 10) * bo;              // only tens×tens and ones×ones
  const choices = [correct];
  for (const c of [partial, forgot, correct + 10, correct - a]) if (choices.length < 4 && c > 0 && !choices.includes(c)) choices.push(c);
  return choiceExercise({
    idPrefix: 'math_g4_m2',
    title: 'כפל דו-ספרתי בדו-ספרתי',
    instructionHebrew: 'פרקו את אחד המספרים, ופתרו:',
    formula: `${a} × ${b} = ?`,
    soundCue: `כמה זה ${a} כפול ${b}?`,
    correct,
    choices: shuffle(choices),
    explanation: [
      ltr(`${a} × ${b} = ${a} × ${bt} + ${a} × ${bo}`),
      ltr(`${a} × ${bt} = ${a * bt}`),
      ltr(`${a} × ${bo} = ${a * bo}`),
      ltr(`${a * bt} + ${a * bo} = ${fmt(correct)}`)
    ],
    mistakes: mistakesFor(choices, correct, c => {
      if (c === partial) return `כפלתם רק עשרות בעשרות ואחדות באחדות. צריך לכפול את כל ה-${a} גם ב-${bt} וגם ב-${bo}!`;
      if (c === forgot) return `שכחתם לכפול את ה-${bo}: צריך ${ltr(`${a} × ${bo}`)}, לא רק ${bo}.`;
      return '';
    })
  });
}

// "17 × 32 ≈ ?" — round both to tens and multiply
export function generateGrade4MultEstimate() {
  let a, b;
  do { a = randInt(12, 98); b = randInt(12, 98); } while (a % 10 === 0 || b % 10 === 0 || a % 10 === 5 || b % 10 === 5);
  const ra = Math.round(a / 10) * 10, rb = Math.round(b / 10) * 10;
  const correct = ra * rb;
  const choices = [correct];
  for (const c of [correct * 10, correct / 10, correct + ra * 10, correct - rb * 10]) if (choices.length < 4 && Number.isInteger(c) && c > 0 && !choices.includes(c)) choices.push(c);
  return choiceExercise({
    idPrefix: 'math_g4_mest',
    title: 'אומדן מכפלה',
    instructionHebrew: 'עגלו כל מספר לעשרות, ואמדו: בערך כמה זה?',
    formula: `${a} × ${b} ≈ ?`,
    soundCue: `בערך כמה זה ${a} כפול ${b}?`,
    correct,
    choices: shuffle(choices),
    explanation: [
      `${ltr(`${a} ≈ ${ra}`)} , ${ltr(`${b} ≈ ${rb}`)}`,
      ltr(`${ra} × ${rb} = ${fmt(correct)}`),
      `(המדויק: ${ltr(`${a} × ${b} = ${fmt(a * b)}`)} – קרוב!) אומדן עוזר לבדוק אם תשובה הגיונית.`
    ],
    mistakes: mistakesFor(choices, correct, c => (c === correct * 10 ? 'יש אפס אחד יותר מדי.' : c * 10 === correct ? 'חסר אפס: עשרות כפול עשרות נותן מאות.' : `בדקו את העיגול: ${a} ≈ ${ra}, ${b} ≈ ${rb}.`))
  });
}

export function generateGrade4ZeroOne() {
  const n = randInt(15, 999);
  const NONE = 'אי אפשר';
  const forms = [
    { f: `${n} ÷ 0`, c: NONE, rule: 'אי אפשר לחלק ב-0! (איזה מספר כפול 0 ייתן ' + n + '? אין כזה.)' },
    { f: `0 ÷ ${n}`, c: '0', rule: '0 לחלק לכל מספר (שאינו 0) שווה 0.' },
    { f: `${n} × 0`, c: '0', rule: 'כל מספר כפול 0 שווה 0.' },
    { f: `${n} ÷ ${n}`, c: '1', rule: 'מספר לחלק לעצמו שווה 1.' },
    { f: `${n} ÷ 1`, c: String(n), rule: 'כל מספר לחלק ל-1 שווה לעצמו.' },
    { f: `1 × ${n} × 0`, c: '0', rule: 'אם אחד הגורמים הוא 0, המכפלה היא 0.' }
  ];
  const x = pickRandom(forms);
  const options = shuffle([NONE, '0', '1', String(n)]);
  return {
    id: `math_g4_01_${Date.now()}_${Math.random()}`,
    category: 'math',
    type: 'arithmetic_choice',
    title: 'התכונות של 0 ו-1',
    instructionHebrew: 'פתרו – חשבו על החוק:',
    formula: `${x.f} = ?`,
    soundCue: 'פתרו את התרגיל.',
    expectedAnswer: x.c,
    correctOptionId: x.c,
    explanation: [x.rule],
    mistakes: Object.fromEntries(options.filter(o => o !== x.c).map(o => [o,
      o === NONE ? 'כאן כן אפשר. רק חילוק ב-0 אסור.' : x.c === NONE ? 'אי אפשר לחלק ב-0, אז אין תשובה מספרית.' : x.rule])),
    options: options.map(o => ({ id: o, label: o === NONE ? word(o) : o }))
  };
}

export function generateGrade4Rounding() {
  return roundingExercise([100, 1000, 10000, 100000], 1000000, 'math_g4_round');
}

export function generateGrade4Compare() {
  return compareExercise(6, 'math_g4_cmp');
}

// ---------------- Geometry: quadrilaterals, parallel / perpendicular lines ---------------- //

const QUADS = {
  'ריבוע': { pts: [[0, 0], [100, 0], [100, 100], [0, 100]], is: ['ריבוע', 'מלבן', 'מעוין', 'מקבילית'], why: '4 צלעות שוות ו-4 זוויות ישרות.' },
  'מלבן': { pts: [[0, 0], [160, 0], [160, 90], [0, 90]], is: ['מלבן', 'מקבילית'], why: '4 זוויות ישרות, וכל שתי צלעות נגדיות שוות.' },
  'מעוין': { pts: [[70, 0], [140, 55], [70, 110], [0, 55]], is: ['מעוין', 'מקבילית'], why: '4 צלעות שוות, אבל הזוויות לא ישרות.' },
  'מקבילית': { pts: [[40, 0], [180, 0], [140, 90], [0, 90]], is: ['מקבילית'], why: 'שני זוגות של צלעות מקבילות, בלי זוויות ישרות, והצלעות לא כולן שוות.' },
  'טרפז': { pts: [[45, 0], [125, 0], [170, 90], [0, 90]], is: ['טרפז'], why: 'רק זוג אחד של צלעות מקבילות.' }
};

export function generateGrade4Quadrilateral() {
  const name = pickRandom(Object.keys(QUADS));
  const q = QUADS[name];
  const angle = pickRandom([0, 0, 15, -20]);
  const xs = q.pts.map(p => p[0]), ys = q.pts.map(p => p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const right = name === 'ריבוע' || name === 'מלבן';
  const svg = `<svg viewBox="-30 -30 250 170" width="230" height="160" style="display:inline-block" aria-hidden="true">` +
    `<g transform="rotate(${angle} ${cx} ${cy})"><polygon points="${q.pts.map(p => p.join(',')).join(' ')}" fill="#e0e7ff" stroke="#312e81" stroke-width="4" stroke-linejoin="round"/>` +
    (right ? `<path d="M0,14 L14,14 L14,0" fill="none" stroke="#ef4444" stroke-width="3"/>` : '') + '</g></svg>';
  const wrong = shuffle(Object.keys(QUADS).filter(n => n !== name)).slice(0, 3);
  return {
    ...choiceExercise({
      idPrefix: 'math_g4_quad',
      title: 'מרובעים',
      instructionHebrew: 'מה השם המדויק ביותר של המרובע?',
      formula: svg,
      soundCue: 'מה השם המדויק ביותר של המרובע?',
      correct: name,
      choices: shuffle([name, ...wrong]),
      explanation: [`זה ${name}: ${q.why}`, ...(q.is.length > 1 ? [`${name} הוא גם ${q.is.slice(1).join(' וגם ')}, אבל "${name}" הוא השם המדויק ביותר.`] : [])],
      mistakes: Object.fromEntries(wrong.map(w => [w, q.is.includes(w)
        ? `נכון ש${name} הוא גם ${w}! אבל השם המדויק ביותר הוא ${name}: ${q.why}`
        : `${w}: ${QUADS[w].why} למרובע הזה אין את התכונות האלה.`]))
    }),
    options: shuffle([name, ...wrong]).map(o => ({ id: o, label: word(o) }))
  };
}

export function generateGrade4Lines() {
  const type = pickRandom(['parallel', 'perpendicular', 'neither']);
  const base = randInt(-30, 30);
  const second = type === 'parallel' ? base : type === 'perpendicular' ? base + 90 : base + pickRandom([35, 55, 125, 145]);
  const seg = (deg, cx, cy, L = 80) => {
    const r = (deg * Math.PI) / 180, dx = Math.cos(r) * L, dy = -Math.sin(r) * L;
    return `<line x1="${cx - dx}" y1="${cy - dy}" x2="${cx + dx}" y2="${cy + dy}" stroke="#312e81" stroke-width="5" stroke-linecap="round"/>`;
  };
  const svg = `<svg viewBox="0 0 220 180" width="220" height="180" style="display:inline-block" aria-hidden="true">` +
    (type === 'parallel' ? seg(base, 110, 60) + seg(second, 110, 125) : seg(base, 110, 90) + seg(second, 110, 90)) + '</svg>';
  const names = { parallel: 'מקבילים', perpendicular: 'מאונכים', neither: 'נחתכים, לא מאונכים' };
  const correct = names[type];
  const ex = choiceExercise({
    idPrefix: 'math_g4_lines',
    title: 'ישרים מקבילים ומאונכים',
    instructionHebrew: 'איך נקרא הקשר בין שני הקווים?',
    formula: svg,
    soundCue: 'האם הקווים מקבילים, מאונכים, או נחתכים?',
    correct,
    choices: shuffle(Object.values(names)),
    explanation: [
      'מקבילים – לא נפגשים אף פעם, גם אם ממשיכים אותם (כמו פסי רכבת).',
      'מאונכים – נחתכים ויוצרים זווית ישרה (כמו פינה של דף).',
      'נחתכים, לא מאונכים – נפגשים, אבל הזווית ביניהם לא ישרה.'
    ],
    mistakes: Object.fromEntries(Object.values(names).filter(n => n !== correct).map(n => [n,
      type === 'parallel' ? 'הקווים לא נפגשים בכלל – הם מקבילים.' :
      type === 'perpendicular' ? 'הקווים נפגשים בזווית ישרה, כמו פינה של דף – מאונכים.' :
      n === names.perpendicular ? 'הזווית בין הקווים לא ישרה – בדקו עם פינה של דף.' : 'הקווים נפגשים, אז הם לא מקבילים.']))
  });
  ex.options = ex.options.map(o => ({ id: o.id, label: word(o.id) }));
  return ex;
}

// ---------------- Calendar ---------------- //

const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
const MONTHS = [['ינואר', 31], ['מרץ', 31], ['אפריל', 30], ['מאי', 31], ['יוני', 30], ['יולי', 31], ['אוגוסט', 31], ['ספטמבר', 30], ['אוקטובר', 31], ['נובמבר', 30], ['דצמבר', 31]];

export function generateGrade4Calendar() {
  const kind = pickRandom(['weeksToDays', 'daysToWeeks', 'dayAfter', 'monthDays']);
  if (kind === 'dayAfter') {
    const today = randInt(0, 6), after = randInt(8, 24);
    const target = (today + after) % 7;
    const correct = `יום ${DAYS[target]}`;
    const wrong = shuffle([1, -1, 2].map(s => `יום ${DAYS[(target + s + 7) % 7]}`)).slice(0, 3);
    const ex = choiceExercise({
      idPrefix: 'math_g4_cal',
      title: 'לוח שנה',
      instructionHebrew: `היום יום ${DAYS[today]}. איזה יום יהיה בעוד ${after} ימים?`,
      formula: rtlText(`יום ${DAYS[today]} + ${after} ימים = ?`),
      soundCue: `היום יום ${DAYS[today]}. איזה יום יהיה בעוד ${after} ימים?`,
      correct,
      choices: shuffle([correct, ...wrong]),
      explanation: [
        `בשבוע 7 ימים. כל 7 ימים חוזרים לאותו יום.`,
        `${ltr(`${after} = ${Math.floor(after / 7)} × 7 + ${after % 7}`)} → ${Math.floor(after / 7) === 1 ? 'שבוע אחד' : `${Math.floor(after / 7)} שבועות`} מחזירים אותנו ליום ${DAYS[today]}, ועוד ${after % 7} ימים.`,
        `יום ${DAYS[today]} + ${after % 7} ימים → ${correct}`
      ],
      mistakes: {}
    });
    ex.options = ex.options.map(o => ({ id: o.id, label: word(o.id) }));
    ex.mistakes = Object.fromEntries(wrong.map(w => [w, `ספרו שוב: אחרי השבועות השלמים נשארים ${after % 7} ימים.`]));
    return ex;
  }
  if (kind === 'monthDays') {
    const [m, days] = pickRandom(MONTHS);
    const choices = [31, 30, 28, 32].map(String);
    return choiceExercise({
      idPrefix: 'math_g4_cal',
      title: 'לוח שנה',
      instructionHebrew: `כמה ימים יש בחודש ${m}?`,
      formula: rtlText(`${m} = ? ימים`),
      soundCue: `כמה ימים יש בחודש ${m}?`,
      correct: days,
      choices: [31, 30, 28, 32],
      explanation: [
        'טריק האגרופים: סופרים חודשים על פרקי האצבעות. על "בליטה" – 31 ימים, ב"גומה" – 30 (פברואר – 28 או 29).',
        `${m}: ${days} ימים`
      ],
      mistakes: { '32': 'אין חודש עם 32 ימים!', '28': 'רק לפברואר יש 28 (או 29) ימים.', [String(days === 31 ? 30 : 31)]: 'בדקו בלוח השנה או בטריק האגרופים.' }
    });
  }
  if (kind === 'weeksToDays') {
    const w = randInt(2, 9), extra = Math.random() < 0.5 ? randInt(1, 6) : 0;
    const correct = 7 * w + extra;
    const choices = numberChoices(correct, [w, -7, 7, 10 * w - correct], 4, 1);
    return choiceExercise({
      idPrefix: 'math_g4_cal',
      title: 'לוח שנה',
      instructionHebrew: `כמה ימים יש ב-${w} שבועות${extra ? ` ו-${extra} ימים` : ''}?`,
      formula: rtlText(`${w} שבועות${extra ? ` ו-${extra} ימים` : ''} = ? ימים`),
      soundCue: `כמה ימים יש ב-${w} שבועות${extra ? ` ו-${extra} ימים` : ''}?`,
      correct,
      choices,
      explanation: ['בשבוע יש 7 ימים.', ltr(`${w} × 7 = ${7 * w}`), ...(extra ? [ltr(`${7 * w} + ${extra} = ${correct}`)] : [])],
      mistakes: mistakesFor(choices, correct, c => (c === 10 * w ? 'בשבוע יש 7 ימים, לא 10.' : ''))
    });
  }
  const w = randInt(2, 8), r = randInt(1, 6), total = 7 * w + r;
  const correct = `${w} שבועות ו-${r} ימים`;
  const wrong = [`${w + 1} שבועות ו-${r} ימים`, `${w} שבועות ו-${(r + 2) % 7 || 3} ימים`, `${Math.floor(total / 10)} שבועות ו-${total % 10} ימים`].filter(x => x !== correct);
  const ex = choiceExercise({
    idPrefix: 'math_g4_cal',
    title: 'לוח שנה',
    instructionHebrew: `${total} ימים – כמה שבועות וכמה ימים זה?`,
    formula: rtlText(`${total} ימים = ?`),
    soundCue: `${total} ימים, כמה שבועות וכמה ימים זה?`,
    correct,
    choices: shuffle([correct, ...new Set(wrong)]),
    explanation: ['מחלקים ב-7 (ימים בשבוע):', ltr(`${w} × 7 = ${7 * w}`), ltr(`${total} - ${7 * w} = ${r}`), `→ ${correct}`]
  });
  ex.options = ex.options.map(o => ({ id: o.id, label: word(o.id) }));
  ex.mistakes = Object.fromEntries([...new Set(wrong)].map(x => [x, x.startsWith(String(Math.floor(total / 10))) && Math.floor(total / 10) !== w ? 'חילקתם ב-10. בשבוע יש 7 ימים!' : `בדיקה: ${ltr(`${w} × 7 + ${r} = ${total}`)}.`]));
  return ex;
}

// ---------------- Data: pie charts (plus bar charts and pictograms from grade 3) ---------------- //

const PIE_SETS = [
  { topic: 'משחק אהוב', names: ['כדורגל', 'כדורסל', 'שחייה', 'ריקוד'] },
  { topic: 'צבע אהוב', names: ['כחול', 'אדום', 'ירוק', 'צהוב'] },
  { topic: 'חיית מחמד', names: ['כלב', 'חתול', 'דג', 'ארנב'] }
];
const PIE_COLORS = ['#818cf8', '#f472b6', '#34d399', '#fbbf24'];

export function generateGrade4PieChart() {
  if (Math.random() < 0.35) return dataExercise({ idPrefix: 'math_g4_data' });
  const set = pickRandom(PIE_SETS);
  const split = pickRandom([[2, 4, 8, 8], [4, 4, 4, 4], [2, 4, 4], [2, 8, 8, 4]]);   // denominators: 1/2, 1/4, 1/8 ...
  const names = set.names.slice(0, split.length);
  const total = 8 * randInt(2, 5);
  const r = 64, c = 70;
  let start = 0;
  const slices = split.map((den, k) => {
    const sweep = 360 / den;
    const p = a => [c + r * Math.sin((a * Math.PI) / 180), c - r * Math.cos((a * Math.PI) / 180)];
    const [x1, y1] = p(start), [x2, y2] = p(start + sweep);
    const path = `<path d="M${c},${c} L${x1},${y1} A${r},${r} 0 ${sweep > 180 ? 1 : 0} 1 ${x2},${y2} Z" fill="${PIE_COLORS[k]}" stroke="#fff" stroke-width="2"/>`;
    start += sweep;
    return path;
  }).join('');
  const legend = names.map((n, k) => `<span style="white-space:nowrap"><span style="display:inline-block;width:14px;height:14px;background:${PIE_COLORS[k]};border-radius:3px;vertical-align:middle"></span> ${n}</span>`).join(' &nbsp; ');
  const formula = `<span style="display:inline-block;white-space:normal"><svg viewBox="0 0 140 140" width="140" height="140" aria-hidden="true">${slices}</svg>` +
    `<div dir="rtl" style="font-size:15px;font-weight:bold">${legend}</div></span>`;
  const k = randInt(0, split.length - 1);
  const den = split[k];
  const correct = total / den;
  const choices = numberChoices(correct, [correct, -correct / 2, total - correct - correct, 2], 4, 1).filter(Number.isInteger);
  while (choices.length < 4) choices.push(correct + choices.length * 3);
  const partName = { 2: 'חצי', 4: 'רבע', 8: 'שמינית' }[den];
  return choiceExercise({
    idPrefix: 'math_g4_pie',
    title: 'דיאגרמת עוגה',
    instructionHebrew: `${set.topic}: ${total} ילדים ענו על הסקר. כמה ילדים בחרו ב${names[k]}?`,
    formula,
    soundCue: `${total} ילדים ענו על הסקר. כמה ילדים בחרו ב${names[k]}?`,
    correct,
    choices: shuffle([...new Set(choices)]),
    explanation: [
      `החלק של ${names[k]} הוא ${partName} מהעוגה (${frac(1, den)}).`,
      `${partName} מ-${total}: ${ltr(`${total} ÷ ${den} = ${correct}`)}`
    ],
    mistakes: mistakesFor(choices, correct, x => (x === total - correct ? 'זה מספר הילדים שלא בחרו ב' + names[k] + '.' : `בדקו איזה חלק מהעוגה צבוע ב${names[k]}: ${partName}.`))
  });
}
