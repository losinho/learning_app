// Age 8-9 Math Curriculum: Israeli Ministry of Education (Grades 3-4)
// Times tables (לוח הכפל), Word problems (בעיות מילוליות), Simple fractions (שברים פשוטים)
import { generateAge8Multiplication, generateAge8MissingFactor, generateAge8Division } from '../../engine/procedural_math.js';

export const mathAge8_9CuratedExercises = [
  {
    id: 'math_8_word_1',
    ageGroup: '8-9',
    category: 'math',
    type: 'numeric_input',
    title: 'בעיה מילולית: חלוקה לקבוצות',
    instructionHebrew: 'קראו את הבעיה המילולית ופתרו:',
    storyText: 'בְּכִתָּה יֵשׁ 24 תַּלְמִידִים. הַמּוֹרָה חִלְּקָה אוֹתָם לְ-4 קְבוּצוֹת שָׁווֹת לְצֹרֶךְ מִשְׂחָק.\nכַּמָּה תַּלְמִידִים יֵשׁ בְּכָל קְבוּצָה?',
    hint: '24 ÷ 4',
    expectedAnswer: 6
  },
  {
    id: 'math_8_word_2',
    ageGroup: '8-9',
    category: 'math',
    type: 'numeric_input',
    title: 'בעיה מילולית דו-שלבית',
    instructionHebrew: 'קראו בזהירות וחשבו את התשובה:',
    storyText: 'דָּנִי קָנָה 3 חֲבִילוֹת שֶׁל עֶפְרוֹנוֹת. בְּכָל חֲבִילָה יֵשׁ 8 עֶפְרוֹנוֹת.\nלְאַחַר מִכֵּן, הוּא נָתַן לַאֲחוֹתוֹ 5 עֶפְרוֹנוֹת מַתָּנָה.\nכַּמָּה עֶפְרוֹנוֹת נִשְׁאֲרוּ לְדָנִי?',
    hint: '(3 × 8) - 5',
    expectedAnswer: 19
  },
  {
    id: 'math_8_frac_1',
    ageGroup: '8-9',
    category: 'math',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'שברים פשוטים: חלק משלם',
    instructionHebrew: 'סַבָּא חִלֵּק עֻגָּה לְ-4 חֲלָקִים שָׁוִים וְנָתַן לְעִדּוֹ חֵלֶק אֶחָד. אֵיזֶה שֶׁבֶר מֵהָעֻגָּה קִבֵּל עִדּוֹ?',
    targetWordVocalized: '🍰 1 מתוך 4 חלקים שווים',
    correctOptionId: 'fourth',
    options: [
      { id: 'half', emoji: '½', label: 'חֲצִי (1/2)' },
      { id: 'fourth', emoji: '¼', label: 'רֶבַע (1/4)' },
      { id: 'third', emoji: '⅓', label: 'שְׁלִישׁ (1/3)' }
    ]
  },
  {
    id: 'math_8_frac_compare',
    ageGroup: '8-9',
    category: 'math',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'השוואת שברים',
    instructionHebrew: 'מִי גָּדוֹל יוֹתֵר: חֲצִי פִּיצָה (1/2) אוֹ רֶבַע פִּיצָה (1/4)?',
    targetWordVocalized: 'הַשְׁוָאַת שְׁבָרִים',
    correctOptionId: 'half',
    options: [
      { id: 'half', emoji: '🍕', label: 'חֲצִי (1/2) גדול יותר' },
      { id: 'fourth', emoji: '🍕', label: 'רֶבַע (1/4) גדול יותר' },
      { id: 'equal', emoji: '⚖️', label: 'הם שווים' }
    ]
  },
  {
    id: 'math_8_word_saving',
    ageGroup: '8-9',
    category: 'math',
    type: 'numeric_input',
    title: 'חישוב כספי',
    instructionHebrew: 'פתרו את התרגיל:',
    storyText: 'יוֹנָתָן רוֹצֶה לִקְנוֹת מִשְׂחָק שֶׁמְּחִירוֹ 80 שְׁקָלִים. הוּא כְּבָר חָסַךְ 55 שְׁקָלִים.\nכַּמָּה שְׁקָלִים נוֹסָפִים חֲסֵרִים לוֹ כְּדֵי לִקְנוֹת אֶת הַמִּשְׂחָק?',
    hint: '80 - 55',
    expectedAnswer: 25
  }
];

// A round mixes all 5 curated items (word problems, fractions) with generated drills
// (multiplication, missing factor, division, in rotation). No formula repeats within a round.
export function getMathAge8Exercises(count = 20) {
  const drills = [generateAge8Multiplication, generateAge8MissingFactor, generateAge8Division];
  const curated = mathAge8_9CuratedExercises.slice(0, count);
  const drillCount = count - curated.length;

  const usedFormulas = new Set();
  const generated = [];
  for (let i = 0; i < drillCount; i++) {
    const generate = drills[i % drills.length];
    let ex = generate();
    for (let tries = 0; tries < 30 && usedFormulas.has(ex.formula); tries++) ex = generate();
    usedFormulas.add(ex.formula);
    generated.push(ex);
  }

  // Spread the curated items evenly between the drills
  const round = [...generated];
  curated.forEach((item, idx) => {
    const position = Math.round(((idx + 1) * round.length) / (curated.length + 1)) + idx;
    round.splice(position, 0, item);
  });
  return round;
}
