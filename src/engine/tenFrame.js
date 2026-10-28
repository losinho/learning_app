// Quick count with a ten-frame (גן חובה / כיתה א': "תפיסה מיידית של כמויות" — seeing an amount without
// counting one by one). Dots fill a 2×5 frame (top row first) and are shown for a moment, then hidden;
// the child says how many. Amounts over 10 use a full frame plus a second one (10 + 3).

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// One 2×5 frame with `filled` dots (inline styles: the size follows the banner text)
function frame(filled) {
  const cells = Array.from({ length: 10 }, (_, i) => `
    <span style="width:1.1em;height:1.1em;display:flex;align-items:center;justify-content:center;border:2px solid #fcd34d;border-radius:0.2em;background:#fff">
      ${i < filled ? '<span style="width:0.75em;height:0.75em;border-radius:50%;background:#ef4444;display:block"></span>' : ''}
    </span>`).join('');
  return `<span style="display:inline-grid;grid-template-columns:repeat(5,1.1em);gap:0.12em;padding:0.12em;border:3px solid #b45309;border-radius:0.3em;background:#fffbeb">${cells}</span>`;
}

// min/max: the amounts used; flashMs: how long the dots stay visible
export function generateTenFrame({ min = 1, max = 10, flashMs = 3000 } = {}) {
  const n = randInt(min, max);
  const frames = n > 10 ? [10, n - 10] : [n];
  // 3 neighbouring numbers that include the answer, in ascending order (like a number line)
  const first = Math.max(1, n - randInt(0, 2));
  const choices = [first, first + 1, first + 2];

  return {
    id: `math_tenframe_${n}`,
    category: 'math',
    type: 'image_word_match',
    hideWordAudio: true,
    flashMs,
    title: 'ספירה במבט',
    instructionHebrew: 'הסתכלו מהר: כמה נקודות יש? (בלי לספור אחת-אחת)',
    soundCue: 'הסתכלו מהר: כמה נקודות יש?',
    targetWordVocalized: `<span dir="rtl" style="font-size:0.75em;display:inline-flex;flex-direction:column;gap:0.2em">${frames.map(frame).join('')}</span>`,
    count: n,
    correctOptionId: String(n),
    feedbackNote: n > 10 ? `${n} = 10 + ${n - 10}` : n > 5 ? `${n} = 5 + ${n - 5}` : `${n}`,
    options: choices.map(c => ({ id: String(c), emoji: String(c) }))
  };
}
