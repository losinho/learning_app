// Spatial Words Generator (גן חובה: תחושה מרחבית – "להשתמש בשפה מדויקת כדי לתאר יחסים בסיסיים במרחב")
// Each option is a small scene: an object placed above / below / beside / inside a container.
// Right and left are left out on purpose: in a right-to-left screen they are easy to confuse.
import { shuffle } from './random.js';

const MOVERS = [
  { emoji: '🐱', name: 'החתול' },
  { emoji: '🐶', name: 'הכלב' },
  { emoji: '⚽', name: 'הכדור' },
  { emoji: '🧸', name: 'הדובי' }
];

const CONTAINERS = [
  { emoji: '📦', definite: 'הקופסה', withLe: 'לקופסה' },
  { emoji: '🧺', definite: 'הסל', withLe: 'לסל' }
];

// word: shown in the banner; phrase(container): used in the question
const RELATIONS = {
  above: { word: 'מֵעַל', phrase: c => `מעל ${c.definite}` },
  below: { word: 'מִתַּחַת', phrase: c => `מתחת ${c.withLe}` },
  beside: { word: 'לְיַד', phrase: c => `ליד ${c.definite}` },
  inside: { word: 'בְּתוֹךְ', phrase: c => `בתוך ${c.definite}` }
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Absolute positions (px) inside a 120x120 scene for the object and the container
const LAYOUTS = {
  above: { mover: 'left:38px;top:2px', container: 'left:34px;top:64px' },
  below: { mover: 'left:38px;top:70px', container: 'left:34px;top:6px' },
  beside: { mover: 'left:70px;top:44px', container: 'left:4px;top:40px' },
  // The object is drawn smaller and behind the container, so it peeks out of the top
  inside: { mover: 'left:41px;top:22px;font-size:36px;z-index:0', container: 'left:34px;top:46px;z-index:1' }
};

export function spatialScene(moverEmoji, containerEmoji, relation) {
  const layout = LAYOUTS[relation];
  return `<span style="position:relative;display:inline-block;width:120px;height:120px;font-size:44px;line-height:1">` +
    `<span style="position:absolute;${layout.container}">${containerEmoji}</span>` +
    `<span style="position:absolute;${layout.mover}">${moverEmoji}</span>` +
    `</span>`;
}

// "באיזו תמונה החתול מעל הקופסה?" — 3 scenes with the same object and container
export function generateAge5Spatial() {
  const mover = pickRandom(MOVERS);
  const container = pickRandom(CONTAINERS);
  const relationKeys = Object.keys(RELATIONS);
  const target = pickRandom(relationKeys);
  const distractors = shuffle(relationKeys.filter(r => r !== target)).slice(0, 2);
  const relation = RELATIONS[target];

  return {
    id: `math_5_spatial_${target}`,
    ageGroup: '5',
    category: 'math',
    type: 'image_word_match',
    title: 'מיקום במרחב',
    instructionHebrew: `באיזו תמונה ${mover.name} ${relation.phrase(container)}?`,
    targetWordVocalized: relation.word,
    soundCue: `באיזו תמונה ${mover.name} ${relation.phrase(container)}?`,
    correctOptionId: target,
    options: shuffle([target, ...distractors]).map(r => ({ id: r, emoji: spatialScene(mover.emoji, container.emoji, r) }))
  };
}
