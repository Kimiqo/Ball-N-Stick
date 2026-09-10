const potrace = require('potrace');
const fs = require('fs');

const inputPath = process.argv[2];
const outputPath = process.argv[3];

potrace.trace(inputPath, {
  color: '#F5F7FA',
  threshold: 120,
  optCurve: true,
  optTolerance: 0.2,
  turdSize: 100,
}, (err, svg) => {
  if (err) throw err;
  fs.writeFileSync(outputPath, svg);
  console.log('SVG saved successfully!');
});
