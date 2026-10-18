// Grade 3 area measurement (new math program: "מדידת שטח" — comparing areas, measuring with unit squares,
// סמ"ר). Shapes are drawn on a grid of unit squares; the area is the number of squares.
import { numberChoices, choiceExercise } from './procedural_math.js';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const COLS = 6, ROWS = 5, CELL = 28;
const FILLS = ['#a5b4fc', '#fca5a5', '#86efac', '#fcd34d', '#c4b5fd'];

// A random connected shape of `size` unit squares inside the grid: Set of "x,y"
export function randomShape(size) {
  const cells = new Set([`${randInt(1, COLS - 2)},${randInt(1, ROWS - 2)}`]);
  let guard = 0;
  while (cells.size < size && guard++ < 500) {
    const [x, y] = pickRandom([...cells]).split(',').map(Number);
    const [dx, dy] = pickRandom([[1, 0], [-1, 0], [0, 1], [0, -1]]);
    const nx = x + dx, ny = y + dy;
    if (nx >= 0 && ny >= 0 && nx < COLS && ny < ROWS) cells.add(`${nx},${ny}`);
  }
  return cells;
}

// Number of unit edges on the outline — counting these instead of squares is the classic area mistake
export function perimeterOf(cells) {
  let edges = 0;
  for (const c of cells) {
    const [x, y] = c.split(',').map(Number);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!cells.has(`${x + dx},${y + dy}`)) edges++;
  }
  return edges;
}

export function gridSvg(cells, fill, label = '') {
  const w = COLS * CELL, h = ROWS * CELL;
  const grid = [];
  for (let x = 0; x <= COLS; x++) grid.push(`<line x1="${x * CELL}" y1="0" x2="${x * CELL}" y2="${h}"/>`);
  for (let y = 0; y <= ROWS; y++) grid.push(`<line x1="0" y1="${y * CELL}" x2="${w}" y2="${y * CELL}"/>`);
  const squares = [...cells].map(c => {
    const [x, y] = c.split(',').map(Number);
    return `<rect x="${x * CELL}" y="${y * CELL}" width="${CELL}" height="${CELL}" fill="${fill}" stroke="#312e81" stroke-width="1.5"/>`;
  }).join('');
  const caption = label ? `<text x="${w / 2}" y="${h + 22}" text-anchor="middle" font-size="18" font-weight="bold" fill="#312e81">${label}</text>` : '';
  return `<svg viewBox="-2 -2 ${w + 4} ${h + (label ? 30 : 4)}" width="${w + 4}" height="${h + (label ? 30 : 4)}" style="display:inline-block;vertical-align:middle;margin:0 6px" aria-hidden="true">` +
    `<g stroke="#cbd5e1" stroke-width="1">${grid.join('')}</g>${squares}${caption}</svg>`;
}

// "מהו השטח של הצורה?" — count the unit squares (each square is 1 סמ"ר)
export function generateGrade3AreaCount() {
  const size = randInt(4, 12);
  const cells = randomShape(size);
  const area = cells.size;
  const perimeter = perimeterOf(cells);
  const choices = numberChoices(area, [-1, 1, -2, 2], 4, 1);
  // Put the perimeter in as one of the wrong answers (when it differs from the area)
  if (perimeter !== area && !choices.includes(perimeter)) choices[choices.findIndex(c => c !== area)] = perimeter;
  return choiceExercise({
    idPrefix: 'math_g3_area',
    title: 'מדידת שטח',
    instructionHebrew: 'כל ריבוע הוא סמ"ר אחד. מהו השטח של הצורה (בסמ"ר)?',
    formula: gridSvg(cells, pickRandom(FILLS)),
    soundCue: 'כל ריבוע הוא סנטימטר רבוע אחד. מהו השטח של הצורה?',
    correct: area,
    choices: choices.sort(() => Math.random() - 0.5),
    feedbackNote: `השטח: ${area} סמ"ר (סופרים את הריבועים, לא את הצלעות)`
  });
}

// "לאיזו צורה שטח גדול יותר?" — two shapes; sometimes equal areas with different outlines
export function generateGrade3AreaCompare() {
  const a = randomShape(randInt(4, 11));
  const equal = Math.random() < 0.25;
  let b;
  let guard = 0;
  do { b = randomShape(equal ? a.size : randInt(4, 11)); } while (++guard < 50 && (equal ? b.size !== a.size : b.size === a.size));
  const correct = a.size === b.size ? 'שוות' : a.size > b.size ? 'א' : 'ב';
  return {
    id: `math_g3_areacmp_${Date.now()}_${Math.random()}`,
    category: 'math',
    type: 'arithmetic_choice',
    title: 'השוואת שטחים',
    instructionHebrew: 'לאיזו צורה יש שטח גדול יותר?',
    formula: `<span dir="rtl" style="display:inline-block;white-space:normal">${gridSvg(a, FILLS[0], 'צורה א')}${gridSvg(b, FILLS[1], 'צורה ב')}</span>`,
    soundCue: 'לאיזו צורה יש שטח גדול יותר?',
    expectedAnswer: correct,
    correctOptionId: correct,
    feedbackNote: `צורה א: ${a.size} סמ"ר, צורה ב: ${b.size} סמ"ר`,
    options: [
      { id: 'א', label: 'צורה א' },
      { id: 'ב', label: 'צורה ב' },
      { id: 'שוות', label: 'שטחים שווים' }
    ]
  };
}
