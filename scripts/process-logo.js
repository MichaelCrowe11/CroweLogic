import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processLogo() {
  try {
    // Input path to the original logo
    const inputPath = path.join(__dirname, '../attached_assets/logo.png');
    // Output path for the processed logo
    const outputPath = path.join(__dirname, '../public/images/crowe-logo-processed.png');
    
    // Process the image
    await sharp(inputPath)
      // Extract alpha channel based on white background
      .extractChannel('alpha')
      // Make it black with transparency
      .composite([{
        input: {
          create: {
            width: 300, // Adjust width as needed
            height: 300, // Adjust height as needed
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 1 }
          }
        },
        blend: 'atop'
      }])
      .png()
      .toFile(outputPath);
    
    console.log(`Logo processed successfully and saved to ${outputPath}`);
  } catch (error) {
    console.error('Error processing logo:', error);
  }
}

// Create a simpler fixed logo as a backup
async function createFixedLogo() {
  try {
    // Create a simple circular logo with the text "CL"
    const outputPath = path.join(__dirname, '../public/images/crowe-logo-fixed.png');
    
    // Create a transparent background
    const width = 200;
    const height = 200;
    
    // Create a circle with dark background
    await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([
        {
          input: Buffer.from(`
            <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
              <circle cx="${width/2}" cy="${height/2}" r="${width/2-2}" fill="black" />
              <text x="${width/2}" y="${height/2+15}" font-family="Arial" font-size="80" font-weight="bold" fill="white" text-anchor="middle">CL</text>
            </svg>
          `),
          gravity: 'center'
        }
      ])
      .png()
      .toFile(outputPath);
    
    console.log(`Fixed logo created successfully and saved to ${outputPath}`);
  } catch (error) {
    console.error('Error creating fixed logo:', error);
  }
}

// Run both logo processing methods
async function main() {
  await processLogo();
  await createFixedLogo();
}

main();