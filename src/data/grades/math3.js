// Grade 3 Math (כיתה ג'): times tables (completing and consolidating), division within 100 with and
// without remainder, numbers up to 10,000 (place value), order of operations, word problems, unit fractions.
import {
  generateAge8Multiplication,
  generateAge8MissingFactor,
  generateAge8Division,
  generateGrade3DivisionWithRemainder,
  generateGrade3PlaceValue,
  generateGrade3OrderOfOperations
} from '../../engine/procedural_math.js';
import { mathAge8_9CuratedExercises } from '../age8_9/math.js';
import { mixRound } from './roundUtils.js';

export function getMathGrade3Exercises(count = 20) {
  const generators = [
    generateAge8Multiplication,
    generateGrade3DivisionWithRemainder,
    generateAge8MissingFactor,
    generateGrade3PlaceValue,
    generateAge8Division,
    generateGrade3OrderOfOperations
  ];
  const curated = mathAge8_9CuratedExercises.filter(ex => ex.grade === '3');
  return mixRound(count, generators, curated);
}
