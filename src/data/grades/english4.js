// Grade 4 English (כיתה ד' — A1 / Band I). Curated items (src/data/age8_9/english.js) plus generated
// grammar and vocabulary questions: be (am/is/are), have/has, a/an, present simple with he/she (-s),
// opposites, plural nouns (regular and irregular). Answers are text only — the child reads.
import { englishAge8_9Exercises } from '../age8_9/english.js';
import { mixRound } from './roundUtils.js';

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Fill-in-the-blank sentence (the existing fill_in_blank card): "The dogs ___ big."
function blank({ id, title, instructionHebrew, instructionEnglish, before, after, answer, options }) {
  return {
    id,
    category: 'english',
    type: 'fill_in_blank',
    title,
    instructionHebrew,
    instructionEnglish,
    sentenceBefore: before,
    sentenceAfter: after,
    expectedAnswer: answer,
    soundCue: `${before}${answer}${after}`,
    lang: 'en-US',
    options: shuffle(options).map(o => ({ id: o, label: o }))
  };
}

// Text-only choice: "What is the opposite of BIG?"
function choice({ id, title, instructionHebrew, instructionEnglish, prompt, answer, wrong, soundCue }) {
  return {
    id,
    category: 'english',
    type: 'image_word_match',
    showOptionLabels: true,
    title,
    instructionHebrew,
    instructionEnglish,
    targetWordVocalized: prompt,
    soundCue: soundCue || prompt,
    lang: 'en-US',
    correctOptionId: answer,
    options: shuffle([answer, ...wrong]).map(o => ({ id: o, emoji: '', label: o }))
  };
}

// ---- be: am / is / are ----
const BE_SUBJECTS = [
  { s: 'I', be: 'am' }, { s: 'You', be: 'are' }, { s: 'We', be: 'are' }, { s: 'They', be: 'are' },
  { s: 'He', be: 'is' }, { s: 'She', be: 'is' }, { s: 'It', be: 'is' },
  { s: 'The cat', be: 'is' }, { s: 'The dogs', be: 'are' }, { s: 'My sister', be: 'is' }, { s: 'The children', be: 'are' }
];
const BE_ENDINGS = ['happy.', 'at school.', 'in the park.', 'hungry.', 'very tall.', 'my friend.'];

export function generateBeVerb() {
  const subject = pickRandom(BE_SUBJECTS);
  // "my friend" only fits a single person (not "It", "I" or a plural subject)
  const ending = pickRandom(BE_ENDINGS.filter(e => !(e === 'my friend.' && ['We', 'They', 'The dogs', 'The children', 'I', 'It', 'The cat'].includes(subject.s))));
  return blank({
    id: `eng_g4_be_${subject.s}_${ending}`,
    title: 'Grammar: am, is, are',
    instructionHebrew: 'השלימו את המילה הנכונה (am / is / are):',
    instructionEnglish: 'Choose am, is or are:',
    before: `${subject.s} `,
    after: ` ${ending}`,
    answer: subject.be,
    options: ['am', 'is', 'are']
  });
}

// ---- have / has ----
const HAVE_SUBJECTS = [
  { s: 'I', v: 'have' }, { s: 'You', v: 'have' }, { s: 'We', v: 'have' }, { s: 'They', v: 'have' },
  { s: 'He', v: 'has' }, { s: 'She', v: 'has' }, { s: 'Dan', v: 'has' }, { s: 'My mother', v: 'has' }
];
const HAVE_OBJECTS = ['a red bike.', 'two cats.', 'a big bag.', 'a new ball.', 'many books.'];

export function generateHaveHas() {
  const subject = pickRandom(HAVE_SUBJECTS);
  const object = pickRandom(HAVE_OBJECTS);
  return blank({
    id: `eng_g4_have_${subject.s}_${object}`,
    title: 'Grammar: have or has',
    instructionHebrew: 'השלימו have או has:',
    instructionEnglish: 'Choose have or has:',
    before: `${subject.s} `,
    after: ` ${object}`,
    answer: subject.v,
    options: ['have', 'has']
  });
}

// ---- a / an ----
const A_AN_WORDS = ['apple', 'egg', 'orange', 'elephant', 'umbrella', 'ice cream', 'banana', 'dog', 'pencil', 'house', 'cat', 'bike'];

export function generateAAn() {
  const word = pickRandom(A_AN_WORDS);
  const answer = /^[aeiou]/.test(word) ? 'an' : 'a';
  return blank({
    id: `eng_g4_aan_${word}`,
    title: 'Grammar: a or an',
    instructionHebrew: 'השלימו a או an:',
    instructionEnglish: 'Choose a or an:',
    before: 'I have ',
    after: ` ${word}.`,
    answer,
    options: ['a', 'an']
  });
}

// ---- Present simple: he/she + verb-s ----
const VERB_PHRASES = [
  { base: 'play', s: 'plays', rest: 'football' }, { base: 'read', s: 'reads', rest: 'books' },
  { base: 'like', s: 'likes', rest: 'pizza' }, { base: 'eat', s: 'eats', rest: 'an apple every day' },
  { base: 'go', s: 'goes', rest: 'to school' }, { base: 'swim', s: 'swims', rest: 'in the sea' },
  { base: 'drink', s: 'drinks', rest: 'milk' }
];
const PS_SUBJECTS = [
  { s: 'He', third: true }, { s: 'She', third: true }, { s: 'My brother', third: true },
  { s: 'I', third: false }, { s: 'We', third: false }, { s: 'They', third: false }
];

export function generatePresentSimple() {
  const subject = pickRandom(PS_SUBJECTS);
  const verb = pickRandom(VERB_PHRASES);
  return blank({
    id: `eng_g4_ps_${subject.s}_${verb.base}`,
    title: 'Grammar: Present Simple',
    instructionHebrew: 'איזו צורה של הפועל נכונה?',
    instructionEnglish: 'Choose the correct verb:',
    before: `${subject.s} `,
    after: ` ${verb.rest}.`,
    answer: subject.third ? verb.s : verb.base,
    options: [verb.base, verb.s]
  });
}

// ---- Opposites ----
const OPPOSITES = [
  ['big', 'small'], ['hot', 'cold'], ['happy', 'sad'], ['fast', 'slow'], ['tall', 'short'], ['up', 'down'],
  ['day', 'night'], ['black', 'white'], ['full', 'empty'], ['clean', 'dirty'], ['wet', 'dry'], ['open', 'closed'],
  ['old', 'new'], ['early', 'late'], ['easy', 'hard']
];

export function generateOpposite() {
  const pair = shuffle(pickRandom(OPPOSITES));
  const [word, answer] = pair;
  // Wrong answers come from other pairs (no word in the list is a second opposite of another)
  const wrong = shuffle(OPPOSITES.filter(p => !p.includes(word)).flat().filter(w => w !== answer)).slice(0, 2);
  return choice({
    id: `eng_g4_opp_${word}`,
    title: 'Opposites (הפכים)',
    instructionHebrew: `מה ההפך של ${word.toUpperCase()}?`,
    instructionEnglish: `What is the opposite of ${word.toUpperCase()}?`,
    prompt: `${word.toUpperCase()} ↔ ?`,
    answer,
    wrong,
    soundCue: `What is the opposite of ${word}?`
  });
}

// ---- Plural nouns ----
const PLURALS = [
  { one: 'box', many: 'boxes', wrong: ['boxs', 'boxies'] },
  { one: 'baby', many: 'babies', wrong: ['babys', 'babyes'] },
  { one: 'bus', many: 'buses', wrong: ['buss', 'busies'] },
  { one: 'child', many: 'children', wrong: ['childs', 'childes'] },
  { one: 'mouse', many: 'mice', wrong: ['mouses', 'meese'] },
  { one: 'foot', many: 'feet', wrong: ['foots', 'feets'] },
  { one: 'man', many: 'men', wrong: ['mans', 'mens'] },
  { one: 'tooth', many: 'teeth', wrong: ['tooths', 'teeths'] },
  { one: 'book', many: 'books', wrong: ['bookes', 'bookies'] },
  { one: 'dress', many: 'dresses', wrong: ['dresss', 'dressies'] },
  { one: 'city', many: 'cities', wrong: ['citys', 'cityes'] },
  { one: 'fish', many: 'fish', wrong: ['fishs', 'fishies'] }
];

export function generatePlural() {
  const item = pickRandom(PLURALS);
  return choice({
    id: `eng_g4_plural_${item.one}`,
    title: 'Grammar: Plurals',
    instructionHebrew: 'מהי צורת הרבים הנכונה?',
    instructionEnglish: 'Choose the correct plural:',
    prompt: `one ${item.one} → two ?`,
    answer: item.many,
    wrong: item.wrong,
    soundCue: `One ${item.one}, two ...`
  });
}

// About half the round from the curated items (a different sample each round), half generated
export function getEnglishGrade4Exercises(count = 20) {
  const curated = shuffle(englishAge8_9Exercises).slice(0, Math.ceil(count / 2));
  return mixRound(count, [generateBeVerb, generatePlural, generateHaveHas, generateOpposite, generatePresentSimple, generateAAn], curated);
}
