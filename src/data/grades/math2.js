// Grade 2 Math (כיתה ב' — new math program): numbers to 1,000, comparing with < > =, add/subtract
// within 100, multiplication as equal groups, the ×2/×4/×5/×10 facts and division, half, the clock.
import {
  generateGrade2PlaceValue,
  generateGrade2CompareSymbols,
  generateGrade2AddSub100,
  generateGrade2Facts,
  generateGrade2Groups,
  generateGrade2Half,
  generateGrade2Clock
} from '../../engine/grade2_math.js';
import { mixRound } from './roundUtils.js';

export function getMathGrade2Exercises(count = 20) {
  return mixRound(count, [
    generateGrade2AddSub100,
    generateGrade2Facts,
    generateGrade2PlaceValue,
    generateGrade2Groups,
    generateGrade2CompareSymbols,
    generateGrade2Facts,
    generateGrade2Clock,
    generateGrade2AddSub100,
    generateGrade2Half
  ]);
}
