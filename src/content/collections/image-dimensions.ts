// Reads width/height from PNG, JPEG, WebP, and AVIF headers without decoding
// the image or loading sharp, so tests and checks run anywhere (CI included).

export type ImageFormat = 'png' | 'jpeg' | 'webp' | 'avif';

export interface ImageDimensions {
  format: ImageFormat;
  width: number;
  height: number;
}

const ascii = (bytes: Uint8Array, start: number, length: number) =>
  String.fromCharCode(...bytes.subarray(start, start + length));

function png(bytes: Uint8Array, view: DataView): ImageDimensions | undefined {
  if (bytes[0] !== 0x89 || ascii(bytes, 1, 3) !== 'PNG') return undefined;
  return { format: 'png', width: view.getUint32(16), height: view.getUint32(20) };
}

// Start-of-frame markers carry the dimensions (baseline, progressive, lossless, ...).
const SOF = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);

function jpeg(bytes: Uint8Array, view: DataView): ImageDimensions | undefined {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return undefined;
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) return undefined;
    const marker = bytes[offset + 1];
    if (marker === 0xff) {
      offset += 1; // fill byte
      continue;
    }
    if (SOF.has(marker)) {
      return { format: 'jpeg', height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
    }
    offset += 2 + view.getUint16(offset + 2);
  }
  return undefined;
}

function webp(bytes: Uint8Array, view: DataView): ImageDimensions | undefined {
  if (ascii(bytes, 0, 4) !== 'RIFF' || ascii(bytes, 8, 4) !== 'WEBP') return undefined;
  const chunk = ascii(bytes, 12, 4);
  if (chunk === 'VP8 ') {
    return {
      format: 'webp',
      width: view.getUint16(26, true) & 0x3fff,
      height: view.getUint16(28, true) & 0x3fff,
    };
  }
  if (chunk === 'VP8L') {
    const [b0, b1, b2, b3] = bytes.subarray(21, 25);
    return {
      format: 'webp',
      width: 1 + (((b1 & 0x3f) << 8) | b0),
      height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
    };
  }
  if (chunk === 'VP8X') {
    const u24 = (at: number) => bytes[at] | (bytes[at + 1] << 8) | (bytes[at + 2] << 16);
    return { format: 'webp', width: 1 + u24(24), height: 1 + u24(27) };
  }
  return undefined;
}

function avif(bytes: Uint8Array, view: DataView): ImageDimensions | undefined {
  if (ascii(bytes, 4, 4) !== 'ftyp' || !['avif', 'avis'].includes(ascii(bytes, 8, 4))) return undefined;
  // First 'ispe' (image spatial extents) property: version/flags, then width, height.
  for (let offset = 12; offset + 16 <= bytes.length; offset += 1) {
    if (ascii(bytes, offset, 4) === 'ispe') {
      return { format: 'avif', width: view.getUint32(offset + 8), height: view.getUint32(offset + 12) };
    }
  }
  return undefined;
}

export function imageDimensions(bytes: Uint8Array): ImageDimensions | undefined {
  if (bytes.length < 30) return undefined;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return png(bytes, view) ?? jpeg(bytes, view) ?? webp(bytes, view) ?? avif(bytes, view);
}
