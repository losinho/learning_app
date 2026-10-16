// Procedural Math Exercise Generator for Infinite Practice
// Aligned with Israeli Ministry of Education (Preschool & Grades 3-4)

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
  choices.sort(() => Math.random() - 0.5);

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
  choices.sort(() => Math.random() - 0.5);

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
  const animals = [...LINE_ANIMALS].sort(() => Math.random() - 0.5).slice(0, 6);
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
  choices.sort(() => Math.random() - 0.5);

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
  choices.sort(() => Math.random() - 0.5);

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
  choices.sort(() => Math.random() - 0.5);

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
  choices.sort(() => Math.random() - 0.5);

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
  return choices.sort(() => Math.random() - 0.5);
}

export function choiceExercise({ idPrefix, title, instructionHebrew, formula, soundCue, correct, choices, feedbackNote }) {
  return {
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
  for (const f of fakes.sort(() => Math.random() - 0.5)) {
    if (candidates.length === 4) break;
    if (!candidates.some(c => key(...c) === key(...f))) candidates.push(f);
  }
  const options = candidates.sort(() => Math.random() - 0.5);

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
    options: options.map(([q, r]) => ({ id: key(q, r), label: label(q, r) }))
  };
}

const PLACE_NAMES = ['אחדות', 'עשרות', 'מאות', 'אלפים', 'עשרות אלפים', 'מאות אלפים'];

// Place value: "מהי ספרת המאות במספר 4,382?" — grade 3 up to 10,000, grade 4 up to 1,000,000
function placeValue(digits, idPrefix) {
  const number = randInt(10 ** (digits - 1), 10 ** digits - 1);
  const place = randInt(0, digits - 1);
  const digitAt = (n, p) => Math.floor(n / 10 ** p) % 10;
  const correct = digitAt(number, place);
  // Other digits of the same number are the natural mistakes; fill with random digits if needed
  const choices = [correct];
  const otherDigits = [...String(number)].map(Number).filter(d => d !== correct);
  for (const d of otherDigits.sort(() => Math.random() - 0.5)) {
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
    choices: choices.sort(() => Math.random() - 0.5),
    feedbackNote: `ספרת ה${PLACE_NAMES[place]}: ${correct}`
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
  const forms = [
    { formula: `${a} + ${b} × ${c}`, correct: a + b * c, leftToRight: (a + b) * c },
    { formula: `${b} × ${c} + ${a}`, correct: b * c + a, leftToRight: b * (c + a) },
    { formula: `${a + b * c} - ${b} × ${c}`, correct: a, leftToRight: (a + b * c - b) * c }
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
    choices: choices.sort(() => Math.random() - 0.5)
  });
}

// ---------------- GRADE 4 PROCEDURAL GENERATORS (INFINITE) ---------------- //

// Long multiplication by a one-digit number (two- and three-digit numbers)
export function generateGrade4Multiplication() {
  const a = Math.random() < 0.6 ? randInt(12, 99) : randInt(101, 999);
  const b = randInt(3, 9);
  const product = a * b;
  return choiceExercise({
    idPrefix: 'math_g4_mult',
    title: 'כפל במאונך',
    instructionHebrew: 'פתרו את תרגיל הכפל (אפשר לחשב במאונך):',
    formula: `${a} × ${b} = ?`,
    soundCue: `כמה זה ${a} כפול ${b}?`,
    correct: product,
    choices: numberChoices(product, [-b, b, -10, 10, -100, 100], 4, 1)
  });
}

// Long division by a one-digit number, no remainder
export function generateGrade4LongDivision() {
  const divisor = randInt(2, 9);
  const quotient = randInt(12, 120);
  const dividend = divisor * quotient;
  return choiceExercise({
    idPrefix: 'math_g4_div',
    title: 'חילוק ארוך',
    instructionHebrew: 'פתרו את תרגיל החילוק:',
    formula: `${dividend} ÷ ${divisor} = ?`,
    soundCue: `כמה זה ${dividend} לחלק ל-${divisor}?`,
    correct: quotient,
    choices: numberChoices(quotient, [-1, 1, -10, 10, -2, 2], 4, 1),
    feedbackNote: `<span dir="ltr">${quotient} × ${divisor} = ${dividend}</span>`
  });
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
    choices: choices.sort(() => Math.random() - 0.5),
    feedbackNote: `<span dir="ltr">${correct} ÷ ${d} = ${correct / d}</span>`
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
    choices: choices.sort(() => Math.random() - 0.5),
    feedbackNote: askArea
      ? `<span dir="ltr">${w} × ${h} = ${area}</span>`
      : `<span dir="ltr">${w} + ${h} + ${w} + ${h} = ${perimeter}</span>`
  });
}

// Fraction of a quantity: "3/4 מ-12"
export function generateGrade4FractionOfQuantity() {
  const den = pickRandom([2, 3, 4, 5, 6, 8, 10]);
  const num = randInt(1, den - 1);
  const whole = den * randInt(2, 10);
  const correct = (whole / den) * num;
  return choiceExercise({
    idPrefix: 'math_g4_fracq',
    title: 'שבר מכמות',
    instructionHebrew: 'כמה זה?',
    // Hebrew inside the formula, so it is laid out right-to-left (the card shows formulas left-to-right)
    formula: `<span dir="rtl"><span dir="ltr">${num}/${den}</span> מ-${whole} = ?</span>`,
    soundCue: `כמה זה ${num} חלקי ${den} מ-${whole}?`,
    correct,
    choices: numberChoices(correct, [-(whole / den), whole / den, -1, 1, 2], 4, 1),
    feedbackNote: `<span dir="ltr">${whole} ÷ ${den} × ${num} = ${correct}</span>`
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
  const choices = [correct, ...wrongs].slice(0, 4).sort(() => Math.random() - 0.5);
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
    options: choices.map(c => ({ id: c, label: `<span dir="ltr">${c}</span>` }))
  };
}

export function generateGrade4PlaceValue() {
  return placeValue(6, 'math_g4_place');
}