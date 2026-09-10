const opentype = require('opentype.js');
const fs = require('fs');
const path = require('path');

const fontBuffer = fs.readFileSync(path.join(__dirname, 'BarlowCondensed-Black.ttf'));
const font = opentype.parse(fontBuffer.buffer);

const FONT_SIZE = 100;

function getLetterPaths(text) {
  const letters = [];
  let xOffset = 0;

  for (const char of text) {
    const glyph = font.charToGlyph(char);
    const charWidth = (glyph.advanceWidth / font.unitsPerEm) * FONT_SIZE;

    if (char === ' ') {
      letters.push({ char: ' ', path: '', width: charWidth, x: xOffset });
      xOffset += charWidth;
      continue;
    }

    const p = font.getPath(char, xOffset, FONT_SIZE * 0.82, FONT_SIZE);
    const pathData = p.toPathData(2);

    letters.push({
      char,
      path: pathData,
      width: charWidth,
      x: xOffset,
    });

    xOffset += charWidth;
  }

  return { letters, totalWidth: xOffset };
}

const heroLines = [
  { text: 'GROWING', filled: true },
  { text: 'THE GAME.', filled: true },
  { text: 'BUILDING THE', filled: false },
  { text: 'NEXT GENERATION.', filled: false },
];

const result = {};

for (const line of heroLines) {
  const data = getLetterPaths(line.text);
  result[line.text] = {
    filled: line.filled,
    totalWidth: data.totalWidth,
    letters: data.letters,
  };
}

const output = `// Auto-generated SVG path data for hero text
// Font: Barlow Condensed Black, Size: ${FONT_SIZE}px
// Generated at: ${new Date().toISOString()}

export const HERO_TEXT_PATHS = ${JSON.stringify(result, null, 2)} as const;

export const FONT_SIZE = ${FONT_SIZE};
export const LINE_HEIGHT = ${FONT_SIZE * 0.86};
`;

const outPath = path.join(__dirname, '..', 'src', 'data', 'heroTextPaths.ts');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, output);
console.log('Written to ' + outPath);
console.log('Lines generated: ' + Object.keys(result).length);
for (const [text, data] of Object.entries(result)) {
  console.log('  "' + text + '" -> ' + data.letters.length + ' letters, width: ' + Math.round(data.totalWidth));
}
