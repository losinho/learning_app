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
  const count = randInt(1, 8);

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

// ---------------- AGE 8-9 PROCEDURAL GENERATORS (INFINITE) ---------------- //

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
