/**
 * Helper utilities for the WasteNexus application
 * Provides point calculation, reward tier determination, and date formatting
 */

/**
 * Calculate points based on waste weight and type
 * Base rate: 10 points per kg with multipliers for specific waste types
 * 
 * @param weightKg - Weight of waste in kilograms
 * @param wasteType - Type of waste (plastic, cardboard, e-waste, etc.)
 * @returns Calculated points
 * 
 * @example
 * calculatePoints(5, 'plastic') // Returns 75 (5kg * 10 * 1.5)
 * calculatePoints(2, 'e-waste') // Returns 40 (2kg * 10 * 2.0)
 */
export function calculatePoints(weightKg: number, wasteType: string): number {
  const basePointsPerKg = 10;
  let multiplier = 1;

  // Bonus points for harder-to-recycle materials
  const bonusMultipliers: Record<string, number> = {
    'e-waste': 2.0,     // 20 points per kg
    'plastic': 1.5,     // 15 points per kg
    'metal': 1.3,       // 13 points per kg
    'glass': 1.2,       // 12 points per kg
    'cardboard': 1.0,   // 10 points per kg
    'paper': 1.0,       // 10 points per kg
    'organic': 0.8,     // 8 points per kg
  };

  multiplier = bonusMultipliers[wasteType.toLowerCase()] || 1;

  return Math.round(weightKg * basePointsPerKg * multiplier);
}

/**
 * Determine reward tier based on total points
 * Tiers range from Beginner (0-499) to Diamond (10,000+)
 * 
 * @param totalPoints - User's total accumulated points
 * @returns Object containing tier name, badge emoji, and color class
 * 
 * @example
 * getRewardTier(750) // Returns { tier: 'Bronze', badge: '🥉', color: 'text-green-300' }
 */
export function getRewardTier(totalPoints: number): {
  tier: string;
  badge: string;
  color: string;
} {
  if (totalPoints >= 10000) {
    return { tier: 'Diamond', badge: '💎', color: 'text-green-700' };
  } else if (totalPoints >= 5000) {
    return { tier: 'Platinum', badge: '🏆', color: 'text-green-600' };
  } else if (totalPoints >= 2500) {
    return { tier: 'Gold', badge: '🥇', color: 'text-green-500' };
  } else if (totalPoints >= 1000) {
    return { tier: 'Silver', badge: '🥈', color: 'text-green-400' };
  } else if (totalPoints >= 500) {
    return { tier: 'Bronze', badge: '🥉', color: 'text-green-300' };
  } else {
    return { tier: 'Beginner', badge: '🌱', color: 'text-green-200' };
  }
}

/**
 * Format date for display in a user-friendly format
 * 
 * @param date - Date to format
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 * 
 * @example
 * formatDate(new Date('2024-01-15')) // Returns "Jan 15, 2024"
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Format date with time for detailed display
 * 
 * @param date - Date to format
 * @returns Formatted date and time string (e.g., "Jan 15, 2024, 02:30 PM")
 * 
 * @example
 * formatDateTime(new Date('2024-01-15T14:30:00')) // Returns "Jan 15, 2024, 02:30 PM"
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
