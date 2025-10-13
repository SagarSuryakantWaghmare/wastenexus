// Simple fallback waste analysis function
export async function analyzeWasteImage(imageBase64: string) {
  // For demo purposes, we'll return mock data
  // In a real app, you would call the Gemini API here
  
  // Mock waste types and their properties
  const wasteTypes = [
    {
      type: 'plastic',
      recyclability: 70,
      description: 'Plastic waste that can be recycled at local facilities.',
      quantity: Math.max(0.1, Math.random() * 5).toFixed(1) // Random quantity between 0.1 and 5kg
    },
    {
      type: 'paper',
      recyclability: 90,
      description: 'Paper waste that is highly recyclable.',
      quantity: Math.max(0.1, Math.random() * 3).toFixed(1)
    },
    {
      type: 'metal',
      recyclability: 85,
      description: 'Metal items that can be recycled for materials.',
      quantity: Math.max(0.1, Math.random() * 10).toFixed(1)
    },
    {
      type: 'glass',
      recyclability: 95,
      description: 'Glass materials that are 100% recyclable.',
      quantity: Math.max(0.1, Math.random() * 2).toFixed(1)
    },
    {
      type: 'organic',
      recyclability: 40,
      description: 'Organic waste suitable for composting.',
      quantity: Math.max(0.1, Math.random() * 8).toFixed(1)
    },
    {
      type: 'electronic',
      recyclability: 60,
      description: 'E-waste that requires special recycling.',
      quantity: Math.max(0.1, Math.random() * 15).toFixed(1)
    },
    {
      type: 'mixed',
      recyclability: 30,
      description: 'Mixed waste that needs to be sorted.',
      quantity: Math.max(0.1, Math.random() * 7).toFixed(1)
    }
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a random waste type for demo purposes
  const randomWaste = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
  
  return {
    wasteType: randomWaste.type,
    quantity: parseFloat(randomWaste.quantity),
    recyclability: randomWaste.recyclability,
    description: randomWaste.description
  };
}

// Simple marketplace item analysis
export async function analyzeMarketplaceItem(imageBase64: string, title: string, description: string) {
  // Mock data for demo purposes
  const reuseOptions = [
    {
      reuseability: 'This item is in good condition and can be reused.',
      suggestions: [
        'Donate to local charity',
        'Sell on online marketplace',
        'Repurpose for a different use',
        'Offer for free in local community groups'
      ],
      estimatedValue: 150
    },
    {
      reuseability: 'Item shows signs of wear but is still functional.',
      suggestions: [
        'Repair and continue using',
        'Upcycle into something new',
        'Donate to organizations that accept used items',
        'List for free in local exchange groups'
      ],
      estimatedValue: 80
    },
    {
      reuseability: 'Item is in excellent condition and highly reusable.',
      suggestions: [
        'Sell on second-hand platforms',
        'Donate to schools or community centers',
        'Use as a gift',
        'Exchange with friends or family'
      ],
      estimatedValue: 250
    }
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return a random reuse option for demo
  return reuseOptions[Math.floor(Math.random() * reuseOptions.length)];
}

export function calculateImpact(wasteType: string, quantity: number) {
  // Simple impact calculation formulas
  const impactFactors: Record<string, { co2: number; trees: number; water: number }> = {
    plastic: { co2: 2.5, trees: 0.01, water: 5 },
    organic: { co2: 0.5, trees: 0.005, water: 2 },
    electronic: { co2: 15, trees: 0.05, water: 50 },
    metal: { co2: 8, trees: 0.03, water: 20 },
    paper: { co2: 1.5, trees: 0.02, water: 10 },
    glass: { co2: 0.8, trees: 0.008, water: 3 },
    mixed: { co2: 3, trees: 0.015, water: 8 },
  };

  const factors = impactFactors[wasteType.toLowerCase()] || impactFactors.mixed;

  return {
    co2Saved: Math.round(quantity * factors.co2 * 10) / 10,
    treesEquivalent: Math.round(quantity * factors.trees * 100) / 100,
    waterSaved: Math.round(quantity * factors.water * 10) / 10,
  };
}
