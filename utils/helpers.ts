


/**
 * Rounds a number to a specified number of decimal places.
 * @param n The number to round.
 * @param d The number of decimal places.
 * @returns The rounded number.
 */
export const roundTo = (n: number, d: number): number => {
  const factor = Math.pow(10, d);
  return Math.round(n * factor) / factor;
};

/**
 * Generates a random floating-point number within a specified range.
 * @param min The minimum value of the range (inclusive).
 * @param max The maximum value of the range (exclusive).
 * @returns A random number between min and max.
 */
export const randRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Generates a random integer within a specified range.
 * @param min The minimum value of the range (inclusive).
 * @param max The maximum value of the range (inclusive).
 * @returns A random integer between min and max.
 */
export const randInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Picks a random element from an array.
 * @param arr The array to pick from.
 * @returns A randomly selected element from the array.
 */
export const pick = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Generates a simple unique ID string.
 * @param prefix An optional prefix for the ID.
 * @returns A string ID, e.g., "prefix-a1b2c3d".
 */
export const id = (prefix: string = ''): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Picks a random item from an array based on a 'peso' (weight) property.
 * Items with higher weights have a higher chance of being selected.
 * @param items An array of objects, where each object must have a `peso` number property.
 * @returns A randomly selected item from the array, biased by its weight.
 */
export const weightedPick = <T extends { peso: number }>(items: T[]): T => {
  if (!items || items.length === 0) {
    throw new Error("Cannot perform weighted pick from an empty or invalid array.");
  }

  // Filter out items with non-positive weights to avoid issues.
  const positiveWeightItems = items.filter(item => item.peso > 0);
  if (positiveWeightItems.length === 0) {
    // If no items have positive weight, return a random item from the original list as a fallback.
    return items[Math.floor(Math.random() * items.length)];
  }

  const totalWeight = positiveWeightItems.reduce((sum, item) => sum + item.peso, 0);
  let random = Math.random() * totalWeight;

  for (const item of positiveWeightItems) {
    random -= item.peso;
    if (random <= 0) {
      return item;
    }
  }
  
  // Fallback for floating point inaccuracies, returns the last item.
  return positiveWeightItems[positiveWeightItems.length - 1]; 
};