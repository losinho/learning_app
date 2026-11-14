// Procedural Math Exercise Generator for Infinite Practice
// Aligned with Israeli Ministry of Education (Preschool & Grades 3-4)
import { shuffle, shuffleInPlace } from './random.js';
import {
  mistakesFor, explainMultiply, multiplyHint, explainDivide, divideHint, explainRemainder, remainderHint,
  explainOrder, explainPlaceValue, placeValueHint, dotGrid
} from './explain.js';


const KID_EMOJIS = ['🍎', '⭐', '🚗', '🎈', '🐟', '⚽', '🐻', '🍓', '🧁', '🌸', '🐱', '🦋'];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------- AGE 5 PROCEDURAL GENERATORS (INFINITE) ---------------- //

export function generateAge5Comparison() {
  const emoji = pickRandom(KID_EMOJIS);
  let left = randInt(1, 9);
  let right = randInt(1, 9);
  if (Math.random() < 0.25) {
    right = left;
  }

  const symbol = left < right ? '<' : (left > right ? '>' : '=');

  return {
    id: 'math_proc_comp_' + Date.now() + '_' + Math.random(),
    ageGroup: '5',
    category: 'math',
    type: 'comparison_drill',
    title: 'השוואת כמויות',
    instructionHebrew: 'איזה סימן מתאים? גדול (>), קטן (<) או שווה (=)?',
    visual: true,
    emoji: emoji,
    leftVal: left,
    rightVal: right,
    expectedAnswer: symbol,
    // Counts are not printed on the picture (the child counts); they are revealed after answering.
    // dir="rtl" lays the numbers out like the picture (left group on the right) and mirrors < > the same way.
    feedbackNote: `<span dir="rtl">${left} ${symbol} ${right}</span>`
  };
}

export function generateAge5OperatorChoice() {
  const emoji = pickRandom(KID_EMOJIS);
  const isPlus = Math.random() < 0.5;
  let a, b, result;

  if (isPlus) {
    a = randInt(1, 5);
    b = randInt(1, 4);
    result = a + b;
  } else {
    a = randInt(2, 9);
    b = randInt(1, a - 1);
    result = a - b;
  }

  return {
    id: 'math_proc_op_' + Date.now() + '_' + Math.random(),
    ageGroup: '5',
    category: 'math',
    type: 'operator_choice',
    title: 'חיבור או חיסור?',
    instructionHebrew: 'האם הכמות גדלה או קטנה? בחרו ועוד (+) או פחות (-)',
    visual: true,
    emoji: emoji,
    numA: a,
    numB: b,
    result: result,
    correctOperator: isPlus ? '+' : '-',
    // Counts are not printed on the picture; revealed after answering, laid out like the picture (RTL)
    feedbackNote: `<span dir="rtl">${a} ${isPlus ? '+' : '-'} ${b} = ${result}</span>`
  };
}

export function generateAge5VisualCounting() {
  const emoji = pickRandom(KID_EMOJIS);
  // Gan goal: count objects up to 20. Half the questions stay within 10 so small amounts keep coming up.
  const count = Math.random() < 0.5 ? randInt(1, 10) : randInt(11, 20);

  // Generate 3 unique choices including the correct count
  const choices = [count];
  while (choices.length < 3) {
    const fake = Math.max(1, count + randInt(-2, 2));
    if (!choices.includes(fake)) {
      choices.push(fake);
    }
  }
  shuffleInPlace(choices);

  return {
    id: 'math_proc_count_' + Date.now() + '_' + Math.random(),
    ageGroup: '5',
    category: 'math',
    type: 'visual_counting',
    title: 'סופרים ומזהים',
    instructionHebrew: `כמה פריטים יש בתמונה?`,
    emoji: emoji,
    count: count,
    correctOptionId: String(count),
    expectedAnswer: count,
    options: choices.map(c => ({
      id: String(c),
      label: String(c)
    }))
  };
}

// "How many are left?" — some items are crossed out (they went away); count the rest
export function generateAge5VisualSubtraction() {
  const emoji = pickRandom(KID_EMOJIS);
  const total = randInt(3, 10);
  const takeAway = randInt(1, total - 1);
  const left = total - takeAway;

  const choices = [left];
  while (choices.length < 3) {
    const fake = Math.max(1, left + randInt(-2, 2));
    if (!choices.includes(fake)) {
      choices.push(fake);
    }
  }
  shuffleInPlace(choices);

  return {
    id: 'math_proc_sub_' + Date.now() + '_' + Math.random(),
    ageGroup: '5',
    category: 'math',
    type: 'visual_subtraction',
    title: 'כמה נשארו?',
    instructionHebrew: `כמה ${emoji} נשארו? אלה עם ✕ כבר הלכו.`,
    emoji: emoji,
    total: total,
    takeAway: takeAway,
    expectedAnswer: left,
    correctOptionId: String(left),
    // Revealed after answering, laid out like the picture (RTL)
    feedbackNote: `<span dir="rtl">${total} - ${takeAway} = ${left}</span>`,
    options: choices.map(c => ({
      id: String(c),
      label: String(c)
    }))
  };
}

const ORDINALS = ['רִאשׁוֹן', 'שֵׁנִי', 'שְׁלִישִׁי', 'רְבִיעִי', 'חֲמִישִׁי', 'שִׁשִּׁי'];
const ORDINAL_SPOKEN = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];
const LINE_ANIMALS = ['🐶', '🐱', '🐰', '🐻', '🐵', '🐸', '🐷', '🦁', '🐮', '🐔', '🐭', '🐢'];

// Ordinal numbers to "sixth": 6 different animals stand in line behind a flag — who is third?
export function generateAge5Ordinal() {
  const animals = shuffle(LINE_ANIMALS).slice(0, 6);
  const position = randInt(0, 5);

  return {
    id: `math_5_ordinal_${position + 1}`,
    ageGroup: '5',
    category: 'math',
    type: 'ordinal_line',
    title: 'מספרים סודרים',
    instructionHebrew: `הדגל מסמן את תחילת התור. מי ה${ORDINAL_SPOKEN[position]} בתור?`,
    targetWordVocalized: ORDINALS[position],
    soundCue: `מי ה${ORDINAL_SPOKEN[position]} בתור?`,
    correctOptionId: String(position),
    feedbackNote: `${animals[position]} = ${ORDINALS[position]}`,
    options: animals.map((emoji, idx) => ({ id: String(idx), emoji }))
  };
}

export function generateAge5VisualAdd() {
  const emoji = pickRandom(KID_EMOJIS);
  const a = randInt(1, 5);
  const b = randInt(1, 4);
  const sum = a + b;

  // 3 choices including correct sum
  const choices = [sum];
  while (choices.length < 3) {
    const fake = Math.max(1, sum + randInt(-2, 2));
    if (!choices.includes(fake)) {
      choices.push(fake);
    }
  }
  shuffleInPlace(choices);

  return {
    id: 'math_proc_visadd_' + Date.now() + '_' + Math.random(),
    ageGroup: '5',
    category: 'math',
    type: 'visual_addition',
    title: 'סופרים ומחברים',
    instructionHebrew: `כמה ${emoji} יש בסך הכל?`,
    emoji: emoji,
    numA: a,
    numB: b,
    expectedAnswer: sum,
    correctOptionId: String(sum),
    // Counts are not printed on the picture; revealed after answering, laid out like the picture (RTL)
    feedbackNote: `<span dir="rtl">${a} + ${b} = ${sum}</span>`,
    options: choices.map(num => ({
      id: String(num),
      label: String(num)
    }))
  };
}

// ---------------- GRADE 3 PROCEDURAL GENERATORS (INFINITE; originally the "age 8-9" set) ---------------- //

export function generateAge8Multiplication() {
  const a = randInt(2, 10);
  const b = randInt(2, 10);
  const product = a * b;

  const choices = [product];
  while (choices.length < 4) {
    const fake = Math.max(2, product + pickRandom([-a, a, -10, 10, -1, 1]));
    if (!choices.includes(fake)) {
      choices.push(fake);
    }
  }
  shuffleInPlace(choices);

  return {
    id: 'math_proc_mult_' + Date.now() + '_' + Math.random(),
    ageGroup: '8-9',
    category: 'math',
    type: 'arithmetic_choice',
    title: 'לוח הכפל',
    instructionHebrew: 'פתרו את תרגיל הכפל:',
    formula: `${a} × ${b} = ?`,
    soundCue: `כמה זה ${a} כפול ${b}?`,
    expectedAnswer: product,
    correctOptionId: String(product),
    explanation: explainMultiply(a, b),
    mistakes: mistakesFor(choices, product, w => multiplyHint(a, b, w)),
    options: choices.map(c => ({
      id: String(c),
      label: String(c)
    }))
  };
}

export function generateAge8MissingFactor() {
  const a = randInt(2, 9);
  const b = randInt(2, 9);
  const product = a * b;

  const choices = [b];
  while (choices.length < 4) {
    const fake = Math.max(1, b + randInt(-3, 3));
    if (!choices.includes(fake)) {
      choices.push(fake);
    }
  }
  shuffleInPlace(choices);

  return {
    id: 'math_proc_miss_' + Date.now() + '_' + Math.random(),
    ageGroup: '8-9',
    category: 'math',
    type: 'arithmetic_choice',
    title: 'השלמת גורם חסר',
    instructionHebrew: 'איזה מספר משלים את התרגיל?',
    formula: `${a} × [ ? ] = ${product}`,
    soundCue: `${a} כפול כמה שווה ${product}?`,
    expectedAnswer: b,
    correctOptionId: String(b),
    explanation: [
      `מחפשים: ${a} כפול כמה שווה ${product}? זה כמו ${ltrSpan(`${product} ÷ ${a}`)}`,
      ...explainDivide(product, a, b).slice(1)
    ],
    mistakes: mistakesFor(choices, b, w => `בדיקה: ${ltrSpan(`${a} × ${w} = ${a * w}`)}, ולא ${product}.`),
    options: choices.map(c => ({
      id: String(c),
      label: String(c)
    }))
  };
}

export function generateAge8Division() {
  const divisor = randInt(2, 9);
  const quotient = randInt(2, 9);
  const dividend = divisor * quotient;

  const choices = [quotient];
  while (choices.length < 4) {
    const fake = Math.max(1, quotient + randInt(-3, 3));
    if (!choices.includes(fake)) {
      choices.push(fake);
    }
  }
  shuffleInPlace(choices);

  return {
    id: 'math_proc_div_' + Date.now() + '_' + Math.random(),
    ageGroup: '8-9',
    category: 'math',
    type: 'arithmetic_choice',
    title: 'חילוק עד 100',
    instructionHebrew: 'פתרו את תרגיל החילוק:',
    formula: `${dividend} ÷ ${divisor} = ?`,
    soundCue: `כמה זה ${dividend} לחלק ל-${divisor}?`,
    expectedAnswer: quotient,
    correctOptionId: String(quotient),
    explanation: explainDivide(dividend, divisor, quotient),
    mistakes: mistakesFor(choices, quotient, w => divideHint(dividend, divisor, w)),
    options: choices.map(c => ({
      id: String(c),
      label: String(c)
    }))
  };
}

// Shared helper: `count` distinct numeric choices around the correct answer, shuffled
export function numberChoices(correct, offsets, count = 4, min = 0) {
  const choices = [correct];
  let guard = 0;
  while (choices.length < count && guard++ < 200) {
    const fake = correct + pickRandom(offsets);
    if (fake >= min && !choices.includes(fake)) choices.push(fake);
  }
  return shuffleInPlace(choices);
}

const ltrSpan = (s) => `<span dir="ltr">${s}</span>`;

// explanation: steps shown after a wrong answer; mistakes: { optionId: hint } for specific wrong choices
export function choiceExercise({ idPrefix, title, instructionHebrew, formula, soundCue, correct, choices, feedbackNote, explanation, mistakes }) {
  return {
    explanation,
    mistakes,
    id: `${idPrefix}_${Date.now()}_${Math.random()}`,
    category: 'math',
    type: 'arithmetic_choice',
    title,
    instructionHebrew,
    formula,
    soundCue,
    expectedAnswer: correct,
    correctOptionId: String(correct),
    feedbackNote,
    options: choices.map(c => ({ id: String(c), label: typeof c === 'number' ? c.toLocaleString('en-US') : String(c) }))
  };
}

// Grade 3: division within 100 with a remainder (one-digit divisor) — "17 ÷ 5 = 3 (שארית 2)"
export function generateGrade3DivisionWithRemainder() {
  const divisor = randInt(2, 9);
  const quotient = randInt(2, 11);
  const remainder = randInt(1, divisor - 1);
  const dividend = divisor * quotient + remainder;
  if (dividend > 100) return generateGrade3DivisionWithRemainder();

  const key = (q, r) => `${q}r${r}`;
  // Quotient big, remainder on a smaller second line so the answer buttons don't wrap awkwardly
  const label = (q, r) => `${q}<span class="block text-base sm:text-lg font-bold" dir="rtl">שארית ${r}</span>`;
  const candidates = [[quotient, remainder]];
  // Typical mistakes: quotient or remainder off by one. Every option keeps a proper remainder
  // (0 ≤ r < divisor), so no wrong option is secretly also true (e.g. 17 ÷ 5 = 2 remainder 7).
  const fakes = [[quotient + 1, remainder], [quotient - 1, remainder], [quotient, remainder + 1], [quotient, remainder - 1],
    [quotient + 1, remainder - 1], [quotient - 1, remainder + 1]]
    .filter(([q, r]) => q >= 1 && r >= 0 && r < divisor);
  for (const f of shuffleInPlace(fakes)) {
    if (candidates.length === 4) break;
    if (!candidates.some(c => key(...c) === key(...f))) candidates.push(f);
  }
  const options = shuffleInPlace(candidates);

  return {
    id: `math_g3_rem_${Date.now()}_${Math.random()}`,
    category: 'math',
    type: 'arithmetic_choice',
    title: 'חילוק עם שארית',
    instructionHebrew: 'פתרו את תרגיל החילוק (עם שארית):',
    formula: `${dividend} ÷ ${divisor} = ?`,
    soundCue: `כמה זה ${dividend} לחלק ל-${divisor}?`,
    expectedAnswer: key(quotient, remainder),
    correctOptionId: key(quotient, remainder),
    feedbackNote: `<span dir="ltr">${divisor} × ${quotient} + ${remainder} = ${dividend}</span>`,
    explanation: explainRemainder(dividend, divisor, quotient, remainder),
    mistakes: Object.fromEntries(options.filter(([q, r]) => q !== quotient || r !== remainder)
      .map(([q, r]) => [key(q, r), remainderHint(dividend, divisor, q, r)])),
    options: options.map(([q, r]) => ({ id: key(q, r), label: label(q, r) }))
  };
}

const PLACE_NAMES = ['אחדות', 'עשרות', 'מאות', 'אלפים', 'עשרות אלפים', 'מאות אלפים'];

// Place value: "מהי ספרת המאות במספר 4,382?" — grade 3 up to 10,000, grade 4 up to 1,000,000
export function placeValue(digits, idPrefix) {
  const number = randInt(10 ** (digits - 1), 10 ** digits - 1);
  const place = randInt(0, digits - 1);
  const digitAt = (n, p) => Math.floor(n / 10 ** p) % 10;
  const correct = digitAt(number, place);
  // Other digits of the same number are the natural mistakes; fill with random digits if needed
  const choices = [correct];
  const otherDigits = [...String(number)].map(Number).filter(d => d !== correct);
  for (const d of shuffleInPlace(otherDigits)) {
    if (choices.length < 4 && !choices.includes(d)) choices.push(d);
  }
  while (choices.length < 4) {
    const d = randInt(0, 9);
    if (!choices.includes(d)) choices.push(d);
  }
  return choiceExercise({
    idPrefix,
    title: 'ערך המקום',
    instructionHebrew: `מהי ספרת ה${PLACE_NAMES[place]} במספר?`,
    formula: number.toLocaleString('en-US'),
    soundCue: `מהי ספרת ה${PLACE_NAMES[place]} במספר ${number}?`,
    correct,
    choices: shuffleInPlace(choices),
    feedbackNote: `ספרת ה${PLACE_NAMES[place]}: ${correct}`,
    explanation: explainPlaceValue(number, place),
    mistakes: mistakesFor(choices, correct, w => placeValueHint(number, place, w))
  });
}

export function generateGrade3PlaceValue() {
  return placeValue(4, 'math_g3_place');
}

// Grade 3: order of operations — multiplication before addition/subtraction
export function generateGrade3OrderOfOperations() {
  const a = randInt(2, 20);
  const b = randInt(2, 9);
  const c = randInt(2, 9);
  const p = b * c;
  const forms = [
    { formula: `${a} + ${b} × ${c}`, correct: a + p, leftToRight: (a + b) * c, rest: `${a} + ${p}` },
    // "b × c + a" read left to right is also correct, so the classic mistake here is adding first: b × (c + a)
    { formula: `${b} × ${c} + ${a}`, correct: p + a, leftToRight: b * (c + a), rest: `${p} + ${a}` },
    { formula: `${a + p} - ${b} × ${c}`, correct: a, leftToRight: (a + p - b) * c, rest: `${a + p} - ${p}` }
  ];
  const form = pickRandom(forms);
  const choices = [form.correct];
  if (form.leftToRight !== form.correct) choices.push(form.leftToRight); // the classic mistake
  for (const c2 of numberChoices(form.correct, [-2, -1, 1, 2, 10, -10], 6, 0)) {
    if (choices.length < 4 && !choices.includes(c2)) choices.push(c2);
  }
  return choiceExercise({
    idPrefix: 'math_g3_order',
    title: 'סדר פעולות החשבון',
    instructionHebrew: 'זכרו: כפל לפני חיבור וחיסור!',
    formula: `${form.formula} = ?`,
    soundCue: 'פתרו את התרגיל. זכרו, כפל לפני חיבור וחיסור.',
    correct: form.correct,
    choices: shuffleInPlace(choices),
    explanation: explainOrder({ first: `${b} × ${c}`, firstValue: p, rest: form.rest, correct: form.correct }),
    mistakes: mistakesFor(choices, form.correct, w => (w === form.leftToRight
      ? 'עשיתם קודם את החיבור או החיסור. צריך קודם את הכפל!'
      : ''))
  });
}

// ---------------- GRADE 4 PROCEDURAL GENERATORS (INFINITE) ---------------- //

// Long multiplication by a one-digit number (two- and three-digit numbers)
export function generateGrade4Multiplication() {
  const a = Math.random() < 0.6 ? randInt(12, 99) : randInt(101, 999);
  const b = randInt(3, 9);
  const product = a * b;
  const choices = numberChoices(product, [-b, b, -10, 10, -100, 100], 4, 1);
  const parts = [...String(a)].map((d, i, arr) => Number(d) * 10 ** (arr.length - 1 - i)).filter(Boolean);
  return choiceExercise({
    idPrefix: 'math_g4_mult',
    title: 'כפל במאונך',
    instructionHebrew: 'פתרו את תרגיל הכפל (אפשר לחשב במאונך):',
    formula: `${a} × ${b} = ?`,
    soundCue: `כמה זה ${a} כפול ${b}?`,
    correct: product,
    choices,
    // Split by place value: 347 × 6 = 300 × 6 + 40 × 6 + 7 × 6
    explanation: [
      'מפרקים את המספר לפי ערך המקום, וכופלים כל חלק:',
      ...parts.map(p => ltrSpan(`${p} × ${b} = ${(p * b).toLocaleString('en-US')}`)),
      ltrSpan(`${parts.map(p => (p * b).toLocaleString('en-US')).join(' + ')} = ${product.toLocaleString('en-US')}`)
    ],
    mistakes: mistakesFor(choices, product, w => {
      const d = Math.abs(w - product);
      if (d === 10 || d === 100) return 'כמעט! טעות בנשיאה: כשתוצאה של עמודה גדולה מ-9, מעבירים את העשרות לעמודה הבאה.';
      if (d === b) return `זה ${ltrSpan(`${w / b} × ${b}`)}. בדקו שוב את ספרת האחדות.`;
      return '';
    })
  });
}

// Long division by a one-digit number, no remainder
export function generateGrade4LongDivision() {
  const divisor = randInt(2, 9);
  const quotient = randInt(12, 120);
  const dividend = divisor * quotient;
  const choices = numberChoices(quotient, [-1, 1, -10, 10, -2, 2], 4, 1);
  return choiceExercise({
    idPrefix: 'math_g4_div',
    title: 'חילוק ארוך',
    instructionHebrew: 'פתרו את תרגיל החילוק:',
    formula: `${dividend} ÷ ${divisor} = ?`,
    soundCue: `כמה זה ${dividend} לחלק ל-${divisor}?`,
    correct: quotient,
    choices,
    feedbackNote: `<span dir="ltr">${quotient} × ${divisor} = ${dividend}</span>`,
    explanation: explainDivide(dividend, divisor, quotient),
    mistakes: mistakesFor(choices, quotient, w => divideHint(dividend, divisor, w))
  });
}

// "4 + 1 + 7 = 12" — the digit sum, written out
function digitSum(n) {
  const digits = [...String(n)].map(Number);
  return ltrSpan(`${digits.join(' + ')} = ${digits.reduce((s, x) => s + x, 0)}`);
}

// Divisibility by 3, 6 or 9: exactly one of the numbers divides evenly
export function generateGrade4Divisibility() {
  const d = pickRandom([3, 6, 9]);
  const correct = d * randInt(12, 111);
  const choices = [correct];
  while (choices.length < 3) {
    const n = randInt(30, 999);
    if (n % d !== 0 && !choices.includes(n)) choices.push(n);
  }
  return choiceExercise({
    idPrefix: 'math_g4_divis',
    title: 'סימני התחלקות',
    instructionHebrew: `איזה מספר מתחלק ב-${d} בלי שארית?`,
    formula: `÷ ${d}`,
    soundCue: `איזה מספר מתחלק ב-${d} בלי שארית?`,
    correct,
    choices: shuffleInPlace(choices),
    feedbackNote: `<span dir="ltr">${correct} ÷ ${d} = ${correct / d}</span>`,
    explanation: [
      d === 6
        ? 'מספר מתחלק ב-6 אם הוא זוגי וגם סכום הספרות שלו מתחלק ב-3.'
        : `מספר מתחלק ב-${d} אם סכום הספרות שלו מתחלק ב-${d}.`,
      `${correct}: ${digitSum(correct)}`,
      ltrSpan(`${correct} ÷ ${d} = ${correct / d}`) + ' ✔️'
    ],
    mistakes: mistakesFor(choices, correct, w => {
      if (d === 6 && w % 2 === 1 && w % 3 === 0) return `${w} מתחלק ב-3, אבל הוא אי-זוגי, אז הוא לא מתחלק ב-6.`;
      if (d === 9 && w % 3 === 0) return `${w}: ${digitSum(w)}. מתחלק ב-3, אבל לא ב-9.`;
      return `${w}: ${digitSum(w)}. לא מתחלק ב-${d === 6 ? 3 : d}.`;
    })
  });
}

// Rectangle area or perimeter, with a drawing of the rectangle and its side lengths
export function generateGrade4RectangleMeasure() {
  const w = randInt(3, 12);
  const h = randInt(2, 9);
  const askArea = Math.random() < 0.5;
  const area = w * h;
  const perimeter = 2 * (w + h);
  const correct = askArea ? area : perimeter;
  const other = askArea ? perimeter : area;   // mixing up area and perimeter is the classic mistake
  const choices = [correct];
  for (const c of [other, w + h, correct + 2, correct - 2]) {
    if (choices.length < 4 && c > 0 && !choices.includes(c)) choices.push(c);
  }
  // Drawn to scale (longest side 150px); width label below, height label on the left
  const scale = 150 / Math.max(w, h);
  const rw = Math.round(w * scale), rh = Math.round(h * scale);
  const label = (n) => `${n} ס״מ`;
  const svg = `<svg viewBox="-64 -6 ${rw + 72} ${rh + 36}" width="${rw + 72}" height="${rh + 36}" style="display:inline-block;vertical-align:middle">` +
    `<rect x="0" y="0" width="${rw}" height="${rh}" fill="#c7d2fe" stroke="#312e81" stroke-width="3"/>` +
    `<text x="${rw / 2}" y="${rh + 24}" text-anchor="middle" font-size="18" font-weight="bold" fill="#312e81">${label(w)}</text>` +
    `<text x="-8" y="${rh / 2 + 6}" text-anchor="end" font-size="18" font-weight="bold" fill="#312e81">${label(h)}</text></svg>`;
  return choiceExercise({
    idPrefix: 'math_g4_rect',
    title: askArea ? 'שטח מלבן' : 'היקף מלבן',
    instructionHebrew: askArea ? 'מהו השטח של המלבן (בסמ"ר)?' : 'מהו ההיקף של המלבן (בס"מ)?',
    formula: svg,
    soundCue: askArea ? `מהו השטח של מלבן שאורכו ${w} ורוחבו ${h}?` : `מהו ההיקף של מלבן שאורכו ${w} ורוחבו ${h}?`,
    correct,
    choices: shuffleInPlace(choices),
    feedbackNote: askArea
      ? `<span dir="ltr">${w} × ${h} = ${area}</span>`
      : `<span dir="ltr">${w} + ${h} + ${w} + ${h} = ${perimeter}</span>`,
    explanation: askArea
      ? [
          'שטח = כמה ריבועים של סמ"ר נכנסים במלבן:',
          `${h} שורות, ובכל שורה ${w} ריבועים`,
          ltrSpan(`${w} × ${h} = ${area}`) + ' סמ"ר'
        ]
      : [
          'היקף = הולכים מסביב למלבן ומחברים את כל 4 הצלעות:',
          ltrSpan(`${w} + ${h} + ${w} + ${h} = ${perimeter}`) + ' ס"מ',
          `או בקיצור: ${ltrSpan(`(${w} + ${h}) × 2 = ${perimeter}`)}`
        ],
    mistakes: mistakesFor(choices, correct, c => {
      if (c === other) return askArea ? 'זה ההיקף (מסביב). שטח זה מה שבפנים: כופלים אורך ברוחב.' : 'זה השטח (מה שבפנים). היקף זה הדרך מסביב: מחברים את כל הצלעות.';
      if (c === w + h) return askArea ? 'חיברתם את הצלעות. בשטח כופלים אורך ברוחב.' : 'חיברתם רק 2 צלעות. למלבן יש 4 צלעות!';
      return '';
    })
  });
}

// A bar split into `den` equal parts with the first `num` colored, each part labeled with its value
function barSvg(den, num, partValue) {
  const cell = Math.min(40, Math.floor(280 / den));
  const cells = Array.from({ length: den }, (_, i) =>
    `<rect x="${i * cell}" y="0" width="${cell}" height="30" fill="${i < num ? '#86efac' : '#fff'}" stroke="#312e81" stroke-width="2"/>` +
    `<text x="${i * cell + cell / 2}" y="20" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e293b">${partValue}</text>`
  ).join('');
  return `<svg dir="ltr" viewBox="-2 -2 ${den * cell + 4} 34" width="${den * cell + 4}" height="34" style="display:inline-block" aria-hidden="true">${cells}</svg>`;
}

// Fraction of a quantity: "3/4 מ-12"
export function generateGrade4FractionOfQuantity() {
  const den = pickRandom([2, 3, 4, 5, 6, 8, 10]);
  const num = randInt(1, den - 1);
  const whole = den * randInt(2, 10);
  const correct = (whole / den) * num;
  const part = whole / den;
  const choices = numberChoices(correct, [-part, part, -1, 1, 2], 4, 1);
  return choiceExercise({
    idPrefix: 'math_g4_fracq',
    title: 'שבר מכמות',
    instructionHebrew: 'כמה זה?',
    // Hebrew inside the formula, so it is laid out right-to-left (the card shows formulas left-to-right)
    formula: `<span dir="rtl"><span dir="ltr">${num}/${den}</span> מ-${whole} = ?</span>`,
    soundCue: `כמה זה ${num} חלקי ${den} מ-${whole}?`,
    correct,
    choices,
    feedbackNote: `<span dir="ltr">${whole} ÷ ${den} × ${num} = ${correct}</span>`,
    explanation: [
      `מחלקים את ${whole} ל-${den} חלקים שווים: ${ltrSpan(`${whole} ÷ ${den} = ${part}`)}`,
      `${barSvg(den, num, part)}`,
      num === 1 ? `לוקחים חלק אחד → ${correct}` : `לוקחים ${num} חלקים: ${ltrSpan(`${part} × ${num} = ${correct}`)}`
    ],
    mistakes: mistakesFor(choices, correct, c => {
      if (c === part && num > 1) return `זה רק חלק אחד (${ltrSpan(`1/${den}`)}). צריך ${num} חלקים.`;
      if (c === correct + part || c === correct - part) return `זה ${ltrSpan(`${c / part}/${den}`)}. ספרו שוב כמה חלקים לוקחים: ${num}.`;
      return '';
    })
  });
}

// Equivalent fractions: "איזה שבר שווה ל-1/2?"
export function generateGrade4EquivalentFraction() {
  const base = pickRandom([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5]]);
  const k = randInt(2, 4);
  const correct = `${base[0] * k}/${base[1] * k}`;
  const wrongs = new Set();
  const value = base[0] / base[1];
  let guard = 0;
  while (wrongs.size < 3 && guard++ < 100) {
    const d = base[1] * k + pickRandom([-2, -1, 1, 2, 0]);
    const n = base[0] * k + pickRandom([-1, 1, 2, 0]);
    if (d > 0 && n > 0 && n < d && Math.abs(n / d - value) > 1e-9 && `${n}/${d}` !== correct) wrongs.add(`${n}/${d}`);
  }
  const choices = shuffle([correct, ...wrongs].slice(0, 4));
  return {
    id: `math_g4_eqfrac_${Date.now()}_${Math.random()}`,
    category: 'math',
    type: 'arithmetic_choice',
    title: 'שברים שווים',
    instructionHebrew: 'איזה שבר שווה לשבר הזה?',
    formula: `<span dir="ltr">${base[0]}/${base[1]} = ?</span>`,
    soundCue: `איזה שבר שווה ל-${base[0]} חלקי ${base[1]}?`,
    expectedAnswer: correct,
    correctOptionId: correct,
    feedbackNote: `<span dir="ltr">${base[0]}/${base[1]} = ${correct}</span>`,
    explanation: [
      'כדי לקבל שבר שווה, כופלים את המונה ואת המכנה באותו מספר:',
      ltrSpan(`${base[0]} × ${k} = ${base[0] * k}`) + ' (מונה, למעלה)',
      ltrSpan(`${base[1]} × ${k} = ${base[1] * k}`) + ' (מכנה, למטה)',
      `→ ${ltrSpan(`${base[0]}/${base[1]} = ${correct}`)}`
    ],
    mistakes: Object.fromEntries([...wrongs].map(wf => {
      const [n, d] = wf.split('/').map(Number);
      if (d % base[1] === 0 && n !== (d / base[1]) * base[0]) {
        return [wf, `המכנה הוכפל ב-${d / base[1]}, אבל המונה לא. צריך לכפול את שניהם באותו מספר.`];
      }
      if (n % base[0] === 0 && d !== (n / base[0]) * base[1]) {
        return [wf, `המונה הוכפל ב-${n / base[0]}, אבל המכנה לא. צריך לכפול את שניהם באותו מספר.`];
      }
      return [wf, 'המונה והמכנה לא הוכפלו באותו מספר.'];
    })),
    options: choices.map(c => ({ id: c, label: `<span dir="ltr">${c}</span>` }))
  };
}

export function generateGrade4PlaceValue() {
  return placeValue(6, 'math_g4_place');
}