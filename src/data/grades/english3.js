// Grade 3 English (כיתה ג' — Pre-A1 / "Pre Band I", the first year of formal English).
// Can-do goals covered: match a word to a picture, recognise everyday nouns/adjectives/action words,
// recognise upper- and lower-case letters, letter–sound links (phonics), read short sentences.
// Reuses the age-5 vocabulary bank; here the child READS the word (age 5 mostly listens).
import { ENGLISH_VOCABULARY_TOPICS, generateEnglishWordMatch, generateEnglishLetterMatch } from '../age5/english.js';
import { mixRound } from './roundUtils.js';
import { shuffle } from '../../engine/random.js';

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Every single word from the bank, with its topic
const ALL_WORDS = Object.entries(ENGLISH_VOCABULARY_TOPICS)
  .flatMap(([topicKey, topic]) => topic.words.map(w => ({ ...w, topicKey })));

// Words whose first letter makes its regular sound: no vowels (several sounds), no digraphs (ch, sh, th…),
// no silent letters (wr, kn) and no soft c/g (circle, giraffe)
const PHONICS_WORDS = ALL_WORDS.filter(w =>
  /^[a-z]+$/.test(w.word) &&
  !/^[aeiou]/.test(w.word) &&
  !/^(ch|sh|th|ph|wh|wr|kn)/.test(w.word) &&
  !/^[cg][eiy]/.test(w.word));

// Letters that make the same first sound
const SAME_SOUND = [['c', 'k']];
const soundsAlike = (a, b) => a === b || SAME_SOUND.some(g => g.includes(a) && g.includes(b));

// Consonant-vowel-consonant words for the missing-letter game (cat, dog, sun…)
const CVC_WORDS = ALL_WORDS.filter(w => /^[b-df-hj-np-tv-z][aeiou][b-df-hj-np-tv-z]$/.test(w.word));
const VOWELS = ['a', 'e', 'i', 'o', 'u'];

// 1. Read a word (lower case, as in books) and choose its picture
export function generateGrade3ReadWord() {
  const target = pickRandom(ALL_WORDS);
  const ex = generateEnglishWordMatch(target.topicKey, target);
  return {
    ...ex,
    id: `eng_g3_read_${target.topicKey}_${target.word.replace(/\s+/g, '_')}`,
    title: 'Reading Words (קריאת מילים)',
    instructionHebrew: 'קראו את המילה באנגלית ובחרו את התמונה המתאימה:',
    instructionEnglish: 'Read the word and choose the picture:',
    targetWordVocalized: target.word
  };
}

// 2. Letter sounds: "Which picture starts with B?"
export function generateGrade3Phonics() {
  const target = pickRandom(PHONICS_WORDS);
  const letter = target.word[0];
  const distractors = [];
  for (const w of shuffle(PHONICS_WORDS)) {
    if (distractors.length === 2) break;
    if (soundsAlike(w.word[0], letter)) continue;
    if (w.emoji === target.emoji || distractors.some(d => d.emoji === w.emoji || soundsAlike(d.word[0], w.word[0]))) continue;
    distractors.push(w);
  }
  return {
    id: `eng_g3_phonics_${target.word}`,
    category: 'english',
    type: 'image_word_match',
    title: 'Letter Sounds (צלילי אותיות)',
    instructionHebrew: `איזו תמונה מתחילה באות ${letter.toUpperCase()}?`,
    instructionEnglish: `Which picture starts with ${letter.toUpperCase()}?`,
    targetWordVocalized: `${letter.toUpperCase()} ${letter}`,
    soundCue: `Which picture starts with the letter ${letter.toUpperCase()}?`,
    lang: 'en-US',
    correctOptionId: target.word,
    feedbackNote: `${target.emoji} ${target.word}`,
    options: shuffle([target, ...distractors]).map(w => ({ id: w.word, emoji: w.emoji }))
  };
}

// 3. Missing letter: 🐱 c _ t → a / o / u
export function generateGrade3MissingLetter() {
  const target = pickRandom(CVC_WORDS);
  const vowel = target.word[1];
  const others = shuffle(VOWELS.filter(v => v !== vowel)).slice(0, 2);
  return {
    id: `eng_g3_missing_${target.word}`,
    category: 'english',
    type: 'image_word_match',
    title: 'Missing Letter (האות החסרה)',
    instructionHebrew: 'איזו אות חסרה במילה?',
    instructionEnglish: 'Which letter is missing?',
    targetWordVocalized: `${target.emoji} ${target.word[0]} _ ${target.word[2]}`,
    soundCue: target.word,
    lang: 'en-US',
    correctOptionId: vowel,
    feedbackNote: `${target.emoji} ${target.word}`,
    options: shuffle([vowel, ...others]).map(v => ({ id: v, emoji: v }))
  };
}

// 4. Read a short sentence and choose the picture
const SENTENCE_TEMPLATES = [
  { topic: 'actions', make: w => `I can ${w}.` },
  { topic: 'feelings', make: w => `I am ${w}.` },
  { topic: 'animals', make: w => `I see ${/^[aeiou]/.test(w) ? 'an' : 'a'} ${w}.` },
  { topic: 'colors', make: w => `It is ${w}.` },
  { topic: 'fruits', make: w => `I have ${w === 'grapes' ? 'grapes' : `${/^[aeiou]/.test(w) ? 'an' : 'a'} ${w}`}.` }
];

export function generateGrade3Sentence() {
  const template = pickRandom(SENTENCE_TEMPLATES);
  const words = ENGLISH_VOCABULARY_TOPICS[template.topic].words;
  const target = pickRandom(words);
  const distractors = shuffle(words.filter(w => w.word !== target.word)).slice(0, 2);
  const sentence = template.make(target.word);
  return {
    id: `eng_g3_sentence_${template.topic}_${target.word}`,
    category: 'english',
    type: 'image_word_match',
    title: 'Reading Sentences (קריאת משפטים)',
    instructionHebrew: 'קראו את המשפט ובחרו את התמונה המתאימה:',
    instructionEnglish: 'Read the sentence and choose the picture:',
    targetWordVocalized: sentence,
    soundCue: sentence,
    lang: 'en-US',
    correctOptionId: target.word,
    feedbackNote: `${target.emoji} ${sentence}`,
    options: shuffle([target, ...distractors]).map(w => ({ id: w.word, emoji: w.emoji }))
  };
}

export function getEnglishGrade3Exercises(count = 20) {
  return mixRound(count, [
    generateGrade3ReadWord,
    generateGrade3Phonics,
    generateGrade3MissingLetter,
    generateGrade3Sentence,
    () => generateEnglishLetterMatch()
  ]);
}
