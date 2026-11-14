// Curated math items for grades 3-4 (word problems, fractions). Each item has a grade;
// the rounds are built in src/data/grades/math3.js and math4.js.

export const mathAge8_9CuratedExercises = [
  {
    id: 'math_8_word_1',
    grade: '3',
    category: 'math',
    type: 'numeric_input',
    title: 'בעיה מילולית: חלוקה לקבוצות',
    instructionHebrew: 'קראו את הבעיה המילולית ופתרו:',
    storyText: 'בְּכִתָּה יֵשׁ 24 תַּלְמִידִים. הַמּוֹרָה חִלְּקָה אוֹתָם לְ-4 קְבוּצוֹת שָׁווֹת לְצֹרֶךְ מִשְׂחָק.\nכַּמָּה תַּלְמִידִים יֵשׁ בְּכָל קְבוּצָה?',
    hint: '24 ÷ 4',
    explanation: [
      '24 תלמידים מתחלקים ל-4 קבוצות שוות → חילוק.',
      '<span dir="ltr">24 ÷ 4 = ?</span>',
      'איזה מספר כפול 4 שווה 24? <span dir="ltr">4 × 6 = 24</span>',
      'בכל קבוצה 6 תלמידים.'
    ],
    expectedAnswer: 6
  },
  {
    id: 'math_8_word_2',
    grade: '3',
    category: 'math',
    type: 'numeric_input',
    title: 'בעיה מילולית דו-שלבית',
    instructionHebrew: 'קראו בזהירות וחשבו את התשובה:',
    storyText: 'דָּנִי קָנָה 3 חֲבִילוֹת שֶׁל עֶפְרוֹנוֹת. בְּכָל חֲבִילָה יֵשׁ 8 עֶפְרוֹנוֹת.\nלְאַחַר מִכֵּן, הוּא נָתַן לַאֲחוֹתוֹ 5 עֶפְרוֹנוֹת מַתָּנָה.\nכַּמָּה עֶפְרוֹנוֹת נִשְׁאֲרוּ לְדָנִי?',
    hint: '(3 × 8) - 5',
    explanation: [
      'זו בעיה בשני שלבים.',
      'שלב 1 – כמה עפרונות קנה? <span dir="ltr">3 × 8 = 24</span>',
      'שלב 2 – הוא נתן 5: <span dir="ltr">24 - 5 = 19</span>',
      'נשארו לדני 19 עפרונות.'
    ],
    expectedAnswer: 19
  },
  {
    id: 'math_8_frac_1',
    grade: '4', // the new math program (grade 3 from תשפ"ז) starts fractions only in grade 4
    category: 'math',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'שברים פשוטים: חלק משלם',
    instructionHebrew: 'סַבָּא חִלֵּק עֻגָּה לְ-4 חֲלָקִים שָׁוִים וְנָתַן לְעִדּוֹ חֵלֶק אֶחָד. אֵיזֶה שֶׁבֶר מֵהָעֻגָּה קִבֵּל עִדּוֹ?',
    targetWordVocalized: '🍰 1 מתוך 4 חלקים שווים',
    correctOptionId: 'fourth',
    explanation: [
      'העוגה חולקה ל-4 חלקים שווים → כל חלק הוא רבע (1/4).',
      'המספר למטה (4) אומר לכמה חלקים חילקנו, והמספר למעלה (1) – כמה חלקים לקחנו.'
    ],
    options: [
      { id: 'half', emoji: '½', label: 'חֲצִי (1/2)' },
      { id: 'fourth', emoji: '¼', label: 'רֶבַע (1/4)' },
      { id: 'third', emoji: '⅓', label: 'שְׁלִישׁ (1/3)' }
    ]
  },
  {
    id: 'math_8_frac_compare',
    grade: '4',
    category: 'math',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'השוואת שברים',
    instructionHebrew: 'מִי גָּדוֹל יוֹתֵר: חֲצִי פִּיצָה (1/2) אוֹ רֶבַע פִּיצָה (1/4)?',
    targetWordVocalized: 'הַשְׁוָאַת שְׁבָרִים',
    correctOptionId: 'half',
    explanation: [
      'חצי = חותכים את הפיצה ל-2 חלקים. רבע = חותכים ל-4 חלקים.',
      'כשחותכים ליותר חלקים, כל חלק קטן יותר. לכן חצי גדול מרבע.'
    ],
    mistakes: { fourth: 'המספר 4 גדול מ-2, אבל רבע זה חלק קטן יותר: חותכים את הפיצה ליותר חתיכות!' },
    options: [
      { id: 'half', emoji: '🍕', label: 'חֲצִי (1/2) גדול יותר' },
      { id: 'fourth', emoji: '🍕', label: 'רֶבַע (1/4) גדול יותר' },
      { id: 'equal', emoji: '⚖️', label: 'הם שווים' }
    ]
  },
  {
    id: 'math_8_word_saving',
    grade: '3',
    category: 'math',
    type: 'numeric_input',
    title: 'חישוב כספי',
    instructionHebrew: 'פתרו את התרגיל:',
    storyText: 'יוֹנָתָן רוֹצֶה לִקְנוֹת מִשְׂחָק שֶׁמְּחִירוֹ 80 שְׁקָלִים. הוּא כְּבָר חָסַךְ 55 שְׁקָלִים.\nכַּמָּה שְׁקָלִים נוֹסָפִים חֲסֵרִים לוֹ כְּדֵי לִקְנוֹת אֶת הַמִּשְׂחָק?',
    hint: '80 - 55',
    explanation: [
      'כמה חסר מ-55 עד 80? → חיסור.',
      '<span dir="ltr">55 + 5 = 60</span>, <span dir="ltr">60 + 20 = 80</span>',
      '<span dir="ltr">5 + 20 = 25</span> → חסרים 25 שקלים.',
      'בדיקה: <span dir="ltr">55 + 25 = 80</span> ✔️'
    ],
    expectedAnswer: 25
  }
];
