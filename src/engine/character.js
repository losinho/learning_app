// The dress-up character for the star shop: a boy or girl (from the profile's gender) drawn in SVG layers.
// Separate from the profile's emoji symbol. Plain shapes only (no gradient ids), so many copies can share a page.
// Coordinates: head around (100,78), body down to y=240, hats may rise to y=-20, pets stand at x>146.

export const SKIN_TONES = ['#fde0c8', '#f5c9a0', '#d9a066', '#a86b3c', '#6f4325'];
export const HAIR_COLORS = ['#2b1d14', '#6b3f1d', '#c8893b', '#e8c15a', '#b3461f'];

// The shop's first tab: whole themed outfits, built from items in the slots below
export const SETS_TAB = { key: 'sets', label: 'תלבושות', emoji: '🎭' };

export const SHOP_SLOTS = [
  { key: 'top', label: 'חולצות', emoji: '👕' },
  { key: 'bottom', label: 'מכנסיים', emoji: '👖' },
  { key: 'shoes', label: 'נעליים', emoji: '👟' },
  { key: 'hat', label: 'כובעים', emoji: '🧢' },
  { key: 'glasses', label: 'משקפיים', emoji: '🕶️' },
  { key: 'pet', label: 'חיות', emoji: '🐾' },
  { key: 'background', label: 'רקעים', emoji: '🏞️' }
];

const VIEWBOX = '0 -20 200 270';
// What to show of an item on its shop tile
const THUMB_VIEWBOX = {
  top: '38 108 124 124',
  bottom: '50 170 100 80',
  shoes: '58 200 84 48',
  hat: '30 -20 140 100',
  glasses: '52 62 96 46',
  pet: '146 194 54 54',
  background: VIEWBOX
};

const star = (cx, cy, r, fill) => {
  const points = Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 ? r * 0.45 : r;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    return `${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`;
  });
  return `<polygon points="${points.join(' ')}" fill="${fill}"/>`;
};
const heart = (cx, cy, s, fill) => `<path d="M${cx} ${cy + s} C${cx - 2 * s} ${cy - 0.2 * s} ${cx - s} ${cy - 1.2 * s} ${cx} ${cy - 0.4 * s} C${cx + s} ${cy - 1.2 * s} ${cx + 2 * s} ${cy - 0.2 * s} ${cx} ${cy + s} Z" fill="${fill}"/>`;
const circle = (cx, cy, r, fill, more = '') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${more}/>`;
const rect = (x, y, w, h, fill, rx = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
const path = (d, fill, more = '') => `<path d="${d}" fill="${fill}" ${more}/>`;
const line = (d, stroke, width = 3) => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;

// --- Clothes helpers ---
const TORSO = 'M68 126 Q68 116 82 116 H118 Q132 116 132 126 V186 H68 Z';
const sleeves = (color, h = 30) => rect(54, 120, 19, h, color, 9) + rect(127, 120, 19, h, color, 9);
const shirt = (color, extra = '', sleeveH = 30, sleeveColor = color) => sleeves(sleeveColor, sleeveH) + path(TORSO, color) + extra;
const dress = (color, hem, extra = '') => sleeves(color) + path(`M68 126 Q68 116 82 116 H118 Q132 116 132 126 L${hem === 'long' ? '150 234 H50' : '146 210 H54'} Z`, color) + extra;

const shorts = (color, extra = '') => path('M70 180 H130 L126 210 H103 L100 194 L97 210 H74 Z', color) + extra;
const pants = (color, extra = '') => path('M70 180 H130 L125 232 H103 L100 194 L97 232 H75 Z', color) + extra;

const shoes = (color, sole = '#f8fafc', extra = '') =>
  path('M76 226 H98 V236 H68 Q68 228 76 226 Z', color) + path('M102 226 H124 Q132 228 132 236 H102 Z', color) +
  rect(67, 236, 31, 4, sole, 2) + rect(102, 236, 31, 4, sole, 2) + extra;

const boots = (color, sole, extra = '') => rect(76, 208, 22, 22, color, 3) + rect(102, 208, 22, 22, color, 3) + shoes(color, sole) + extra;

const pet = (body) => `<g transform="translate(173 222)">${body}</g>`;
const petEyes = (dx, y, color = '#1e293b') => circle(-dx, y, 2.4, color) + circle(dx, y, 2.4, color);

// --- The catalog. cost 0 = free for everyone. gender (optional) limits an item to that character. ---
export const SHOP_ITEMS = [
  // Tops
  { id: 'top_basic', slot: 'top', name: 'חולצה כחולה', cost: 0, draw: () => shirt('#38bdf8') },
  { id: 'top_stripes', slot: 'top', name: 'חולצת פסים', cost: 15, draw: () => shirt('#fff', [130, 146, 162, 178].map(y => rect(68, y, 64, 8, '#ef4444')).join(''), 30, '#ef4444') },
  { id: 'top_star', slot: 'top', name: 'חולצת כוכב', cost: 20, draw: () => shirt('#8b5cf6', star(100, 152, 18, '#fde047')) },
  { id: 'top_heart', slot: 'top', name: 'חולצת לב', cost: 20, draw: () => shirt('#f9a8d4', heart(100, 150, 12, '#e11d48')) },
  { id: 'top_soccer', slot: 'top', name: 'חולצת כדורגל', cost: 40, draw: () => shirt('#facc15', rect(68, 126, 12, 60, '#16a34a') + rect(120, 126, 12, 60, '#16a34a') + `<text x="100" y="164" text-anchor="middle" font-size="30" font-weight="900" font-family="sans-serif" fill="#166534">10</text>`, 30, '#16a34a') },
  { id: 'top_dress', slot: 'top', name: 'שמלה', cost: 45, gender: 'girl', draw: () => dress('#f472b6', 'short', [70, 100, 130].map(x => circle(x, 196, 5, '#fff')).join('') + [85, 115].map(x => circle(x, 170, 4, '#fff')).join('')) },
  { id: 'top_hoodie', slot: 'top', name: 'קפוצ׳ון', cost: 50, draw: () => shirt('#fb923c', rect(80, 158, 40, 22, '#ea580c', 6) + line('M92 124 V144', '#fff') + line('M108 124 V144', '#fff'), 54) },
  { id: 'top_suit', slot: 'top', name: 'חליפה ועניבה', cost: 90, gender: 'boy', draw: () => shirt('#1e3a8a', path('M84 116 H116 L100 160 Z', '#fff') + path('M95 124 H105 L108 150 L100 160 L92 150 Z', '#dc2626'), 54) },
  { id: 'top_princess', slot: 'top', name: 'שמלת נסיכה', cost: 100, gender: 'girl', draw: () => dress('#c084fc', 'long', [[72, 214], [100, 200], [128, 214], [86, 180], [114, 180]].map(([x, y]) => star(x, y, 7, '#fef08a')).join('') + rect(68, 150, 64, 7, '#fde047')) },
  { id: 'top_super', slot: 'top', name: 'חולצת גיבורי על', cost: 100, draw: () => shirt('#2563eb', star(100, 150, 20, '#facc15') + rect(68, 176, 64, 8, '#facc15'), 30, '#dc2626'), back: () => path('M72 118 H128 L152 216 Q100 232 48 216 Z', '#dc2626') },
  { id: 'top_astro', slot: 'top', name: 'חולצת חלל', cost: 120, draw: () => shirt('#f1f5f9', rect(82, 140, 36, 26, '#475569', 5) + circle(92, 153, 4, '#ef4444') + circle(108, 153, 4, '#22c55e') + rect(68, 178, 64, 6, '#f97316'), 54) },
  { id: 'top_doctor', slot: 'top', name: 'חלוק רופא', cost: 60, draw: () => shirt('#f8fafc', line('M100 118 V186', '#cbd5e1', 2) + line('M84 118 Q82 146 100 150 Q118 146 116 118', '#334155') + circle(100, 154, 5, '#94a3b8') + rect(114, 165, 12, 4, '#ef4444') + rect(118, 161, 4, 12, '#ef4444'), 54) },
  { id: 'top_chef', slot: 'top', name: 'חולצת שף', cost: 50, draw: () => shirt('#f8fafc', rect(82, 116, 36, 11, '#ef4444', 4) + [[90, 140], [110, 140], [90, 160], [110, 160]].map(([x, y]) => circle(x, y, 3.5, '#94a3b8')).join(''), 54) },
  { id: 'top_pirate', slot: 'top', name: 'חולצת פיראטים', cost: 60, draw: () => shirt('#f8fafc', [128, 142, 156].map(y => rect(90, y, 20, 6, '#1e293b')).join('') + path('M68 126 Q68 116 82 116 H90 V186 H68 Z', '#7f1d1d') + path('M132 126 Q132 116 118 116 H110 V186 H132 Z', '#7f1d1d') + rect(68, 170, 64, 9, '#facc15')) },
  { id: 'top_fire', slot: 'top', name: 'מעיל כבאים', cost: 70, draw: () => shirt('#374151', rect(68, 150, 64, 8, '#facc15') + rect(68, 172, 64, 8, '#facc15') + rect(97, 116, 6, 70, '#facc15'), 54) },
  { id: 'top_wizard', slot: 'top', name: 'גלימת קוסמים', cost: 90, draw: () => dress('#4c1d95', 'long', sleeves('#4c1d95', 54) + [[78, 206], [122, 206], [100, 180], [100, 220]].map(([x, y]) => star(x, y, 7, '#fde047')).join('') + rect(70, 156, 60, 6, '#facc15')) },
  { id: 'top_prince', slot: 'top', name: 'מעיל נסיך', cost: 90, gender: 'boy', draw: () => shirt('#b91c1c', rect(96, 116, 8, 70, '#facc15') + rect(68, 176, 64, 8, '#facc15') + [132, 148, 164].map(y => circle(100, y, 3, '#fff')).join(''), 54), back: () => path('M72 118 H128 L148 216 Q100 230 52 216 Z', '#7c3aed') },
  { id: 'top_knight', slot: 'top', name: 'שריון אבירים', cost: 110, draw: () => shirt('#64748b', rect(70, 120, 60, 62, '#cbd5e1', 10) + rect(96, 128, 8, 46, '#dc2626') + rect(84, 142, 32, 8, '#dc2626'), 54) },

  // Bottoms
  { id: 'bottom_basic', slot: 'bottom', name: 'מכנסיים קצרים', cost: 0, draw: () => shorts('#1e3a8a') },
  { id: 'bottom_red', slot: 'bottom', name: 'מכנסיים אדומים', cost: 10, draw: () => shorts('#ef4444') },
  { id: 'bottom_jeans', slot: 'bottom', name: 'ג׳ינס', cost: 15, draw: () => pants('#3b82f6', line('M82 200 H90', '#1d4ed8', 2) + line('M110 200 H118', '#1d4ed8', 2)) },
  { id: 'bottom_sport', slot: 'bottom', name: 'טרנינג', cost: 20, draw: () => pants('#64748b', line('M73 186 L78 230', '#fff') + line('M127 186 L122 230', '#fff')) },
  { id: 'bottom_skirt', slot: 'bottom', name: 'חצאית', cost: 20, gender: 'girl', draw: () => path('M70 180 H130 L144 214 H56 Z', '#a855f7') },
  { id: 'bottom_tutu', slot: 'bottom', name: 'טוטו', cost: 40, gender: 'girl', draw: () => path('M70 180 H130 L150 206 L136 202 L124 212 L112 202 L100 212 L88 202 L76 212 L64 202 L50 206 Z', '#f9a8d4') },
  { id: 'bottom_rainbow', slot: 'bottom', name: 'מכנסי קשת', cost: 60, draw: () => pants('#fff', [['#ef4444', 186], ['#f97316', 194], ['#facc15', 202], ['#22c55e', 210], ['#3b82f6', 218], ['#a855f7', 226]].map(([c, y]) => rect(76, y, 21, 6, c) + rect(103, y, 21, 6, c)).join('')) },
  { id: 'bottom_soccer', slot: 'bottom', name: 'מכנסי כדורגל', cost: 20, draw: () => shorts('#16a34a', rect(74, 200, 23, 4, '#fff') + rect(103, 200, 23, 4, '#fff')) },
  { id: 'bottom_chef', slot: 'bottom', name: 'מכנסי שף', cost: 25, draw: () => pants('#475569', [190, 204, 218].map(y => [78, 90, 106, 118].map(x => rect(x, y, 5, 5, '#e2e8f0')).join('')).join('')) },
  { id: 'bottom_doctor', slot: 'bottom', name: 'מכנסי רופא', cost: 30, draw: () => pants('#2dd4bf') },
  { id: 'bottom_pirate', slot: 'bottom', name: 'מכנסי פיראטים', cost: 30, draw: () => pants('#1e293b') },
  { id: 'bottom_fire', slot: 'bottom', name: 'מכנסי כבאים', cost: 40, draw: () => pants('#374151', rect(75, 212, 22, 6, '#facc15') + rect(103, 212, 22, 6, '#facc15')) },
  { id: 'bottom_prince', slot: 'bottom', name: 'מכנסי נסיך', cost: 40, gender: 'boy', draw: () => pants('#f8fafc', line('M74 186 L78 230', '#facc15') + line('M126 186 L122 230', '#facc15')) },
  { id: 'bottom_super', slot: 'bottom', name: 'מכנסי גיבורי על', cost: 50, draw: () => pants('#2563eb') },
  { id: 'bottom_knight', slot: 'bottom', name: 'מכנסי אבירים', cost: 60, draw: () => pants('#64748b', circle(86, 208, 8, '#cbd5e1') + circle(114, 208, 8, '#cbd5e1')) },
  { id: 'bottom_astro', slot: 'bottom', name: 'מכנסי חלל', cost: 70, draw: () => pants('#f1f5f9', rect(76, 198, 21, 6, '#f97316') + rect(103, 198, 21, 6, '#f97316') + rect(84, 212, 8, 10, '#94a3b8', 2) + rect(108, 212, 8, 10, '#94a3b8', 2)) },

  // Shoes
  { id: 'shoes_basic', slot: 'shoes', name: 'נעליים לבנות', cost: 0, draw: () => shoes('#e2e8f0', '#94a3b8') },
  { id: 'shoes_red', slot: 'shoes', name: 'נעלי ספורט', cost: 15, draw: () => shoes('#ef4444', '#fff', line('M78 231 H90', '#fff', 2) + line('M110 231 H122', '#fff', 2)) },
  { id: 'shoes_boots', slot: 'shoes', name: 'מגפיים', cost: 25, draw: () => rect(76, 210, 22, 20, '#92400e', 3) + rect(102, 210, 22, 20, '#92400e', 3) + shoes('#92400e', '#451a03') },
  { id: 'shoes_soccer', slot: 'shoes', name: 'נעלי כדורגל', cost: 30, draw: () => shoes('#16a34a', '#fde047', star(84, 231, 4, '#fff') + star(116, 231, 4, '#fff')) },
  { id: 'shoes_gold', slot: 'shoes', name: 'נעלי זהב', cost: 60, draw: () => shoes('#eab308', '#a16207', star(84, 231, 4, '#fff') + star(116, 231, 4, '#fff')) },
  { id: 'shoes_chef', slot: 'shoes', name: 'נעלי שף', cost: 15, draw: () => shoes('#1f2937', '#0f172a') },
  { id: 'shoes_doctor', slot: 'shoes', name: 'נעלי רופא', cost: 20, draw: () => shoes('#5eead4', '#0f766e') },
  { id: 'shoes_wizard', slot: 'shoes', name: 'נעלי קוסמים', cost: 30, draw: () => shoes('#7c3aed', '#4c1d95', star(84, 231, 4, '#fde047') + star(116, 231, 4, '#fde047')) },
  { id: 'shoes_pirate', slot: 'shoes', name: 'מגפי פיראטים', cost: 35, draw: () => boots('#451a03', '#1c0a00', rect(74, 206, 26, 8, '#78350f', 2) + rect(100, 206, 26, 8, '#78350f', 2)) },
  { id: 'shoes_fire', slot: 'shoes', name: 'מגפי כבאים', cost: 40, draw: () => boots('#111827', '#facc15') },
  { id: 'shoes_super', slot: 'shoes', name: 'מגפי גיבורי על', cost: 40, draw: () => boots('#dc2626', '#991b1b') },
  { id: 'shoes_knight', slot: 'shoes', name: 'מגפי אבירים', cost: 50, draw: () => boots('#94a3b8', '#475569') },
  { id: 'shoes_astro', slot: 'shoes', name: 'מגפי חלל', cost: 50, draw: () => boots('#e2e8f0', '#475569', rect(76, 214, 22, 5, '#3b82f6') + rect(102, 214, 22, 5, '#3b82f6')) },

  // Hats
  { id: 'hat_bow', slot: 'hat', name: 'סרט לשיער', cost: 15, gender: 'girl', draw: () => path('M128 36 L108 24 V48 Z M128 36 L148 24 V48 Z', '#ec4899') + circle(128, 36, 6, '#be185d') },
  { id: 'hat_cap', slot: 'hat', name: 'כובע מצחייה', cost: 15, draw: () => path('M54 60 C50 8 150 8 146 60 Z', '#ef4444') + path('M52 60 Q100 44 148 60 Q150 72 100 66 Q50 72 52 60 Z', '#b91c1c') },
  { id: 'hat_beanie', slot: 'hat', name: 'כובע צמר', cost: 20, draw: () => path('M56 54 C52 4 148 4 144 54 Z', '#14b8a6') + rect(52, 48, 96, 16, '#0f766e', 8) + circle(100, 14, 11, '#ccfbf1') },
  { id: 'hat_party', slot: 'hat', name: 'כובע מסיבה', cost: 25, draw: () => path('M72 42 L100 -12 L128 42 Q100 52 72 42 Z', '#ec4899') + circle(100, 22, 4, '#fde047') + circle(90, 34, 4, '#38bdf8') + circle(110, 36, 4, '#a7f3d0') + circle(100, -13, 7, '#fde047') },
  { id: 'hat_flowers', slot: 'hat', name: 'זר פרחים', cost: 30, draw: () => [[60, 52, '#f472b6'], [76, 38, '#fde047'], [100, 32, '#fb7185'], [124, 38, '#c084fc'], [140, 52, '#38bdf8']].map(([x, y, c]) => [[-6, 0], [6, 0], [0, -6], [0, 6]].map(([dx, dy]) => circle(x + dx, y + dy, 5, c)).join('') + circle(x, y, 4, '#f59e0b')).join('') },
  { id: 'hat_bunny', slot: 'hat', name: 'אוזני ארנב', cost: 40, draw: () => '<ellipse cx="74" cy="6" rx="13" ry="34" fill="#fff" stroke="#cbd5e1" stroke-width="2" transform="rotate(-10 74 6)"/><ellipse cx="74" cy="8" rx="6" ry="24" fill="#fbcfe8" transform="rotate(-10 74 8)"/><ellipse cx="126" cy="6" rx="13" ry="34" fill="#fff" stroke="#cbd5e1" stroke-width="2" transform="rotate(10 126 6)"/><ellipse cx="126" cy="8" rx="6" ry="24" fill="#fbcfe8" transform="rotate(10 126 8)"/>' + line('M60 44 Q100 16 140 44', '#ec4899', 6) },
  { id: 'hat_cowboy', slot: 'hat', name: 'כובע בוקרים', cost: 45, draw: () => path('M68 46 C66 0 88 8 100 12 C112 8 134 0 132 46 Z', '#a16207') + path('M36 42 Q100 62 164 42 Q150 64 100 62 Q50 64 36 42 Z', '#854d0e') + rect(68, 38, 64, 8, '#451a03') },
  { id: 'hat_wizard', slot: 'hat', name: 'כובע קוסמים', cost: 60, draw: () => path('M66 46 L104 -18 L134 46 Z', '#4c1d95') + star(100, 18, 8, '#fde047') + star(114, 34, 5, '#fde047') + star(86, 36, 4, '#fde047') + '<ellipse cx="100" cy="48" rx="56" ry="9" fill="#5b21b6"/>' },
  { id: 'hat_pirate', slot: 'hat', name: 'כובע פיראטים', cost: 70, draw: () => path('M44 50 Q60 42 70 18 Q100 -4 130 18 Q140 42 156 50 Q100 66 44 50 Z', '#1e293b') + circle(100, 28, 10, '#f8fafc') + rect(92, 42, 16, 4, '#fde047', 2) },
  { id: 'hat_tiara', slot: 'hat', name: 'נזר', cost: 80, gender: 'girl', draw: () => path('M66 44 L74 26 L86 38 L100 12 L114 38 L126 26 L134 44 Q100 34 66 44 Z', '#e2e8f0', 'stroke="#94a3b8" stroke-width="1.5"') + circle(100, 28, 5, '#ec4899') + circle(78, 36, 3, '#38bdf8') + circle(122, 36, 3, '#38bdf8') },
  { id: 'hat_crown', slot: 'hat', name: 'כתר זהב', cost: 100, draw: () => path('M64 46 L60 6 L82 26 L100 -4 L118 26 L140 6 L136 46 Q100 38 64 46 Z', '#facc15', 'stroke="#ca8a04" stroke-width="2"') + circle(100, 30, 5, '#dc2626') + circle(78, 34, 4, '#2563eb') + circle(122, 34, 4, '#2563eb') },
  { id: 'hat_doctor', slot: 'hat', name: 'כובע רופא', cost: 25, draw: () => path('M56 56 C52 6 148 6 144 56 Q100 44 56 56 Z', '#2dd4bf') + rect(94, 28, 12, 4, '#fff') + rect(98, 24, 4, 12, '#fff') },
  { id: 'hat_chef', slot: 'hat', name: 'כובע שף', cost: 30, draw: () => path('M68 56 V34 C50 26 56 -4 78 4 C84 -12 116 -12 122 4 C144 -4 150 26 132 34 V56 Q100 46 68 56 Z', '#fff', 'stroke="#cbd5e1" stroke-width="2"') },
  { id: 'hat_fire', slot: 'hat', name: 'קסדת כבאים', cost: 60, draw: () => path('M56 56 C52 4 148 4 144 56 Z', '#dc2626') + path('M42 56 Q100 44 158 56 Q158 68 100 64 Q42 68 42 56 Z', '#b91c1c') + path('M90 18 H110 V36 Q100 46 90 36 Z', '#facc15') },
  { id: 'hat_knight', slot: 'hat', name: 'קסדת אבירים', cost: 80, thumbBox: '30 -20 140 124', draw: () => path('M100 30 C88 -8 128 -22 138 2 C124 -6 112 4 110 30 Z', '#dc2626') + path('M52 98 C44 2 156 2 148 98 L134 98 C138 66 130 58 100 58 C70 58 62 66 66 98 Z', '#94a3b8') + rect(96, 56, 8, 26, '#64748b', 3) },
  { id: 'hat_astro', slot: 'hat', name: 'קסדת חלל', cost: 100, thumbBox: '30 8 140 136', draw: () => rect(62, 122, 76, 14, '#94a3b8', 7) + circle(100, 76, 60, '#bae6fd44', 'stroke="#e2e8f0" stroke-width="7"') + line('M62 54 Q70 34 88 28', '#ffffffcc', 5) },

  // Glasses
  { id: 'glasses_round', slot: 'glasses', name: 'משקפיים עגולים', cost: 15, draw: () => `<g fill="#ffffff55" stroke="#1e293b" stroke-width="3.5">${circle(83, 84, 13, '#ffffff55')}${circle(117, 84, 13, '#ffffff55')}</g>` + line('M96 84 H104', '#1e293b', 3.5) },
  { id: 'glasses_sun', slot: 'glasses', name: 'משקפי שמש', cost: 25, draw: () => rect(66, 74, 30, 20, '#0f172a', 7) + rect(104, 74, 30, 20, '#0f172a', 7) + line('M96 82 H104', '#0f172a', 4) + line('M72 80 L78 80', '#94a3b8', 2.5) + line('M110 80 L116 80', '#94a3b8', 2.5) },
  { id: 'glasses_swim', slot: 'glasses', name: 'משקפי שחייה', cost: 30, draw: () => line('M52 84 H148', '#2563eb', 6) + `<g stroke="#2563eb" stroke-width="4">${rect(67, 73, 29, 22, '#7dd3fc99', 10)}${rect(104, 73, 29, 22, '#7dd3fc99', 10)}</g>` },
  { id: 'glasses_star', slot: 'glasses', name: 'משקפי כוכב', cost: 40, draw: () => star(83, 84, 18, '#f472b6') + star(117, 84, 18, '#f472b6') + circle(83, 84, 6, '#fce7f3') + circle(117, 84, 6, '#fce7f3') + circle(83, 84, 3.5, '#2b2b3a') + circle(117, 84, 3.5, '#2b2b3a') },
  { id: 'glasses_heart', slot: 'glasses', name: 'משקפי לב', cost: 40, draw: () => heart(83, 84, 11, '#ef4444') + heart(117, 84, 11, '#ef4444') + line('M96 82 H104', '#ef4444', 3) },
  { id: 'glasses_mask', slot: 'glasses', name: 'מסכת גיבורים', cost: 60, draw: () => path('M56 72 Q100 80 144 72 Q148 98 124 100 Q108 100 100 90 Q92 100 76 100 Q52 98 56 72 Z M73 84 a10 8 0 1 0 20 0 a10 8 0 1 0 -20 0 Z M107 84 a10 8 0 1 0 20 0 a10 8 0 1 0 -20 0 Z', '#dc2626', 'fill-rule="evenodd"') },

  // Pets
  { id: 'pet_chick', slot: 'pet', name: 'אפרוח', cost: 30, draw: () => pet(circle(0, 2, 14, '#fde047') + circle(0, -11, 10, '#fde047') + petEyes(4, -12) + path('M-3 -8 H3 L0 -4 Z', '#f97316') + line('M-5 16 V19', '#f97316', 2.5) + line('M5 16 V19', '#f97316', 2.5)) },
  { id: 'pet_cat', slot: 'pet', name: 'חתול', cost: 40, draw: () => pet(line('M12 12 Q24 8 18 -6', '#f97316', 5) + `<ellipse cx="0" cy="8" rx="13" ry="11" fill="#fb923c"/>` + circle(0, -9, 12, '#fb923c') + path('M-11 -14 L-11 -24 L-3 -18 Z M11 -14 L11 -24 L3 -18 Z', '#fb923c') + petEyes(4.5, -10) + path('M-2 -6 H2 L0 -4 Z', '#be185d') + line('M-13 -7 H-7 M7 -7 H13', '#7c2d12', 1)) },
  { id: 'pet_dog', slot: 'pet', name: 'כלב', cost: 40, draw: () => pet(line('M12 10 Q20 4 19 -2', '#a16207', 5) + `<ellipse cx="0" cy="8" rx="13" ry="11" fill="#ca8a04"/>` + circle(0, -9, 12, '#eab308') + `<ellipse cx="-12" cy="-8" rx="4.5" ry="9" fill="#854d0e"/><ellipse cx="12" cy="-8" rx="4.5" ry="9" fill="#854d0e"/>` + petEyes(4.5, -11) + `<ellipse cx="0" cy="-5" rx="3" ry="2.5" fill="#1e293b"/>` + rect(-8, -1, 16, 3, '#dc2626', 1.5)) },
  { id: 'pet_bunny', slot: 'pet', name: 'ארנב', cost: 50, draw: () => pet(`<ellipse cx="-6" cy="-22" rx="4.5" ry="11" fill="#f1f5f9" stroke="#cbd5e1"/><ellipse cx="6" cy="-22" rx="4.5" ry="11" fill="#f1f5f9" stroke="#cbd5e1"/><ellipse cx="0" cy="9" rx="13" ry="10" fill="#f8fafc" stroke="#cbd5e1"/>` + circle(0, -8, 11, '#f8fafc', 'stroke="#cbd5e1"') + petEyes(4, -9) + path('M-2 -5 H2 L0 -3 Z', '#ec4899')) },
  { id: 'pet_penguin', slot: 'pet', name: 'פינגווין', cost: 60, draw: () => pet(`<ellipse cx="0" cy="0" rx="15" ry="19" fill="#1e293b"/><ellipse cx="0" cy="4" rx="10" ry="14" fill="#f8fafc"/>` + circle(-4, -9, 2.6, '#fff') + circle(4, -9, 2.6, '#fff') + circle(-4, -9, 1.3, '#0f172a') + circle(4, -9, 1.3, '#0f172a') + path('M-3 -6 H3 L0 -2 Z', '#f97316') + rect(-10, 17, 8, 3, '#f97316', 1.5) + rect(2, 17, 8, 3, '#f97316', 1.5)) },
  { id: 'pet_unicorn', slot: 'pet', name: 'חד-קרן', cost: 150, draw: () => pet(`<ellipse cx="0" cy="6" rx="16" ry="11" fill="#fff" stroke="#cbd5e1"/>` + rect(-11, 12, 5, 9, '#fff', 2) + rect(6, 12, 5, 9, '#fff', 2) + path('M4 2 L12 -14 L20 -2 Z', '#fff') + `<ellipse cx="13" cy="-11" rx="9" ry="7.5" fill="#fff" stroke="#cbd5e1"/>` + path('M12 -17 L16 -27 L17 -16 Z', '#facc15') + line('M8 -17 Q0 -12 2 0', '#ec4899', 3.5) + line('M4 -16 Q-4 -10 -2 2', '#8b5cf6', 3) + circle(15, -12, 1.8, '#1e293b') + line('M-16 4 Q-23 8 -20 16', '#38bdf8', 4)) },

  // Backgrounds
  { id: 'bg_basic', slot: 'background', name: 'שמיים', cost: 0, draw: () => scene('#e0f2fe', '#bae6fd') },
  { id: 'bg_park', slot: 'background', name: 'פארק', cost: 20, draw: () => scene('#bae6fd', '#86efac', circle(168, 10, 14, '#fde047') + rect(20, 110, 12, 90, '#92400e', 3) + circle(26, 96, 26, '#22c55e') + circle(10, 112, 16, '#16a34a') + circle(42, 112, 16, '#16a34a')) },
  { id: 'bg_beach', slot: 'background', name: 'חוף ים', cost: 30, draw: () => scene('#bfdbfe', '#fde68a', circle(30, 20, 15, '#facc15') + rect(0, 130, 200, 70, '#38bdf8') + line('M12 150 q8 -6 16 0 t16 0', '#e0f2fe') + line('M150 170 q8 -6 16 0 t16 0', '#e0f2fe')) },
  { id: 'bg_night', slot: 'background', name: 'לילה', cost: 40, draw: () => scene('#1e1b4b', '#312e81', circle(165, 20, 16, '#fef9c3') + circle(158, 15, 14, '#1e1b4b') + [[20, 10], [50, 40], [30, 110], [170, 90], [180, 150], [14, 170]].map(([x, y]) => star(x, y, 5, '#fef08a')).join('')) },
  { id: 'bg_rainbow', slot: 'background', name: 'קשת', cost: 50, draw: () => scene('#e0f2fe', '#86efac', ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#a855f7'].map((c, i) => `<path d="M${-6 + i * 9} 200 A${106 - i * 9} ${130 - i * 9} 0 0 1 ${206 - i * 9} 200" fill="none" stroke="${c}" stroke-width="9"/>`).join('')) },
  { id: 'bg_sea', slot: 'background', name: 'מתחת למים', cost: 70, draw: () => scene('#0ea5e9', '#fde68a', [[24, 40, 6], [40, 70, 4], [170, 30, 5], [180, 90, 7], [160, 130, 4]].map(([x, y, r]) => circle(x, y, r, '#e0f2fe99')).join('') + path('M20 120 q14 -10 26 0 q-12 10 -26 0 Z M46 120 l9 -7 v14 Z', '#f97316') + path('M178 170 q-14 -10 -26 0 q12 10 26 0 Z M152 170 l-9 -7 v14 Z', '#facc15') + line('M16 210 q-6 -16 0 -30 q6 -12 0 -24', '#16a34a', 5)) },
  { id: 'bg_space', slot: 'background', name: 'חלל', cost: 80, draw: () => scene('#0f172a', '#334155', circle(32, 30, 18, '#fb923c') + `<ellipse cx="32" cy="30" rx="28" ry="6" fill="none" stroke="#fde68a" stroke-width="3"/>` + [[170, 14], [120, -8], [186, 80], [14, 110], [176, 150], [24, 180]].map(([x, y]) => star(x, y, 4, '#fff')).join('') + circle(172, 44, 8, '#a5b4fc')) },
  { id: 'bg_castle', slot: 'background', name: 'טירה', cost: 120, draw: () => scene('#fbcfe8', '#a7f3d0', path('M0 200 V60 H12 V46 H22 V60 H34 V46 H44 V100 H156 V46 H166 V60 H178 V46 H188 V60 H200 V200 Z', '#c4b5fd') + path('M0 60 L22 18 L44 60 Z M156 60 L178 18 L200 60 Z', '#8b5cf6') + rect(14, 90, 14, 20, '#4c1d95', 7) + rect(172, 90, 14, 20, '#4c1d95', 7)) }
];

// A sky colour, a ground colour from y=200 down, and what stands on it
function scene(sky, ground, extra = '') {
  return rect(0, -20, 200, 270, sky) + extra + rect(0, 200, 200, 50, ground);
}

// Themed outfits. Sets are only groupings: every piece is also sold on its own in its slot.
export const SHOP_SETS = [
  { id: 'set_soccer', name: 'כדורגל', pieces: ['top_soccer', 'bottom_soccer', 'shoes_soccer'] },
  { id: 'set_chef', name: 'שפים', pieces: ['top_chef', 'bottom_chef', 'shoes_chef', 'hat_chef'] },
  { id: 'set_doctor', name: 'רופאים', pieces: ['top_doctor', 'bottom_doctor', 'shoes_doctor', 'hat_doctor'] },
  { id: 'set_wizard', name: 'קוסמים', pieces: ['top_wizard', 'shoes_wizard', 'hat_wizard'] },
  { id: 'set_pirate', name: 'פיראטים', pieces: ['top_pirate', 'bottom_pirate', 'shoes_pirate', 'hat_pirate'] },
  { id: 'set_fire', name: 'כבאים', pieces: ['top_fire', 'bottom_fire', 'shoes_fire', 'hat_fire'] },
  { id: 'set_princess', name: 'נסיכה', gender: 'girl', pieces: ['top_princess', 'shoes_gold', 'hat_tiara'] },
  { id: 'set_super', name: 'גיבורי על', pieces: ['top_super', 'bottom_super', 'shoes_super', 'glasses_mask'] },
  { id: 'set_prince', name: 'נסיך', gender: 'boy', pieces: ['top_prince', 'bottom_prince', 'shoes_gold', 'hat_crown'] },
  { id: 'set_knight', name: 'אבירים', pieces: ['top_knight', 'bottom_knight', 'shoes_knight', 'hat_knight'] },
  { id: 'set_space', name: 'חלל', pieces: ['top_astro', 'bottom_astro', 'shoes_astro', 'hat_astro'] }
];

export function setsFor(gender) {
  return SHOP_SETS.filter(set => !set.gender || set.gender === gender);
}

const ITEMS_BY_ID = new Map(SHOP_ITEMS.map(item => [item.id, item]));
const DEFAULTS = { top: 'top_basic', bottom: 'bottom_basic', shoes: 'shoes_basic', background: 'bg_basic' };

export function shopItem(id) {
  return ITEMS_BY_ID.get(id);
}

export function itemsForSlot(slot, gender) {
  return SHOP_ITEMS.filter(item => item.slot === slot && (!item.gender || item.gender === gender));
}

// The item worn in a slot: an item for the other gender (after the profile changed) falls back to the default
function wornItem(slot, equipped, gender) {
  const item = ITEMS_BY_ID.get(equipped?.[slot]);
  if (item && item.slot === slot && (!item.gender || item.gender === gender)) return item;
  return ITEMS_BY_ID.get(DEFAULTS[slot]) || null;
}

function drawBackHair(gender, hair) {
  return gender === 'girl'
    ? path('M50 80 C42 8 158 8 150 80 C156 112 160 140 150 164 H50 C40 140 44 112 50 80 Z', hair)
    : '';
}

function drawFrontHair(gender, hair) {
  return gender === 'girl'
    ? path('M53 84 C44 8 156 8 147 84 C143 66 132 56 120 52 C108 64 82 66 70 58 C60 64 56 74 53 84 Z', hair)
    : path('M53 80 C46 10 154 10 147 80 C141 62 126 52 112 56 C96 62 76 55 66 60 C58 65 56 72 53 80 Z', hair);
}

function drawFace(gender) {
  const lashes = gender === 'girl'
    ? line('M78.5 79 L74 75.5 M77.5 83 L72 81.5 M121.5 79 L126 75.5 M122.5 83 L128 81.5', '#2b2b3a', 2)
    : '';
  return `<ellipse cx="83" cy="84" rx="5.5" ry="7" fill="#2b2b3a"/><ellipse cx="117" cy="84" rx="5.5" ry="7" fill="#2b2b3a"/>` +
    circle(85, 81, 2, '#fff') + circle(119, 81, 2, '#fff') + lashes +
    circle(70, 98, 7, '#fb7185', 'opacity="0.35"') + circle(130, 98, 7, '#fb7185', 'opacity="0.35"') +
    line('M86 102 Q100 114 114 102', '#9f1239', 3);
}

// look = { gender, skin (index), hair (index), equipped: { slot: itemId } }.
// options.headOnly: a small head for the header, without background and pet.
export function characterSvg(look, { className = '', style = '', headOnly = false } = {}) {
  const gender = look.gender === 'girl' ? 'girl' : 'boy';
  const skin = SKIN_TONES[look.skin] || SKIN_TONES[0];
  const hair = HAIR_COLORS[look.hair] || HAIR_COLORS[0];
  const worn = slot => wornItem(slot, look.equipped, gender);
  const draw = slot => worn(slot)?.draw() || '';

  const layers = [
    headOnly ? '' : draw('background'),
    headOnly ? '' : worn('top')?.back?.() || '',
    drawBackHair(gender, hair),
    headOnly ? '' : rect(78, 180, 19, 52, skin, 8) + rect(103, 180, 19, 52, skin, 8),
    headOnly ? '' : draw('bottom') + draw('shoes'),
    headOnly ? '' : rect(55, 124, 17, 58, skin, 8.5) + rect(128, 124, 17, 58, skin, 8.5),
    headOnly ? '' : draw('top'),
    gender === 'boy' ? circle(54, 84, 8, skin) + circle(146, 84, 8, skin) : '',
    circle(100, 78, 46, skin),
    drawFace(gender),
    drawFrontHair(gender, hair),
    draw('glasses'),
    draw('hat'),
    headOnly ? '' : draw('pet')
  ];

  const viewBox = headOnly ? '36 -2 128 128' : VIEWBOX;
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="${className}" style="${style}" aria-hidden="true">${layers.join('')}</svg>`;
}

// One item alone, for its shop tile
export function itemThumbSvg(item) {
  const body = (item.back?.() || '') + item.draw();
  return `<svg viewBox="${item.thumbBox || THUMB_VIEWBOX[item.slot]}" preserveAspectRatio="xMidYMid ${item.slot === 'background' ? 'slice' : 'meet'}" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" aria-hidden="true">${body}</svg>`;
}
