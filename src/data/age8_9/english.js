// Age 8-9 English Curriculum (Ministry of Education - Band I / Grades 3-4)
// Rich variety of exercises:
// 1. Sentence Completion (Grammar & Sight Words)
// 2. Odd One Out (Vocabulary Categorization)
// 3. Opposites & Antonyms (Vocabulary Expansion)
// 4. Question & Answer Matching (Dialogue & Communication)

export const englishAge8_9Exercises = [
  // --- TYPE 1: SENTENCE COMPLETION ---
  {
    id: 'eng_8_comp_1',
    ageGroup: '8-9',
    category: 'english',
    type: 'fill_in_blank',
    title: 'Sentence Completion',
    instructionHebrew: 'השלימו את המילה הנכונה במשפט:',
    instructionEnglish: 'Choose the correct word to complete the sentence:',
    sentenceBefore: 'The children are playing in the ',
    sentenceAfter: '.',
    expectedAnswer: 'park',
    soundCue: 'The children are playing in the park.',
    lang: 'en-US',
    options: [
      { id: 'park', label: 'park 🌳' },
      { id: 'pencil', label: 'pencil ✏️' },
      { id: 'pizza', label: 'pizza 🍕' }
    ]
  },
  {
    id: 'eng_8_comp_2',
    ageGroup: '8-9',
    category: 'english',
    type: 'fill_in_blank',
    title: 'Grammar: Have or Has',
    instructionHebrew: 'איזו מילה מתאימה למשפט (Have או Has)?',
    instructionEnglish: 'Choose have or has:',
    sentenceBefore: 'Maya ',
    sentenceAfter: ' a cute little dog.',
    expectedAnswer: 'has',
    soundCue: 'Maya has a cute little dog.',
    lang: 'en-US',
    options: [
      { id: 'has', label: 'has' },
      { id: 'have', label: 'have' },
      { id: 'having', label: 'having' }
    ]
  },
  {
    id: 'eng_8_comp_3',
    ageGroup: '8-9',
    category: 'english',
    type: 'fill_in_blank',
    title: 'Grammar: Is, Are, Am',
    instructionHebrew: 'השלימו את פועל העזר הנכון:',
    instructionEnglish: 'Choose the correct form of the verb "to be":',
    sentenceBefore: 'There ',
    sentenceAfter: ' five apples on the tree.',
    expectedAnswer: 'are',
    soundCue: 'There are five apples on the tree.',
    lang: 'en-US',
    options: [
      { id: 'is', label: 'is' },
      { id: 'are', label: 'are' },
      { id: 'am', label: 'am' }
    ]
  },

  // --- TYPE 2: ODD ONE OUT (יוצא דופן) ---
  {
    id: 'eng_8_odd_1',
    ageGroup: '8-9',
    category: 'english',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'Odd One Out (יוצא דופן)',
    instructionHebrew: 'איזו מילה היא יוצאת דופן בקבוצה?',
    instructionEnglish: 'Which word does NOT belong to the group?',
    targetWordVocalized: 'Fruits vs Animals',
    soundCue: 'Which word is the odd one out?',
    lang: 'en-US',
    correctOptionId: 'dog',
    options: [
      { id: 'apple', emoji: '🍎', label: 'Apple' },
      { id: 'banana', emoji: '🍌', label: 'Banana' },
      { id: 'dog', emoji: '🐶', label: 'Dog' },
      { id: 'orange', emoji: '🍊', label: 'Orange' }
    ]
  },
  {
    id: 'eng_8_odd_2',
    ageGroup: '8-9',
    category: 'english',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'Odd One Out (יוצא דופן)',
    instructionHebrew: 'איזו מילה אינה שייכת לקבוצת כלי התחבורה?',
    instructionEnglish: 'Which word does NOT belong?',
    targetWordVocalized: 'Vehicles',
    soundCue: 'Which word does not belong?',
    lang: 'en-US',
    correctOptionId: 'book',
    options: [
      { id: 'car', emoji: '🚗', label: 'Car' },
      { id: 'bus', emoji: '🚌', label: 'Bus' },
      { id: 'plane', emoji: '✈️', label: 'Plane' },
      { id: 'book', emoji: '📖', label: 'Book' }
    ]
  },
  {
    id: 'eng_8_odd_3',
    ageGroup: '8-9',
    category: 'english',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'Odd One Out (יוצא דופן)',
    instructionHebrew: 'איזו מילה אינה שייכת לקבוצת הרהיטים?',
    instructionEnglish: 'Which word is NOT furniture?',
    targetWordVocalized: 'Furniture',
    soundCue: 'Which word is not furniture?',
    lang: 'en-US',
    correctOptionId: 'pizza',
    options: [
      { id: 'chair', emoji: '🪑', label: 'Chair' },
      { id: 'table', emoji: '🪵', label: 'Table' },
      { id: 'pizza', emoji: '🍕', label: 'Pizza' },
      { id: 'bed', emoji: '🛏️', label: 'Bed' }
    ]
  },

  // --- TYPE 3: OPPOSITES & ANTONYMS (הפכים) ---
  {
    id: 'eng_8_opp_1',
    ageGroup: '8-9',
    category: 'english',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'Opposites (הפכים)',
    instructionHebrew: 'מה ההפך של המילה BIG (גדול)?',
    instructionEnglish: 'What is the opposite of BIG?',
    targetWordVocalized: 'BIG ↔ ?',
    soundCue: 'What is the opposite of big?',
    lang: 'en-US',
    correctOptionId: 'small',
    options: [
      { id: 'small', emoji: '🐭', label: 'Small (קטן)' },
      { id: 'tall', emoji: '🦒', label: 'Tall (גבוה)' },
      { id: 'blue', emoji: '🔵', label: 'Blue (כחול)' }
    ]
  },
  {
    id: 'eng_8_opp_2',
    ageGroup: '8-9',
    category: 'english',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'Opposites (הפכים)',
    instructionHebrew: 'מה ההפך של המילה HOT (חם)?',
    instructionEnglish: 'What is the opposite of HOT?',
    targetWordVocalized: 'HOT ↔ ?',
    soundCue: 'What is the opposite of hot?',
    lang: 'en-US',
    correctOptionId: 'cold',
    options: [
      { id: 'cold', emoji: '🧊', label: 'Cold (קר)' },
      { id: 'warm', emoji: '☀️', label: 'Warm (חמים)' },
      { id: 'red', emoji: '🔴', label: 'Red (אדום)' }
    ]
  },
  {
    id: 'eng_8_opp_3',
    ageGroup: '8-9',
    category: 'english',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'Opposites (הפכים)',
    instructionHebrew: 'מה ההפך של המילה HAPPY (שמח)?',
    instructionEnglish: 'What is the opposite of HAPPY?',
    targetWordVocalized: 'HAPPY ↔ ?',
    soundCue: 'What is the opposite of happy?',
    lang: 'en-US',
    correctOptionId: 'sad',
    options: [
      { id: 'sad', emoji: '😢', label: 'Sad (עצוב)' },
      { id: 'fast', emoji: '🏃', label: 'Fast (מהיר)' },
      { id: 'funny', emoji: '🤡', label: 'Funny (מצחיק)' }
    ]
  },
  {
    id: 'eng_8_opp_4',
    ageGroup: '8-9',
    category: 'english',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'Opposites (הפכים)',
    instructionHebrew: 'מה ההפך של המילה FAST (מהיר)?',
    instructionEnglish: 'What is the opposite of FAST?',
    targetWordVocalized: 'FAST ↔ ?',
    soundCue: 'What is the opposite of fast?',
    lang: 'en-US',
    correctOptionId: 'slow',
    options: [
      { id: 'slow', emoji: '🐢', label: 'Slow (איטי)' },
      { id: 'loud', emoji: '📢', label: 'Loud (רועש)' },
      { id: 'green', emoji: '🟢', label: 'Green (ירוק)' }
    ]
  },

  // --- TYPE 4: QUESTION & ANSWER MATCHING (דיאלוג ותקשורת) ---
  {
    id: 'eng_8_qa_1',
    ageGroup: '8-9',
    category: 'english',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'Questions & Answers',
    instructionHebrew: 'איזו תשובה מתאימה לשאלה: "How old are you?"',
    instructionEnglish: 'Choose the correct answer for: "How old are you?"',
    targetWordVocalized: 'How old are you?',
    soundCue: 'How old are you?',
    lang: 'en-US',
    correctOptionId: 'ans_age',
    options: [
      { id: 'ans_age', emoji: '🎂', label: 'I am 9 years old.' },
      { id: 'ans_name', emoji: '🏷️', label: 'My name is Dan.' },
      { id: 'ans_like', emoji: '🍕', label: 'I like pizza.' }
    ]
  },
  {
    id: 'eng_8_qa_2',
    ageGroup: '8-9',
    category: 'english',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'Questions & Answers',
    instructionHebrew: 'איזו תשובה מתאימה לשאלה: "Where do you live?"',
    instructionEnglish: 'Choose the correct answer for: "Where do you live?"',
    targetWordVocalized: 'Where do you live?',
    soundCue: 'Where do you live?',
    lang: 'en-US',
    correctOptionId: 'ans_city',
    options: [
      { id: 'ans_city', emoji: '🏙️', label: 'I live in Haifa.' },
      { id: 'ans_time', emoji: '⏰', label: 'It is 8 o\'clock.' },
      { id: 'ans_color', emoji: '🎨', label: 'Blue and green.' }
    ]
  },
  {
    id: 'eng_8_qa_3',
    ageGroup: '8-9',
    category: 'english',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'Questions & Answers',
    instructionHebrew: 'איזו תשובה מתאימה לשאלה: "Can you swim?"',
    instructionEnglish: 'Choose the correct answer for: "Can you swim?"',
    targetWordVocalized: 'Can you swim?',
    soundCue: 'Can you swim?',
    lang: 'en-US',
    correctOptionId: 'ans_can',
    options: [
      { id: 'ans_can', emoji: '🏊', label: 'Yes, I can!' },
      { id: 'ans_no', emoji: '🌧️', label: 'It is raining.' },
      { id: 'ans_apple', emoji: '🍎', label: 'Two apples.' }
    ]
  }
];
