// Grade 3 Math (כיתה ג' — new math program, from תשפ"ז): numbers to 10,000 (place value, comparing, ×/÷ 10
// and 100, gematria, skip counting), add/subtract in columns, rounding and estimation, times tables and
// division, multiplying whole tens/hundreds, the distributive law, order of operations and parentheses,
// properties of 0 and 1, equations, angles and triangles, area, the clock with minutes and time spans,
// tables / bar charts / pictograms, word problems.
import {
  generateAge8Multiplication,
  generateAge8MissingFactor,
  generateAge8Division,
  generateGrade3PlaceValue,
  generateGrade3OrderOfOperations
} from '../../engine/procedural_math.js';
import { generateGrade3AreaCount, generateGrade3AreaCompare } from '../../engine/area.js';
import {
  generateGrade3Rounding, generateGrade3Estimate, generateGrade3ColumnAddSub, generateGrade3Times10,
  generateGrade3MultTens, generateGrade3Distributive, generateGrade3Parentheses, generateGrade3Compare,
  generateGrade3Gematria, generateGrade3Sequence, generateGrade3Equation, generateGrade3ZeroOne,
  generateGrade3Angle, generateGrade3Triangle, generateGrade3Clock, generateGrade3TimeSpan, generateGrade3Data
} from '../../engine/grade3_math.js';
import { mathAge8_9CuratedExercises } from '../age8_9/math.js';
import { mixRound } from './roundUtils.js';
import { shuffle } from '../../engine/random.js';

export function getMathGrade3Exercises(count = 20) {
  // More topics than questions in a round, so the order is shuffled: every topic gets its turn over a few rounds
  const generators = shuffle([
    generateAge8Multiplication,
    generateAge8MissingFactor,
    generateAge8Division,
    generateGrade3PlaceValue,
    generateGrade3OrderOfOperations,
    generateGrade3AreaCount,
    generateGrade3AreaCompare,
    generateGrade3Rounding,
    generateGrade3Estimate,
    generateGrade3ColumnAddSub,
    generateGrade3Times10,
    generateGrade3MultTens,
    generateGrade3Distributive,
    generateGrade3Parentheses,
    generateGrade3Compare,
    generateGrade3Gematria,
    generateGrade3Sequence,
    generateGrade3Equation,
    generateGrade3ZeroOne,
    generateGrade3Angle,
    generateGrade3Triangle,
    generateGrade3Clock,
    generateGrade3TimeSpan,
    generateGrade3Data
  ]);
  const curated = mathAge8_9CuratedExercises.filter(ex => ex.grade === '3');
  return mixRound(count, generators, curated);
}
