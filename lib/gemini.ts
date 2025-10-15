import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface WasteClassification {
  type: string;
  confidence: number;
  description: string;
  recyclable: boolean;
  suggestions: string[];
}

export async function classifyWaste(imageUrl: string): Promise<WasteClassification> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
      throw new Error('Invalid response from AI');
    }

    const classification: WasteClassification = JSON.parse(jsonMatch[0]);
    return classification;
  } catch (error) {
    console.error('Gemini classification error:', error);
    
    // Return a default classification if AI fails
    return {
      type: 'plastic',
      confidence: 0.5,
      description: 'Unable to classify automatically. Please verify manually.',
      recyclable: true,
      suggestions: ['Please ensure proper waste segregation'],
    };
  }
}

async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

export async function generateWasteInsights(reports: Array<{ type: string; weightKg: number }>): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
    return result.response.text();
  } catch (error) {
    console.error('Gemini insights error:', error);
    return 'Unable to generate insights at this time.';
  }
}
