// Basic Russian (gan level — enrichment; Russian is not part of the Ministry curriculum).
// Same idea as age-5 English: hear + see a Russian word → pick the picture from the same topic; plus
// upper/lower-case Cyrillic letter matching. Pictures and Hebrew meanings come from the English word bank.
import { ENGLISH_VOCABULARY_TOPICS } from './english.js';
import { shuffle } from '../../engine/random.js';

// Russian word per English bank word, by topic ('orange' the colour ≠ 'orange' the fruit)
const RUSSIAN_WORDS = {
  colors: { red: 'красный', blue: 'синий', green: 'зелёный', yellow: 'жёлтый', orange: 'оранжевый', purple: 'фиолетовый', brown: 'коричневый', black: 'чёрный', white: 'белый' },
  fruits: { apple: 'яблоко', banana: 'банан', orange: 'апельсин', grapes: 'виноград', strawberry: 'клубника', watermelon: 'арбуз', lemon: 'лимон', pear: 'груша', cherry: 'вишня', peach: 'персик', pineapple: 'ананас', mango: 'манго', kiwi: 'киви', coconut: 'кокос', avocado: 'авокадо', melon: 'дыня' },
  vegetables: { carrot: 'морковь', tomato: 'помидор', cucumber: 'огурец', corn: 'кукуруза', potato: 'картошка', onion: 'лук', garlic: 'чеснок', broccoli: 'брокколи', eggplant: 'баклажан', mushroom: 'гриб', lettuce: 'салат', pepper: 'перец' },
  animals: { cat: 'кошка', dog: 'собака', fish: 'рыба', bird: 'птица', cow: 'корова', horse: 'лошадь', lion: 'лев', elephant: 'слон', monkey: 'обезьяна', rabbit: 'кролик', duck: 'утка', frog: 'лягушка', pig: 'свинья', sheep: 'овца', bear: 'медведь', chicken: 'курица', snake: 'змея', turtle: 'черепаха', mouse: 'мышь', giraffe: 'жираф', tiger: 'тигр', zebra: 'зебра', owl: 'сова', fox: 'лиса', wolf: 'волк', camel: 'верблюд', kangaroo: 'кенгуру', hedgehog: 'ёжик', goat: 'коза', panda: 'панда', crocodile: 'крокодил', dinosaur: 'динозавр' },
  bugs: { butterfly: 'бабочка', bee: 'пчела', ant: 'муравей', spider: 'паук', ladybug: 'божья коровка', snail: 'улитка', caterpillar: 'гусеница' },
  sea: { whale: 'кит', dolphin: 'дельфин', octopus: 'осьминог', crab: 'краб', shark: 'акула', shell: 'ракушка', shrimp: 'креветка', penguin: 'пингвин' },
  food: { bread: 'хлеб', milk: 'молоко', egg: 'яйцо', cheese: 'сыр', pizza: 'пицца', cake: 'торт', 'ice cream': 'мороженое', cookie: 'печенье', candy: 'конфета', water: 'вода', sandwich: 'бутерброд', soup: 'суп', rice: 'рис', pasta: 'макароны', chocolate: 'шоколад', honey: 'мёд', juice: 'сок', popcorn: 'попкорн', hamburger: 'гамбургер', donut: 'пончик' },
  body: { eye: 'глаз', ear: 'ухо', nose: 'нос', mouth: 'рот', hand: 'рука', leg: 'нога', tooth: 'зуб', tongue: 'язык', finger: 'палец' },
  clothes: { shirt: 'футболка', pants: 'штаны', dress: 'платье', hat: 'кепка', shoes: 'кроссовки', socks: 'носки', coat: 'куртка', glasses: 'очки', scarf: 'шарф', gloves: 'перчатки', boots: 'сапоги', crown: 'корона', tie: 'галстук', shorts: 'шорты' },
  toys: { ball: 'мяч', balloon: 'шарик', book: 'книга', pencil: 'карандаш', bag: 'рюкзак', 'teddy bear': 'мишка', house: 'дом', bed: 'кровать', door: 'дверь', key: 'ключ', clock: 'часы', phone: 'телефон', kite: 'воздушный змей', drum: 'барабан', puzzle: 'пазл', guitar: 'гитара', robot: 'робот', gift: 'подарок', scissors: 'ножницы', chair: 'стул', spoon: 'ложка', TV: 'телевизор' },
  transport: { car: 'машина', bus: 'автобус', train: 'поезд', plane: 'самолёт', boat: 'лодка', bike: 'велосипед', truck: 'грузовик', rocket: 'ракета', helicopter: 'вертолёт', taxi: 'такси', ambulance: 'скорая помощь', 'fire truck': 'пожарная машина', 'police car': 'полицейская машина', ship: 'корабль', tractor: 'трактор', scooter: 'самокат', motorcycle: 'мотоцикл' },
  nature: { sun: 'солнце', moon: 'луна', star: 'звезда', cloud: 'облако', rain: 'дождь', snow: 'снег', rainbow: 'радуга', tree: 'дерево', flower: 'цветок', sea: 'море', mountain: 'гора', fire: 'огонь', leaf: 'лист', wind: 'ветер', cactus: 'кактус', lightning: 'молния', umbrella: 'зонтик', earth: 'Земля' },
  shapes: { circle: 'круг', square: 'квадрат', triangle: 'треугольник', star: 'звезда', heart: 'сердце', diamond: 'ромб' },
  actions: { run: 'бегать', walk: 'ходить', swim: 'плавать', dance: 'танцевать', sing: 'петь', clap: 'хлопать', sleep: 'спать', write: 'писать', ride: 'кататься', climb: 'лазать', read: 'читать', cook: 'готовить', eat: 'есть', drink: 'пить', draw: 'рисовать', play: 'играть', laugh: 'смеяться', cry: 'плакать', wash: 'мыться' },
  family: { mom: 'мама', dad: 'папа', baby: 'малыш', grandma: 'бабушка', grandpa: 'дедушка', boy: 'мальчик', girl: 'девочка', family: 'семья', teacher: 'учительница', doctor: 'врач' },
  numbers: { zero: 'ноль', one: 'один', two: 'два', three: 'три', four: 'четыре', five: 'пять', six: 'шесть', seven: 'семь', eight: 'восемь', nine: 'девять', ten: 'десять' },
  greetings: { hello: 'привет', 'thank you': 'спасибо', yes: 'да', no: 'нет', 'good morning': 'доброе утро', 'good night': 'спокойной ночи', OK: 'хорошо', stop: 'стоп' }
};

// Card titles: Hebrew topic name + Russian
const RUSSIAN_TOPIC_NAMES = {
  colors: 'Цвета', fruits: 'Фрукты', vegetables: 'Овощи', animals: 'Животные', bugs: 'Насекомые', sea: 'Морские животные',
  food: 'Еда', body: 'Тело', clothes: 'Одежда', toys: 'Игрушки и дом', transport: 'Транспорт', nature: 'Природа',
  shapes: 'Фигуры', actions: 'Действия', family: 'Семья', numbers: 'Числа', greetings: 'Слова'
};

// Topics as { title, words: [{ word (Russian), emoji, he }] }, built from the English bank
export const RUSSIAN_VOCABULARY_TOPICS = Object.fromEntries(Object.entries(RUSSIAN_WORDS).map(([key, words]) => {
  const english = ENGLISH_VOCABULARY_TOPICS[key];
  const hebrewName = (english.title.match(/\((.+)\)/) || [null, ''])[1];
  return [key, {
    title: `${hebrewName} (${RUSSIAN_TOPIC_NAMES[key]})`,
    words: english.words.filter(w => words[w.word]).map(w => ({ word: words[w.word], emoji: w.emoji, he: w.he }))
  }];
}));

const RUSSIAN_ALPHABET = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.split('');

// Lower-case letters that look alike — used as preferred distractors
const LOOKALIKE_LETTERS = {
  'и': ['й', 'п'], 'й': ['и'], 'е': ['ё', 'э'], 'ё': ['е'], 'ш': ['щ', 'и'], 'щ': ['ш'],
  'ь': ['ъ', 'ы', 'б'], 'ъ': ['ь'], 'ы': ['ь'], 'б': ['в', 'ь'], 'в': ['б'], 'п': ['н', 'л'], 'н': ['п'],
  'л': ['п', 'д'], 'д': ['л'], 'з': ['э', 'е'], 'э': ['з', 'е'], 'р': ['ф'], 'ф': ['р']
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Hear + see a Russian word → pick its picture (3 options from the same topic)
export function generateRussianWordMatch(topicKey, targetWord = null) {
  const topic = RUSSIAN_VOCABULARY_TOPICS[topicKey];
  const target = targetWord || pickRandom(topic.words);
  const distractors = shuffle(topic.words.filter(w => w.word !== target.word)).slice(0, 2);
  return {
    id: `rus_5_${topicKey}_${target.word.replace(/\s+/g, '_')}`,
    ageGroup: '5',
    category: 'russian',
    type: 'image_word_match',
    title: topic.title,
    instructionHebrew: 'הקשיבו למילה ברוסית ובחרו את התמונה המתאימה:',
    targetWordVocalized: target.word.toUpperCase(),
    soundCue: target.word,
    lang: 'ru-RU',
    correctOptionId: target.word,
    correctAnswerHebrew: target.he,
    options: shuffle([target, ...distractors]).map(w => ({ id: w.word, emoji: w.emoji }))
  };
}

// Upper-case → lower-case Cyrillic letter (3 options, a look-alike when there is one)
export function generateRussianLetterMatch(letter = null) {
  const target = letter || pickRandom(RUSSIAN_ALPHABET);
  const lookalikes = shuffle(LOOKALIKE_LETTERS[target] || []);
  const others = shuffle(RUSSIAN_ALPHABET.filter(l => l !== target && !lookalikes.includes(l)));
  const distractors = [...lookalikes, ...others].slice(0, 2);
  return {
    id: `rus_5_letter_${target}`,
    ageGroup: '5',
    category: 'russian',
    type: 'image_word_match',
    title: 'אותיות (Буквы)',
    instructionHebrew: `איזו אות קטנה מתאימה לאות הגדולה ${target.toUpperCase()}?`,
    targetWordVocalized: target.toUpperCase(),
    soundCue: `Буква ${target.toUpperCase()}`,
    lang: 'ru-RU',
    correctOptionId: target,
    options: shuffle([target, ...distractors]).map(l => ({ id: l, emoji: l }))
  };
}

// A round mixes topics (no topic repeats until all are used, no word repeats) with a letter question every 5th
export function getRussianAge5Exercises(count = 20) {
  const topicKeys = Object.keys(RUSSIAN_VOCABULARY_TOPICS);
  let topicQueue = [];
  const usedWords = new Set();
  const usedLetters = new Set();
  const list = [];
  for (let i = 0; i < count; i++) {
    if (i % 5 === 4) {
      let letter;
      do { letter = pickRandom(RUSSIAN_ALPHABET); } while (usedLetters.has(letter));
      usedLetters.add(letter);
      list.push(generateRussianLetterMatch(letter));
      continue;
    }
    if (topicQueue.length === 0) topicQueue = shuffle(topicKeys);
    const topicKey = topicQueue.pop();
    const words = RUSSIAN_VOCABULARY_TOPICS[topicKey].words;
    const fresh = words.filter(w => !usedWords.has(w.word));
    const target = pickRandom(fresh.length ? fresh : words);
    usedWords.add(target.word);
    list.push(generateRussianWordMatch(topicKey, target));
  }
  return list;
}
