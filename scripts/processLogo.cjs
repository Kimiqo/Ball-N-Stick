const Jimp = require('jimp');
const potrace = require('potrace');
const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(__dirname, '../../logo.jpeg');
const outputPngPath = path.resolve(__dirname, '../public/logo_transparent.png');
const outputSvgPath = path.resolve(__dirname, '../public/logo_traced.svg');
const outputFaviconPath = path.resolve(__dirname, '../public/favicon.png');

async function processLogo() {
  console.log('Reading logo image...');
  const image = await Jimp.read(inputPath);
  
  // The background is a dark navy #080718 approx.
  // We'll iterate over every pixel. If it's dark, make it transparent.
  // If it's light (the text/emblem), keep it white.
  
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // Calculate brightness
    const brightness = (r + g + b) / 3;
    
    if (brightness < 100) {
      // Dark background -> transparent
      this.bitmap.data[idx + 3] = 0; // alpha to 0
    } else {
      // Light graphic -> make pure white and fully opaque
      this.bitmap.data[idx + 0] = 255;
      this.bitmap.data[idx + 1] = 255;
      this.bitmap.data[idx + 2] = 255;
      this.bitmap.data[idx + 3] = 255;
    }
  });

  console.log('Saving transparent PNG...');
  await image.writeAsync(outputPngPath);
  
  // Create a cropped version for Favicon (the circle emblem is roughly in the top half)
  // Let's just clone and crop
  const favicon = image.clone();
  // We need to find the bounding box of the circle or just crop a fixed area.
  // Looking at the logo, the circle is centered horizontally.
  // We can just crop a square from the top.
  const width = image.bitmap.width;
  const size = width * 0.7; // approximate size of the circle
  const x = (width - size) / 2;
  const y = image.bitmap.height * 0.1;
  favicon.crop(x, y, size, size);
  // resize to standard favicon size
  favicon.resize(64, 64);
  await favicon.writeAsync(outputFaviconPath);
  console.log('Favicon created.');

  // Now trace the transparent PNG to SVG
  console.log('Tracing SVG paths...');
  potrace.trace(outputPngPath, {
    color: '#F5F7FA',
    threshold: 120,
    optCurve: true,
    optTolerance: 0.2,
    turdSize: 100, // ignore small compression artifacts
  }, (err, svg) => {
    if (err) throw err;
    fs.writeFileSync(outputSvgPath, svg);
    console.log('SVG saved successfully!');
  });
}

processLogo().catch(console.error);
