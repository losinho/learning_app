// Age 5 Math Curriculum: Quantity comparisons (< > =), Operations (+ -), Visual Counting & Addition, Shapes & Solids
import {
  generateAge5Comparison,
  generateAge5OperatorChoice,
  generateAge5VisualAdd,
  generateAge5VisualCounting
} from '../../engine/procedural_math.js';
import { generateAge5ShapeMatch, generateAge5SolidMatch } from '../../engine/shapes.js';

export function getMathAge5Exercises(count = 10) {
  const exercises = [];
  let shapeTurns = 0;

  // Create a well-balanced round of 10 math exercises (each of the 5 kinds twice)
  for (let i = 0; i < count; i++) {
    const mod = i % 5;
    if (mod === 0) {
      exercises.push(generateAge5Comparison());
    } else if (mod === 1) {
      exercises.push(generateAge5VisualAdd());
    } else if (mod === 2) {
      exercises.push(generateAge5OperatorChoice());
    } else if (mod === 3) {
      exercises.push(generateAge5VisualCounting());
    } else {
      // Alternate flat shapes and solids
      exercises.push(shapeTurns++ % 2 === 0 ? generateAge5ShapeMatch() : generateAge5SolidMatch());
    }
  }

  return exercises;
}
