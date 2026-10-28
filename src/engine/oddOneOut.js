// Odd one out (מה לא שייך? — sorting into groups, גן חובה): 3 pictures from one group and 1 from another.
// Groups are the word-bank topics. Topics in the same family never meet (a bee is not "odd" among animals,
// a cake is not "odd" among fruits), so the odd picture is clearly a different kind of thing.
// Left out: colors, shapes and numbers (abstract pictures; 🔵 is both blue and circle) and actions,
// feelings and greetings (faces and hands look alike across them).
import { shuffle } from './random.js';

const FAMILIES = {
  animals: 'living', bugs: 'living', sea: 'living',
  fruits: 'food', vegetables: 'food', food: 'food',
  body: 'people', family: 'people',
  clothes: 'clothes', transport: 'transport', toys: 'toys', nature: 'nature'
};

// "Toys & home" and "nature & weather" are mixed bags (spoon, kite, bed), so they only supply the odd picture
const GROUP_TOPICS = ['animals', 'bugs', 'sea', 'fruits', 'vegetables', 'food', 'body', 'family', 'clothes', 'transport'];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// topics: { key: { words: [{ word, emoji, ... }] } } keyed like the English bank.
// Returns { groupKey, group (3 words), odd (1 word) }.
export function pickOddOneOut(topics, groupSize = 3) {
  const keys = Object.keys(topics).filter(k => FAMILIES[k]);
  const groupKey = pickRandom(keys.filter(k => GROUP_TOPICS.includes(k) && topics[k].words.length >= groupSize));
  const group = shuffle(topics[groupKey].words).slice(0, groupSize);
  const oddKey = pickRandom(keys.filter(k => FAMILIES[k] !== FAMILIES[groupKey]));
  const odd = pickRandom(topics[oddKey].words.filter(w => !group.some(g => g.emoji === w.emoji)));
  return { groupKey, group, odd };
}
