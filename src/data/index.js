// Curriculum Data Repository Coordinator
import { getHebrewAge5Exercises } from './age5/hebrew.js';
import { getEnglishAge5Exercises } from './age5/english.js';
import { getMathAge5Exercises } from './age5/math.js';

import { hebrewAge8_9ReadingPassages, hebrewAge8_9Grammar } from './age8_9/hebrew.js';
import { englishAge8_9Exercises } from './age8_9/english.js';
import { getMathAge8Exercises } from './age8_9/math.js';

// Questions per round. Fixed age 8-9 lists that are shorter than this use all their items (no repeats).
export const ROUND_SIZE = 20;

export function getExercisesForProfile(profile, subject = 'hebrew') {
  const ageGroup = profile ? profile.ageGroup : '5';

  if (ageGroup === '5') {
    switch (subject) {
      case 'hebrew':
        // Generates a fresh, infinite round of varied exercises each session
        return getHebrewAge5Exercises(ROUND_SIZE);
      case 'math':
        // Generates a fresh, infinite round of varied math drills each session
        return getMathAge5Exercises(ROUND_SIZE);
      case 'english':
        // Mixed topics by default; the child can pick one topic and turn on listen-only (saved per profile)
        return getEnglishAge5Exercises(ROUND_SIZE, profile?.englishTopic || null, { listenOnly: Boolean(profile?.englishListenOnly) });
      default:
        return getHebrewAge5Exercises(ROUND_SIZE);
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
        return combined.sort(() => Math.random() - 0.5).slice(0, ROUND_SIZE);
      }
      case 'math':
        return getMathAge8Exercises(ROUND_SIZE);
      case 'english':
        return [...englishAge8_9Exercises].sort(() => Math.random() - 0.5).slice(0, ROUND_SIZE);
      default:
        return getMathAge8Exercises(ROUND_SIZE);
    }
  }
}
