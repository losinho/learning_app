// Age 5 Math Curriculum: Quantity comparisons (< > =), Operations (+ -), Visual Counting & Addition,
// Shapes & Solids, Coins
import {
  generateAge5Comparison,
  generateAge5OperatorChoice,
  generateAge5VisualAdd,
  generateAge5VisualCounting,
  generateAge5VisualSubtraction,
  generateAge5Ordinal
} from '../../engine/procedural_math.js';
import { generateAge5ShapeMatch, generateAge5SolidMatch, generateAge5DrawnSolidMatch } from '../../engine/shapes.js';
import { generateAge5CoinRecognition, generateAge5CoinBuying } from '../../engine/coins.js';
import { generateAge5Spatial } from '../../engine/spatial.js';

// Two exercises are "the same question" when they have the same type and the same numbers/answer
function questionKey(ex) {
  return [ex.title, ex.leftVal, ex.rightVal, ex.numA, ex.numB, ex.count, ex.correctOptionId].join('|');
}

// A slot that rotates between related generators each time it comes up. The starting point is random,
// so when a slot comes up fewer times than it has generators, every generator still appears across rounds.
function rotating(...generators) {
  let turn = Math.floor(Math.random() * generators.length);
  return () => generators[turn++ % generators.length];
}

export function getMathAge5Exercises(count = 20) {
  // Each slot returns the generator to use this time; the round cycles through the slots in order
  const slots = [
    () => generateAge5Comparison,
    () => generateAge5VisualAdd,
    () => generateAge5OperatorChoice,
    () => generateAge5VisualCounting,
    () => generateAge5VisualSubtraction,
    () => generateAge5Ordinal,
    () => generateAge5Spatial,
    rotating(generateAge5ShapeMatch, generateAge5DrawnSolidMatch, generateAge5SolidMatch),
    rotating(generateAge5CoinRecognition, generateAge5CoinBuying)
  ];

  const used = new Set();
  const exercises = [];
  for (let i = 0; i < count; i++) {
    // Pick the generator once per question, then retry within it until the question is new
    const generate = slots[i % slots.length]();
    let ex = generate();
    for (let tries = 0; tries < 30 && used.has(questionKey(ex)); tries++) ex = generate();
    used.add(questionKey(ex));
    exercises.push(ex);
  }

  return exercises;
}
