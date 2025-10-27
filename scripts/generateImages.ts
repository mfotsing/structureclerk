#!/usr/bin/env tsx

import {
  generateHeroImage,
  generateFeatureScanImage,
  generateFeatureAudioImage,
  generateFeatureAutomationsImage,
  generateCanadaTrustImage,
} from "../lib/images/generateImage";

async function generateAllImages() {
  console.log("🎨 Starting image generation for StructureClerk...\n");

  try {
    // Generate hero image
    console.log("1️⃣ Generating hero image...");
    const heroPath = await generateHeroImage();
    console.log(`   ✅ Hero image saved to: ${heroPath}\n`);

    // Generate feature images
    console.log("2️⃣ Generating feature images...");

    const scanPath = await generateFeatureScanImage();
    console.log(`   ✅ Scan feature image saved to: ${scanPath}`);

    const audioPath = await generateFeatureAudioImage();
    console.log(`   ✅ Audio feature image saved to: ${audioPath}`);

    const automationsPath = await generateFeatureAutomationsImage();
    console.log(`   ✅ Automations feature image saved to: ${automationsPath}`);

    const trustPath = await generateCanadaTrustImage();
    console.log(`   ✅ Canada trust image saved to: ${trustPath}\n`);

    console.log("🎉 All images generated successfully!");
    console.log("📁 Images are available in the /public/images directory");

  } catch (error) {
    console.error("💥 Failed to generate images:", error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllImages();
}