// Grade 1 Math (כיתה א' — new math program): numbers to 100, sequences, comparing in words,
// addition/subtraction within 20, whole tens, the clock (whole hours), comparing lengths, picture patterns.
import {
  generateGrade1Sequence,
  generateGrade1CompareWords,
  generateGrade1AddSub20,
  generateGrade1Tens,
  generateGrade1Clock,
  generateGrade1Length
} from '../../engine/grade1_math.js';
import { generatePattern } from '../../engine/patterns.js';
import { mixRound } from './roundUtils.js';

export function getMathGrade1Exercises(count = 20) {
  return mixRound(count, [
    () => generatePattern(['AAB', 'ABB', 'ABC', 'AABB']),
    generateGrade1AddSub20,
    generateGrade1Sequence,
    generateGrade1CompareWords,
    generateGrade1Clock,
    generateGrade1AddSub20,
    generateGrade1Tens,
    generateGrade1Length
  ]);
}
