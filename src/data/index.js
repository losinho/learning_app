// Curriculum Data Repository Coordinator
// Every subject lists its content sources and the grades each source is written for. A round for a child
// is built from three parts:
//   - core: the child's own grade (most of the round)
//   - challenge: the NEXT grade, if content exists for it (share depends on the challenge setting, see below)
//   - review: 2 questions from the PREVIOUS grade, if content exists for it
// Adding a new grade later only means adding a source here; the mixing logic stays the same.
import { getHebrewAge5Exercises } from './age5/hebrew.js';
import { getEnglishAge5Exercises } from './age5/english.js';
import { getMathAge5Exercises } from './age5/math.js';
import { getRussianAge5Exercises } from './age5/russian.js';

import { getHebrewGrades3And4Exercises } from './grades/hebrew34.js';
import { getEnglishGrade4Exercises } from './grades/english4.js';
import { getMathGrade3Exercises } from './grades/math3.js';
import { getMathGrade4Exercises } from './grades/math4.js';
import { getEnglishGrade3Exercises } from './grades/english3.js';
import { getHebrewGrade1Exercises } from './grades/hebrew1.js';
import { getMathGrade1Exercises } from './grades/math1.js';
import { getHebrewGrade2Exercises } from './grades/hebrew2.js';
import { getMathGrade2Exercises } from './grades/math2.js';
import { spreadInto } from './grades/roundUtils.js';
import { gradeOfProfile, nextGrade, previousGrade } from './grades.js';

// Questions per round. Fixed lists that are shorter than this use all their items (no repeats).
export const ROUND_SIZE = 20;
const REVIEW_COUNT = 2;

// build(count, profile) returns up to `count` exercises without repeats
const SOURCES = {
  hebrew: [
    { grades: ['gan'], build: (n) => getHebrewAge5Exercises(n) },
    { grades: ['1'], build: (n) => getHebrewGrade1Exercises(n) },
    { grades: ['2'], build: (n) => getHebrewGrade2Exercises(n) },
    { grades: ['3', '4'], build: (n) => getHebrewGrades3And4Exercises(n) }
  ],
  math: [
    { grades: ['gan'], build: (n) => getMathAge5Exercises(n) },
    { grades: ['1'], build: (n) => getMathGrade1Exercises(n) },
    { grades: ['2'], build: (n) => getMathGrade2Exercises(n) },
    { grades: ['3'], build: (n) => getMathGrade3Exercises(n) },
    { grades: ['4'], build: (n) => getMathGrade4Exercises(n) }
  ],
  english: [
    // Gan, grade 1 and grade 2 (no official English before grade 3): mixed topics by default; the child can pick
    // one topic and turn on listen-only (saved per profile)
    { grades: ['gan', '1', '2'], build: (n, profile) => getEnglishAge5Exercises(n, profile?.englishTopic || null, { listenOnly: Boolean(profile?.englishListenOnly) }) },
    { grades: ['3'], build: (n) => getEnglishGrade3Exercises(n) },
    { grades: ['4'], build: (n) => getEnglishGrade4Exercises(n) }
  ],
  // Basic Russian (gan-level enrichment, not in the Ministry curriculum) — offered to every grade.
  // The profile's gender (if set) adds feelings in the matching form (весёлый / весёлая); from grade 2
  // (children read) some questions are picture → written word.
  russian: [
    { grades: ['gan', '1', '2', '3', '4'], build: (n, profile) => getRussianAge5Exercises(n, {
      gender: profile?.gender,
      reading: ['2', '3', '4'].includes(gradeOfProfile(profile))
    }) }
  ]
};

// Share of the round taken by next-grade challenges, from the profile's challenge setting.
// 'auto' (default) adapts to the child's last challenge results in this subject.
const CHALLENGE_SHARES = { off: 0, some: 0.2, many: 0.4 };

export function challengeShare(profile, subject) {
  const mode = profile?.challengeMode || 'auto';
  if (mode !== 'auto') return CHALLENGE_SHARES[mode] ?? 0.2;
  const history = profile?.challengeHistory?.[subject] || [];
  if (history.length < 5) return 0.2;
  const accuracy = history.filter(Boolean).length / history.length;
  if (accuracy >= 0.9) return 0.4;
  if (accuracy >= 0.75) return 0.3;
  if (accuracy < 0.5) return 0.1;
  return 0.2;
}

// A source for `grade` that is not also the core source (so a shared pool never challenges itself)
function sourceFor(sources, grade, coreGrade) {
  if (!grade) return null;
  return sources.find(s => s.grades.includes(grade) && !s.grades.includes(coreGrade)) || null;
}

const tag = (grade, extra = {}) => ex => ({ ...ex, grade, ...extra });

// Subjects that can add next-grade challenges for this grade (empty when no next-grade content exists yet)
export function challengeSubjectsFor(grade) {
  const challengeGrade = nextGrade(grade);
  return Object.keys(SOURCES).filter(subject => sourceFor(SOURCES[subject], challengeGrade, grade));
}

export function getExercisesForProfile(profile, subject = 'hebrew', size = ROUND_SIZE) {
  // Profiles still waiting for the one-time grade question are treated as grade 3 until they answer
  const grade = gradeOfProfile(profile) || '3';
  const sources = SOURCES[subject] || SOURCES.hebrew;
  const core = sources.find(s => s.grades.includes(grade));
  if (!core) return [];

  const challengeGrade = nextGrade(grade);
  const challengeSource = sourceFor(sources, challengeGrade, grade);
  const reviewGrade = previousGrade(grade);
  const reviewSource = sourceFor(sources, reviewGrade, grade);

  const challengeCount = challengeSource ? Math.round(size * challengeShare(profile, subject)) : 0;
  const reviewCount = reviewSource ? REVIEW_COUNT : 0;

  const coreItems = core.build(size - challengeCount - reviewCount, profile).map(tag(grade));
  const challengeItems = challengeCount ? challengeSource.build(challengeCount, profile).map(tag(challengeGrade, { isChallenge: true })) : [];
  const reviewItems = reviewCount ? reviewSource.build(reviewCount, profile).map(tag(reviewGrade, { isReview: true })) : [];

  // Review first-ish (warm-up), challenges spread through the round
  return spreadInto([...reviewItems, ...coreItems], challengeItems);
}
