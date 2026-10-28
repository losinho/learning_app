// Age 5 English Exercises
// Focus: Basic visual vocabulary by topic (colors, fruits, vegetables, animals, bugs, sea animals, food,
// body, clothes, toys & home, transport, nature, shapes, actions, feelings, family, greetings, numbers)
// + uppercase/lowercase letter matching.
// Every round is generated fresh: each question shows + speaks an English word and the child
// picks the matching picture out of 3 options from the SAME topic.
import { shuffle } from '../../engine/random.js';
import { pickOddOneOut } from '../../engine/oddOneOut.js';

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
      { word: 'kiwi', emoji: '🥝', he: 'קיווי' },
      { word: 'coconut', emoji: '🥥', he: 'קוקוס' },
      { word: 'avocado', emoji: '🥑', he: 'אבוקדו' },
      { word: 'melon', emoji: '🍈', he: 'מלון' }
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
      { word: 'lettuce', emoji: '🥬', he: 'חסה' },
      { word: 'pepper', emoji: '🌶️', he: 'פלפל' }
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
      { word: 'tiger', emoji: '🐯', he: 'נמר' },
      { word: 'zebra', emoji: '🦓', he: 'זברה' },
      { word: 'owl', emoji: '🦉', he: 'ינשוף' },
      { word: 'fox', emoji: '🦊', he: 'שועל' },
      { word: 'wolf', emoji: '🐺', he: 'זאב' },
      { word: 'camel', emoji: '🐫', he: 'גמל' },
      { word: 'kangaroo', emoji: '🦘', he: 'קנגורו' },
      { word: 'hedgehog', emoji: '🦔', he: 'קיפוד' },
      { word: 'goat', emoji: '🐐', he: 'עז' },
      { word: 'panda', emoji: '🐼', he: 'פנדה' },
      { word: 'crocodile', emoji: '🐊', he: 'תנין' },
      { word: 'dinosaur', emoji: '🦖', he: 'דינוזאור' }
    ]
  },
  bugs: {
    title: 'Bugs (חרקים ושרצים)',
    words: [
      { word: 'butterfly', emoji: '🦋', he: 'פרפר' },
      { word: 'bee', emoji: '🐝', he: 'דבורה' },
      { word: 'ant', emoji: '🐜', he: 'נמלה' },
      { word: 'spider', emoji: '🕷️', he: 'עכביש' },
      { word: 'ladybug', emoji: '🐞', he: 'פרת משה רבנו' },
      { word: 'snail', emoji: '🐌', he: 'חילזון' },
      { word: 'caterpillar', emoji: '🐛', he: 'זחל' }
    ]
  },
  sea: {
    title: 'Sea Animals (חיות ים)',
    words: [
      { word: 'whale', emoji: '🐳', he: 'לווייתן' },
      { word: 'dolphin', emoji: '🐬', he: 'דולפין' },
      { word: 'octopus', emoji: '🐙', he: 'תמנון' },
      { word: 'crab', emoji: '🦀', he: 'סרטן' },
      { word: 'shark', emoji: '🦈', he: 'כריש' },
      { word: 'shell', emoji: '🐚', he: 'צדף' },
      { word: 'shrimp', emoji: '🦐', he: 'שרימפס' },
      { word: 'penguin', emoji: '🐧', he: 'פינגווין' }
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
      { word: 'water', emoji: '💧', he: 'מים' },
      { word: 'sandwich', emoji: '🥪', he: 'כריך' },
      { word: 'soup', emoji: '🍲', he: 'מרק' },
      { word: 'rice', emoji: '🍚', he: 'אורז' },
      { word: 'pasta', emoji: '🍝', he: 'פסטה' },
      { word: 'chocolate', emoji: '🍫', he: 'שוקולד' },
      { word: 'honey', emoji: '🍯', he: 'דבש' },
      { word: 'juice', emoji: '🧃', he: 'מיץ' },
      { word: 'popcorn', emoji: '🍿', he: 'פופקורן' },
      { word: 'hamburger', emoji: '🍔', he: 'המבורגר' },
      { word: 'donut', emoji: '🍩', he: 'סופגנייה' }
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
      { word: 'tooth', emoji: '🦷', he: 'שן' },
      { word: 'tongue', emoji: '👅', he: 'לשון' },
      { word: 'finger', emoji: '☝️', he: 'אצבע' }
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
      { word: 'glasses', emoji: '👓', he: 'משקפיים' },
      { word: 'scarf', emoji: '🧣', he: 'צעיף' },
      { word: 'gloves', emoji: '🧤', he: 'כפפות' },
      { word: 'boots', emoji: '👢', he: 'מגפיים' },
      { word: 'crown', emoji: '👑', he: 'כתר' },
      { word: 'tie', emoji: '👔', he: 'עניבה' },
      { word: 'shorts', emoji: '🩳', he: 'מכנסיים קצרים' }
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
      { word: 'phone', emoji: '📱', he: 'טלפון' },
      { word: 'kite', emoji: '🪁', he: 'עפיפון' },
      { word: 'drum', emoji: '🥁', he: 'תוף' },
      { word: 'puzzle', emoji: '🧩', he: 'פאזל' },
      { word: 'guitar', emoji: '🎸', he: 'גיטרה' },
      { word: 'robot', emoji: '🤖', he: 'רובוט' },
      { word: 'gift', emoji: '🎁', he: 'מתנה' },
      { word: 'scissors', emoji: '✂️', he: 'מספריים' },
      { word: 'chair', emoji: '🪑', he: 'כיסא' },
      { word: 'spoon', emoji: '🥄', he: 'כפית' },
      { word: 'TV', emoji: '📺', he: 'טלוויזיה' }
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
      { word: 'rocket', emoji: '🚀', he: 'טיל' },
      { word: 'helicopter', emoji: '🚁', he: 'מסוק' },
      { word: 'taxi', emoji: '🚕', he: 'מונית' },
      { word: 'ambulance', emoji: '🚑', he: 'אמבולנס' },
      { word: 'fire truck', emoji: '🚒', he: 'כבאית' },
      { word: 'police car', emoji: '🚓', he: 'ניידת משטרה' },
      { word: 'ship', emoji: '🚢', he: 'ספינה' },
      { word: 'tractor', emoji: '🚜', he: 'טרקטור' },
      { word: 'scooter', emoji: '🛴', he: 'קורקינט' },
      { word: 'motorcycle', emoji: '🏍️', he: 'אופנוע' }
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
      { word: 'sea', emoji: '🌊', he: 'ים' },
      { word: 'mountain', emoji: '⛰️', he: 'הר' },
      { word: 'fire', emoji: '🔥', he: 'אש' },
      { word: 'leaf', emoji: '🍁', he: 'עלה' },
      { word: 'wind', emoji: '🌬️', he: 'רוח' },
      { word: 'cactus', emoji: '🌵', he: 'קקטוס' },
      { word: 'lightning', emoji: '⚡', he: 'ברק' },
      { word: 'umbrella', emoji: '☔', he: 'מטרייה' },
      { word: 'earth', emoji: '🌍', he: 'כדור הארץ' }
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
  actions: {
    title: 'Actions (פעולות)',
    words: [
      { word: 'run', emoji: '🏃', he: 'לרוץ' },
      { word: 'walk', emoji: '🚶', he: 'ללכת' },
      { word: 'swim', emoji: '🏊', he: 'לשחות' },
      { word: 'dance', emoji: '💃', he: 'לרקוד' },
      { word: 'sing', emoji: '🎤', he: 'לשיר' },
      { word: 'clap', emoji: '👏', he: 'למחוא כפיים' },
      { word: 'sleep', emoji: '😴', he: 'לישון' },
      { word: 'write', emoji: '✍️', he: 'לכתוב' },
      { word: 'ride', emoji: '🚴', he: 'לרכוב' },
      { word: 'climb', emoji: '🧗', he: 'לטפס' },
      { word: 'read', emoji: '📚', he: 'לקרוא' },
      { word: 'cook', emoji: '👨‍🍳', he: 'לבשל' },
      { word: 'eat', emoji: '🍽️', he: 'לאכול' },
      { word: 'drink', emoji: '🥤', he: 'לשתות' },
      { word: 'draw', emoji: '🎨', he: 'לצייר' },
      { word: 'play', emoji: '🎮', he: 'לשחק' },
      { word: 'laugh', emoji: '😂', he: 'לצחוק' },
      { word: 'cry', emoji: '😭', he: 'לבכות' },
      { word: 'wash', emoji: '🧼', he: 'לרחוץ' }
    ]
  },
  feelings: {
    title: 'Feelings (רגשות)',
    words: [
      { word: 'happy', emoji: '😊', he: 'שמח' },
      { word: 'sad', emoji: '😢', he: 'עצוב' },
      { word: 'angry', emoji: '😠', he: 'כועס' },
      { word: 'scared', emoji: '😨', he: 'מפחד' },
      { word: 'surprised', emoji: '😮', he: 'מופתע' },
      { word: 'tired', emoji: '🥱', he: 'עייף' },
      { word: 'sick', emoji: '🤒', he: 'חולה' },
      { word: 'silly', emoji: '🤪', he: 'מצחיק' },
      { word: 'cold', emoji: '🥶', he: 'קר לי' },
      { word: 'hot', emoji: '🥵', he: 'חם לי' }
    ]
  },
  family: {
    title: 'Family & People (משפחה ואנשים)',
    words: [
      { word: 'mom', emoji: '👩', he: 'אמא' },
      { word: 'dad', emoji: '👨', he: 'אבא' },
      { word: 'baby', emoji: '👶', he: 'תינוק' },
      { word: 'grandma', emoji: '👵', he: 'סבתא' },
      { word: 'grandpa', emoji: '👴', he: 'סבא' },
      { word: 'boy', emoji: '👦', he: 'ילד' },
      { word: 'girl', emoji: '👧', he: 'ילדה' },
      { word: 'family', emoji: '👪', he: 'משפחה' },
      { word: 'teacher', emoji: '👩‍🏫', he: 'מורה' },
      { word: 'doctor', emoji: '👩‍⚕️', he: 'רופאה' }
    ]
  },
  greetings: {
    title: 'Greetings (ברכות ומילים)',
    words: [
      { word: 'hello', emoji: '👋', he: 'שלום' },
      { word: 'thank you', emoji: '🙏', he: 'תודה' },
      { word: 'yes', emoji: '👍', he: 'כן' },
      { word: 'no', emoji: '👎', he: 'לא' },
      { word: 'good morning', emoji: '🌅', he: 'בוקר טוב' },
      { word: 'good night', emoji: '🌙', he: 'לילה טוב' },
      { word: 'OK', emoji: '👌', he: 'בסדר' },
      { word: 'stop', emoji: '✋', he: 'עצור' }
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
      { word: 'ten', emoji: '🔟', he: 'עשר' },
      { word: 'zero', emoji: '0️⃣', he: 'אפס' }
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

// A topic's Hebrew name, from its title: 'Fruits (פירות)' → 'פירות'
export function topicHebrewName(topicKey) {
  const title = ENGLISH_VOCABULARY_TOPICS[topicKey].title;
  return (title.match(/\((.+)\)/) || [null, title])[1];
}

// Odd one out: 3 pictures of one kind + 1 that doesn't belong, each with its English word
export function generateEnglishOddOneOut() {
  const { groupKey, group, odd } = pickOddOneOut(ENGLISH_VOCABULARY_TOPICS);
  return {
    id: `eng_odd_${odd.word.replace(/\s+/g, '_')}`,
    ageGroup: '5',
    category: 'english',
    type: 'image_word_match',
    showOptionLabels: true,
    title: 'Odd One Out (מה לא שייך?)',
    instructionHebrew: 'שלוש תמונות שייכות לאותה קבוצה. איזו תמונה לא שייכת?',
    instructionEnglish: 'Which one does not belong?',
    targetWordVocalized: '<span style="font-size:0.55em;white-space:nowrap">Odd one out 🤔</span>',
    soundCue: 'Which one does not belong?',
    lang: 'en-US',
    correctOptionId: odd.word,
    feedbackNote: `${group.map(w => w.emoji).join(' ')} – ${topicHebrewName(groupKey)}<br>${odd.emoji} ${odd.word} = ${odd.he}`,
    options: shuffle([...group, odd]).map(w => ({ id: w.word, emoji: w.emoji, label: w.word }))
  };
}

// Topic picker chips: the topic's Hebrew name (from its title) and its first word's emoji
export function getEnglishTopicChips() {
  return Object.entries(ENGLISH_VOCABULARY_TOPICS).map(([key, topic]) => ({
    key,
    label: (topic.title.match(/\((.+)\)/) || [null, topic.title])[1],
    emoji: topic.words[0].emoji
  }));
}

// Listen-only: the word is hidden and spoken automatically; it is revealed in the feedback
function toListenOnly(ex) {
  if (!ex.correctAnswerHebrew) return ex; // letter questions need the letter on screen
  return {
    ...ex,
    revealWord: ex.targetWordVocalized,
    targetWordVocalized: '👂 ?',
    instructionEnglish: 'Listen and choose',
    autoSpeak: true
  };
}

// Generates a fresh round. With no topic, the round mixes topics (no topic twice in a row)
// and every 5 questions include 1 odd-one-out and 1 letter-matching question.
// topicKey: a topic ('fruits', 'colors', ...) practises only that topic; 'letters' practises only letters.
// options.listenOnly hides the English word so the child must recognise it by ear.
export function getEnglishAge5Exercises(count = 20, topicKey = null, options = {}) {
  const round = buildEnglishRound(count, topicKey);
  return options.listenOnly ? round.map(toListenOnly) : round;
}

function buildEnglishRound(count, topicKey) {
  if (topicKey === 'letters') {
    // 26 letters, so a round of up to 26 never repeats one
    const letters = shuffle(ALPHABET);
    const list = [];
    for (let i = 0; i < count; i++) list.push(generateEnglishLetterMatch(letters[i % letters.length]));
    return list;
  }

  if (topicKey && ENGLISH_VOCABULARY_TOPICS[topicKey]) {
    // A topic has 6–22 words, so a 20-question round goes through all of them before repeating any
    const words = ENGLISH_VOCABULARY_TOPICS[topicKey].words;
    let queue = [];
    const list = [];
    for (let i = 0; i < count; i++) {
      if (queue.length === 0) queue = shuffle(words);
      list.push(generateEnglishWordMatch(topicKey, queue.pop()));
    }
    return list;
  }

  const topicKeys = Object.keys(ENGLISH_VOCABULARY_TOPICS);
  let topicQueue = [];
  const usedWords = new Set();
  const usedLetters = new Set();
  const list = [];

  for (let i = 0; i < count; i++) {
    if (i % 5 === 2) {
      let ex = generateEnglishOddOneOut();
      for (let tries = 0; tries < 10 && usedWords.has(ex.correctOptionId); tries++) ex = generateEnglishOddOneOut();
      usedWords.add(ex.correctOptionId);
      list.push(ex);
      continue;
    }
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
