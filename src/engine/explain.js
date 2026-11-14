// "Let's understand" explanations shown after a wrong answer (math).
// Every builder returns plain data, so exercises stay serializable:
//   explanation: [html, html, ...]   – short steps, shown one under the other
//   mistakes:    { optionId: html }  – a hint for a specific wrong choice ("you added instead of multiplying")
// The exercise card shows the hint for the chosen option (if any) above the steps.

const ltr = (s) => `<span dir="ltr">${s}</span>`;
const fmt = (n) => (typeof n === 'number' ? n.toLocaleString('en-US') : String(n));

// Builds { optionId: hint } for every wrong choice that hintFor() has something to say about
export function mistakesFor(choices, correct, hintFor) {
  const out = {};
  for (const c of choices) {
    if (String(c) === String(correct)) continue;
    const hint = hintFor(c);
    if (hint) out[String(c)] = hint;
  }
  return out;
}

// Small dot grid: `rows` rows of `cols` dots (multiplication as rows of equal size)
export function dotGrid(rows, cols) {
  const r = 7, gap = 18;
  const w = cols * gap, h = rows * gap;
  let dots = '';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Every 5th column a different color, so groups of 5 are easy to count
      const fill = x >= 5 ? '#f59e0b' : '#6366f1';
      dots += `<circle cx="${x * gap + gap / 2}" cy="${y * gap + gap / 2}" r="${r}" fill="${fill}"/>`;
    }
  }
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="display:inline-block;vertical-align:middle" aria-hidden="true">${dots}</svg>`;
}

// ---------- Addition / subtraction ---------- //

// 47 + 28: tens with tens, ones with ones. 8 + 5 (within 20): make a ten.
export function explainAdd(a, b) {
  const sum = a + b;
  if (a < 10 && b < 10 && sum > 10) {
    const toTen = 10 - a;
    return [
      'משלימים קודם ל-10:',
      ltr(`${a} + ${toTen} = 10`),
      ltr(`10 + ${b - toTen} = ${sum}`)
    ];
  }
  if (a < 10 && b < 10) return [ltr(`${a} + ${b} = ${sum}`), `סופרים ${b} קדימה מ-${a}.`];
  if (b < 10) {
    const ta = a - (a % 10), oa = a % 10;
    if (oa + b < 10) return ['מחברים רק את האחדות:', ltr(`${oa} + ${b} = ${oa + b}`), ltr(`${ta} + ${oa + b} = ${sum}`)];
    const toTen = 10 - oa;
    return ['משלימים קודם לעשרת הבאה:', ltr(`${a} + ${toTen} = ${a + toTen}`), ltr(`${a + toTen} + ${b - toTen} = ${sum}`)];
  }
  const [ta, oa] = [a - (a % 10), a % 10];
  const [tb, ob] = [b - (b % 10), b % 10];
  return [
    'עשרות עם עשרות, אחדות עם אחדות:',
    ltr(`${ta} + ${tb} = ${ta + tb}`),
    ltr(`${oa} + ${ob} = ${oa + ob}`) + (oa + ob >= 10 ? ' (יצאה עשרת נוספת!)' : ''),
    ltr(`${ta + tb} + ${oa + ob} = ${sum}`)
  ];
}

// 63 - 28: take away the tens, then the ones
export function explainSub(a, b) {
  const diff = a - b;
  if (b < 10) {
    if (a % 10 < b && a > 10) {
      const toTen = a % 10;
      return [
        'מורידים קודם עד העשרת:',
        ltr(`${a} - ${toTen} = ${a - toTen}`),
        ltr(`${a - toTen} - ${b - toTen} = ${diff}`)
      ];
    }
    return [ltr(`${a} - ${b} = ${diff}`), `סופרים ${b} אחורה מ-${a}.`];
  }
  const tb = b - (b % 10), ob = b % 10;
  const steps = ['מורידים קודם את העשרות, ואחר כך את האחדות:', ltr(`${a} - ${tb} = ${a - tb}`)];
  if (ob) steps.push(ltr(`${a - tb} - ${ob} = ${diff}`));
  steps.push(`בדיקה: ${ltr(`${diff} + ${b} = ${a}`)} ✔️`);
  return steps;
}

// Hints for a wrong answer of a + b / a - b
export function addSubHint(a, b, isAdd, wrong) {
  const correct = isAdd ? a + b : a - b;
  const diff = wrong - correct;
  if (isAdd && wrong === a - b) return 'שימו לב לסימן: זה חיבור (+), לא חיסור.';
  if (!isAdd && wrong === a + b) return 'שימו לב לסימן: זה חיסור (-), לא חיבור.';
  if (Math.abs(diff) === 10) {
    // Forgetting to carry gives 10 too little; forgetting to borrow (doing 8 - 3 instead of 3 - 8) 10 too much
    if (isAdd && diff === -10 && (a % 10) + (b % 10) >= 10) return 'כמעט! האחדות יחד יוצאות יותר מ-10, אז נוספת עשרת אחת.';
    if (!isAdd && diff === 10 && (a % 10) < (b % 10)) return `כמעט! אי אפשר להוריד ${b % 10} מ-${a % 10}, אז פורטים עשרת אחת ל-10 אחדות.`;
    return diff > 0 ? 'כמעט! יצאה עשרת אחת יותר מדי. בדקו את העשרות.' : 'כמעט! חסרה עשרת אחת. בדקו את העשרות.';
  }
  if (Math.abs(diff) <= 2) return 'קרוב מאוד! טעות קטנה בספירה. נסו לחשב שוב לאט.';
  return '';
}

// ---------- Multiplication / division ---------- //

// 7 × 8: rows of dots + split into an easy part (×5 or ×2) and the rest
export function explainMultiply(a, b) {
  const product = a * b;
  const steps = [];
  if (a <= 10 && b <= 10) steps.push(`${dotGrid(a, b)}<div>${a} שורות, בכל שורה ${b}</div>`);
  if (b === 10 || a === 10) {
    steps.push(`כפול 10: מוסיפים 0 בסוף → ${ltr(`${a} × ${b} = ${product}`)}`);
  } else if (b > 5) {
    steps.push('מפרקים לחלקים קלים:');
    steps.push(ltr(`${a} × ${b} = ${a} × 5 + ${a} × ${b - 5}`));
    steps.push(ltr(`${a * 5} + ${a * (b - 5)} = ${product}`));
  } else if (b > 2) {
    steps.push(`סופרים בקפיצות של ${a}: ${ltr(Array.from({ length: b }, (_, i) => a * (i + 1)).join(', '))}`);
  } else {
    steps.push(ltr(`${a} × ${b} = ${Array(b).fill(a).join(' + ')} = ${product}`));
  }
  return steps;
}

export function multiplyHint(a, b, wrong) {
  if (wrong === a + b) return `חיברתם (${ltr(`${a} + ${b}`)}) במקום לכפול.`;
  if (wrong === a * (b - 1) || wrong === a * (b + 1)) return `זה ${ltr(`${a} × ${wrong / a}`)}. חסרה או עודפת קבוצה אחת של ${a}.`;
  if (wrong === b * (a - 1) || wrong === b * (a + 1)) return `זה ${ltr(`${wrong / b} × ${b}`)}. חסרה או עודפת קבוצה אחת של ${b}.`;
  return '';
}

// 24 ÷ 4: "which number times 4 is 24?" – count by 4 up to 24
export function explainDivide(dividend, divisor, quotient) {
  const steps = [`חילוק הוא כפל הפוך: איזה מספר כפול ${divisor} שווה ${dividend}?`];
  if (quotient <= 12) {
    steps.push(`סופרים בקפיצות של ${divisor}: ${ltr(Array.from({ length: quotient }, (_, i) => divisor * (i + 1)).join(', '))}`);
    steps.push(`עשינו ${quotient} קפיצות → ${ltr(`${dividend} ÷ ${divisor} = ${quotient}`)}`);
  } else {
    // Long division: split the dividend into an easy multiple of 10 and the rest
    const tens = Math.floor(quotient / 10) * 10;
    const first = tens * divisor, rest = dividend - first;
    steps.push('מפרקים את המספר לחלקים נוחים:');
    steps.push(ltr(`${fmt(dividend)} = ${fmt(first)} + ${fmt(rest)}`));
    steps.push(ltr(`${fmt(first)} ÷ ${divisor} = ${tens}`) + ' , ' + ltr(`${rest} ÷ ${divisor} = ${quotient - tens}`));
    steps.push(ltr(`${tens} + ${quotient - tens} = ${quotient}`));
  }
  steps.push(`בדיקה: ${ltr(`${quotient} × ${divisor} = ${fmt(dividend)}`)} ✔️`);
  return steps;
}

// Checking a wrong quotient by multiplying back is the most useful habit to teach
export function divideHint(dividend, divisor, wrong) {
  const back = wrong * divisor;
  return `בדיקה: ${ltr(`${wrong} × ${divisor} = ${fmt(back)}`)}, ולא ${fmt(dividend)}. ${back < dividend ? 'קטן מדי.' : 'גדול מדי.'}`;
}

export function explainRemainder(dividend, divisor, quotient, remainder) {
  return [
    `מחפשים את המספר הגדול ביותר בלוח של ${divisor} שלא עובר את ${dividend}:`,
    ltr(`${divisor} × ${quotient} = ${divisor * quotient}`) + (divisor * (quotient + 1) > dividend ? ` (ו-${ltr(`${divisor} × ${quotient + 1} = ${divisor * (quotient + 1)}`)} כבר גדול מדי)` : ''),
    `מה שנשאר: ${ltr(`${dividend} - ${divisor * quotient} = ${remainder}`)} → שארית ${remainder}`,
    `השארית תמיד קטנה מ-${divisor}.`
  ];
}

export function remainderHint(dividend, divisor, q, r) {
  const back = divisor * q + r;
  return `בדיקה: ${ltr(`${divisor} × ${q} + ${r} = ${back}`)}, ולא ${dividend}.`;
}

// ---------- Order of operations ---------- //

export function explainOrder(parts) {
  // parts: { formula, first: 'b × c', firstValue, rest: 'a + p', correct }
  return [
    'כפל עושים קודם, גם אם הוא באמצע או בסוף:',
    ltr(`${parts.first} = ${parts.firstValue}`),
    ltr(`${parts.rest} = ${parts.correct}`)
  ];
}

// ---------- Place value ---------- //

const PLACE_NAMES = ['אחדות', 'עשרות', 'מאות', 'אלפים', 'עשרות אלפים', 'מאות אלפים'];

export function explainPlaceValue(number, place) {
  const digits = [...String(number)];
  const n = digits.length;
  const cells = digits.map((d, i) => {
    const p = n - 1 - i;
    const on = p === place;
    return `<td style="padding:4px 8px;border:2px solid #c7d2fe;${on ? 'background:#bbf7d0;font-weight:900' : ''}">` +
      `<div style="font-size:11px">${PLACE_NAMES[p]}</div><div style="font-size:22px">${d}</div></td>`;
  }).join('');
  return [
    `<table dir="ltr" style="margin:0 auto;border-collapse:collapse;text-align:center"><tr>${cells}</tr></table>`,
    'סופרים מימין: אחדות, עשרות, מאות, אלפים...'
  ];
}

export function placeValueHint(number, place, wrong) {
  const digits = [...String(number)].reverse().map(Number);
  const at = digits.indexOf(Number(wrong));
  if (at >= 0 && at !== place) return `${wrong} היא ספרת ה${PLACE_NAMES[at]}, ולא ספרת ה${PLACE_NAMES[place]}.`;
  return '';
}

export { PLACE_NAMES };
