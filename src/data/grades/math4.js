// Grade 4 Math (כיתה ד'): long multiplication and division, numbers up to 1,000,000 (place value),
// divisibility by 3/6/9, fractions (of a quantity, equivalent, comparing), rectangle area and perimeter.
import {
  generateGrade4Multiplication,
  generateGrade4LongDivision,
  generateGrade4PlaceValue,
  generateGrade4Divisibility,
  generateGrade4RectangleMeasure,
  generateGrade4FractionOfQuantity,
  generateGrade4EquivalentFraction
} from '../../engine/procedural_math.js';
import { mathAge8_9CuratedExercises } from '../age8_9/math.js';
import { mixRound } from './roundUtils.js';

export function getMathGrade4Exercises(count = 20) {
  const generators = [
    generateGrade4Multiplication,
    generateGrade4FractionOfQuantity,
    generateGrade4LongDivision,
    generateGrade4RectangleMeasure,
    generateGrade4PlaceValue,
    generateGrade4EquivalentFraction,
    generateGrade4Divisibility
  ];
  const curated = mathAge8_9CuratedExercises.filter(ex => ex.grade === '4');
  return mixRound(count, generators, curated);
}
