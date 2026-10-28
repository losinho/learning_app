// Israeli Coins Generator (גן חובה: מושגים כמותיים בחיי היום יום – "הילד ידע לזהות מטבעות",
// "הילד ידע להשתמש בכסף לצורך קנייה"). Coin pictures are in public/coins/.
import { shuffle } from './random.js';

export const COINS = [
  { id: 'agorot10', value: 0.1, name: 'עֶשֶׂר אֲגוֹרוֹת', spoken: 'עשר אגורות' },
  { id: 'half', value: 0.5, name: 'חֲצִי שֶׁקֶל', spoken: 'חצי שקל' },
  { id: 'shekel1', value: 1, name: 'שֶׁקֶל אֶחָד', spoken: 'שקל אחד' },
  { id: 'shekel2', value: 2, name: 'שְׁנֵי שְׁקָלִים', spoken: 'שני שקלים' },
  { id: 'shekel5', value: 5, name: 'חֲמִשָּׁה שְׁקָלִים', spoken: 'חמישה שקלים' },
  { id: 'shekel10', value: 10, name: 'עֲשָׂרָה שְׁקָלִים', spoken: 'עשרה שקלים' }
];

// Coins children mix up: both "10" coins, and ½ vs 1 shekel
const LOOKALIKE_COINS = {
  agorot10: ['shekel10'], shekel10: ['agorot10'],
  half: ['shekel1'], shekel1: ['half']
};

// Things to "buy" in the shop game (prices use whole-shekel coins only)
const SHOP_ITEMS = [
  { id: 'lollipop', emoji: '🍭', name: 'סוכרייה' },
  { id: 'balloon', emoji: '🎈', name: 'בלון' },
  { id: 'icecream', emoji: '🍦', name: 'גלידה' },
  { id: 'apple', emoji: '🍎', name: 'תפוח' },
  { id: 'pencil', emoji: '✏️', name: 'עיפרון' },
  { id: 'ball', emoji: '⚽', name: 'כדור' }
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function coinImg(coinId) {
  return `<img src="./public/coins/${coinId}.png" alt="" width="112" height="112" draggable="false" style="display:inline-block">`;
}

// 2 distractors for a target coin: a look-alike when there is one, otherwise random
function coinDistractors(target, pool = COINS) {
  const lookalike = (LOOKALIKE_COINS[target.id] || []).map(id => pool.find(c => c.id === id)).find(Boolean);
  const others = shuffle(pool.filter(c => c.id !== target.id && c !== lookalike));
  return lookalike ? [lookalike, others[0]] : others.slice(0, 2);
}

// "איפה המטבע של חמישה שקלים?" — 3 coin pictures
export function generateAge5CoinRecognition() {
  const target = pickRandom(COINS);
  const options = shuffle([target, ...coinDistractors(target)]).map(c => ({ id: c.id, emoji: coinImg(c.id) }));

  return {
    id: `math_5_coin_${target.id}`,
    ageGroup: '5',
    category: 'math',
    type: 'image_word_match',
    title: 'מטבעות',
    instructionHebrew: `איפה המטבע של ${target.spoken}?`,
    targetWordVocalized: target.name,
    soundCue: `איפה המטבע של ${target.spoken}?`,
    correctOptionId: target.id,
    options
  };
}

// "הסוכרייה עולה 2 ₪. באיזה מטבע משלמים?" — pay the exact price with one coin
export function generateAge5CoinBuying() {
  const wholeShekels = COINS.filter(c => Number.isInteger(c.value));
  const coin = pickRandom(wholeShekels);
  const item = pickRandom(SHOP_ITEMS);
  const options = shuffle([coin, ...coinDistractors(coin, wholeShekels)]).map(c => ({ id: c.id, emoji: coinImg(c.id) }));

  return {
    id: `math_5_buy_${item.id}_${coin.id}`,
    ageGroup: '5',
    category: 'math',
    type: 'image_word_match',
    title: 'קונים בחנות',
    instructionHebrew: `ה${item.name} עולה ${coin.value} ₪. באיזה מטבע משלמים?`,
    targetWordVocalized: `${item.emoji} ${coin.value} ₪`,
    soundCue: `ה${item.name} עולה ${coin.spoken}. באיזה מטבע משלמים?`,
    correctOptionId: coin.id,
    feedbackNote: `${item.emoji} = ${coin.name}`,
    options
  };
}
