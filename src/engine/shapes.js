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

// A square is also a rectangle and a cube is also a box, so each pair never appears in the same question
const NEVER_TOGETHER = [['square', 'rectangle'], ['cube', 'box']];

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

// Target plus 2 distractors that never form a "square + rectangle" or "cube + box" pair
function pickWithoutConflicts(pool) {
  const target = pickRandom(pool);
  const distractors = [];
  for (const item of shuffle(pool)) {
    if (distractors.length === 2) break;
    if (item.kind === target.kind || conflicts(item.kind, target.kind)) continue;
    if (distractors.some(d => conflicts(d.kind, item.kind))) continue;
    distractors.push(item);
  }
  return { target, distractors };
}

// "איפה המשולש?" — 3 drawn shapes, one matches the name
export function generateAge5ShapeMatch() {
  const { target, distractors } = pickWithoutConflicts(SHAPES_2D);

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

// Solids drawn as simple 3D pictures (for the solids without a good emoji: cone, pyramid, prism).
// Side faces get a dark overlay so the shape reads as 3D in any colour.
const SHADE = (points, opacity) => `<polygon points="${points}" fill="#000" fill-opacity="${opacity}" stroke="none"/>`;
const SOLID_DRAWERS = {
  cube: () =>
    '<polygon points="20,36 36,20 80,20 64,36"/>' + SHADE('20,36 36,20 80,20 64,36', 0.08) +
    '<polygon points="64,36 80,20 80,64 64,80"/>' + SHADE('64,36 80,20 80,64 64,80', 0.25) +
    '<rect x="20" y="36" width="44" height="44"/>',
  box: () =>
    '<polygon points="8,46 24,30 92,30 76,46"/>' + SHADE('8,46 24,30 92,30 76,46', 0.08) +
    '<polygon points="76,46 92,30 92,64 76,80"/>' + SHADE('76,46 92,30 92,64 76,80', 0.25) +
    '<rect x="8" y="46" width="68" height="34"/>',
  cylinder: () =>
    '<path d="M24,22 L24,78 A26,9 0 0 0 76,78 L76,22 Z"/>' +
    '<path d="M50,22 L76,22 L76,78 A26,9 0 0 1 50,87 Z" fill="#000" fill-opacity="0.18" stroke="none"/>' +
    '<ellipse cx="50" cy="22" rx="26" ry="9"/>',
  cone: () =>
    '<path d="M22,78 L50,10 L78,78 A28,9 0 0 1 22,78 Z"/>' +
    '<path d="M50,10 L78,78 A28,9 0 0 1 50,87 Z" fill="#000" fill-opacity="0.18" stroke="none"/>' +
    '<path d="M22,78 A28,9 0 0 0 78,78" fill="none"/>',
  pyramid: () =>
    '<polygon points="12,76 56,90 50,12"/>' +
    '<polygon points="56,90 90,70 50,12"/>' + SHADE('56,90 90,70 50,12', 0.25),
  prism: () =>
    '<polygon points="30,58 70,36 54,66 14,86"/>' + SHADE('30,58 70,36 54,66 14,86', 0.08) +
    '<polygon points="46,86 86,64 70,36 30,58"/>' + SHADE('46,86 86,64 70,36 30,58', 0.25) +
    '<polygon points="14,86 46,86 30,58"/>',
  sphere: () =>
    '<circle cx="50" cy="50" r="40"/>' +
    '<path d="M10,50 A40,13 0 0 0 90,50" fill="none" stroke-opacity="0.6"/>' +
    '<circle cx="36" cy="34" r="10" fill="#fff" fill-opacity="0.35" stroke="none"/>'
};

export const SOLIDS_DRAWN = [
  { kind: 'cube', name: 'קֻבִּיָּה' },
  { kind: 'box', name: 'תֵּבָה' },
  { kind: 'cylinder', name: 'גָּלִיל' },
  { kind: 'cone', name: 'חָרוּט' },
  { kind: 'pyramid', name: 'פִּירָמִידָה' },
  { kind: 'prism', name: 'מִנְסָרָה' },
  { kind: 'sphere', name: 'כַּדּוּר' }
];

export function solidSvg(kind) {
  const color = pickRandom(SHAPE_COLORS);
  const scale = (0.8 + Math.random() * 0.15).toFixed(2);
  return `<svg viewBox="0 0 100 100" width="120" height="120" aria-hidden="true" style="display:inline-block">` +
    `<g transform="translate(50 50) scale(${scale}) translate(-50 -50)" ` +
    `fill="${color}" stroke="#1e293b" stroke-width="2.5" stroke-linejoin="round">${SOLID_DRAWERS[kind]()}</g></svg>`;
}

// "איפה הפירמידה?" — 3 drawn solids, one matches the name
export function generateAge5DrawnSolidMatch() {
  const { target, distractors } = pickWithoutConflicts(SOLIDS_DRAWN);

  return {
    id: `math_5_solid_drawn_${target.kind}`,
    ageGroup: '5',
    category: 'math',
    type: 'image_word_match',
    title: 'גופים',
    instructionHebrew: `איפה ה${target.name}?`,
    targetWordVocalized: target.name,
    soundCue: `איפה ה${target.name}?`,
    correctOptionId: target.kind,
    options: shuffle([target, ...distractors]).map(s => ({ id: s.kind, emoji: solidSvg(s.kind) }))
  };
}

// "איזה חפץ דומה לקובייה?" — 3 everyday objects, one has the solid's shape
export function generateAge5SolidMatch() {
  const { target, distractors } = pickWithoutConflicts(SOLIDS_3D);

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
