// Curriculum Data Repository Coordinator
import { getHebrewAge5Exercises } from './age5/hebrew.js';
import { getEnglishAge5Exercises } from './age5/english.js';
import { getMathAge5Exercises } from './age5/math.js';

import { hebrewAge8_9ReadingPassages, hebrewAge8_9Grammar } from './age8_9/hebrew.js';
import { englishAge8_9Exercises } from './age8_9/english.js';
import { getMathAge8Exercises } from './age8_9/math.js';

export function getExercisesForProfile(profile, subject = 'hebrew') {
  const ageGroup = profile ? profile.ageGroup : '5';

  if (ageGroup === '5') {
    switch (subject) {
      case 'hebrew':
        // Generates a fresh, infinite round of 10 varied exercises each session
        return getHebrewAge5Exercises(10);
      case 'math':
        // Generates a fresh, infinite round of 10 varied math drills each session
        return getMathAge5Exercises(10);
      case 'english':
        // Generates a fresh round of 10 mixed-topic vocabulary + letter exercises each session
        return getEnglishAge5Exercises(10);
      default:
        return getHebrewAge5Exercises(10);
    }
  } else {
    // Age 8-9 (Grades 3-4)
    switch (subject) {
      case 'hebrew': {
        const readingItems = [];
        hebrewAge8_9ReadingPassages.forEach(set => {
          set.questions.forEach((q, qIndex) => {
            readingItems.push({
              id: `${set.id}_${q.id}`,
              ageGroup: '8-9',
              category: 'hebrew',
              type: 'reading_comprehension_question',
              title: `${set.title} (שאלה ${qIndex + 1}/${set.questions.length})`,
              passageTitle: set.passageTitle,
              passageText: set.passageText,
              instructionHebrew: 'קראו את הקטע וענו על השאלה הבאה:',
              prompt: q.prompt,
              options: q.options.map((optText, optIdx) => ({
                id: String(optIdx),
                label: optText
              })),
              correctIndex: q.correctIndex
            });
          });
        });
        const combined = [...readingItems, ...hebrewAge8_9Grammar];
        return combined.sort(() => Math.random() - 0.5).slice(0, 10);
      }
      case 'math':
        return getMathAge8Exercises();
      case 'english':
        return [...englishAge8_9Exercises].sort(() => Math.random() - 0.5).slice(0, 10);
      default:
        return getMathAge8Exercises();
    }
  }
}
