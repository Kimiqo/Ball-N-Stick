const MAX_INPUT_BYTES = 30 * 1024 * 1024;
export const MAX_UPLOAD_BYTES = 1024 * 1024;
const TARGET_BYTES = 500 * 1024;
const MAX_EDGE = 1920;

function encode(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob(
    blob => blob ? resolve(blob) : reject(new Error('Could not compress this image. Please export it as JPEG or WebP and try again.')),
    'image/webp', quality,
  ));
}

// Preserve animation rather than silently turning it into a still image.
async function isAnimated(file: File) {
  if (file.type === 'image/gif') return true;
  if (!['image/png', 'image/webp'].includes(file.type)) return false;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const view = new DataView(bytes.buffer);
  const png = file.type === 'image/png';
  for (let offset = png ? 8 : 12; offset + 8 <= bytes.length;) {
    const typeOffset = png ? offset + 4 : offset;
    const type = String.fromCharCode(...bytes.subarray(typeOffset, typeOffset + 4));
    if (type === 'acTL' || type === 'ANIM') return true;
    const length = view.getUint32(png ? offset : offset + 4, !png);
    offset += png ? length + 12 : length + 8 + (length % 2);
  }
  return false;
}

export async function compressImage(file: File): Promise<File> {
  if (!file.size) throw new Error('This image file is empty.');
  if (file.size > MAX_INPUT_BYTES) throw new Error('Choose an image smaller than 30 MB before compression.');
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'].includes(file.type)) {
    throw new Error('Use a JPEG, PNG, WebP, GIF or SVG image. Export HEIC photos as JPEG first.');
  }
  if (file.type === 'image/svg+xml' || await isAnimated(file)) {
    if (file.size > MAX_UPLOAD_BYTES) throw new Error('Animated images and SVGs must be under 1 MB. Please optimise this file before uploading.');
    return file;
  }

  let bitmap: ImageBitmap;
  try { bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
  catch { throw new Error('This image could not be read. Please export it as JPEG or PNG and try again.'); }
  const canvas = document.createElement('canvas');
  try {
    if (bitmap.width * bitmap.height > 50_000_000) throw new Error('This image exceeds 50 megapixels. Resize it before uploading.');
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Image compression is unavailable in this browser. Please use a current browser.');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    let result = await encode(canvas, 0.82);
    for (const quality of [0.74, 0.66]) {
      if (result.size <= TARGET_BYTES) break;
      const candidate = await encode(canvas, quality);
      if (candidate.size < result.size) result = candidate;
    }
    // Avoid degrading already efficient images or making files bigger.
    if (file.size <= result.size && file.size <= MAX_UPLOAD_BYTES) return file;
    if (result.size > MAX_UPLOAD_BYTES) throw new Error('This image is still over 1 MB after compression. Please resize it or export at a lower quality.');
    const extension = result.type === 'image/webp' ? 'webp' : 'png';
    return new File([result], `${file.name.replace(/\.[^.]+$/, '')}.${extension}`, { type: result.type });
  } finally {
    bitmap.close();
    canvas.width = 0;
    canvas.height = 0;
  }
}
