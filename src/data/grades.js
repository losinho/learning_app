// Grade levels. A profile has a `grade`; every exercise in a round gets the grade it was written for.
// The order is used for challenges (next grade) and review (previous grade).
export const GRADE_ORDER = ['gan', '1', '2', '3', '4', '5', '6'];

const GRADE_LABELS = {
  gan: 'גן חובה',
  '1': "כיתה א'",
  '2': "כיתה ב'",
  '3': "כיתה ג'",
  '4': "כיתה ד'",
  '5': "כיתה ה'",
  '6': "כיתה ו'"
};

// Grades a parent can choose for a child today (content exists for these)
export const SELECTABLE_GRADES = [
  { key: 'gan', label: 'גן חובה', emoji: '🧒', hint: 'גיל 5' },
  { key: '1', label: "כיתה א'", emoji: '🎒', hint: 'גיל 6–7' },
  { key: '3', label: "כיתה ג'", emoji: '🧑', hint: 'גיל 8–9' },
  { key: '4', label: "כיתה ד'", emoji: '🧑‍🎓', hint: 'גיל 9–10' }
];

export function gradeLabel(grade) {
  return GRADE_LABELS[grade] || '';
}

// Older profiles only have ageGroup: '5' (gan) or '8-9' (grade 3 or 4 — the app asks once which one)
export function gradeOfProfile(profile) {
  if (!profile) return 'gan';
  if (profile.grade) return profile.grade;
  if (profile.ageGroup === '5') return 'gan';
  return null;
}

export function needsGradeChoice(profile) {
  return Boolean(profile) && gradeOfProfile(profile) === null;
}

export function nextGrade(grade) {
  const idx = GRADE_ORDER.indexOf(grade);
  return idx >= 0 ? GRADE_ORDER[idx + 1] || null : null;
}

export function previousGrade(grade) {
  const idx = GRADE_ORDER.indexOf(grade);
  return idx > 0 ? GRADE_ORDER[idx - 1] : null;
}
