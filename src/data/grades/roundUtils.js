// Builds a round from rotating generators plus fixed (curated) items spread evenly between them.
// No question repeats inside a round: a generated question is regenerated (up to 30 tries) when its key was used.
export function mixRound(count, generators, curated = [], keyOf = defaultKey) {
  const fixed = curated.slice(0, count);
  const generatedCount = count - fixed.length;

  const used = new Set(fixed.map(keyOf));
  const generated = [];
  for (let i = 0; i < generatedCount; i++) {
    const generate = generators[i % generators.length];
    let ex = generate();
    for (let tries = 0; tries < 30 && used.has(keyOf(ex)); tries++) ex = generate();
    used.add(keyOf(ex));
    generated.push(ex);
  }

  return spreadInto(generated, fixed);
}

// Inserts `items` at evenly spaced positions in `base` (returns a new array)
export function spreadInto(base, items) {
  const round = [...base];
  items.forEach((item, idx) => {
    const position = Math.round(((idx + 1) * base.length) / (items.length + 1)) + idx;
    round.splice(position, 0, item);
  });
  return round;
}

function defaultKey(ex) {
  return [ex.title, ex.formula, ex.targetWordVocalized, ex.correctOptionId, ex.prompt].join('|');
}
