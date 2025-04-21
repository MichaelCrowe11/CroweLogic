import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Process the logo to remove white background and create versions for different backgrounds
async function removeBackground(inputPath, outputPath) {
  try {
    console.log(`Processing ${inputPath} to ${outputPath}`);
    
    // Get image metadata to preserve original dimensions
    const metadata = await sharp(inputPath).metadata();
    
    // Remove white background by making it transparent
    // Ensure the full circular shape is preserved
    await sharp(inputPath)
      .ensureAlpha() // Ensure alpha channel
      .png() // Convert to PNG for transparency support
      .toFile(outputPath);
      
    console.log(`Successfully created ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error);
    return false;
  }
}

// Create a black version of the logo with transparent background
async function createBlackVersion(inputPath, outputPath) {
  try {
    console.log(`Creating black version from ${inputPath} to ${outputPath}`);
    
    // Get image metadata to preserve original dimensions
    const metadata = await sharp(inputPath).metadata();
    
    // Extract alpha channel and create black version with proper dimensions
    await sharp(inputPath)
      .ensureAlpha() // Make sure we have an alpha channel
      .tint({ r: 0, g: 0, b: 0 }) // Tint the image black
      .png() // Save as PNG for transparency
      .toFile(outputPath);
      
    console.log(`Successfully created black version at ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Error creating black version of ${inputPath}:`, error);
    return false;
  }
}

// Create a white version of the logo with transparent background
async function createWhiteVersion(inputPath, outputPath) {
  try {
    console.log(`Creating white version from ${inputPath} to ${outputPath}`);
    
    // Get image metadata to preserve original dimensions
    const metadata = await sharp(inputPath).metadata();
    
    // Create white version with proper dimensions
    await sharp(inputPath)
      .ensureAlpha() // Make sure we have an alpha channel
      .negate({ alpha: false }) // Negate colors but not alpha
      .tint({ r: 255, g: 255, b: 255 }) // Ensure it's pure white
      .png() // Save as PNG for transparency
      .toFile(outputPath);
      
    console.log(`Successfully created white version at ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Error creating white version of ${inputPath}:`, error);
    return false;
  }
}

// Create a color version of the logo with transparent background
async function createColorVersion(inputPath, outputPath) {
  try {
    console.log(`Creating color version from ${inputPath} to ${outputPath}`);
    
    // Get image metadata to preserve original dimensions
    const metadata = await sharp(inputPath).metadata();
    
    // Just ensure alpha channel and preserve original colors
    await sharp(inputPath)
      .ensureAlpha() // Make sure we have an alpha channel
      .png() // Save as PNG for transparency
      .toFile(outputPath);
      
    console.log(`Successfully created color version at ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Error creating color version of ${inputPath}:`, error);
    return false;
  }
}

// Create a favicon from the logo
async function createFavicon(inputPath, outputPath) {
  try {
    console.log(`Creating favicon from ${inputPath} to ${outputPath}`);
    
    // Create a favicon (32x32 pixels)
    await sharp(inputPath)
      .resize(32, 32)
      .ensureAlpha()
      .png()
      .toFile(outputPath);
      
    console.log(`Successfully created favicon at ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Error creating favicon of ${inputPath}:`, error);
    return false;
  }
}

async function main() {
  // Ensure directories exist
  const outputDir = path.join(__dirname, '../public/images');
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Process the Crowe Logic logo
  const croweLogoInput = path.join(__dirname, '../attached_assets/logo.png');
  const processedLogo = path.join(__dirname, '../processed_assets/processed-logo.png');
  const colorLogo = path.join(outputDir, 'crowe-logo-color.png');
  const blackLogo = path.join(outputDir, 'crowe-logo-black.png');
  const whiteLogo = path.join(outputDir, 'crowe-logo-white.png');
  const favicon = path.join(publicDir, 'favicon.png');
  
  // Process Southwest Mushrooms logo
  const swLogoInput = path.join(__dirname, '../attached_assets/southwest-mushrooms-logo.png');
  const processedSWLogo = path.join(__dirname, '../processed_assets/processed-sw-logo.png');
  const colorSWLogo = path.join(outputDir, 'sw-logo-color.png');
  const blackSWLogo = path.join(outputDir, 'sw-logo-black.png');
  const whiteSWLogo = path.join(outputDir, 'sw-logo-white.png');
  
  // First remove backgrounds
  await removeBackground(croweLogoInput, processedLogo);
  await removeBackground(swLogoInput, processedSWLogo);
  
  // Create color versions
  await createColorVersion(processedLogo, colorLogo);
  await createColorVersion(processedSWLogo, colorSWLogo);
  
  // Also create black and white versions
  await createBlackVersion(processedLogo, blackLogo);
  await createWhiteVersion(processedLogo, whiteLogo);
  await createBlackVersion(processedSWLogo, blackSWLogo);
  await createWhiteVersion(processedSWLogo, whiteSWLogo);
  
  // Create favicon
  await createFavicon(colorLogo, favicon);
  
  // Copy the original files to public too
  fs.copyFileSync(croweLogoInput, path.join(outputDir, 'crowe-logo-original.png'));
  fs.copyFileSync(swLogoInput, path.join(outputDir, 'sw-logo-original.png'));
  
  console.log('Logo processing complete!');
}

main().catch(console.error);