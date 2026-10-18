// Grades 3–4 Hebrew (shared pool — the Ministry sets these goals "by the end of grade 4").
// Curated reading passages and root questions (src/data/age8_9/hebrew.js) plus generated grammar questions
// from the program's language topics: gender/number agreement, number words, סמיכות.
import { hebrewAge8_9ReadingPassages, hebrewAge8_9Grammar } from '../age8_9/hebrew.js';
import { mixRound } from './roundUtils.js';

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function textQuestion({ id, title, instructionHebrew, targetWordVocalized, correct, wrong, feedbackNote }) {
  return {
    id,
    category: 'hebrew',
    type: 'image_word_match',
    showOptionLabels: true,
    bigLabels: true,
    hideWordAudio: true,
    title,
    instructionHebrew,
    targetWordVocalized,
    correctOptionId: correct,
    feedbackNote,
    options: shuffle([correct, ...wrong]).map(w => ({ id: w, emoji: '', label: w }))
  };
}

// ---- 1. Agreement (התאם): subject + present-tense verb in the right gender and number ----
// Form order: [masculine singular, feminine singular, masculine plural, feminine plural]
const SUBJECTS = [
  { text: 'הַיֶּלֶד', form: 0 }, { text: 'דָּנִי', form: 0 },
  { text: 'הַיַּלְדָּה', form: 1 }, { text: 'נֹעָה', form: 1 },
  { text: 'הַיְלָדִים', form: 2 }, { text: 'הַתַּלְמִידִים', form: 2 },
  { text: 'הַיְּלָדוֹת', form: 3 }, { text: 'הַתַּלְמִידוֹת', form: 3 }
];
const VERBS = [
  { forms: ['רָץ', 'רָצָה', 'רָצִים', 'רָצוֹת'], rest: 'בַּגַּן' },
  { forms: ['כּוֹתֵב', 'כּוֹתֶבֶת', 'כּוֹתְבִים', 'כּוֹתְבוֹת'], rest: 'מִכְתָּב' },
  { forms: ['שָׁר', 'שָׁרָה', 'שָׁרִים', 'שָׁרוֹת'], rest: 'שִׁיר' },
  { forms: ['אוֹכֵל', 'אוֹכֶלֶת', 'אוֹכְלִים', 'אוֹכְלוֹת'], rest: 'תַּפּוּחַ' },
  { forms: ['קוֹרֵא', 'קוֹרֵאת', 'קוֹרְאִים', 'קוֹרְאוֹת'], rest: 'סֵפֶר' },
  { forms: ['מְשַׂחֵק', 'מְשַׂחֶקֶת', 'מְשַׂחֲקִים', 'מְשַׂחֲקוֹת'], rest: 'בַּכַּדּוּר' },
  { forms: ['יָשֵׁן', 'יְשֵׁנָה', 'יְשֵׁנִים', 'יְשֵׁנוֹת'], rest: 'בַּלַּיְלָה' }
];

export function generateAgreement() {
  const subject = pickRandom(SUBJECTS);
  const verb = pickRandom(VERBS);
  const correct = verb.forms[subject.form];
  const wrong = shuffle(verb.forms.filter((_, i) => i !== subject.form)).slice(0, 2);
  return textQuestion({
    id: `heb_34_agree_${subject.text}_${verb.forms[0]}`,
    title: 'לשון: התאם במין ובמספר',
    instructionHebrew: 'איזו מילה מתאימה למשפט?',
    targetWordVocalized: `${subject.text} ___ ${verb.rest}.`,
    correct,
    wrong,
    feedbackNote: `${subject.text} ${correct} ${verb.rest}.`
  });
}

// ---- 2. Number words: masculine nouns take שְׁלוֹשָׁה, feminine nouns take שָׁלוֹשׁ ----
// Includes nouns whose plural ending "hides" their gender (צִפֳּרִים is feminine, עֶפְרוֹנוֹת masculine)
const NUMBERS = [
  { m: 'שְׁלוֹשָׁה', f: 'שָׁלוֹשׁ' }, { m: 'אַרְבָּעָה', f: 'אַרְבַּע' }, { m: 'חֲמִשָּׁה', f: 'חָמֵשׁ' },
  { m: 'שִׁשָּׁה', f: 'שֵׁשׁ' }, { m: 'שִׁבְעָה', f: 'שֶׁבַע' }, { m: 'שְׁמוֹנָה', f: 'שְׁמוֹנֶה' },
  { m: 'תִּשְׁעָה', f: 'תֵּשַׁע' }, { m: 'עֲשָׂרָה', f: 'עֶשֶׂר' }
];
const COUNTED_NOUNS = [
  { word: 'יְלָדִים', gender: 'm' }, { word: 'סְפָרִים', gender: 'm' }, { word: 'כְּלָבִים', gender: 'm' },
  { word: 'עֶפְרוֹנוֹת', gender: 'm' }, { word: 'שֻׁלְחָנוֹת', gender: 'm' }, { word: 'חַלּוֹנוֹת', gender: 'm' },
  { word: 'בָּנוֹת', gender: 'f' }, { word: 'מְכוֹנִיּוֹת', gender: 'f' }, { word: 'יְלָדוֹת', gender: 'f' },
  { word: 'צִפֳּרִים', gender: 'f' }, { word: 'בֵּיצִים', gender: 'f' }
];

export function generateNumberWords() {
  const number = pickRandom(NUMBERS);
  const noun = pickRandom(COUNTED_NOUNS);
  const correct = number[noun.gender];
  const other = number[noun.gender === 'm' ? 'f' : 'm'];
  // A third option: the right gender but a different number, so the child must read the number too
  const third = pickRandom(NUMBERS.filter(n => n !== number))[noun.gender];
  return textQuestion({
    id: `heb_34_number_${number.m}_${noun.word}`,
    title: 'לשון: שם המספר',
    instructionHebrew: `איך אומרים נכון? (המספר הוא ${NUMBERS.indexOf(number) + 3})`,
    targetWordVocalized: `___ ${noun.word}`,
    correct,
    wrong: [other, third],
    feedbackNote: `${correct} ${noun.word} (${noun.gender === 'm' ? 'זכר' : 'נקבה'})`
  });
}

// ---- 3. סמיכות: "עֻגָּה שֶׁל שׁוֹקוֹלָד" → "עֻגַּת שׁוֹקוֹלָד" ----
const CONSTRUCT_ITEMS = [
  { long: 'עֻגָּה שֶׁל שׁוֹקוֹלָד', correct: 'עֻגַּת שׁוֹקוֹלָד', wrong: ['עֻגָּה שׁוֹקוֹלָד', 'עֻגּוֹת שׁוֹקוֹלָד'] },
  { long: 'בַּיִת שֶׁל סֵפֶר', correct: 'בֵּית סֵפֶר', wrong: ['בַּיִת סֵפֶר', 'בָּתִּים סֵפֶר'] },
  { long: 'תַּחֲנָה שֶׁל אוֹטוֹבּוּס', correct: 'תַּחֲנַת אוֹטוֹבּוּס', wrong: ['תַּחֲנָה אוֹטוֹבּוּס', 'תַּחֲנוֹת אוֹטוֹבּוּס'] },
  { long: 'אֲרוּחָה שֶׁל בֹּקֶר', correct: 'אֲרוּחַת בֹּקֶר', wrong: ['אֲרוּחָה בֹּקֶר', 'אֲרוּחוֹת בֹּקֶר'] },
  { long: 'מִטָּה שֶׁל תִּינוֹק', correct: 'מִטַּת תִּינוֹק', wrong: ['מִטָּה תִּינוֹק', 'מִטּוֹת תִּינוֹק'] },
  { long: 'שֻׁלְחָן שֶׁל כְּתִיבָה', correct: 'שֻׁלְחַן כְּתִיבָה', wrong: ['שֻׁלְחָן כְּתִיבָה', 'שֻׁלְחָנוֹת כְּתִיבָה'] },
  { long: 'שִׂמְלָה שֶׁל כַּלָּה', correct: 'שִׂמְלַת כַּלָּה', wrong: ['שִׂמְלָה כַּלָּה', 'שְׂמָלוֹת כַּלָּה'] }
];

export function generateConstruct() {
  const item = pickRandom(CONSTRUCT_ITEMS);
  return textQuestion({
    id: `heb_34_smichut_${item.correct}`,
    title: 'לשון: צירוף סמיכות',
    instructionHebrew: 'איך אומרים את זה בצירוף סמיכות (בלי "שֶׁל")?',
    targetWordVocalized: item.long,
    correct: item.correct,
    wrong: item.wrong,
    feedbackNote: `${item.long} = ${item.correct}`
  });
}

// ---- Curated items (reading passages flattened to one question each, plus root/plural questions) ----
function curatedItems() {
  const readingItems = [];
  hebrewAge8_9ReadingPassages.forEach(set => {
    set.questions.forEach((q, qIndex) => {
      readingItems.push({
        id: `${set.id}_${q.id}`,
        category: 'hebrew',
        type: 'reading_comprehension_question',
        title: `${set.title} (שאלה ${qIndex + 1}/${set.questions.length})`,
        passageTitle: set.passageTitle,
        passageText: set.passageText,
        instructionHebrew: 'קראו את הקטע וענו על השאלה הבאה:',
        prompt: q.prompt,
        options: q.options.map((optText, optIdx) => ({ id: String(optIdx), label: optText })),
        correctIndex: q.correctIndex
      });
    });
  });
  return [...readingItems, ...hebrewAge8_9Grammar];
}

// About half the round comes from the curated pool (a different sample each round), half is generated
export function getHebrewGrades3And4Exercises(count = 20) {
  const curated = shuffle(curatedItems()).slice(0, Math.ceil(count / 2));
  return mixRound(count, [generateAgreement, generateNumberWords, generateConstruct], curated);
}
