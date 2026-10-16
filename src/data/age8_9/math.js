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
    expectedAnswer: 25
  }
];
