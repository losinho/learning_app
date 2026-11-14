// Grade 3 Math generators for the new math program (כיתה ג', from תשפ"ז): numbers to 10,000 (comparing,
// ×/÷ 10 and 100, gematria, skip counting), add/subtract in columns, rounding and estimation, multiplying
// whole tens and hundreds, the distributive law, parentheses, properties of 0 and 1, simple equations,
// angles and triangles, the clock with minutes and time spans, reading tables, bar charts and pictograms.
// Every generator also returns `explanation` (steps) and `mistakes` (hints per wrong option) — see explain.js.
import { numberChoices, choiceExercise } from './procedural_math.js';
import { clockSvg } from './grade1_math.js';
import { mistakesFor, PLACE_NAMES } from './explain.js';
import { shuffle } from './random.js';

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
export const ltr = (s) => `<span dir="ltr">${s}</span>`;
export const fmt = (n) => Number(n).toLocaleString('en-US');
// A Hebrew answer inside a big answer button (the buttons are sized for numbers)
export const word = (t) => `<span class="block text-xl sm:text-2xl leading-snug" dir="rtl">${t}</span>`;
// Hebrew text inside the formula banner (the banner is left-to-right and very large)
export const rtlText = (t) => `<span dir="rtl" class="block text-2xl sm:text-3xl leading-snug">${t}</span>`;

// Builds a choice exercise whose options are Hebrew words (id = the word itself)
function wordChoice({ idPrefix, title, instructionHebrew, formula, soundCue, correct, wrong, explanation, mistakes }) {
  const ex = choiceExercise({ idPrefix, title, instructionHebrew, formula, soundCue, correct, choices: shuffle([correct, ...wrong]), explanation, mistakes });
  ex.options = ex.options.map(o => ({ id: o.id, label: word(o.id) }));
  return ex;
}

// ---------------- Number line (rounding) ---------------- //

export function numberLineSvg(low, high, n) {
  const W = 300, x0 = 20, x1 = 280;
  const x = x0 + ((n - low) / (high - low)) * (x1 - x0);
  const mid = (low + high) / 2;
  const tick = (v, label, color = '#312e81') => {
    const tx = x0 + ((v - low) / (high - low)) * (x1 - x0);
    return `<line x1="${tx}" y1="38" x2="${tx}" y2="52" stroke="${color}" stroke-width="3"/>` +
      `<text x="${tx}" y="70" text-anchor="middle" font-size="14" font-weight="bold" fill="${color}">${label}</text>`;
  };
  return `<svg dir="ltr" viewBox="0 0 ${W} 76" width="${W}" height="76" style="display:inline-block;max-width:100%" aria-hidden="true">` +
    `<line x1="${x0}" y1="45" x2="${x1}" y2="45" stroke="#312e81" stroke-width="3"/>` +
    tick(low, fmt(low)) + tick(high, fmt(high)) + tick(mid, fmt(mid), '#94a3b8') +
    `<circle cx="${x}" cy="45" r="7" fill="#ef4444"/>` +
    `<text x="${x}" y="24" text-anchor="middle" font-size="15" font-weight="900" fill="#ef4444">${fmt(n)}</text></svg>`;
}

const UNIT_NAMES = { 10: 'עשרות', 100: 'מאות', 1000: 'אלפים', 10000: 'עשרות אלפים', 100000: 'מאות אלפים' };
const roundTo = (n, unit) => Math.round(n / unit) * unit;   // .5 rounds up for positive numbers

// "עגלו את 4,356 למאות השלמות" — grade 3: tens/hundreds/thousands; grade 4 adds bigger units
export function roundingExercise(units, maxN, idPrefix) {
  const unit = pickRandom(units);
  const low = unit * randInt(1, Math.floor(maxN / unit) - 1);
  // A quarter of the questions sit exactly on the midpoint, the case children get wrong most often
  const n = Math.random() < 0.25 ? low + unit / 2 : low + randInt(1, unit - 1);
  const high = low + unit;
  const correct = roundTo(n, unit);
  const decider = Math.floor(n / (unit / 10)) % 10;           // the digit right of the rounding place
  const otherUnits = Object.keys(UNIT_NAMES).map(Number).filter(u => u !== unit && u < n);
  const choices = [correct, correct === high ? low : high];
  for (const u of shuffle(otherUnits)) {
    const r = roundTo(n, u);
    if (choices.length < 4 && !choices.includes(r) && r > 0) choices.push(r);
  }
  for (const c of [correct + unit, correct - unit, correct + 2 * unit]) if (choices.length < 4 && c > 0 && !choices.includes(c)) choices.push(c);
  const placeOfDecider = PLACE_NAMES[Math.log10(unit) - 1];
  return choiceExercise({
    idPrefix,
    title: 'עיגול מספרים',
    instructionHebrew: `עגלו את המספר ל${UNIT_NAMES[unit]} השלמות הקרובות:`,
    formula: `${fmt(n)} ≈ ?`,
    soundCue: `עגלו את ${n} ל${UNIT_NAMES[unit]} השלמות הקרובות.`,
    correct,
    choices: shuffle(choices),
    explanation: [
      numberLineSvg(low, high, n),
      `${ltr(fmt(n))} נמצא בין ${ltr(fmt(low))} ל-${ltr(fmt(high))}.`,
      `מסתכלים על ספרת ה${placeOfDecider}: ${decider}. ${decider >= 5 ? '5 או יותר → מעגלים למעלה' : 'פחות מ-5 → מעגלים למטה'} → ${ltr(fmt(correct))}`
    ],
    mistakes: mistakesFor(choices, correct, c => {
      if (c === low || c === high) {
        if (n - low === unit / 2) return 'בדיוק באמצע? מעגלים תמיד למעלה!';
        return decider >= 5 ? `ספרת ה${placeOfDecider} היא ${decider}, 5 או יותר, אז מעגלים למעלה.` : `ספרת ה${placeOfDecider} היא ${decider}, פחות מ-5, אז מעגלים למטה.`;
      }
      const u = Object.keys(UNIT_NAMES).map(Number).find(x => x !== unit && roundTo(n, x) === c);
      if (u) return `זה עיגול ל${UNIT_NAMES[u]}. כאן מעגלים ל${UNIT_NAMES[unit]}.`;
      return '';
    })
  });
}

export function generateGrade3Rounding() {
  return roundingExercise([10, 100, 1000], 10000, 'math_g3_round');
}

// Estimation: round each number to hundreds, then add/subtract — "398 + 215 ≈ ?"
export function generateGrade3Estimate() {
  const add = Math.random() < 0.5;
  const a = add ? randInt(120, 780) : randInt(320, 980);
  const b = randInt(110, add ? 990 - a : a - 120);
  if (roundTo(a, 100) === a || roundTo(b, 100) === b) return generateGrade3Estimate();
  const ra = roundTo(a, 100), rb = roundTo(b, 100);
  const correct = add ? ra + rb : ra - rb;
  if (correct <= 0) return generateGrade3Estimate();
  const choices = numberChoices(correct, [-100, 100, 200, -200], 4, 100);
  const sign = add ? '+' : '-';
  return choiceExercise({
    idPrefix: 'math_g3_est',
    title: 'אומדן',
    instructionHebrew: 'עגלו כל מספר למאות, ואמדו: בערך כמה זה?',
    formula: `${a} ${sign} ${b} ≈ ?`,
    soundCue: `בערך כמה זה ${a} ${add ? 'ועוד' : 'פחות'} ${b}?`,
    correct,
    choices,
    explanation: [
      'מעגלים כל מספר למאות השלמות הקרובות:',
      `${ltr(`${a} ≈ ${ra}`)} , ${ltr(`${b} ≈ ${rb}`)}`,
      `${ltr(`${ra} ${sign} ${rb} = ${correct}`)} → התוצאה בערך ${correct}`,
      `(החישוב המדויק: ${ltr(`${a} ${sign} ${b} = ${add ? a + b : a - b}`)} – באמת קרוב!)`
    ],
    mistakes: mistakesFor(choices, correct, () => `בדקו את העיגול: ${a} מתעגל ל-${ra}, ו-${b} מתעגל ל-${rb}.`)
  });
}

// ---------------- Add / subtract in columns (within 10,000) ---------------- //

const COL_NAMES = ['אחדות', 'עשרות', 'מאות', 'אלפים'];
const digitsOf = (n, len) => String(n).padStart(len, '0').split('').reverse().map(Number); // ones first

// The numbers written one under the other, with the carries / borrows in small red digits above
function columnTable(a, b, result, sign, marks) {
  const len = Math.max(String(a).length, String(b).length, String(result).length);
  const cell = (d, extra = '') => `<td style="width:26px;text-align:center;${extra}">${d}</td>`;
  const row = (n, prefix = '') => `<tr>${cell(prefix)}${String(n).padStart(len, ' ').split('').map(d => cell(d === ' ' ? '' : d)).join('')}</tr>`;
  const markRow = `<tr style="font-size:13px;color:#dc2626">${cell('')}${Array.from({ length: len }, (_, i) => cell(marks[len - 1 - i] || '')).join('')}</tr>`;
  return `<table dir="ltr" style="margin:0 auto;font-size:22px;font-weight:900;border-collapse:collapse;font-family:monospace">` +
    markRow + row(a) + row(b, sign) +
    `<tr><td></td><td colspan="${len}" style="border-top:3px solid #312e81"></td></tr>` + row(result) + '</table>';
}

// Typical mistakes: forgetting a carry; subtracting the smaller digit from the bigger in every column
function noCarrySum(a, b) {
  const da = digitsOf(a, 5), db = digitsOf(b, 5);
  return Number(da.map((d, i) => (d + db[i]) % 10).reverse().join(''));
}
function smallFromBig(a, b) {
  const da = digitsOf(a, 5), db = digitsOf(b, 5);
  return Number(da.map((d, i) => Math.abs(d - db[i])).reverse().join(''));
}

export function generateGrade3ColumnAddSub() {
  const add = Math.random() < 0.5;
  let a, b;
  if (add) { a = randInt(1000, 8800); b = randInt(150, Math.min(9999 - a, 4999)); }
  else { a = randInt(1200, 9999); b = randInt(150, a - 100); }
  const correct = add ? a + b : a - b;
  const len = String(Math.max(a, b)).length;
  const da = digitsOf(a, len), db = digitsOf(b, len);
  const steps = [];
  const marks = [];
  if (add) {
    let carry = 0;
    for (let i = 0; i < len; i++) {
      const s = da[i] + db[i] + carry;
      steps.push(`${COL_NAMES[i]}: ${ltr(`${da[i]} + ${db[i]}${carry ? ' + 1' : ''} = ${s}`)}${s >= 10 ? ` → כותבים ${s % 10}, ומעבירים 1 ל${COL_NAMES[i + 1] || 'עמודה הבאה'}` : ''}`);
      carry = s >= 10 ? 1 : 0;
      marks[i + 1] = carry ? '1' : '';
    }
  } else {
    let borrow = 0;
    for (let i = 0; i < len; i++) {
      let top = da[i] - borrow;
      let note = borrow ? `(${da[i]} נתנה 1 → ${top}) ` : '';
      if (top < 0) {
        // A 0 that had to lend: it first borrows from the next column itself (10), then gives 1 → 9
        top = 9;
        note = `(יש כאן 0, אז גם היא פורטת מה${COL_NAMES[i + 1]}: ${ltr('10 - 1 = 9')}) `;
        steps.push(`${COL_NAMES[i]}: ${note}${ltr(`9 - ${db[i]} = ${9 - db[i]}`)}`);
        marks[i] = '9';
        borrow = 1;
      } else if (top < db[i]) {
        steps.push(`${COL_NAMES[i]}: ${note}${ltr(`${top} - ${db[i]}`)} אי אפשר → פורטים 1 מה${COL_NAMES[i + 1]}: ${ltr(`${top + 10} - ${db[i]} = ${top + 10 - db[i]}`)}`);
        marks[i] = String(top + 10);
        borrow = 1;
      } else {
        steps.push(`${COL_NAMES[i]}: ${note}${ltr(`${top} - ${db[i]} = ${top - db[i]}`)}`);
        if (borrow) marks[i] = String(top);
        borrow = 0;
      }
    }
  }
  const typical = add ? noCarrySum(a, b) : smallFromBig(a, b);
  const choices = [correct];
  if (typical !== correct) choices.push(typical);
  for (const c of numberChoices(correct, [-10, 10, -100, 100, -1000, 1000], 6, 0)) if (choices.length < 4 && !choices.includes(c)) choices.push(c);
  const sign = add ? '+' : '-';
  return choiceExercise({
    idPrefix: 'math_g3_col',
    title: add ? 'חיבור במאונך' : 'חיסור במאונך',
    instructionHebrew: 'פתרו (אפשר לכתוב את המספרים אחד מתחת לשני):',
    formula: `${fmt(a)} ${sign} ${fmt(b)} = ?`,
    soundCue: `כמה זה ${a} ${add ? 'ועוד' : 'פחות'} ${b}?`,
    correct,
    choices: shuffle(choices),
    explanation: [
      columnTable(a, b, correct, sign, marks),
      'מתחילים מימין – מהאחדות:',
      ...steps,
      `בדיקה: ${ltr(add ? `${fmt(correct)} - ${fmt(b)} = ${fmt(a)}` : `${fmt(correct)} + ${fmt(b)} = ${fmt(a)}`)} ✔️`
    ],
    mistakes: mistakesFor(choices, correct, c => {
      if (c === typical) return add
        ? 'שכחתם להעביר את ה-1 לעמודה הבאה, כשהסכום בעמודה יצא 10 או יותר.'
        : 'בעמודה שבה הספרה למעלה קטנה יותר, הורדתם את הקטנה מהגדולה. צריך לפרוט מהעמודה השכנה!';
      const d = Math.abs(c - correct);
      if (d === 10 || d === 100 || d === 1000) return `הטעות בספרת ה${COL_NAMES[Math.log10(d)]}. בדקו שוב את העמודה הזו.`;
      return '';
    })
  });
}

// ---------------- ×/÷ 10, 100, 1000 and whole tens / hundreds ---------------- //

export function generateGrade3Times10() {
  const factor = pickRandom([10, 100, 1000]);
  const divide = factor !== 1000 && Math.random() < 0.4;
  const n = factor === 1000 ? randInt(2, 9) : factor === 100 ? randInt(2, 99) : randInt(2, 999);
  const big = n * factor;
  const [formula, correct] = divide ? [`${fmt(big)} ÷ ${fmt(factor)} = ?`, n] : [`${fmt(n)} × ${fmt(factor)} = ?`, big];
  const zeros = String(factor).length - 1;
  const choices = [correct];
  for (const c of [correct * 10, Math.floor(correct / 10), correct * 100, correct + factor]) {
    if (choices.length < 4 && c > 0 && !choices.includes(c)) choices.push(c);
  }
  return choiceExercise({
    idPrefix: 'math_g3_x10',
    title: divide ? `חילוק ב-${fmt(factor)}` : `כפל ב-${fmt(factor)}`,
    instructionHebrew: 'פתרו את התרגיל:',
    formula,
    soundCue: divide ? `כמה זה ${big} לחלק ל-${factor}?` : `כמה זה ${n} כפול ${factor}?`,
    correct,
    choices: shuffle(choices),
    explanation: divide
      ? [`חילוק ב-${fmt(factor)}: כל ספרה זזה ${zeros === 1 ? 'מקום אחד' : `${zeros} מקומות`} ימינה – מורידים ${zeros === 1 ? 'אפס אחד' : `${zeros} אפסים`} מהסוף.`,
         `${ltr(fmt(big))} → ${ltr(fmt(n))}`, `בדיקה: ${ltr(`${fmt(n)} × ${fmt(factor)} = ${fmt(big)}`)} ✔️`]
      : [`כפל ב-${fmt(factor)}: כל ספרה זזה ${zeros === 1 ? 'מקום אחד' : `${zeros} מקומות`} שמאלה – מוסיפים ${zeros === 1 ? 'אפס אחד' : `${zeros} אפסים`} בסוף.`,
         `${ltr(fmt(n))} → ${ltr(fmt(big))}`, `למשל: ${n} אחדות × ${fmt(factor)} = ${n} ${UNIT_NAMES[factor]} = ${fmt(big)}`],
    mistakes: mistakesFor(choices, correct, c => {
      if (c === correct * 10 || c === correct * 100) return `יש יותר מדי אפסים. ב-${fmt(factor)} יש ${zeros === 1 ? 'אפס אחד' : `${zeros} אפסים`}.`;
      if (c * 10 === correct) return `חסר אפס. ב-${fmt(factor)} יש ${zeros === 1 ? 'אפס אחד' : `${zeros} אפסים`}.`;
      if (c === correct + factor) return divide ? '' : `חיברתם ${fmt(factor)} במקום לכפול.`;
      return '';
    })
  });
}

// "4 × 30", "200 × 6", "240 ÷ 6" — whole tens and hundreds times / divided by a one-digit number
export function generateGrade3MultTens() {
  const unit = pickRandom([10, 100]);
  const a = randInt(2, 9), d = randInt(2, 9);
  const whole = d * unit;                    // 30, 600...
  const product = a * whole;
  if (product > 10000) return generateGrade3MultTens();
  const divide = Math.random() < 0.4;
  const unitName = unit === 10 ? 'עשרות' : 'מאות';
  const correct = divide ? whole : product;
  // Mistakes: a zero too many / too few, and the one-digit fact without the zeros
  const choices = [correct];
  for (const c of shuffle([correct * 10, correct / 10, divide ? d : a * d, correct + unit, correct - unit])) {
    if (choices.length < 4 && Number.isInteger(c) && c > 0 && !choices.includes(c)) choices.push(c);
  }
  shuffle(choices);
  return choiceExercise({
    idPrefix: 'math_g3_tens',
    title: `כפל וחילוק ב${unitName} שלמות`,
    instructionHebrew: 'פתרו את התרגיל:',
    formula: divide ? `${fmt(product)} ÷ ${a} = ?` : `${a} × ${fmt(whole)} = ?`,
    soundCue: divide ? `כמה זה ${product} לחלק ל-${a}?` : `כמה זה ${a} כפול ${whole}?`,
    correct,
    choices: shuffle(choices),
    explanation: divide
      ? [`${ltr(fmt(product))} זה ${product / unit} ${unitName}.`, `${ltr(`${product / unit} ÷ ${a} = ${d}`)} → ${d} ${unitName}`, `${d} ${unitName} = ${ltr(fmt(whole))}`]
      : [`${ltr(fmt(whole))} זה ${d} ${unitName}.`, `${ltr(`${a} × ${d} = ${a * d}`)} → ${a * d} ${unitName}`, `${a * d} ${unitName} = ${ltr(fmt(product))}`],
    mistakes: mistakesFor(choices, correct, c => {
      if (c === correct * 10) return 'יש אפס אחד יותר מדי.';
      if (c * 10 === correct) return 'חסר אפס בסוף.';
      if (c === (divide ? d : a * d)) return `שכחתם שאלה ${unitName}: ${c} ${unitName} = ${fmt(c * unit)}.`;
      return '';
    })
  });
}

// Distributive law with a one-digit factor: 23 × 4 = 20 × 4 + 3 × 4
export function generateGrade3Distributive() {
  const a = randInt(3, 9), tens = 10 * randInt(1, 4), ones = randInt(1, 9);
  const b = tens + ones;
  const correct = a * b;
  const forgotOnes = a * tens + ones;          // multiplied only the tens
  const choices = [correct, forgotOnes];
  for (const c of numberChoices(correct, [-a, a, -10, 10], 6, 1)) if (choices.length < 4 && !choices.includes(c)) choices.push(c);
  const rectW = 220, rectTens = Math.round(rectW * tens / b);
  const rect = `<svg dir="ltr" viewBox="0 0 ${rectW + 4} 74" width="${rectW + 4}" height="74" style="display:inline-block" aria-hidden="true">` +
    `<rect x="2" y="2" width="${rectTens}" height="50" fill="#c7d2fe" stroke="#312e81" stroke-width="2"/>` +
    `<rect x="${2 + rectTens}" y="2" width="${rectW - rectTens}" height="50" fill="#fde68a" stroke="#312e81" stroke-width="2"/>` +
    `<text x="${2 + rectTens / 2}" y="32" text-anchor="middle" font-size="14" font-weight="bold">${tens} × ${a}</text>` +
    `<text x="${2 + rectTens + (rectW - rectTens) / 2}" y="32" text-anchor="middle" font-size="14" font-weight="bold">${ones} × ${a}</text>` +
    `<text x="${2 + rectTens / 2}" y="68" text-anchor="middle" font-size="13">${tens}</text>` +
    `<text x="${2 + rectTens + (rectW - rectTens) / 2}" y="68" text-anchor="middle" font-size="13">${ones}</text></svg>`;
  return choiceExercise({
    idPrefix: 'math_g3_dist',
    title: 'פירוק לעשרות ואחדות (חוק הפילוג)',
    instructionHebrew: 'פרקו את המספר לעשרות ואחדות, ופתרו:',
    formula: `${b} × ${a} = ?`,
    soundCue: `כמה זה ${b} כפול ${a}?`,
    correct,
    choices: shuffle(choices),
    explanation: [
      rect,
      ltr(`${b} × ${a} = (${tens} × ${a}) + (${ones} × ${a})`),
      ltr(`${tens * a} + ${ones * a} = ${correct}`)
    ],
    mistakes: mistakesFor(choices, correct, c => (c === forgotOnes
      ? `כפלתם רק את ה-${tens}. צריך לכפול ב-${a} גם את ה-${ones}!`
      : ''))
  });
}

// Parentheses: "(5 + 3) × 4" — what is in the parentheses is done first
export function generateGrade3Parentheses() {
  const a = randInt(2, 12), b = randInt(2, 9), c = randInt(2, 9);
  const forms = [
    { formula: `(${a} + ${b}) × ${c}`, correct: (a + b) * c, noParens: a + b * c, inside: `${a} + ${b} = ${a + b}`, rest: `${a + b} × ${c}` },
    { formula: `${c} × (${a} + ${b})`, correct: c * (a + b), noParens: c * a + b, inside: `${a} + ${b} = ${a + b}`, rest: `${c} × ${a + b}` },
    { formula: `(${a + b + 5} - ${b}) × ${c}`, correct: (a + 5) * c, noParens: a + b + 5 - b * c, inside: `${a + b + 5} - ${b} = ${a + 5}`, rest: `${a + 5} × ${c}` }
  ];
  const f = pickRandom(forms);
  const choices = [f.correct];
  if (f.noParens > 0 && f.noParens !== f.correct) choices.push(f.noParens);
  for (const x of numberChoices(f.correct, [-c, c, -1, 1, 10, -10], 6, 1)) if (choices.length < 4 && !choices.includes(x)) choices.push(x);
  return choiceExercise({
    idPrefix: 'math_g3_paren',
    title: 'סוגריים',
    instructionHebrew: 'זכרו: מה שבתוך הסוגריים עושים קודם!',
    formula: `${f.formula} = ?`,
    soundCue: 'פתרו את התרגיל. זכרו, מה שבתוך הסוגריים עושים קודם.',
    correct: f.correct,
    choices: shuffle(choices),
    explanation: ['קודם הסוגריים:', ltr(f.inside), 'ואז:', ltr(`${f.rest} = ${f.correct}`)],
    mistakes: mistakesFor(choices, f.correct, x => (x === f.noParens ? 'פתרתם כאילו אין סוגריים (קודם הכפל). כאן הסוגריים אומרים: קודם מה שבפנים!' : ''))
  });
}

// ---------------- Comparing numbers up to 10,000 ---------------- //

export function compareExercise(maxDigits, idPrefix) {
  const lo = 10 ** (maxDigits - 2), hi = 10 ** maxDigits - 1;
  let a = randInt(lo, hi), b;
  const kind = Math.random();
  if (kind < 0.15) b = a;
  else if (kind < 0.6) {                                    // same digits rearranged, or one digit changed
    const ds = String(a).split('');
    const i = randInt(0, ds.length - 1);
    ds[i] = String((Number(ds[i]) + randInt(1, 8)) % 10);
    b = Number(ds.join(''));
    if (String(b).length !== String(a).length || b === a) b = a + pickRandom([-1, 1]) * 10 ** randInt(1, maxDigits - 2);
  } else b = randInt(lo, hi);
  const correct = a < b ? '<' : a > b ? '>' : '=';
  const sa = String(a), sb = String(b);
  let reason;
  if (a === b) reason = 'כל הספרות זהות → המספרים שווים.';
  else if (sa.length !== sb.length) reason = `ל-${ltr(fmt(Math.max(a, b)))} יש יותר ספרות, אז הוא גדול יותר.`;
  else {
    const i = [...sa].findIndex((d, k) => d !== sb[k]);
    const place = PLACE_NAMES[sa.length - 1 - i];
    reason = `משווים משמאל. הספרה הראשונה ששונה היא ספרת ה${place}: ${sa[i]} מול ${sb[i]}.`;
  }
  return {
    id: `${idPrefix}_${Date.now()}_${Math.random()}`,
    category: 'math',
    type: 'arithmetic_choice',
    title: 'השוואת מספרים',
    instructionHebrew: 'איזה סימן מתאים: גדול (>), קטן (<) או שווה (=)?',
    formula: `${fmt(a)} ? ${fmt(b)}`,
    soundCue: `איזה סימן מתאים בין ${a} ל-${b}?`,
    expectedAnswer: correct,
    correctOptionId: correct,
    explanation: [reason, ltr(`${fmt(a)} ${correct} ${fmt(b)}`), 'הפה הפתוח של הסימן פונה אל המספר הגדול.'],
    mistakes: Object.fromEntries(['<', '=', '>'].filter(x => x !== correct).map(x => [x,
      x === '=' ? 'המספרים לא זהים – בדקו ספרה אחרי ספרה.' : correct === '=' ? 'המספרים זהים לגמרי, אז הם שווים (=).' : 'הסימן הפוך! הפה הפתוח צריך להיות מול המספר הגדול.'])),
    options: ['<', '=', '>'].map(s => ({ id: s, label: s }))
  };
}

export function generateGrade3Compare() {
  return compareExercise(4, 'math_g3_cmp');
}

// ---------------- Gematria (letter values) ---------------- //

const LETTERS = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');
const FINALS = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
export const letterValue = (ch) => {
  const i = LETTERS.indexOf(FINALS[ch] || ch);
  return i < 9 ? i + 1 : i < 18 ? (i - 8) * 10 : (i - 17) * 100;
};
const GEMATRIA_WORDS = ['אב', 'יד', 'דג', 'גן', 'לב', 'טל', 'אם', 'חג', 'יום', 'אור', 'ספר', 'בית', 'שלום', 'ילד', 'עט', 'שמש', 'ים', 'גשם', 'פרח', 'כיתה', 'חלב', 'לחם'];

export function generateGrade3Gematria() {
  const kind = pickRandom(['value', 'letter', 'word', 'word']);
  const table = 'א–ט: 1–9 · י–צ: 10, 20 … 90 · ק–ת: 100, 200, 300, 400';
  if (kind === 'word') {
    const w = pickRandom(GEMATRIA_WORDS);
    const parts = [...w].map(letterValue);
    const correct = parts.reduce((s, x) => s + x, 0);
    const ordinal = [...w].map(ch => LETTERS.indexOf(FINALS[ch] || ch) + 1).reduce((s, x) => s + x, 0);
    const choices = [correct];
    if (ordinal !== correct) choices.push(ordinal);
    for (const c of numberChoices(correct, [-10, 10, -1, 1, 100, -100], 6, 1)) if (choices.length < 4 && !choices.includes(c)) choices.push(c);
    return choiceExercise({
      idPrefix: 'math_g3_gem',
      title: 'גימטרייה',
      instructionHebrew: 'מה הערך (הגימטרייה) של המילה? מחברים את ערכי האותיות.',
      formula: `<span dir="rtl">${w}</span> = ?`,
      soundCue: `מה הגימטרייה של המילה ${w}?`,
      correct,
      choices: shuffle(choices),
      explanation: [table, `${[...w].map(ch => `${ch} = ${letterValue(ch)}`).join(' , ')}`, ltr(`${parts.join(' + ')} = ${correct}`)],
      mistakes: mistakesFor(choices, correct, c => (c === ordinal
        ? 'חיברתם את מקום האותיות באלף-בית. אבל אחרי ט (9) הערכים קופצים: י = 10, כ = 20...'
        : 'בדקו שוב את ערך כל אות, וחברו בזהירות.'))
    });
  }
  const i = randInt(5, 21);
  const ch = LETTERS[i], v = letterValue(ch);
  if (kind === 'value') {
    const choices = [v];
    for (const c of [i + 1, v + (v >= 100 ? 100 : 10), v - (v >= 100 ? 100 : v >= 10 ? 10 : 1), v + 1, v * 10]) if (c > 0 && !choices.includes(c)) choices.push(c);
    return choiceExercise({
      idPrefix: 'math_g3_gemv',
      title: 'גימטרייה',
      instructionHebrew: 'מה הערך של האות בגימטרייה?',
      formula: `<span dir="rtl">${ch}</span> = ?`,
      soundCue: `מה הערך של האות ${ch}?`,
      correct: v,
      choices: shuffle(choices.slice(0, 4)),
      explanation: [table, `${ch} = ${v}`],
      mistakes: mistakesFor(choices, v, c => (c === i + 1 ? `${ch} היא האות ה-${i + 1} באלף-בית, אבל אחרי ט הערכים קופצים בעשרות ואחר כך במאות.` : ''))
    });
  }
  const wrong = shuffle(LETTERS.filter(l => l !== ch && Math.abs(LETTERS.indexOf(l) - i) <= 3)).slice(0, 3);
  return wordChoice({
    idPrefix: 'math_g3_geml',
    title: 'גימטרייה',
    instructionHebrew: `איזו אות שווה ${v}?`,
    formula: `${v} = ?`,
    soundCue: `איזו אות שווה ${v}?`,
    correct: ch,
    wrong,
    explanation: [table, `${ch} = ${v}`],
    mistakes: Object.fromEntries(wrong.map(l => [l, `${l} = ${letterValue(l)}, לא ${v}.`]))
  });
}

// ---------------- Skip counting (sequences) ---------------- //

export function generateGrade3Sequence() {
  const step = pickRandom([20, 25, 50, 200, 250, 500, 100, 1000]);
  const down = Math.random() < 0.35;
  const len = 5;
  const maxStart = 10000 - step * (len - 1);
  let start = step * randInt(0, Math.floor(maxStart / step));
  if (Math.random() < 0.4 && step <= 100) start += pickRandom([5, 10, 15, 30]) % step; // not always on a multiple
  const terms = Array.from({ length: len }, (_, k) => (down ? start + step * (len - 1) - step * k : start + step * k));
  const at = randInt(1, len - 1);
  const correct = terms[at];
  const choices = numberChoices(correct, [-step, step, -10, 10, 100, -100], 4, 0);
  return choiceExercise({
    idPrefix: 'math_g3_seq',
    title: 'סדרות ודילוגים',
    instructionHebrew: 'איזה מספר חסר בסדרה?',
    formula: terms.map((t, k) => (k === at ? '?' : fmt(t))).join(', '),
    soundCue: 'איזה מספר חסר בסדרה?',
    correct,
    choices,
    explanation: [
      `בודקים את ההפרש בין שני מספרים צמודים: כל פעם ${down ? 'יורדים' : 'עולים'} ב-${step}.`,
      ltr(terms.map(fmt).join(' → '))
    ],
    mistakes: mistakesFor(choices, correct, () => `בדקו את הקפיצה: בין כל שני מספרים יש הפרש של ${step}.`)
  });
}

// ---------------- Equations, properties of 0 and 1 ---------------- //

// "___ + 200 = 300 + 148" — solved by insight (comparing both sides) rather than long calculation
export function generateGrade3Equation() {
  const kind = pickRandom(['balance', 'neighbor', 'missing']);
  let formula, correct, explanation, choices;
  if (kind === 'balance') {
    const a = 100 * randInt(1, 9), shift = 100 * randInt(1, 5), b = randInt(101, 899);
    // ? + a = (a + shift) + b  →  ? = b + shift
    correct = b + shift;
    formula = `? + ${fmt(a)} = ${fmt(a + shift)} + ${b}`;
    explanation = [
      `${ltr(fmt(a + shift))} גדול מ-${ltr(fmt(a))} ב-${shift}.`,
      `כדי ששני הצדדים יהיו שווים, המספר החסר צריך להיות גדול מ-${b} ב-${shift}:`,
      ltr(`${b} + ${shift} = ${fmt(correct)}`),
      `בדיקה: ${ltr(`${fmt(correct)} + ${fmt(a)} = ${fmt(correct + a)}`)} , ${ltr(`${fmt(a + shift)} + ${b} = ${fmt(a + shift + b)}`)} ✔️`
    ];
    choices = numberChoices(correct, [-2 * shift, -shift + 0, shift, -100, 100], 4, 1);
    if (!choices.includes(b - shift) && b - shift > 0) choices[choices.findIndex(c => c !== correct)] = b - shift;
  } else if (kind === 'neighbor') {
    const a = randInt(1001, 8999), b = 100 * randInt(2, 9);
    // a + (b - 1) = ?  given  a + b
    correct = a + b - 1;
    formula = `<span dir="rtl" class="block text-2xl">אם ${ltr(`${fmt(a)} + ${b} = ${fmt(a + b)}`)}</span>${fmt(a)} + ${b - 1} = ?`;
    explanation = [`${b - 1} קטן מ-${b} ב-1, אז גם התוצאה קטנה ב-1:`, ltr(`${fmt(a + b)} - 1 = ${fmt(correct)}`)];
    choices = numberChoices(correct, [2, 1, -1, 10, -10], 4, 1);
  } else {
    const c = randInt(1200, 9800), a = randInt(150, c - 100);
    correct = c - a;
    formula = `${fmt(a)} + ? = ${fmt(c)}`;
    explanation = ['חיבור וחיסור הם פעולות הפוכות. המספר החסר הוא:', ltr(`${fmt(c)} - ${fmt(a)} = ${fmt(correct)}`), `בדיקה: ${ltr(`${fmt(a)} + ${fmt(correct)} = ${fmt(c)}`)} ✔️`];
    choices = numberChoices(correct, [-10, 10, -100, 100, 1, -1], 4, 1);
  }
  return choiceExercise({
    idPrefix: 'math_g3_eq',
    title: 'משוואות',
    instructionHebrew: 'איזה מספר מתאים במקום סימן השאלה?',
    formula,
    soundCue: 'איזה מספר מתאים במקום סימן השאלה?',
    correct,
    choices: shuffle(choices),
    explanation,
    mistakes: mistakesFor(choices, correct, c => `בדיקה: הציבו ${fmt(c)} במקום סימן השאלה – שני הצדדים לא יוצאים שווים.`)
  });
}

export function generateGrade3ZeroOne() {
  const n = randInt(12, 999);
  const forms = [
    { f: `${n} × 0`, c: 0, rule: 'כל מספר כפול 0 שווה 0.' },
    { f: `0 × ${n}`, c: 0, rule: '0 כפול כל מספר שווה 0.' },
    { f: `${n} × 1`, c: n, rule: 'כל מספר כפול 1 שווה לעצמו.' },
    { f: `${n} ÷ 1`, c: n, rule: 'כל מספר לחלק ל-1 שווה לעצמו.' },
    { f: `${n} ÷ ${n}`, c: 1, rule: 'מספר לחלק לעצמו שווה 1.' },
    { f: `0 ÷ ${n}`, c: 0, rule: '0 לחלק לכל מספר שווה 0 (אין מה לחלק).' },
    { f: `${n} + 0`, c: n, rule: 'הוספת 0 לא משנה את המספר.' },
    { f: `${n} - ${n}`, c: 0, rule: 'מספר פחות עצמו שווה 0.' }
  ];
  const x = pickRandom(forms);
  const choices = [...new Set([x.c, 0, 1, n, n + 1, n * 10])].filter(v => v !== undefined);
  const four = shuffle([x.c, ...shuffle(choices.filter(v => v !== x.c)).slice(0, 3)]);
  return choiceExercise({
    idPrefix: 'math_g3_01',
    title: 'הכפל והחילוק ב-0 וב-1',
    instructionHebrew: 'פתרו בלי לחשב הרבה – חשבו על החוק!',
    formula: `${x.f} = ?`,
    soundCue: 'פתרו את התרגיל.',
    correct: x.c,
    choices: four,
    explanation: [x.rule, ltr(`${x.f} = ${x.c}`)],
    mistakes: mistakesFor(four, x.c, () => x.rule)
  });
}

// ---------------- Angles and triangles ---------------- //

const ANGLE_TYPES = { acute: 'חדה', right: 'ישרה', obtuse: 'קהה', straight: 'שטוחה' };

function angleSvg(deg, rotate) {
  const r = 90, cx = 110, cy = 100;
  const p = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy - r * Math.sin((a * Math.PI) / 180)];
  const [x1, y1] = p(rotate), [x2, y2] = p(rotate + deg);
  let mark;
  if (deg === 90) {
    const q = (a, s) => [cx + s * Math.cos((a * Math.PI) / 180), cy - s * Math.sin((a * Math.PI) / 180)];
    const [ax, ay] = q(rotate, 16), [bx, by] = q(rotate + 90, 16), [mx, my] = [ax + bx - cx, ay + by - cy];
    mark = `<path d="M${ax},${ay} L${mx},${my} L${bx},${by}" fill="none" stroke="#ef4444" stroke-width="3"/>`;
  } else {
    const s = 24, [ax, ay] = [cx + s * Math.cos((rotate * Math.PI) / 180), cy - s * Math.sin((rotate * Math.PI) / 180)];
    const [bx, by] = [cx + s * Math.cos(((rotate + deg) * Math.PI) / 180), cy - s * Math.sin(((rotate + deg) * Math.PI) / 180)];
    mark = `<path d="M${ax},${ay} A${s},${s} 0 0 0 ${bx},${by}" fill="none" stroke="#ef4444" stroke-width="3"/>`;
  }
  return `<svg viewBox="0 0 220 200" width="200" height="180" style="display:inline-block" aria-hidden="true">` +
    `<line x1="${cx}" y1="${cy}" x2="${x1}" y2="${y1}" stroke="#312e81" stroke-width="5" stroke-linecap="round"/>` +
    `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#312e81" stroke-width="5" stroke-linecap="round"/>` +
    mark + `<circle cx="${cx}" cy="${cy}" r="4" fill="#312e81"/></svg>`;
}

export function generateGrade3Angle() {
  const type = pickRandom(['acute', 'acute', 'right', 'right', 'obtuse', 'obtuse', 'straight']);
  const deg = type === 'acute' ? randInt(25, 70) : type === 'right' ? 90 : type === 'obtuse' ? randInt(110, 160) : 180;
  const rotate = type === 'straight' ? pickRandom([0, 0, 30, -30]) : randInt(-20, 100);
  const correct = ANGLE_TYPES[type];
  return wordChoice({
    idPrefix: 'math_g3_angle',
    title: 'סוגי זוויות',
    instructionHebrew: 'איזו זווית זו: חדה, ישרה, קהה או שטוחה?',
    formula: angleSvg(deg, rotate),
    soundCue: 'איזו זווית זו?',
    correct,
    wrong: Object.values(ANGLE_TYPES).filter(t => t !== correct),
    explanation: [
      'משווים לפינה של דף (זווית ישרה):',
      'קטנה מהפינה = חדה · בדיוק כמו הפינה = ישרה · גדולה מהפינה = קהה · קו ישר = שטוחה',
      type === 'right' ? 'כאן הזווית בדיוק כמו פינה של דף (הריבוע האדום מסמן זווית ישרה).'
        : type === 'straight' ? 'שתי השוקיים יוצרות קו ישר אחד – זווית שטוחה.'
        : type === 'acute' ? 'כאן הפתיחה קטנה מפינה של דף – זווית חדה.' : 'כאן הפתיחה גדולה מפינה של דף, אבל זה עוד לא קו ישר – זווית קהה.'
    ],
    mistakes: Object.fromEntries(Object.values(ANGLE_TYPES).filter(t => t !== correct).map(t => [t,
      t === ANGLE_TYPES.right ? 'זווית ישרה היא בדיוק כמו פינה של דף. נסו להצמיד פינה של דף לזווית.' :
      t === ANGLE_TYPES.straight ? 'זווית שטוחה נראית כמו קו ישר אחד.' :
      t === ANGLE_TYPES.acute ? 'זווית חדה קטנה מפינה של דף.' : 'זווית קהה גדולה מפינה של דף.']))
  });
}

// Triangle with base angles A and B (degrees), drawn to fit; the right angle (if any) gets a square mark
function triangleSvg(A, B) {
  const C = 180 - A - B, rad = d => (d * Math.PI) / 180;
  const L = 200;
  const side = (L * Math.sin(rad(B))) / Math.sin(rad(C));
  const pts = [[0, 0], [L, 0], [side * Math.cos(rad(A)), side * Math.sin(rad(A))]];
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), maxY = Math.max(...ys);
  const scale = Math.min(1, 200 / (maxX - minX), 150 / maxY);
  const P = pts.map(([x, y]) => [10 + (x - minX) * scale, 10 + (maxY - y) * scale]);
  const angles = [A, B, C];
  let mark = '';
  const ri = angles.indexOf(90);
  if (ri >= 0) {
    const [vx, vy] = P[ri], others = P.filter((_, k) => k !== ri);
    const u = others.map(([x, y]) => { const d = Math.hypot(x - vx, y - vy); return [(x - vx) / d * 14, (y - vy) / d * 14]; });
    mark = `<path d="M${vx + u[0][0]},${vy + u[0][1]} L${vx + u[0][0] + u[1][0]},${vy + u[0][1] + u[1][1]} L${vx + u[1][0]},${vy + u[1][1]}" fill="none" stroke="#ef4444" stroke-width="3"/>`;
  }
  const w = (maxX - minX) * scale + 20, h = maxY * scale + 20;
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="display:inline-block" aria-hidden="true">` +
    `<polygon points="${P.map(p => p.join(',')).join(' ')}" fill="#e0e7ff" stroke="#312e81" stroke-width="4" stroke-linejoin="round"/>${mark}</svg>`;
}

const TRIANGLE_TYPES = { acute: 'חד-זווית', right: 'ישר-זווית', obtuse: 'קהה-זווית' };

export function generateGrade3Triangle() {
  const type = pickRandom(['acute', 'right', 'obtuse']);
  let A, B;
  if (type === 'right') { A = 90; B = randInt(30, 60); if (Math.random() < 0.5) [A, B] = [B, A]; }
  else if (type === 'obtuse') { A = randInt(105, 135); B = randInt(15, 180 - A - 15); if (Math.random() < 0.5) [A, B] = [B, A]; }
  else { A = randInt(50, 80); B = randInt(Math.max(50, 100 - A), 80); }
  const correct = TRIANGLE_TYPES[type];
  return wordChoice({
    idPrefix: 'math_g3_tri',
    title: 'סוגי משולשים',
    instructionHebrew: 'איזה משולש זה? (לפי הזוויות)',
    formula: triangleSvg(A, B),
    soundCue: 'איזה משולש זה, לפי הזוויות שלו?',
    correct,
    wrong: Object.values(TRIANGLE_TYPES).filter(t => t !== correct),
    explanation: [
      'מסתכלים על הזווית הגדולה ביותר במשולש:',
      'יש זווית ישרה → ישר-זווית · יש זווית קהה → קהה-זווית · כל הזוויות חדות → חד-זווית',
      type === 'right' ? 'כאן יש זווית ישרה (מסומנת בריבוע אדום).' : type === 'obtuse' ? 'כאן יש זווית אחת רחבה – גדולה מפינה של דף.' : 'כאן כל שלוש הזוויות קטנות מפינה של דף.'
    ],
    mistakes: Object.fromEntries(Object.values(TRIANGLE_TYPES).filter(t => t !== correct).map(t => [t,
      t === TRIANGLE_TYPES.acute ? 'במשולש חד-זווית כל הזוויות קטנות מפינה של דף. בדקו את הזווית הגדולה.' :
      t === TRIANGLE_TYPES.right ? 'במשולש ישר-זווית יש זווית בדיוק כמו פינה של דף.' : 'במשולש קהה-זווית יש זווית אחת גדולה מפינה של דף.']))
  });
}

// ---------------- Time: clock with minutes, time spans ---------------- //

const pad = (m) => String(m).padStart(2, '0');

export function generateGrade3Clock() {
  const h = randInt(1, 12), m = 5 * randInt(1, 11);
  const wrap = x => ((x - 1 + 12) % 12) + 1;
  const correct = `${h}:${pad(m)}`;
  const minuteNumber = m / 5;
  const wrongs = [
    `${h}:${pad(minuteNumber)}`,                       // read the number the long hand points at as minutes
    `${wrap(h + 1)}:${pad(m)}`,                        // hour hand past the half → read the next hour
    `${minuteNumber === 0 ? 12 : minuteNumber}:${pad(5 * (h % 12))}`  // swapped the hands
  ];
  for (const w of [`${wrap(h - 1)}:${pad(m)}`, `${h}:${pad((m + 30) % 60)}`, `${wrap(h + 1)}:${pad(minuteNumber)}`]) wrongs.push(w);
  const unique = [...new Set(wrongs)].filter(w => w !== correct);
  const choices = shuffle([correct, ...unique.slice(0, 3)]);
  return {
    id: `math_g3_clock_${Date.now()}_${Math.random()}`,
    category: 'math',
    type: 'arithmetic_choice',
    title: 'שעות ודקות',
    instructionHebrew: 'מה השעה בשעון?',
    formula: clockSvg(h, m),
    soundCue: 'מה השעה בשעון?',
    expectedAnswer: correct,
    correctOptionId: correct,
    explanation: [
      `המחוג הקצר מראה את השעה: הוא אחרי ה-${h}${m >= 30 ? ` (ובדרך ל-${wrap(h + 1)})` : ''} → ${h}`,
      `המחוג הארוך מראה דקות: הוא על ${minuteNumber}, וכל מספר בשעון שווה 5 דקות → ${ltr(`${minuteNumber} × 5 = ${m}`)}`,
      `→ ${ltr(correct)}`
    ],
    mistakes: Object.fromEntries(choices.filter(c => c !== correct).map(c => [c,
      c === `${h}:${pad(minuteNumber)}` ? `המחוג הארוך על ${minuteNumber}, אבל זה לא ${minuteNumber} דקות: כל מספר = 5 דקות.` :
      c === `${wrap(h + 1)}:${pad(m)}` ? `המחוג הקצר עוד לא הגיע ל-${wrap(h + 1)}. השעה היא המספר שהוא כבר עבר.` :
      'את השעה מראה המחוג הקצר, ואת הדקות – המחוג הארוך.'])),
    options: choices.map(c => ({ id: c, label: c }))
  };
}

const spanLabel = (mins) => {
  const hh = Math.floor(mins / 60), mm = mins % 60;
  const hPart = hh === 0 ? '' : hh === 1 ? 'שעה' : hh === 2 ? 'שעתיים' : `${hh} שעות`;
  const mPart = mm === 0 ? '' : `${mm} דקות`;
  return [hPart, mPart].filter(Boolean).join(' ו-');
};

export function generateGrade3TimeSpan() {
  const startH = randInt(7, 15), startM = 15 * randInt(0, 3) + (Math.random() < 0.4 ? 5 * randInt(0, 2) : 0);
  const span = 60 * randInt(0, 3) + 15 * randInt(1, 3);
  const end = startH * 60 + startM + span;
  const endH = Math.floor(end / 60), endM = end % 60;
  const correct = spanLabel(span);
  // Typical mistake: subtracting hours and minutes separately (10:15 − 8:45 → "2 hours and 30 minutes")
  const naive = (endH - startH) * 60 + Math.abs(endM - startM);
  const wrongSpans = [...new Set([naive, span + 60, span - 15, span + 15, span - 60].filter(s => s > 0 && s !== span))];
  const wrong = shuffle(wrongSpans).slice(0, 3).map(spanLabel);
  const startT = `${startH}:${pad(startM)}`, endT = `${endH}:${pad(endM)}`;
  return wordChoice({
    idPrefix: 'math_g3_span',
    title: 'כמה זמן עבר?',
    instructionHebrew: `השיעור התחיל ב-${startT} ונגמר ב-${endT}. כמה זמן הוא נמשך?`,
    formula: rtlText(`${ltr(startT)} ← ${ltr(endT)}`),
    soundCue: `השיעור התחיל ב-${startT} ונגמר ב-${endT}. כמה זמן הוא נמשך?`,
    correct,
    wrong,
    explanation: [
      'סופרים קודם שעות שלמות, ואחר כך את הדקות שנשארו:',
      ...Array.from({ length: Math.floor(span / 60) }, (_, k) => `${ltr(`${startH + k}:${pad(startM)}`)} ← ${ltr(`${startH + k + 1}:${pad(startM)}`)} : שעה`),
      span % 60 ? `${ltr(`${startH + Math.floor(span / 60)}:${pad(startM)}`)} ← ${ltr(endT)} : ${span % 60} דקות` : '',
      `סך הכל: ${correct}`
    ].filter(Boolean),
    mistakes: naive !== span && wrong.includes(spanLabel(naive))
      ? { [spanLabel(naive)]: 'חיסרתם שעות לחוד ודקות לחוד. בשעה יש 60 דקות – עדיף לספור קדימה מהשעה הראשונה.' }
      : {}
  });
}

// ---------------- Data: tables, bar charts, pictograms ---------------- //

const DATA_SETS = [
  { topic: 'הפרי האהוב בכיתה', items: [['🍎', 'תפוח'], ['🍌', 'בננה'], ['🍇', 'ענבים'], ['🍉', 'אבטיח']], unit: 'ילדים' },
  { topic: 'איך מגיעים לבית הספר', items: [['🚶', 'ברגל'], ['🚌', 'אוטובוס'], ['🚗', 'רכב'], ['🚲', 'אופניים']], unit: 'ילדים' },
  { topic: 'ספרים שנקראו החודש', items: [['🦁', 'אריה'], ['🐬', 'דולפין'], ['🚀', 'טיל'], ['🦄', 'חד-קרן']], unit: 'ספרים', who: true },
  { topic: 'מזג האוויר בחודש', items: [['☀️', 'שמש'], ['☁️', 'עננים'], ['🌧️', 'גשם'], ['💨', 'רוח']], unit: 'ימים' }
];

export function barChartSvg(items, values, step) {
  const max = Math.max(...values);
  const top = Math.ceil(max / step) * step;
  const H = 150, barW = 40, gap = 22, left = 34;
  const y = v => 10 + H - (v / top) * H;
  let grid = '';
  for (let v = 0; v <= top; v += step) {
    grid += `<line x1="${left}" y1="${y(v)}" x2="${left + items.length * (barW + gap)}" y2="${y(v)}" stroke="#e2e8f0" stroke-width="1"/>` +
      `<text x="${left - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="#475569">${v}</text>`;
  }
  const bars = items.map(([emoji], k) => {
    const x = left + gap / 2 + k * (barW + gap);
    return `<rect x="${x}" y="${y(values[k])}" width="${barW}" height="${10 + H - y(values[k])}" fill="${['#818cf8', '#f472b6', '#34d399', '#fbbf24'][k]}" rx="3"/>` +
      `<text x="${x + barW / 2}" y="${H + 32}" text-anchor="middle" font-size="20">${emoji}</text>`;
  }).join('');
  const w = left + items.length * (barW + gap) + 4;
  return `<svg dir="ltr" viewBox="0 0 ${w} ${H + 40}" width="${w}" height="${H + 40}" style="display:inline-block" aria-hidden="true">${grid}` +
    `<line x1="${left}" y1="10" x2="${left}" y2="${10 + H}" stroke="#334155" stroke-width="2"/>` +
    `<line x1="${left}" y1="${10 + H}" x2="${w}" y2="${10 + H}" stroke="#334155" stroke-width="2"/>${bars}</svg>`;
}

function pictogramHtml(items, values, per, icon) {
  return `<div dir="rtl" style="display:inline-block;text-align:right;font-size:22px;line-height:1.5">` +
    items.map(([emoji, name], k) => `<div><span style="display:inline-block;min-width:90px;font-size:18px;font-weight:bold">${emoji} ${name}</span> ${icon.repeat(values[k] / per)}</div>`).join('') +
    `<div style="font-size:15px;font-weight:bold;color:#475569">מקרא: ${icon} = ${per}</div></div>`;
}

export function dataExercise({ idPrefix, allowPictogram = true }) {
  const set = pickRandom(DATA_SETS);
  const pictogram = allowPictogram && Math.random() < 0.4;
  const step = pictogram ? pickRandom([2, 5]) : pickRandom([1, 2, 5]);
  const per = step;
  let values;
  do { values = set.items.map(() => step * randInt(1, pictogram ? 6 : 9)); } while (new Set(values).size < 4);
  const chart = pictogram ? pictogramHtml(set.items, values, per, '⬛') : barChartSvg(set.items, values, step);
  const legend = pictogram ? '' : `<div dir="rtl" style="font-size:15px;font-weight:bold">${set.items.map(([e, n]) => `${e} ${n}`).join(' · ')}</div>`;
  const formula = `<span style="display:inline-block;white-space:normal">${chart}${legend}</span>`;
  const kind = pickRandom(['most', 'howMany', 'diff', 'total']);
  const reading = pictogram
    ? `בפיקטוגרם כל ⬛ שווה ${per}. סופרים ריבועים וכופלים ב-${per}.`
    : `בדיאגרמה בודקים לאיזה גובה מגיע כל עמוד, לפי המספרים בצד (בקפיצות של ${step}).`;
  const valueLines = set.items.map(([e, n], k) => `${e} ${n}: ${values[k]}`).join(' · ');
  const title = pictogram ? 'קריאת פיקטוגרם' : 'קריאת דיאגרמת עמודות';
  if (kind === 'most') {
    const askMost = Math.random() < 0.6;
    const target = askMost ? Math.max(...values) : Math.min(...values);
    const k = values.indexOf(target);
    const correct = set.items[k][1];
    return wordChoice({
      idPrefix, title, formula,
      instructionHebrew: `${set.topic}: מה ${askMost ? 'הכי הרבה' : 'הכי מעט'}?`,
      soundCue: `${set.topic}. מה ${askMost ? 'הכי הרבה' : 'הכי מעט'}?`,
      correct,
      wrong: set.items.map(i => i[1]).filter(n => n !== correct),
      explanation: [reading, valueLines, `${askMost ? 'הכי הרבה' : 'הכי מעט'}: ${correct} (${target})`],
      mistakes: Object.fromEntries(set.items.filter((_, j) => j !== k).map(([, n], j) => [n, `ל${n} יש ${values[set.items.findIndex(i => i[1] === n)]}. השוו לעמודות האחרות.`]))
    });
  }
  const [i, j] = shuffle([0, 1, 2, 3]).slice(0, 2);
  const [ni, nj] = [set.items[i][1], set.items[j][1]];
  let correct, instruction, steps, choices, hint = () => '';
  if (kind === 'howMany') {
    correct = values[i];
    instruction = `${set.topic}: כמה ${set.unit} – ${ni}?`;
    steps = [reading, `${set.items[i][0]} ${ni}: ${correct}`];
    choices = numberChoices(correct, [-step, step, pictogram ? correct / per - correct : 1, 2 * step], 4, 1);
    if (pictogram) hint = c => (c === correct / per ? `ספרתם ${c} ריבועים, אבל כל ריבוע שווה ${per}!` : '');
  } else if (kind === 'diff') {
    const [big, small] = values[i] >= values[j] ? [i, j] : [j, i];
    correct = values[big] - values[small];
    instruction = `${set.topic}: בכמה ${set.items[big][1]} יותר מ${set.items[small][1]}?`;
    steps = [reading, `${set.items[big][1]}: ${values[big]} , ${set.items[small][1]}: ${values[small]}`, ltr(`${values[big]} - ${values[small]} = ${correct}`)];
    choices = numberChoices(correct, [step, -step, values[big] - correct, values[big] + values[small] - correct], 4, 1);
    hint = c => (c === values[big] + values[small] ? 'חיברתם. "בכמה יותר" שואלים את ההפרש – מחסרים!' : c === values[big] ? `זה רק המספר של ${set.items[big][1]}. צריך את ההפרש.` : '');
  } else {
    correct = values.reduce((s, v) => s + v, 0);
    instruction = `${set.topic}: כמה ${set.unit} בסך הכל?`;
    steps = [reading, valueLines, ltr(`${values.join(' + ')} = ${correct}`)];
    choices = numberChoices(correct, [step, -step, 2 * step, -2 * step], 4, 1);
  }
  return choiceExercise({
    idPrefix, title, formula,
    instructionHebrew: instruction,
    soundCue: instruction,
    correct,
    choices,
    explanation: steps,
    mistakes: mistakesFor(choices, correct, hint)
  });
}

export function generateGrade3Data() {
  return dataExercise({ idPrefix: 'math_g3_data' });
}
