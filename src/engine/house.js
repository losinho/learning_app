// The child's house for the star shop: first buy a house, then furnish its room slot by slot.
// The room is one SVG scene (viewBox 0 0 400 250): wall down to y=175, floor below, the character stands in front.
// Each house brings its own room look (wall, floor, window view); wallpaper and floor items can replace them.
import { star, heart, circle, rect, path, line, characterSvg } from './character.js';

const ROOM_VIEWBOX = '0 0 400 250';
const FLOOR_Y = 175;

// The house tab, then the furniture slots. Optional slots may stay empty.
export const HOUSES_TAB = { key: 'house', label: 'בתים', emoji: '🏡' };

export const HOUSE_SLOTS = [
  { key: 'bed', label: 'מיטות', emoji: '🛏️', optional: true },
  { key: 'seat', label: 'ספות', emoji: '🛋️', optional: true },
  { key: 'table', label: 'שולחנות', emoji: '🪑', optional: true },
  { key: 'shelf', label: 'על הקיר', emoji: '📺', optional: true },
  { key: 'picture', label: 'תמונות', emoji: '🖼️', optional: true },
  { key: 'lamp', label: 'מנורות', emoji: '💡', optional: true },
  { key: 'rug', label: 'שטיחים', emoji: '🟣', optional: true },
  { key: 'plant', label: 'צמחים', emoji: '🪴', optional: true },
  { key: 'toy', label: 'צעצועים', emoji: '🧸', optional: true },
  { key: 'wall', label: 'קירות', emoji: '🎨', optional: false },
  { key: 'floor', label: 'רצפה', emoji: '🟫', optional: false }
];

// What each slot's shop tile shows of the room
const THUMB_BOX = {
  bed: '4 60 140 150',
  seat: '262 120 132 90',
  table: '168 105 94 105',
  shelf: '284 30 102 96',
  picture: '160 34 80 70',
  lamp: '222 0 70 70',
  rug: '140 192 150 46',
  plant: '128 80 54 130',
  toy: '112 196 66 52',
  wall: `0 0 400 ${FLOOR_Y}`,
  floor: `0 ${FLOOR_Y} 400 ${250 - FLOOR_Y}`
};

// --- Room pieces that houses share ---
const planks = (y0, y1, color, gap = 22) => {
  let out = '';
  for (let y = y0 + gap; y < y1; y += gap) out += line(`M0 ${y} H400`, color, 2);
  return out;
};
const floorBoards = (color, lineColor) => rect(0, FLOOR_Y, 400, 75, color) +
  [190, 207, 225].map(y => line(`M0 ${y} H400`, lineColor, 2)).join('') +
  [[60, 175, 190], [180, 175, 190], [300, 175, 190], [120, 190, 207], [250, 190, 207], [370, 190, 207], [40, 207, 225], [200, 207, 225], [330, 207, 225], [110, 225, 250], [270, 225, 250]]
    .map(([x, a, b]) => line(`M${x} ${a} V${b}`, lineColor, 2)).join('');

// A square window at (40,35) with a view inside it
const windowFrame = (view, frame = '#f8fafc') =>
  rect(34, 29, 92, 82, frame, 6) + `<svg x="40" y="35" width="80" height="70" viewBox="0 0 80 70" preserveAspectRatio="none">${view}</svg>` +
  rect(78, 35, 4, 70, frame) + rect(40, 68, 80, 4, frame);

const VIEWS = {
  hills: rect(0, 0, 80, 70, '#bae6fd') + circle(64, 14, 8, '#fde047') + path('M0 50 Q20 30 40 46 T80 40 V70 H0 Z', '#4ade80'),
  garden: rect(0, 0, 80, 70, '#bae6fd') + rect(0, 48, 80, 22, '#86efac') + [[12, '#f43f5e'], [30, '#facc15'], [50, '#a855f7'], [68, '#fb923c']].map(([x, c]) => line(`M${x} 62 V50`, '#15803d', 2) + circle(x, 47, 5, c)).join(''),
  sea: rect(0, 0, 80, 70, '#7dd3fc') + circle(58, 18, 9, '#fde047') + rect(0, 40, 80, 30, '#0ea5e9') + line('M6 50 Q12 46 18 50 M40 58 Q46 54 52 58', '#e0f2fe', 2) + path('M10 40 L22 26 L22 40 Z', '#fff'),
  leaves: rect(0, 0, 80, 70, '#a7f3d0') + [[10, 12], [40, 6], [70, 14], [20, 40], [56, 38], [8, 64], [44, 64], [76, 58]].map(([x, y]) => circle(x, y, 13, '#16a34a')).join('') + circle(48, 30, 5, '#ef4444'),
  castle: rect(0, 0, 80, 70, '#93c5fd') + path('M0 56 Q40 40 80 56 V70 H0 Z', '#4ade80') + line('M50 20 V44', '#475569', 2) + path('M50 20 L64 25 L50 30 Z', '#ef4444'),
  space: rect(0, 0, 80, 70, '#0f172a') + [[8, 10], [30, 22], [66, 8], [14, 50], [72, 44], [44, 60]].map(([x, y]) => circle(x, y, 1.6, '#fff')).join('') + circle(48, 36, 13, '#f97316') + `<ellipse cx="48" cy="36" rx="22" ry="5" fill="none" stroke="#fde68a" stroke-width="2.5"/>`
};

// --- Houses. room() draws the wall and window, floor() the floor. ---
export const HOUSES = [
  {
    id: 'house_cabin', slot: 'house', name: 'בקתת עץ', cost: 25,
    room: () => rect(0, 0, 400, FLOOR_Y, '#d9a066') + planks(0, FLOOR_Y, '#b97f45') + windowFrame(VIEWS.hills, '#7c4a1e'),
    floor: () => floorBoards('#8b5a2b', '#6b4220'),
    outside: () => rect(0, 0, 120, 100, '#bae6fd') + rect(0, 82, 120, 18, '#4ade80') +
      rect(24, 46, 72, 38, '#b45309') + [54, 62, 70, 78].map(y => line(`M24 ${y} H96`, '#92400e', 2)).join('') +
      path('M16 48 L60 18 L104 48 Z', '#78350f') + rect(52, 60, 16, 24, '#451a03', 2) + rect(30, 56, 14, 12, '#fde68a', 2)
  },
  {
    id: 'house_village', slot: 'house', name: 'בית עם גינה', cost: 60,
    room: () => rect(0, 0, 400, FLOOR_Y, '#fef3c7') + rect(0, 150, 400, 25, '#fde68a') + windowFrame(VIEWS.garden),
    floor: () => floorBoards('#c08552', '#9a6638'),
    outside: () => rect(0, 0, 120, 100, '#bae6fd') + rect(0, 82, 120, 18, '#4ade80') + rect(80, 18, 10, 20, '#991b1b') +
      rect(26, 44, 68, 40, '#fef3c7') + path('M18 46 L60 14 L102 46 Z', '#dc2626') + rect(52, 60, 16, 24, '#2563eb', 2) +
      rect(32, 54, 14, 12, '#7dd3fc', 2) + rect(74, 54, 14, 12, '#7dd3fc', 2) +
      [6, 14, 106, 114].map(x => rect(x, 74, 4, 12, '#fff')).join('') + [[12, '#f43f5e'], [108, '#facc15']].map(([x, c]) => circle(x, 72, 4, c)).join('')
  },
  {
    id: 'house_beach', slot: 'house', name: 'בית על החוף', cost: 100,
    room: () => rect(0, 0, 400, FLOOR_Y, '#e0f2fe') + [0, 50, 100, 150].map(y => line(`M0 ${y + 20} Q100 ${y + 8} 200 ${y + 20} T400 ${y + 20}`, '#bae6fd', 4)).join('') + windowFrame(VIEWS.sea),
    floor: () => floorBoards('#f3d59b', '#d6b26a'),
    outside: () => rect(0, 0, 120, 100, '#7dd3fc') + circle(100, 16, 9, '#fde047') + rect(0, 74, 120, 26, '#0ea5e9') + path('M0 82 Q60 70 120 86 V100 H0 Z', '#fde68a') +
      [34, 50, 70, 86].map(x => rect(x, 62, 4, 22, '#92400e')).join('') + rect(28, 34, 64, 30, '#e0f2fe') + path('M22 36 L60 12 L98 36 Z', '#0284c7') +
      rect(54, 44, 12, 20, '#f97316', 2) + rect(34, 42, 12, 10, '#fde68a', 2) + line('M12 84 Q10 60 16 44', '#92400e', 3) + path('M16 44 Q4 40 2 48 M16 44 Q28 38 30 48 M16 44 Q14 32 22 30', '#16a34a', 'stroke="#16a34a" stroke-width="4" fill="none"')
  },
  {
    id: 'house_tree', slot: 'house', name: 'בית על העץ', cost: 120,
    room: () => rect(0, 0, 400, FLOOR_Y, '#a16207') + planks(0, FLOOR_Y, '#854d0e', 25) + [[150, 0], [330, 0]].map(([x]) => path(`M${x} 0 Q${x + 20} 30 ${x + 10} 60`, 'none', 'stroke="#16a34a" stroke-width="6"') + circle(x + 10, 62, 7, '#22c55e')).join('') + windowFrame(VIEWS.leaves, '#713f12'),
    floor: () => floorBoards('#78350f', '#5b2a0b'),
    outside: () => rect(0, 0, 120, 100, '#bae6fd') + rect(0, 86, 120, 14, '#4ade80') + rect(52, 40, 16, 50, '#78350f') +
      [[30, 30], [60, 18], [90, 30], [44, 50], [78, 50]].map(([x, y]) => circle(x, y, 20, '#16a34a')).join('') +
      rect(38, 30, 44, 24, '#b45309', 2) + path('M34 32 L60 16 L86 32 Z', '#dc2626') + rect(54, 38, 10, 16, '#451a03', 1) +
      line('M84 54 V90 M94 54 V90', '#92400e', 2) + [62, 70, 78, 86].map(y => line(`M84 ${y} H94`, '#92400e', 2)).join('')
  },
  {
    id: 'house_castle', slot: 'house', name: 'טירה', cost: 250,
    room: () => {
      let stones = rect(0, 0, 400, FLOOR_Y, '#cbd5e1');
      for (let row = 0; row * 25 < FLOOR_Y; row++) {
        stones += line(`M0 ${row * 25 + 25} H400`, '#94a3b8', 2);
        for (let x = row % 2 ? 25 : 0; x < 400; x += 50) stones += line(`M${x} ${row * 25} V${row * 25 + 25}`, '#94a3b8', 2);
      }
      const arch = path('M34 111 V60 Q80 18 126 60 V111 Z', '#64748b') + `<svg x="40" y="35" width="80" height="70" viewBox="0 0 80 70" preserveAspectRatio="none"><path d="M0 70 V28 Q40 -8 80 28 V70 Z" fill="#93c5fd"/>${VIEWS.castle.replace(/^<rect[^>]*>/, '')}</svg>`;
      return stones + arch + path('M330 20 H370 V90 L350 78 L330 90 Z', '#7c3aed') + star(350, 48, 10, '#fde047');
    },
    floor: () => {
      let tiles = rect(0, FLOOR_Y, 400, 75, '#64748b');
      for (let x = 0; x < 400; x += 40) tiles += line(`M${x} ${FLOOR_Y} V250`, '#475569', 2);
      return tiles + line('M0 200 H400 M0 225 H400', '#475569', 2) + rect(150, FLOOR_Y, 130, 75, '#b91c1c') + line('M156 175 V250 M274 175 V250', '#fde047', 3);
    },
    outside: () => rect(0, 0, 120, 100, '#bae6fd') + rect(0, 86, 120, 14, '#4ade80') + rect(30, 40, 60, 48, '#94a3b8') +
      [10, 86].map(x => rect(x, 26, 24, 62, '#cbd5e1') + [0, 9, 18].map(dx => rect(x + dx, 20, 6, 8, '#cbd5e1')).join('') + path(`M${x + 12} 20 V6 L${x + 22} 10 L${x + 12} 14`, '#ef4444', 'stroke="#475569" stroke-width="1.5"')).join('') +
      [30, 42, 54, 66, 78].map(x => rect(x, 34, 7, 8, '#94a3b8')).join('') + path('M50 88 V68 Q60 56 70 68 V88 Z', '#78350f') + rect(18, 40, 8, 12, '#1e293b', 4) + rect(94, 40, 8, 12, '#1e293b', 4)
  },
  {
    id: 'house_space', slot: 'house', name: 'תחנת חלל', cost: 300,
    room: () => rect(0, 0, 400, FLOOR_Y, '#334155') + [0, 100, 200, 300].map(x => rect(x + 6, 6, 88, 160, '#3f4d63', 8) + circle(x + 16, 16, 3, '#94a3b8') + circle(x + 84, 16, 3, '#94a3b8')).join('') +
      circle(80, 70, 46, '#cbd5e1') + `<svg x="40" y="30" width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="38" fill="#0f172a"/>${VIEWS.space.replace(/^<rect[^>]*>/, '')}</svg>` +
      [200, 214, 228].map((x, i) => circle(x, 150, 4, ['#22c55e', '#facc15', '#ef4444'][i])).join(''),
    floor: () => {
      let grid = rect(0, FLOOR_Y, 400, 75, '#475569');
      for (let x = 0; x < 400; x += 50) grid += line(`M${x} ${FLOOR_Y} V250`, '#64748b', 2);
      return grid + line('M0 212 H400', '#64748b', 2) + rect(0, FLOOR_Y, 400, 4, '#22d3ee');
    },
    outside: () => {
      const dots = [[10, 10], [30, 26], [100, 8], [112, 40], [8, 60], [92, 70]].map(([x, y]) => circle(x, y, 1.5, '#fff')).join('');
      return rect(0, 0, 120, 100, '#0f172a') + dots + circle(100, 86, 30, '#f97316') +
        rect(8, 44, 30, 12, '#38bdf8', 2) + rect(82, 44, 30, 12, '#38bdf8', 2) + rect(36, 48, 48, 4, '#94a3b8') +
        circle(60, 50, 20, '#e2e8f0') + circle(60, 50, 9, '#0ea5e9') + rect(56, 20, 8, 12, '#94a3b8') + circle(60, 18, 4, '#ef4444');
    }
  }
];

// --- Furniture and decorations ---
const pot = (x, y, w = 26, h = 22, color = '#c2410c') => path(`M${x} ${y} H${x + w} L${x + w - 4} ${y + h} H${x + 4} Z`, color) + rect(x - 2, y - 4, w + 4, 6, color, 2);

const wallPattern = (color, drawOne, step = 50) => {
  let out = rect(0, 0, 400, FLOOR_Y, color);
  for (let y = 20; y < FLOOR_Y; y += step) {
    for (let x = (y / step) % 2 ? 45 : 20; x < 400; x += step) out += drawOne(x, y);
  }
  return out;
};

export const HOUSE_ITEMS = [
  // Beds (left side)
  { id: 'bed_basic', slot: 'bed', name: 'מיטה פשוטה', cost: 10, draw: () => rect(10, 120, 14, 85, '#92400e', 4) + rect(18, 160, 117, 22, '#fff', 6) + rect(50, 157, 85, 27, '#60a5fa', 6) + rect(26, 149, 30, 14, '#f1f5f9', 6) + rect(22, 182, 8, 22, '#92400e') + rect(124, 182, 8, 22, '#92400e') },
  { id: 'bed_bunk', slot: 'bed', name: 'מיטת קומותיים', cost: 40, draw: () => rect(12, 70, 8, 135, '#a16207') + rect(127, 70, 8, 135, '#a16207') + rect(16, 88, 115, 14, '#fca5a5', 5) + rect(12, 100, 123, 9, '#a16207') + rect(16, 163, 115, 14, '#93c5fd', 5) + rect(12, 175, 123, 9, '#a16207') + line('M108 109 V163 M122 109 V163', '#854d0e', 3) + [122, 136, 150].map(y => line(`M108 ${y} H122`, '#854d0e', 3)).join('') + rect(22, 80, 24, 10, '#fff', 4) + rect(22, 155, 24, 10, '#fff', 4) },
  { id: 'bed_car', slot: 'bed', name: 'מיטת מכונית', cost: 60, draw: () => path('M10 198 V160 Q10 150 24 150 H52 L68 128 H108 L122 150 Q136 152 136 166 V198 Z', '#dc2626') + path('M72 134 H104 L114 150 H62 Z', '#bae6fd') + rect(24, 154, 90, 14, '#fff', 6) + circle(38, 198, 15, '#1f2937') + circle(38, 198, 6, '#9ca3af') + circle(110, 198, 15, '#1f2937') + circle(110, 198, 6, '#9ca3af') + circle(132, 172, 4, '#fde047') + rect(50, 176, 40, 6, '#fff', 3) },
  { id: 'bed_princess', slot: 'bed', name: 'מיטת חופה', cost: 70, draw: () => rect(12, 60, 6, 145, '#e9d5ff') + rect(129, 60, 6, 145, '#e9d5ff') + path('M8 58 Q74 40 140 58 L132 70 Q74 56 16 70 Z', '#c084fc') + path('M16 66 Q8 120 20 160 L30 160 Q24 110 30 70 Z', '#f5d0fe') + path('M132 66 Q140 120 128 160 L118 160 Q124 110 118 70 Z', '#f5d0fe') + rect(18, 160, 117, 22, '#fff', 6) + rect(50, 157, 85, 27, '#f472b6', 6) + heart(92, 168, 6, '#fff') + rect(26, 149, 30, 14, '#fdf4ff', 6) + rect(22, 182, 8, 22, '#c084fc') + rect(124, 182, 8, 22, '#c084fc') },

  // Seats (right side)
  { id: 'seat_beanbag', slot: 'seat', name: 'פוף', cost: 12, draw: () => `<ellipse cx="330" cy="188" rx="46" ry="20" fill="#7c3aed"/>` + `<ellipse cx="322" cy="168" rx="32" ry="26" fill="#8b5cf6"/>` + `<ellipse cx="312" cy="158" rx="10" ry="6" fill="#a78bfa"/>` },
  { id: 'seat_armchair', slot: 'seat', name: 'כורסה', cost: 18, draw: () => rect(300, 132, 64, 44, '#16a34a', 12) + rect(296, 168, 72, 22, '#22c55e', 8) + rect(288, 152, 16, 40, '#15803d', 7) + rect(360, 152, 16, 40, '#15803d', 7) + rect(298, 192, 6, 12, '#78350f') + rect(360, 192, 6, 12, '#78350f') },
  { id: 'seat_sofa', slot: 'seat', name: 'ספה אדומה', cost: 30, draw: () => rect(276, 136, 106, 42, '#dc2626', 12) + rect(274, 170, 110, 24, '#ef4444', 8) + rect(266, 152, 18, 44, '#b91c1c', 8) + rect(374, 152, 18, 44, '#b91c1c', 8) + rect(290, 150, 26, 22, '#fde047', 6) + rect(342, 150, 26, 22, '#38bdf8', 6) + rect(278, 194, 6, 10, '#451a03') + rect(374, 194, 6, 10, '#451a03') },
  { id: 'seat_cloud', slot: 'seat', name: 'ספת ענן', cost: 60, draw: () => [[296, 160, 22], [326, 146, 26], [358, 158, 22], [282, 182, 18], [376, 182, 18]].map(([x, y, r]) => circle(x, y, r, '#f1f5f9')).join('') + rect(282, 168, 96, 32, '#fff', 14) + circle(312, 180, 3, '#94a3b8') + circle(344, 180, 3, '#94a3b8') + line('M318 188 Q328 194 338 188', '#94a3b8', 2) + rect(292, 200, 8, 6, '#cbd5e1') + rect(360, 200, 8, 6, '#cbd5e1') },

  // Tables (middle, behind the character)
  { id: 'table_wood', slot: 'table', name: 'שולחן עץ', cost: 10, draw: () => rect(174, 156, 82, 10, '#b45309', 3) + rect(182, 166, 7, 38, '#92400e') + rect(241, 166, 7, 38, '#92400e') + rect(200, 140, 14, 16, '#fff', 3) + rect(214, 144, 5, 8, '#fff', 2) },
  { id: 'table_cake', slot: 'table', name: 'שולחן עם עוגה', cost: 30, draw: () => path('M172 160 H258 L252 204 H178 Z', '#fbcfe8') + rect(170, 154, 90, 10, '#f9a8d4', 4) + [182, 198, 214, 230, 246].map(x => circle(x, 166, 3, '#fff')).join('') + rect(194, 128, 42, 26, '#fef3c7', 4) + rect(194, 128, 42, 8, '#f472b6', 4) + rect(213, 112, 4, 16, '#38bdf8') + path('M215 104 Q219 110 215 113 Q211 110 215 104 Z', '#f97316') + [200, 212, 224].map(x => circle(x, 144, 2.5, '#ef4444')).join('') },
  { id: 'table_desk', slot: 'table', name: 'שולחן מחשב', cost: 45, draw: () => rect(172, 150, 86, 10, '#e2e8f0', 3) + rect(176, 160, 22, 44, '#cbd5e1', 2) + rect(180, 168, 14, 3, '#94a3b8') + rect(180, 184, 14, 3, '#94a3b8') + rect(248, 160, 6, 44, '#cbd5e1') + rect(196, 104, 50, 34, '#1e293b', 4) + rect(200, 108, 42, 26, '#38bdf8') + star(221, 121, 8, '#fde047') + rect(217, 138, 8, 12, '#475569') + rect(206, 146, 30, 4, '#475569', 2) },
  { id: 'table_piano', slot: 'table', name: 'פסנתר', cost: 80, draw: () => rect(168, 104, 94, 60, '#111827', 6) + rect(172, 150, 86, 14, '#fff', 2) + [178, 190, 202, 214, 226, 238, 250].map(x => line(`M${x} 150 V164`, '#d1d5db', 1.5)).join('') + [184, 196, 220, 232, 244].map(x => rect(x - 3, 150, 6, 8, '#111827')).join('') + rect(172, 164, 8, 40, '#111827') + rect(250, 164, 8, 40, '#111827') + line('M190 120 Q196 112 200 120 M214 116 V128 M222 114 V126', '#fde047', 2) + circle(212, 128, 3, '#fde047') + circle(220, 126, 3, '#fde047') },

  // On the wall, right side
  { id: 'shelf_books', slot: 'shelf', name: 'מדף ספרים', cost: 25, draw: () => rect(292, 40, 86, 80, '#92400e', 4) + rect(297, 45, 76, 32, '#fef3c7') + rect(297, 83, 76, 32, '#fef3c7') + [[300, '#ef4444', 28], [309, '#3b82f6', 24], [318, '#22c55e', 28], [327, '#facc15', 22], [336, '#a855f7', 28]].map(([x, c, h]) => rect(x, 77 - h, 8, h, c, 1)).join('') + [[300, '#f97316', 26], [309, '#14b8a6', 28], [318, '#ec4899', 22], [346, '#3b82f6', 28], [355, '#ef4444', 24]].map(([x, c, h]) => rect(x, 115 - h, 8, h, c, 1)).join('') + circle(358, 68, 8, '#16a34a') + rect(352, 70, 12, 7, '#c2410c', 2) },
  { id: 'shelf_trophy', slot: 'shelf', name: 'מדף גביעים', cost: 35, draw: () => rect(288, 108, 94, 8, '#92400e', 2) + [[306, 1], [334, 1.25], [362, 1]].map(([x, s]) => path(`M${x - 12 * s} ${108 - 40 * s} H${x + 12 * s} Q${x + 12 * s} ${108 - 22 * s} ${x} ${108 - 18 * s} Q${x - 12 * s} ${108 - 22 * s} ${x - 12 * s} ${108 - 40 * s} Z`, '#facc15') + rect(x - 2, 108 - 18 * s, 4, 10 * s, '#eab308') + rect(x - 8 * s, 108 - 8 * s, 16 * s, 8 * s, '#a16207', 2)).join('') + star(334, 70, 6, '#fff') + line('M344 40 L352 56 L360 40', '#ef4444', 3) + circle(352, 62, 7, '#fbbf24') },
  { id: 'shelf_tv', slot: 'shelf', name: 'טלוויזיה', cost: 50, draw: () => rect(286, 40, 98, 64, '#111827', 6) + rect(292, 46, 86, 52, '#7dd3fc') + rect(292, 82, 86, 16, '#4ade80') + circle(318, 64, 9, '#fde047') + path('M340 82 Q350 60 362 82 Z', '#f97316') + circle(347, 70, 2, '#111827') + circle(355, 70, 2, '#111827') + rect(326, 104, 18, 8, '#374151') },
  { id: 'shelf_fish', slot: 'shelf', name: 'אקווריום', cost: 60, draw: () => rect(288, 44, 94, 66, '#0c4a6e', 6) + rect(292, 48, 86, 58, '#7dd3fc') + rect(292, 96, 86, 10, '#fde68a') + path('M304 96 Q300 80 306 70 M312 96 Q316 82 310 74', 'none', 'stroke="#16a34a" stroke-width="4"') + [[330, 66, '#f97316'], [356, 82, '#facc15'], [346, 58, '#ec4899']].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="${c}"/>` + path(`M${x + 8} ${y} L${x + 15} ${y - 5} V${y + 5} Z`, c) + circle(x - 4, y - 1, 1.5, '#111827')).join('') + circle(322, 54, 2, '#e0f2fe') + circle(326, 50, 1.5, '#e0f2fe') + rect(284, 110, 102, 8, '#334155', 2) },

  // Pictures (middle of the wall)
  { id: 'pic_flag', slot: 'picture', name: 'דגל ישראל', cost: 8, draw: () => rect(170, 44, 62, 44, '#fff', 2) + rect(170, 48, 62, 6, '#1d4ed8') + rect(170, 78, 62, 6, '#1d4ed8') + path('M201 56 L209 70 H193 Z', 'none', 'stroke="#1d4ed8" stroke-width="2"') + path('M201 75 L193 61 H209 Z', 'none', 'stroke="#1d4ed8" stroke-width="2"') + line('M170 44 V88', '#94a3b8', 1) },
  { id: 'pic_sun', slot: 'picture', name: 'ציור שמש', cost: 10, draw: () => rect(166, 40, 70, 54, '#a16207', 3) + rect(172, 46, 58, 42, '#bae6fd') + path('M172 88 V74 Q190 62 206 74 T230 70 V88 Z', '#4ade80') + circle(214, 58, 8, '#facc15') + line('M214 44 V47 M226 58 H223 M205 49 L207 51 M223 49 L221 51', '#facc15', 2) },
  { id: 'pic_rainbow', slot: 'picture', name: 'ציור קשת', cost: 12, draw: () => rect(166, 40, 70, 54, '#f472b6', 3) + rect(172, 46, 58, 42, '#fff') + ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#8b5cf6'].map((c, i) => `<path d="M${180 + i * 4} 84 A${21 - i * 4} ${21 - i * 4} 0 0 1 ${222 - i * 4} 84" fill="none" stroke="${c}" stroke-width="4"/>`).join('') + circle(178, 82, 5, '#e2e8f0') + circle(224, 82, 5, '#e2e8f0') },
  { id: 'pic_clock', slot: 'picture', name: 'שעון', cost: 15, draw: () => circle(201, 66, 26, '#0ea5e9') + circle(201, 66, 21, '#fff') + [0, 1, 2, 3].map(i => { const a = i * Math.PI / 2; return circle((201 + 16 * Math.sin(a)).toFixed(1), (66 - 16 * Math.cos(a)).toFixed(1), 2, '#0f172a'); }).join('') + line('M201 66 V52 M201 66 L211 70', '#0f172a', 3) + circle(201, 66, 2.5, '#ef4444') },
  { id: 'pic_mirror', slot: 'picture', name: 'מראה', cost: 20, draw: () => `<ellipse cx="201" cy="66" rx="24" ry="30" fill="#facc15"/><ellipse cx="201" cy="66" rx="19" ry="25" fill="#e0f2fe"/>` + line('M190 56 L198 46 M192 66 L206 50', '#fff', 3) + star(201, 34, 5, '#facc15') },

  // Ceiling lamps
  { id: 'lamp_bulb', slot: 'lamp', name: 'נורה', cost: 5, draw: () => line('M256 0 V24', '#334155', 2) + rect(250, 22, 12, 8, '#64748b', 2) + circle(256, 38, 10, '#fde047') + circle(256, 38, 18, '#fde047', 'opacity="0.25"') },
  { id: 'lamp_lantern', slot: 'lamp', name: 'פנס נייר', cost: 15, draw: () => line('M256 0 V18', '#334155', 2) + `<ellipse cx="256" cy="38" rx="20" ry="22" fill="#ef4444"/>` + line('M240 30 H272 M238 40 H274 M240 50 H272', '#fca5a5', 2) + rect(250, 16, 12, 5, '#facc15', 1) + rect(250, 58, 12, 5, '#facc15', 1) + line('M256 63 V70', '#facc15', 2) },
  { id: 'lamp_disco', slot: 'lamp', name: 'כדור דיסקו', cost: 40, draw: () => line('M256 0 V14', '#334155', 2) + circle(256, 36, 22, '#cbd5e1') + line('M234 36 H278 M238 24 H274 M238 48 H274 M256 14 V58 M244 16 Q238 36 244 56 M268 16 Q274 36 268 56', '#94a3b8', 1.5) + [[200, 20, '#f472b6'], [300, 30, '#38bdf8'], [150, 120, '#facc15'], [380, 140, '#4ade80'], [100, 150, '#a78bfa'], [330, 110, '#f97316']].map(([x, y, c]) => star(x, y, 5, c)).join('') },
  { id: 'lamp_chandelier', slot: 'lamp', name: 'נברשת', cost: 55, draw: () => line('M256 0 V16', '#a16207', 2) + path('M226 34 Q256 52 286 34', 'none', 'stroke="#ca8a04" stroke-width="4"') + line('M256 16 V44', '#ca8a04', 4) + [226, 241, 256, 271, 286].map((x, i) => rect(x - 3, (i % 2 ? 30 : 22), 6, 12, '#fff', 1) + path(`M${x} ${(i % 2 ? 22 : 14)} Q${x + 4} ${(i % 2 ? 27 : 19)} ${x} ${(i % 2 ? 30 : 22)} Q${x - 4} ${(i % 2 ? 27 : 19)} ${x} ${(i % 2 ? 22 : 14)} Z`, '#f97316')).join('') + [236, 256, 276].map(x => path(`M${x} 46 L${x + 4} 54 L${x} 60 L${x - 4} 54 Z`, '#bae6fd')).join('') },

  // Rugs (floor, in front)
  { id: 'rug_round', slot: 'rug', name: 'שטיח עגול', cost: 10, draw: () => `<ellipse cx="215" cy="215" rx="72" ry="18" fill="#3b82f6"/><ellipse cx="215" cy="215" rx="56" ry="12" fill="none" stroke="#bfdbfe" stroke-width="3"/>` },
  { id: 'rug_star', slot: 'rug', name: 'שטיח כוכבים', cost: 20, draw: () => `<ellipse cx="215" cy="215" rx="72" ry="18" fill="#1e3a8a"/>` + [[175, 212], [200, 220], [230, 209], [255, 218], [215, 228]].map(([x, y]) => star(x, y, 5, '#fde047')).join('') },
  { id: 'rug_rainbow', slot: 'rug', name: 'שטיח קשת', cost: 25, draw: () => ['#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#8b5cf6'].map((c, i) => `<ellipse cx="215" cy="215" rx="${74 - i * 11}" ry="${19 - i * 3}" fill="${c}"/>`).join('') },

  // Plants (between bed and table)
  { id: 'plant_pot', slot: 'plant', name: 'עציץ', cost: 6, draw: () => [[146, 160, -20], [156, 152, 0], [166, 160, 20]].map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="16" fill="#22c55e" transform="rotate(${a} ${x} ${y})"/>`).join('') + pot(143, 180) },
  { id: 'plant_cactus', slot: 'plant', name: 'קקטוס', cost: 8, draw: () => rect(150, 130, 12, 52, '#16a34a', 6) + rect(140, 146, 8, 20, '#16a34a', 4) + rect(140, 160, 14, 6, '#16a34a', 3) + rect(164, 138, 8, 18, '#16a34a', 4) + rect(158, 150, 14, 6, '#16a34a', 3) + circle(156, 128, 4, '#f472b6') + pot(143, 182, 26, 20, '#f59e0b') },
  { id: 'plant_sunflower', slot: 'plant', name: 'חמנייה', cost: 12, draw: () => line('M156 182 V112', '#15803d', 4) + `<ellipse cx="164" cy="150" rx="8" ry="4" fill="#22c55e"/>` + Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5; return circle((156 + 11 * Math.cos(a)).toFixed(1), (106 + 11 * Math.sin(a)).toFixed(1), 6, '#facc15'); }).join('') + circle(156, 106, 8, '#78350f') + pot(143, 182) },
  { id: 'plant_tree', slot: 'plant', name: 'עץ בעציץ', cost: 30, draw: () => rect(152, 120, 8, 62, '#78350f') + [[146, 104], [166, 104], [156, 88], [144, 122], [168, 122]].map(([x, y]) => circle(x, y, 15, '#16a34a')).join('') + [[150, 96], [164, 114], [142, 116]].map(([x, y]) => circle(x, y, 3.5, '#f97316')).join('') + pot(141, 182, 30, 22, '#0d9488') },

  // Toys (front of the floor)
  { id: 'toy_ball', slot: 'toy', name: 'כדור', cost: 6, draw: () => circle(146, 226, 16, '#ef4444') + path('M130 226 Q146 214 162 226 Q146 238 130 226 Z', '#fff') + circle(146, 226, 4, '#facc15') },
  { id: 'toy_blocks', slot: 'toy', name: 'קוביות אבג', cost: 10, draw: () => [[120, 224, '#ef4444', 'א'], [142, 224, '#3b82f6', 'ב'], [131, 202, '#22c55e', 'ג']].map(([x, y, c, ch]) => rect(x, y, 20, 20, c, 3) + `<text x="${x + 10}" y="${y + 15}" text-anchor="middle" font-size="14" font-weight="900" font-family="sans-serif" fill="#fff">${ch}</text>`).join('') },
  { id: 'toy_teddy', slot: 'toy', name: 'דובי', cost: 15, draw: () => circle(146, 230, 15, '#b45309') + circle(146, 230, 8, '#fcd34d') + circle(146, 208, 12, '#b45309') + circle(136, 198, 5, '#b45309') + circle(156, 198, 5, '#b45309') + circle(142, 206, 1.8, '#1f2937') + circle(150, 206, 1.8, '#1f2937') + circle(146, 212, 3.5, '#fcd34d') + circle(132, 236, 6, '#92400e') + circle(160, 236, 6, '#92400e') + heart(146, 228, 3, '#ef4444') },
  { id: 'toy_train', slot: 'toy', name: 'רכבת', cost: 30, draw: () => rect(116, 214, 22, 18, '#3b82f6', 3) + rect(140, 206, 30, 26, '#ef4444', 3) + rect(144, 210, 12, 10, '#bae6fd', 2) + rect(160, 198, 8, 10, '#1f2937') + [122, 134, 146, 164].map(x => circle(x, 234, 5, '#1f2937')).join('') + line('M138 222 H140', '#1f2937', 2) + circle(170, 194, 4, '#e2e8f0') + circle(176, 188, 3, '#e2e8f0') },

  // Wallpaper (replaces the house's own wall; the window stays)
  { id: 'wall_house', slot: 'wall', name: 'הקיר של הבית', cost: 0 },
  { id: 'wall_stripes', slot: 'wall', name: 'פסים צהובים', cost: 10, wall: () => rect(0, 0, 400, FLOOR_Y, '#fef9c3') + Array.from({ length: 10 }, (_, i) => rect(i * 40, 0, 20, FLOOR_Y, '#fde68a')).join('') },
  { id: 'wall_dots', slot: 'wall', name: 'נקודות ירוקות', cost: 10, wall: () => wallPattern('#bbf7d0', (x, y) => circle(x, y, 6, '#86efac'), 40) },
  { id: 'wall_hearts', slot: 'wall', name: 'לבבות ורודים', cost: 15, wall: () => wallPattern('#fbcfe8', (x, y) => heart(x, y, 6, '#f472b6')) },
  { id: 'wall_stars', slot: 'wall', name: 'שמי לילה', cost: 20, wall: () => wallPattern('#1e3a8a', (x, y) => star(x, y, 7, '#fde047')) + circle(360, 30, 14, '#fef9c3') + circle(366, 26, 12, '#1e3a8a') },

  // Floors
  { id: 'floor_house', slot: 'floor', name: 'הרצפה של הבית', cost: 0 },
  { id: 'floor_light', slot: 'floor', name: 'פרקט בהיר', cost: 10, floor: () => floorBoards('#e9c48f', '#c9a066') },
  { id: 'floor_checker', slot: 'floor', name: 'משבצות', cost: 15, floor: () => {
    let tiles = rect(0, FLOOR_Y, 400, 75, '#fff');
    for (let row = 0; row < 3; row++) for (let col = 0; col < 16; col++) if ((row + col) % 2) tiles += rect(col * 25, FLOOR_Y + row * 25, 25, 25, '#a5b4fc');
    return tiles;
  } },
  { id: 'floor_carpet', slot: 'floor', name: 'שטיח מקיר לקיר', cost: 15, floor: () => rect(0, FLOOR_Y, 400, 75, '#93c5fd') + line('M0 178 H400', '#60a5fa', 4) },
  { id: 'floor_grass', slot: 'floor', name: 'דשא', cost: 20, floor: () => rect(0, FLOOR_Y, 400, 75, '#4ade80') + Array.from({ length: 40 }, (_, i) => line(`M${i * 10 + 4} ${190 + (i % 3) * 18} l2 -7 l2 7`, '#16a34a', 2)).join('') }
];

const ITEMS_BY_ID = new Map([...HOUSES, ...HOUSE_ITEMS].map(item => [item.id, item]));

export function houseItem(id) {
  return ITEMS_BY_ID.get(id);
}

export function houseItemsForSlot(slot) {
  return slot === HOUSES_TAB.key ? HOUSES : HOUSE_ITEMS.filter(item => item.slot === slot);
}

// Drawing order, back to front; the character stands between the table and the rug's front toys
const BACK_SLOTS = ['picture', 'shelf', 'lamp', 'bed', 'plant', 'table', 'seat', 'rug'];

// state = { house: houseId, placed: { slot: itemId } }; look = the character's look (optional)
export function roomSvg(state, look, { className = '', style = '' } = {}) {
  const house = houseItem(state.house);
  if (!house) return emptyLotSvg({ className, style });
  const placed = state.placed || {};
  const draw = slot => houseItem(placed[slot])?.draw?.() || '';

  // A wallpaper replaces the wall but keeps the house's window: draw the house's wall, then cover around the window
  const wallpaper = houseItem(placed.wall)?.wall;
  const wall = wallpaper
    ? wallpaper() + `<svg x="0" y="0" width="400" height="${FLOOR_Y}" viewBox="0 0 400 ${FLOOR_Y}"><defs><clipPath id="win-${house.id}"><rect x="30" y="25" width="100" height="90"/></clipPath></defs><g clip-path="url(#win-${house.id})">${house.room()}</g></svg>`
    : house.room();
  const floor = houseItem(placed.floor)?.floor?.() || house.floor();

  const character = look ? characterSvg(look, { noBackground: true, x: 172, y: 116, width: 96, height: 130 }) : '';
  const body = wall + floor + BACK_SLOTS.map(draw).join('') + character + draw('toy');
  return `<svg viewBox="${ROOM_VIEWBOX}" xmlns="http://www.w3.org/2000/svg" class="${className}" style="${style}" aria-hidden="true">${body}</svg>`;
}

// Before the first house: an empty lot with a "for sale" sign
function emptyLotSvg({ className, style }) {
  const body = rect(0, 0, 400, 250, '#bae6fd') + circle(340, 50, 26, '#fde047') + rect(0, 180, 400, 70, '#86efac') +
    rect(196, 120, 8, 70, '#92400e') + rect(150, 96, 100, 40, '#fff', 6) + rect(150, 96, 100, 40, 'none', 6).replace('fill="none"', 'fill="none" stroke="#f59e0b" stroke-width="4"') +
    `<text x="200" y="123" text-anchor="middle" font-size="20" font-weight="900" font-family="sans-serif" fill="#b45309">למכירה</text>` +
    [[40, 200], [90, 214], [320, 206], [360, 222]].map(([x, y]) => circle(x, y, 5, '#f472b6') + line(`M${x} ${y + 5} V${y + 14}`, '#15803d', 2)).join('');
  return `<svg viewBox="${ROOM_VIEWBOX}" xmlns="http://www.w3.org/2000/svg" class="${className}" style="${style}" aria-hidden="true">${body}</svg>`;
}

// One item alone, for its shop tile
export function houseThumbSvg(item) {
  let body;
  let box = THUMB_BOX[item.slot];
  let fit = 'meet';
  if (item.slot === 'house') {
    body = item.outside();
    box = '0 0 120 100';
  } else if (item.slot === 'wall') {
    body = item.wall ? item.wall() : rect(0, 0, 400, FLOOR_Y, '#e2e8f0') + `<text x="200" y="110" text-anchor="middle" font-size="60" font-family="sans-serif">🏠</text>`;
    fit = 'slice';
  } else if (item.slot === 'floor') {
    body = item.floor ? item.floor() : rect(0, FLOOR_Y, 400, 75, '#e2e8f0') + `<text x="200" y="232" text-anchor="middle" font-size="50" font-family="sans-serif">🏠</text>`;
    fit = 'slice';
  } else {
    body = item.draw();
  }
  return `<svg viewBox="${box}" preserveAspectRatio="xMidYMid ${fit}" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" aria-hidden="true">${body}</svg>`;
}
