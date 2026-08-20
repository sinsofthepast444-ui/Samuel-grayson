import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { createCanvas } from '@napi-rs/canvas';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const jobs = [
  ['assets/drawings/j-cole_portrait.pdf', 'assets/drawings/j-cole_portrait_preview.png'],
  ['assets/drawings/red_heart.pdf', 'assets/drawings/red_heart_preview.png'],
  ['assets/drawings/old_man_with_beard.pdf', 'assets/drawings/old_man_with_beard_preview.png'],
];

for (const [source, target] of jobs) {
  const data = new Uint8Array(fs.readFileSync(source));
  const document = await pdfjsLib.getDocument({ data, disableWorker: true }).promise;
  const page = await document.getPage(1);
  const viewport = page.getViewport({ scale: 2.5 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const context = canvas.getContext('2d');

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({ canvasContext: context, viewport }).promise;

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, canvas.toBuffer('image/png'));
  console.log(`${source} -> ${target}`);
}

process.exit(0);
