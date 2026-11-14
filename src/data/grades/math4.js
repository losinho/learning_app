// Grade 4 Math (כיתה ד' — new math program): numbers to 1,000,000 (place value, comparing, rounding),
// long multiplication (incl. two-digit × two-digit) and estimation, long division (with and without
// remainder), properties of 0 and 1, fractions (parts of a shape, on the number line, of a quantity,
// equivalent, comparing, adding/subtracting with equal denominators, whole × fraction), quadrilaterals,
// parallel/perpendicular lines, rectangle area and perimeter, the calendar, pie charts and bar charts.
import {
  generateGrade4Multiplication,
  generateGrade4LongDivision,
  generateGrade3DivisionWithRemainder,
  generateGrade4PlaceValue,
  generateGrade4Divisibility,
  generateGrade4RectangleMeasure,
  generateGrade4FractionOfQuantity,
  generateGrade4EquivalentFraction
} from '../../engine/procedural_math.js';
import {
  generateGrade4FractionShape, generateGrade4FractionNumberLine, generateGrade4FractionCompare,
  generateGrade4FractionAddSub, generateGrade4WholeTimesFraction, generateGrade4Mult2Digit,
  generateGrade4MultEstimate, generateGrade4ZeroOne, generateGrade4Rounding, generateGrade4Compare,
  generateGrade4Quadrilateral, generateGrade4Lines, generateGrade4Calendar, generateGrade4PieChart
} from '../../engine/grade4_math.js';
import { mathAge8_9CuratedExercises } from '../age8_9/math.js';
import { mixRound } from './roundUtils.js';
import { shuffle } from '../../engine/random.js';

export function getMathGrade4Exercises(count = 20) {
  // Fractions are about a third of the grade 4 program, so their generators appear more often
  const generators = shuffle([
    generateGrade4Multiplication,
    generateGrade4LongDivision,
    generateGrade3DivisionWithRemainder,
    generateGrade4PlaceValue,
    generateGrade4Divisibility,
    generateGrade4RectangleMeasure,
    generateGrade4FractionOfQuantity,
    generateGrade4EquivalentFraction,
    generateGrade4FractionShape,
    generateGrade4FractionNumberLine,
    generateGrade4FractionCompare,
    generateGrade4FractionAddSub,
    generateGrade4WholeTimesFraction,
    generateGrade4Mult2Digit,
    generateGrade4MultEstimate,
    generateGrade4ZeroOne,
    generateGrade4Rounding,
    generateGrade4Compare,
    generateGrade4Quadrilateral,
    generateGrade4Lines,
    generateGrade4Calendar,
    generateGrade4PieChart
  ]);
  const curated = mathAge8_9CuratedExercises.filter(ex => ex.grade === '4');
  return mixRound(count, generators, curated);
}
