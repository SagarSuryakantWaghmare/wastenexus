/**
 * Google Gemini AI integration for waste classification
 * Provides AI-powered waste type detection and insights
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from './logger';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface WasteClassification {
  type: string;
  confidence: number;
  description: string;
  recyclable: boolean;
  suggestions: string[];
}

/**
 * Classifies waste from an image URL using Google Gemini AI
 * @param imageUrl - URL of the waste image to classify
 * @returns Waste classification result
 */
export async function classifyWaste(imageUrl: string): Promise<WasteClassification> {
  // Check if AI is configured
  if (!process.env.GEMINI_API_KEY) {
    logger.warn('Gemini API not configured, returning default classification');
    return getDefaultClassification();
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Analyze this waste image and provide a JSON response with the following structure:
{
  "type": "one of: plastic, cardboard, e-waste, metal, glass, organic, paper",
  "confidence": number between 0 and 1,
  "description": "brief description of the waste item",
  "recyclable": boolean,
  "suggestions": ["array of recycling suggestions"]
}

Be precise and only return valid JSON. If you cannot identify the waste type clearly, use the most likely category.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: await fetchImageAsBase64(imageUrl),
          mimeType: 'image/jpeg',
        },
      },
    ]);

    const response = result.response.text();
    
    // Extract JSON from response (remove markdown code blocks if present)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.error('Invalid AI response format', undefined, { response });
      return getDefaultClassification();
    }

    const classification: WasteClassification = JSON.parse(jsonMatch[0]);
    logger.info('Waste classified successfully', { type: classification.type, confidence: classification.confidence });
    return classification;
  } catch (error) {
    logger.error('Gemini classification error', error);
    return getDefaultClassification();
  }
}

/**
 * Fetches an image and converts it to base64
 * @param imageUrl - URL of the image to fetch
 * @returns Base64 encoded image data
 */
async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer).toString('base64');
  } catch (error) {
    logger.error('Failed to fetch image for AI classification', error, { imageUrl });
    throw new Error('Failed to fetch image');
  }
}

/**
 * Returns a default classification when AI is unavailable
 */
function getDefaultClassification(): WasteClassification {
  return {
    type: 'plastic',
    confidence: 0.5,
    description: 'Unable to classify automatically. Please verify manually.',
    recyclable: true,
    suggestions: ['Please ensure proper waste segregation'],
  };
}

/**
 * Generates insights based on waste report history
 * @param reports - Array of waste reports
 * @returns AI-generated insights
 */
export async function generateWasteInsights(reports: Array<{ type: string; weightKg: number }>): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    logger.warn('Gemini API not configured, skipping insights generation');
    return 'AI insights are currently unavailable. Please configure the Gemini API key.';
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const totalWeight = reports.reduce((sum, r) => sum + r.weightKg, 0);
    const typeBreakdown = reports.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + r.weightKg;
      return acc;
    }, {} as Record<string, number>);

    const prompt = `Based on the following waste data, provide 3 actionable insights for improving waste management:

Total Waste: ${totalWeight}kg
Breakdown by type: ${JSON.stringify(typeBreakdown)}

Provide insights in a concise, bullet-point format. Focus on environmental impact and improvement suggestions.`;

    const result = await model.generateContent(prompt);
    const insights = result.response.text();
    logger.info('Waste insights generated successfully');
    return insights;
  } catch (error) {
    logger.error('Gemini insights error', error);
    return 'Unable to generate insights at this time.';
  }
}
