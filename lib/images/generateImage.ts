import { HfInference } from "@huggingface/inference";
import fs from "fs";
import path from "path";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

interface GenerateImageOptions {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  outputPath?: string;
  fileName?: string;
}

export async function generateImage({
  prompt,
  negativePrompt = "blurry, low quality, distorted, ugly, bad anatomy, watermark, text, signature",
  width = 1024,
  height = 1024,
  outputPath = "./public/images",
  fileName = "generated-image",
}: GenerateImageOptions): Promise<string> {
  try {
    console.log(`Generating image with prompt: "${prompt}"`);

    const response = await hf.textToImage({
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt,
      parameters: {
        negative_prompt: negativePrompt,
        width,
        height,
        num_inference_steps: 25,
        guidance_scale: 7.5,
      },
    });

    // Ensure output directory exists
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath, { recursive: true });
    }

    // Convert blob to buffer
    const buffer = Buffer.from(await response.arrayBuffer());

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const finalFileName = `${fileName}-${timestamp}.webp`;
    const filePath = path.join(outputPath, finalFileName);

    // Write file
    fs.writeFileSync(filePath, buffer);

    console.log(`✅ Image generated successfully: ${filePath}`);
    return `/images/${finalFileName}`;

  } catch (error) {
    console.error("❌ Error generating image:", error);
    throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Predefined image generators for StructureClerk branding
export const generateHeroImage = () =>
  generateImage({
    prompt: "premium abstract AI admin assistant, elegant blue+green layers, glassmorphism, Canadian subtle sophistication, Linear/Vercel aesthetic, 3D refractions, minimalist, professional",
    fileName: "hero_unicorn",
    width: 1920,
    height: 1080,
  });

export const generateFeatureScanImage = () =>
  generateImage({
    prompt: "document intelligence, OCR scanning, precision data extraction, clean modern interface, blue accent colors, minimalist design, professional business technology",
    fileName: "feature_scan",
    width: 800,
    height: 600,
  });

export const generateFeatureAudioImage = () =>
  generateImage({
    prompt: "audio to actions visualization, waveform becoming tasks and todos, clean minimal design, green accent colors, modern productivity interface",
    fileName: "feature_audio",
    width: 800,
    height: 600,
  });

export const generateFeatureAutomationsImage = () =>
  generateImage({
    prompt: "automated workflows visualization, nodes and connectors, process automation, clean business diagram, blue and green colors, modern tech interface",
    fileName: "feature_automations",
    width: 800,
    height: 600,
  });

export const generateCanadaTrustImage = () =>
  generateImage({
    prompt: "subtle trust and compliance pattern, Canadian business professionalism, no clichés, clean minimalist design, light blue accents, corporate elegance",
    fileName: "canada_subtle",
    width: 400,
    height: 300,
  });