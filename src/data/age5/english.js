// Age 5 English Exercises
// Focus: Basic visual vocabulary by topic (colors, fruits, vegetables, animals, food, body,
// clothes, toys & home, transport, nature, shapes, numbers) + uppercase/lowercase letter matching.
// Every round is generated fresh: each question shows + speaks an English word and the child
// picks the matching picture out of 3 options from the SAME topic.

// Each topic: title (shown on the card & used as the topic in the parent report)
// and words { word, emoji, he }.
// Emojis are chosen to render on Android and Windows 10 (no Emoji 13+ glyphs).
export const ENGLISH_VOCABULARY_TOPICS = {
  colors: {
    title: 'Colors (צבעים)',
    words: [
      { word: 'red', emoji: '🔴', he: 'אדום' },
      { word: 'blue', emoji: '🔵', he: 'כחול' },
      { word: 'green', emoji: '🟢', he: 'ירוק' },
      { word: 'yellow', emoji: '🟡', he: 'צהוב' },
      { word: 'orange', emoji: '🟠', he: 'כתום' },
      { word: 'purple', emoji: '🟣', he: 'סגול' },
      { word: 'brown', emoji: '🟤', he: 'חום' },
      { word: 'black', emoji: '⚫', he: 'שחור' },
      { word: 'white', emoji: '⚪', he: 'לבן' }
    ]
  },
  fruits: {
    title: 'Fruits (פירות)',
    words: [
      { word: 'apple', emoji: '🍎', he: 'תפוח' },
      { word: 'banana', emoji: '🍌', he: 'בננה' },
      { word: 'orange', emoji: '🍊', he: 'תפוז' },
      { word: 'grapes', emoji: '🍇', he: 'ענבים' },
      { word: 'strawberry', emoji: '🍓', he: 'תות' },
      { word: 'watermelon', emoji: '🍉', he: 'אבטיח' },
      { word: 'lemon', emoji: '🍋', he: 'לימון' },
      { word: 'pear', emoji: '🍐', he: 'אגס' },
      { word: 'cherry', emoji: '🍒', he: 'דובדבן' },
      { word: 'peach', emoji: '🍑', he: 'אפרסק' },
      { word: 'pineapple', emoji: '🍍', he: 'אננס' },
      { word: 'mango', emoji: '🥭', he: 'מנגו' },
      { word: 'kiwi', emoji: '🥝', he: 'קיווי' }
    ]
  },
  vegetables: {
    title: 'Vegetables (ירקות)',
    words: [
      { word: 'carrot', emoji: '🥕', he: 'גזר' },
      { word: 'tomato', emoji: '🍅', he: 'עגבנייה' },
      { word: 'cucumber', emoji: '🥒', he: 'מלפפון' },
      { word: 'corn', emoji: '🌽', he: 'תירס' },
      { word: 'potato', emoji: '🥔', he: 'תפוח אדמה' },
      { word: 'onion', emoji: '🧅', he: 'בצל' },
      { word: 'garlic', emoji: '🧄', he: 'שום' },
      { word: 'broccoli', emoji: '🥦', he: 'ברוקולי' },
      { word: 'eggplant', emoji: '🍆', he: 'חציל' },
      { word: 'mushroom', emoji: '🍄', he: 'פטרייה' },
      { word: 'lettuce', emoji: '🥬', he: 'חסה' }
    ]
  },
  animals: {
    title: 'Animals (חיות)',
    words: [
      { word: 'cat', emoji: '🐱', he: 'חתול' },
      { word: 'dog', emoji: '🐶', he: 'כלב' },
      { word: 'fish', emoji: '🐟', he: 'דג' },
      { word: 'bird', emoji: '🐦', he: 'ציפור' },
      { word: 'cow', emoji: '🐮', he: 'פרה' },
      { word: 'horse', emoji: '🐴', he: 'סוס' },
      { word: 'lion', emoji: '🦁', he: 'אריה' },
      { word: 'elephant', emoji: '🐘', he: 'פיל' },
      { word: 'monkey', emoji: '🐵', he: 'קוף' },
      { word: 'rabbit', emoji: '🐰', he: 'ארנב' },
      { word: 'duck', emoji: '🦆', he: 'ברווז' },
      { word: 'frog', emoji: '🐸', he: 'צפרדע' },
      { word: 'pig', emoji: '🐷', he: 'חזיר' },
      { word: 'sheep', emoji: '🐑', he: 'כבשה' },
      { word: 'bear', emoji: '🐻', he: 'דוב' },
      { word: 'chicken', emoji: '🐔', he: 'תרנגולת' },
      { word: 'snake', emoji: '🐍', he: 'נחש' },
      { word: 'turtle', emoji: '🐢', he: 'צב' },
      { word: 'mouse', emoji: '🐭', he: 'עכבר' },
      { word: 'giraffe', emoji: '🦒', he: 'ג׳ירפה' },
      { word: 'butterfly', emoji: '🦋', he: 'פרפר' },
      { word: 'bee', emoji: '🐝', he: 'דבורה' }
    ]
  },
  food: {
    title: 'Food (אוכל)',
    words: [
      { word: 'bread', emoji: '🍞', he: 'לחם' },
      { word: 'milk', emoji: '🥛', he: 'חלב' },
      { word: 'egg', emoji: '🥚', he: 'ביצה' },
      { word: 'cheese', emoji: '🧀', he: 'גבינה' },
      { word: 'pizza', emoji: '🍕', he: 'פיצה' },
      { word: 'cake', emoji: '🎂', he: 'עוגה' },
      { word: 'ice cream', emoji: '🍦', he: 'גלידה' },
      { word: 'cookie', emoji: '🍪', he: 'עוגייה' },
      { word: 'candy', emoji: '🍬', he: 'סוכרייה' },
      { word: 'water', emoji: '💧', he: 'מים' }
    ]
  },
  body: {
    title: 'My Body (הגוף שלי)',
    words: [
      { word: 'eye', emoji: '👁️', he: 'עין' },
      { word: 'ear', emoji: '👂', he: 'אוזן' },
      { word: 'nose', emoji: '👃', he: 'אף' },
      { word: 'mouth', emoji: '👄', he: 'פה' },
      { word: 'hand', emoji: '✋', he: 'יד' },
      { word: 'foot', emoji: '🦶', he: 'כף רגל' },
      { word: 'leg', emoji: '🦵', he: 'רגל' },
      { word: 'tooth', emoji: '🦷', he: 'שן' }
    ]
  },
  clothes: {
    title: 'Clothes (בגדים)',
    words: [
      { word: 'shirt', emoji: '👕', he: 'חולצה' },
      { word: 'pants', emoji: '👖', he: 'מכנסיים' },
      { word: 'dress', emoji: '👗', he: 'שמלה' },
      { word: 'hat', emoji: '🧢', he: 'כובע' },
      { word: 'shoes', emoji: '👟', he: 'נעליים' },
      { word: 'socks', emoji: '🧦', he: 'גרביים' },
      { word: 'coat', emoji: '🧥', he: 'מעיל' },
      { word: 'glasses', emoji: '👓', he: 'משקפיים' }
    ]
  },
  toys: {
    title: 'Toys & Home (צעצועים ובית)',
    words: [
      { word: 'ball', emoji: '⚽', he: 'כדור' },
      { word: 'balloon', emoji: '🎈', he: 'בלון' },
      { word: 'book', emoji: '📖', he: 'ספר' },
      { word: 'pencil', emoji: '✏️', he: 'עיפרון' },
      { word: 'bag', emoji: '🎒', he: 'תיק' },
      { word: 'teddy bear', emoji: '🧸', he: 'דובי' },
      { word: 'house', emoji: '🏠', he: 'בית' },
      { word: 'bed', emoji: '🛏️', he: 'מיטה' },
      { word: 'door', emoji: '🚪', he: 'דלת' },
      { word: 'key', emoji: '🔑', he: 'מפתח' },
      { word: 'clock', emoji: '⏰', he: 'שעון' },
      { word: 'phone', emoji: '📱', he: 'טלפון' }
    ]
  },
  transport: {
    title: 'Transport (תחבורה)',
    words: [
      { word: 'car', emoji: '🚗', he: 'מכונית' },
      { word: 'bus', emoji: '🚌', he: 'אוטובוס' },
      { word: 'train', emoji: '🚂', he: 'רכבת' },
      { word: 'plane', emoji: '✈️', he: 'מטוס' },
      { word: 'boat', emoji: '⛵', he: 'סירה' },
      { word: 'bike', emoji: '🚲', he: 'אופניים' },
      { word: 'truck', emoji: '🚚', he: 'משאית' },
      { word: 'rocket', emoji: '🚀', he: 'טיל' }
    ]
  },
  nature: {
    title: 'Nature & Weather (טבע ומזג אוויר)',
    words: [
      { word: 'sun', emoji: '☀️', he: 'שמש' },
      { word: 'moon', emoji: '🌙', he: 'ירח' },
      { word: 'star', emoji: '⭐', he: 'כוכב' },
      { word: 'cloud', emoji: '☁️', he: 'ענן' },
      { word: 'rain', emoji: '🌧️', he: 'גשם' },
      { word: 'snow', emoji: '❄️', he: 'שלג' },
      { word: 'rainbow', emoji: '🌈', he: 'קשת' },
      { word: 'tree', emoji: '🌳', he: 'עץ' },
      { word: 'flower', emoji: '🌸', he: 'פרח' },
      { word: 'sea', emoji: '🌊', he: 'ים' }
    ]
  },
  shapes: {
    title: 'Shapes (צורות)',
    words: [
      { word: 'circle', emoji: '🔵', he: 'עיגול' },
      { word: 'square', emoji: '🟥', he: 'ריבוע' },
      { word: 'triangle', emoji: '🔺', he: 'משולש' },
      { word: 'star', emoji: '⭐', he: 'כוכב' },
      { word: 'heart', emoji: '❤️', he: 'לב' },
      { word: 'diamond', emoji: '🔷', he: 'מעוין' }
    ]
  },
  numbers: {
    title: 'Numbers (מספרים)',
    words: [
      { word: 'one', emoji: '1️⃣', he: 'אחת' },
      { word: 'two', emoji: '2️⃣', he: 'שתיים' },
      { word: 'three', emoji: '3️⃣', he: 'שלוש' },
      { word: 'four', emoji: '4️⃣', he: 'ארבע' },
      { word: 'five', emoji: '5️⃣', he: 'חמש' },
      { word: 'six', emoji: '6️⃣', he: 'שש' },
      { word: 'seven', emoji: '7️⃣', he: 'שבע' },
      { word: 'eight', emoji: '8️⃣', he: 'שמונה' },
      { word: 'nine', emoji: '9️⃣', he: 'תשע' },
      { word: 'ten', emoji: '🔟', he: 'עשר' }
    ]
  }
};

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

// Lowercase letters that young children commonly mix up — used as preferred distractors
const CONFUSABLE_LETTERS = {
  b: ['d', 'p', 'q'], d: ['b', 'p', 'q'], p: ['q', 'b', 'd'], q: ['p', 'd', 'b'],
  m: ['n', 'w'], n: ['m', 'h', 'u'], u: ['n', 'v'], w: ['m', 'v'],
  i: ['j', 'l'], j: ['i', 'g'], l: ['i', 't'], h: ['n', 'b']
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Word -> picture: shows & speaks an English word, child picks the picture (3 options, same topic)
export function generateEnglishWordMatch(topicKey, targetWord = null) {
  const topic = ENGLISH_VOCABULARY_TOPICS[topicKey];
  const target = targetWord || pickRandom(topic.words);
  const distractors = shuffle(topic.words.filter(w => w.word !== target.word)).slice(0, 2);

  const options = shuffle([target, ...distractors]).map(w => ({ id: w.word, emoji: w.emoji }));

  return {
    id: `eng_5_${topicKey}_${target.word.replace(/\s+/g, '_')}`,
    ageGroup: '5',
    category: 'english',
    type: 'image_word_match',
    title: topic.title,
    instructionHebrew: 'הקשיבו למילה באנגלית ובחרו את התמונה המתאימה:',
    instructionEnglish: `Listen and choose: ${target.word.toUpperCase()}`,
    targetWordVocalized: target.word.toUpperCase(),
    soundCue: capitalize(target.word),
    lang: 'en-US',
    correctOptionId: target.word,
    correctAnswerHebrew: target.he,
    options
  };
}

// Uppercase -> lowercase letter matching (3 options, prefers visually confusable letters)
export function generateEnglishLetterMatch(letter = null) {
  const target = letter || pickRandom(ALPHABET);
  const confusables = shuffle(CONFUSABLE_LETTERS[target] || []);
  const others = shuffle(ALPHABET.filter(l => l !== target && !confusables.includes(l)));
  const distractors = [...confusables, ...others].slice(0, 2);

  const options = shuffle([target, ...distractors]).map(l => ({ id: l, emoji: l }));

  return {
    id: `eng_5_letter_${target}`,
    ageGroup: '5',
    category: 'english',
    type: 'image_word_match',
    title: 'Alphabet Letters (אותיות ABC)',
    instructionHebrew: `איזו אות קטנה מתאימה לאות הגדולה ${target.toUpperCase()}?`,
    instructionEnglish: `Match uppercase ${target.toUpperCase()} with its lowercase letter:`,
    targetWordVocalized: target.toUpperCase(),
    soundCue: `Letter ${target.toUpperCase()}`,
    lang: 'en-US',
    correctOptionId: target,
    options
  };
}

// Generates a fresh round. With no topic, the round mixes topics (no topic twice in a row)
// and includes ~1 letter-matching question per 5 questions.
// With a topic key ('fruits', 'colors', ...) the whole round practices that topic.
export function getEnglishAge5Exercises(count = 10, topicKey = null) {
  if (topicKey && ENGLISH_VOCABULARY_TOPICS[topicKey]) {
    const words = shuffle(ENGLISH_VOCABULARY_TOPICS[topicKey].words);
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(generateEnglishWordMatch(topicKey, words[i % words.length]));
    }
    return list;
  }

  const topicKeys = Object.keys(ENGLISH_VOCABULARY_TOPICS);
  let topicQueue = [];
  const usedWords = new Set();
  const usedLetters = new Set();
  const list = [];

  for (let i = 0; i < count; i++) {
    if (i % 5 === 4) {
      let letter;
      do { letter = pickRandom(ALPHABET); } while (usedLetters.has(letter));
      usedLetters.add(letter);
      list.push(generateEnglishLetterMatch(letter));
      continue;
    }

    if (topicQueue.length === 0) topicQueue = shuffle(topicKeys);
    const topicKey = topicQueue.pop();
    const fresh = ENGLISH_VOCABULARY_TOPICS[topicKey].words.filter(w => !usedWords.has(w.word));
    const target = pickRandom(fresh.length ? fresh : ENGLISH_VOCABULARY_TOPICS[topicKey].words);
    usedWords.add(target.word);
    list.push(generateEnglishWordMatch(topicKey, target));
  }
  return list;
}
