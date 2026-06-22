/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'images');
const files = fs.readdirSync(imagesDir).filter(f => f.includes('category') && f.endsWith('.png'));

async function compress() {
  for (const file of files) {
    const inputPath = path.join(imagesDir, file);
    const stat = fs.statSync(inputPath);
    const originalSize = stat.size;
    
    const tempPath = inputPath + '.tmp';
    
    await sharp(inputPath)
      .resize(400, 400, { fit: 'cover' })
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(tempPath);
    
    const compressedSize = fs.statSync(tempPath).size;
    fs.renameSync(tempPath, inputPath);
    
    console.log(`${file}: ${(originalSize / 1024).toFixed(1)}KB → ${(compressedSize / 1024).toFixed(1)}KB (${Math.round((1 - compressedSize / originalSize) * 100)}% smaller)`);
  }
  
  // Also compress other large images
  const otherImages = ['hero-model.png', 'about-story.png'];
  for (const file of otherImages) {
    const inputPath = path.join(imagesDir, file);
    if (!fs.existsSync(inputPath)) continue;
    const stat = fs.statSync(inputPath);
    const originalSize = stat.size;
    
    const tempPath = inputPath + '.tmp';
    await sharp(inputPath)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(tempPath);
    
    const compressedSize = fs.statSync(tempPath).size;
    fs.renameSync(tempPath, inputPath);
    
    console.log(`${file}: ${(originalSize / 1024).toFixed(1)}KB → ${(compressedSize / 1024).toFixed(1)}KB (${Math.round((1 - compressedSize / originalSize) * 100)}% smaller)`);
  }
  
  console.log('\n✅ All images compressed!');
}

compress().catch(console.error);
