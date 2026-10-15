// Shapes & Solids Generator (גן חובה: תחושה מרחבית וגיאומטריה)
// 2D shapes are drawn as inline SVG in a random colour, size and rotation, because the Ministry program
// stresses that a shape's name does not depend on its colour, size or orientation
// (e.g. a square "standing on its corner" is still a square).

const SHAPE_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316', '#ec4899', '#14b8a6'];
const ROTATIONS = [0, 0, 15, 30, 45, 90, 180, -20, -45];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Regular polygon centred in the 100x100 viewBox, first vertex at the top
function regularPolygon(sides, radius = 42) {
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / sides;
    points.push(`${(50 + radius * Math.cos(angle)).toFixed(1)},${(50 + radius * Math.sin(angle)).toFixed(1)}`);
  }
  return points.join(' ');
}

// Different kinds of triangles, so children don't learn "triangle = equilateral pointing up"
const TRIANGLE_POINTS = [
  regularPolygon(3),
  '18,82 82,82 18,22',  // right triangle
  '8,72 92,72 34,30',   // wide, obtuse
  '50,8 72,90 28,90'    // tall and thin
];

const SHAPE_DRAWERS = {
  circle: () => '<circle cx="50" cy="50" r="42"/>',
  ellipse: () => '<ellipse cx="50" cy="50" rx="45" ry="26"/>',
  half_circle: () => '<path d="M8,64 A42,42 0 0 1 92,64 Z"/>',
  triangle: () => `<polygon points="${pickRandom(TRIANGLE_POINTS)}"/>`,
  square: () => '<rect x="20" y="20" width="60" height="60"/>',
  rectangle: () => '<rect x="6" y="29" width="88" height="42"/>',
  pentagon: () => `<polygon points="${regularPolygon(5)}"/>`,
  hexagon: () => `<polygon points="${regularPolygon(6)}"/>`
};

export const SHAPES_2D = [
  { kind: 'circle', name: 'עִגּוּל' },
  { kind: 'ellipse', name: 'אֶלִיפְּסָה' },
  { kind: 'half_circle', name: 'חֲצִי עִגּוּל' },
  { kind: 'triangle', name: 'מְשֻׁלָּשׁ' },
  { kind: 'square', name: 'רִבּוּעַ' },
  { kind: 'rectangle', name: 'מַלְבֵּן' },
  { kind: 'pentagon', name: 'מְחֻמָּשׁ' },
  { kind: 'hexagon', name: 'מְשֻׁשֶּׁה' }
];

// A square is also a rectangle, so the two never appear in the same question
const NEVER_TOGETHER = [['square', 'rectangle']];

// Solids are shown as everyday objects ("which object looks like a cube?")
export const SOLIDS_3D = [
  { kind: 'sphere', name: 'כַּדּוּר', emojis: ['⚽', '🏀', '🌍'] },
  { kind: 'cube', name: 'קֻבִּיָּה', emojis: ['🎲', '🧊'] },
  { kind: 'box', name: 'תֵּבָה', emojis: ['📦', '🎁'] },
  { kind: 'cylinder', name: 'גָּלִיל', emojis: ['🥫', '🔋'] }
];

export function shapeSvg(kind) {
  const color = pickRandom(SHAPE_COLORS);
  const rotation = pickRandom(ROTATIONS);
  const scale = (0.7 + Math.random() * 0.2).toFixed(2);
  return `<svg viewBox="0 0 100 100" width="120" height="120" aria-hidden="true" style="display:inline-block">` +
    `<g transform="rotate(${rotation} 50 50) translate(50 50) scale(${scale}) translate(-50 -50)" ` +
    `fill="${color}" stroke="#1e293b" stroke-width="3" stroke-linejoin="round">${SHAPE_DRAWERS[kind]()}</g></svg>`;
}

function conflicts(kindA, kindB) {
  return NEVER_TOGETHER.some(pair => pair.includes(kindA) && pair.includes(kindB));
}

// "איפה המשולש?" — 3 drawn shapes, one matches the name
export function generateAge5ShapeMatch() {
  const target = pickRandom(SHAPES_2D);
  const distractors = [];
  for (const shape of shuffle(SHAPES_2D)) {
    if (distractors.length === 2) break;
    if (shape.kind === target.kind || conflicts(shape.kind, target.kind)) continue;
    if (distractors.some(d => conflicts(d.kind, shape.kind))) continue;
    distractors.push(shape);
  }

  return {
    id: `math_5_shape_${target.kind}`,
    ageGroup: '5',
    category: 'math',
    type: 'image_word_match',
    title: 'צורות',
    instructionHebrew: `איפה ה${target.name}?`,
    targetWordVocalized: target.name,
    soundCue: `איפה ה${target.name}?`,
    correctOptionId: target.kind,
    options: shuffle([target, ...distractors]).map(s => ({ id: s.kind, emoji: shapeSvg(s.kind) }))
  };
}

// "איזה חפץ דומה לקובייה?" — 3 everyday objects, one has the solid's shape
export function generateAge5SolidMatch() {
  const target = pickRandom(SOLIDS_3D);
  const distractors = shuffle(SOLIDS_3D.filter(s => s.kind !== target.kind)).slice(0, 2);

  return {
    id: `math_5_solid_${target.kind}`,
    ageGroup: '5',
    category: 'math',
    type: 'image_word_match',
    title: 'גופים',
    instructionHebrew: `איזה חפץ דומה ל${target.name}?`,
    targetWordVocalized: target.name,
    soundCue: `איזה חפץ דומה ל${target.name}?`,
    correctOptionId: target.kind,
    options: shuffle([target, ...distractors]).map(s => ({ id: s.kind, emoji: pickRandom(s.emojis) }))
  };
}
