import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function removeBackground(inputPath, outputPath) {
  try {
    console.log(`Processing ${inputPath} to remove background...`);
    
    // Read the input image
    const imageBuffer = await sharp(inputPath)
      // Extract alpha channel (if present) or convert white to transparent
      .ensureAlpha()
      // Make white pixels transparent (adjust threshold as needed)
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    const { data, info } = imageBuffer;
    const { width, height, channels } = info;
    
    // Process the raw pixel data to make white background transparent
    for (let i = 0; i < data.length; i += channels) {
      // If pixel is close to white (adjust thresholds as needed)
      if (data[i] > 240 && data[i + 1] > 240 && data[i + 2] > 240) {
        // Set alpha channel to transparent
        data[i + 3] = 0;
      }
    }
    
    // Convert back to image format
    await sharp(data, {
      raw: {
        width,
        height,
        channels
      }
    })
    .png()
    .toFile(outputPath);
    
    console.log(`Successfully saved to ${outputPath}`);
    return true;
  } catch (error) {
    console.error('Error removing background:', error);
    return false;
  }
}

async function main() {
  const inputPath = path.join(__dirname, '../public/images/brand/crowe-logic-formulations.png');
  const outputPath = path.join(__dirname, '../public/images/brand/crowe-logic-transparent.png');
  
  await removeBackground(inputPath, outputPath);
}

main().catch(console.error);