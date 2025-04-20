import { 
  Allergy, 
  FoodItem, 
  Recipe,
  AllergenCheckResult,
  IngredientSubstitution,
  UserProfile,
  FamilyMember
} from '../types';

// Common allergens and their alternatives for substitution
const ALLERGEN_SUBSTITUTIONS: Record<string, string[]> = {
  'Milk': ['Almond milk', 'Soy milk', 'Oat milk', 'Coconut milk'],
  'Eggs': ['Applesauce', 'Mashed banana', 'Flax eggs', 'Silken tofu'],
  'Peanuts': ['Sunflower seed butter', 'Almond butter', 'Wow butter', 'Tahini'],
  'Tree nuts': ['Seeds', 'Roasted chickpeas', 'Coconut', 'Oats'],
  'Wheat': ['Rice flour', 'Almond flour', 'Oat flour', 'Coconut flour'],
  'Soy': ['Chickpeas', 'Lentils', 'Peas', 'Hemp seeds'],
  'Fish': ['Jackfruit', 'Hearts of palm', 'Tofu', 'Tempeh'],
  'Shellfish': ['Mushrooms', 'Jackfruit', 'Hearts of palm', 'Seitan'],
  'Sesame': ['Sunflower seeds', 'Poppy seeds', 'Hemp seeds', 'Flax seeds'],
  'Gluten': ['Rice', 'Quinoa', 'Buckwheat', 'Certified gluten-free oats'],
};

// Common nutritional values for ingredients (per 100g)
const NUTRITION_DATA: Record<string, { calories: number, protein: number, carbs: number, fat: number }> = {
  'Milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1 },
  'Almond milk': { calories: 15, protein: 0.5, carbs: 0.3, fat: 1.1 },
  'Eggs': { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  'Flour': { calories: 364, protein: 10, carbs: 76, fat: 1 },
  'Rice flour': { calories: 366, protein: 6, carbs: 80, fat: 1.4 },
  'Chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  'Beef': { calories: 250, protein: 26, carbs: 0, fat: 17 },
  'Apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  // Add more as needed
};

/**
 * Checks if an ingredient is safe for a given profile
 * @param ingredientName The ingredient to check
 * @param profile The user or family member profile
 * @returns Boolean indicating if the ingredient is safe
 */
export const isIngredientSafe = (
  ingredientName: string, 
  profile: UserProfile | FamilyMember | null
): boolean => {
  if (!profile || !profile.allergies || profile.allergies.length === 0) {
    return true;
  }
  
  const normalizedIngredient = ingredientName.toLowerCase().trim();
  
  // Check if ingredient directly matches any allergen names
  for (const allergy of profile.allergies) {
    if (normalizedIngredient.includes(allergy.name.toLowerCase())) {
      return false;
    }
    
    // Check against common alternative names for allergens
    // This is a simple implementation - could be expanded with a more comprehensive database
    if (allergy.name.toLowerCase() === 'milk' && 
        (normalizedIngredient.includes('dairy') || 
         normalizedIngredient.includes('lactose') || 
         normalizedIngredient.includes('cream') || 
         normalizedIngredient.includes('butter') || 
         normalizedIngredient.includes('cheese'))) {
      return false;
    }
    
    if (allergy.name.toLowerCase() === 'wheat' && 
        (normalizedIngredient.includes('gluten') || 
         normalizedIngredient.includes('flour') || 
         normalizedIngredient.includes('bread') || 
         normalizedIngredient.includes('pasta'))) {
      return false;
    }
    
    // Additional allergen checks can be added here
  }
  
  return true;
};

/**
 * Checks if a food item is safe for the given profile
 * @param foodItem The food item to check
 * @param profile The user or family member profile
 * @returns A detailed result of the allergen check
 */
export const checkIngredientSafety = (
  foodItem: FoodItem | string,
  profile: UserProfile | FamilyMember | null
): AllergenCheckResult => {
  if (!profile) {
    return { safe: true, allergies: [] };
  }
  
  const ingredientName = typeof foodItem === 'string' ? foodItem : foodItem.name;
  const allergensInFood = typeof foodItem === 'string' ? [] : (foodItem.allergens || []);
  const triggeredAllergies: Allergy[] = [];
  
  // Check if the ingredient name matches any allergies
  for (const allergy of profile.allergies) {
    // Direct match on ingredient name
    if (ingredientName.toLowerCase().includes(allergy.name.toLowerCase())) {
      triggeredAllergies.push(allergy);
      continue;
    }
    
    // Check allergens list if available
    if (allergensInFood.some(allergen => 
        allergen.toLowerCase() === allergy.name.toLowerCase())) {
      triggeredAllergies.push(allergy);
      continue;
    }
    
    // Check against common allergen terms
    // This could be expanded with a more comprehensive database
    if (allergy.name.toLowerCase() === 'milk' && 
        (ingredientName.toLowerCase().includes('dairy') || 
         ingredientName.toLowerCase().includes('lactose') ||
         ingredientName.toLowerCase().includes('whey'))) {
      triggeredAllergies.push(allergy);
    }
  }
  
  // Get alternatives for any found allergens
  let alternatives: string[] = [];
  if (triggeredAllergies.length > 0) {
    for (const allergy of triggeredAllergies) {
      const subs = ALLERGEN_SUBSTITUTIONS[allergy.name];
      if (subs) {
        alternatives = [...alternatives, ...subs];
      }
    }
    // Remove duplicates
    alternatives = [...new Set(alternatives)];
  }
  
  return {
    safe: triggeredAllergies.length === 0,
    allergies: triggeredAllergies,
    alternatives: alternatives.length > 0 ? alternatives : undefined
  };
};

/**
 * Find suitable substitutions for an allergenic ingredient
 * @param ingredient The allergenic ingredient
 * @param profile The user or family member profile with allergies
 * @returns List of substitution options
 */
export const findIngredientSubstitutions = (
  ingredient: string,
  profile: UserProfile | FamilyMember | null
): IngredientSubstitution[] => {
  if (!profile) {
    return [];
  }
  
  const substitutions: IngredientSubstitution[] = [];
  const normalizedIngredient = ingredient.toLowerCase().trim();
  
  // Check which allergen category this ingredient might belong to
  for (const allergyName of Object.keys(ALLERGEN_SUBSTITUTIONS)) {
    // Check if ingredient matches the allergen or contains it
    if (
      normalizedIngredient === allergyName.toLowerCase() ||
      normalizedIngredient.includes(allergyName.toLowerCase())
    ) {
      // Get substitutes for this allergen
      const alternatives = ALLERGEN_SUBSTITUTIONS[allergyName];
      
      // Check if the substitutes are safe for this profile
      for (const alternative of alternatives) {
        if (isIngredientSafe(alternative, profile)) {
          // Add to substitutions if safe
          substitutions.push({
            original: ingredient,
            substitute: alternative,
            ratio: '1:1', // Default ratio
            notes: `Safe alternative for ${allergyName}`
          });
        }
      }
    }
  }
  
  // Handle special cases with different ratios
  if (normalizedIngredient === 'eggs' || normalizedIngredient.includes('egg')) {
    substitutions.push({
      original: ingredient,
      substitute: 'Flax eggs (1 tbsp ground flax + 3 tbsp water)',
      ratio: '1 egg : 1 flax egg',
      notes: 'Let sit for 5 minutes before using'
    });
    
    substitutions.push({
      original: ingredient,
      substitute: 'Applesauce',
      ratio: '1 egg : 1/4 cup',
      notes: 'Best for moist baked goods'
    });
  }
  
  return substitutions;
};

/**
 * Suggests recipes based on the current inventory and user profile
 * @param inventory Available food items
 * @param recipes All available recipes
 * @param profile Current user or family member profile
 * @returns Array of recommended recipes
 */
export const suggestRecipes = (
  inventory: FoodItem[] = [],
  recipes: Recipe[] = [],
  profile: UserProfile | FamilyMember | null = null
): Recipe[] => {
  if (recipes.length === 0) {
    return [];
  }
  
  // Filter for safe recipes based on allergies
  const safeRecipes = profile 
    ? recipes.filter(recipe => {
        // Check if any recipe allergen matches profile allergies
        if (profile.allergies.length === 0) return true;
        
        for (const allergen of recipe.allergens) {
          for (const allergy of profile.allergies) {
            if (allergen.toLowerCase() === allergy.name.toLowerCase()) {
              return false;
            }
          }
        }
        return true;
      })
    : [...recipes];
  
  // If we have inventory, prioritize recipes that use available ingredients
  if (inventory.length > 0) {
    // Get all ingredient names from inventory
    const availableIngredients = inventory.map(item => 
      item.name.toLowerCase());
    
    // Score recipes based on how many ingredients are available
    const scoredRecipes = safeRecipes.map(recipe => {
      // Count how many recipe ingredients are in inventory
      let matchCount = 0;
      for (const ingredient of recipe.ingredients) {
        if (availableIngredients.some(avail => 
            ingredient.toLowerCase().includes(avail))) {
          matchCount++;
        }
      }
      
      // Calculate a match percentage
      const matchPercentage = recipe.ingredients.length > 0 
        ? (matchCount / recipe.ingredients.length) * 100 
        : 0;
        
      return {
        recipe,
        matchPercentage
      };
    });
    
    // Sort by match percentage (highest first)
    scoredRecipes.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    // Return recipes, sorted by best match
    return scoredRecipes.map(item => item.recipe);
  }
  
  // If no inventory or if all recipes have been filtered out
  return safeRecipes;
};

/**
 * Calculates nutrition information for a recipe
 * @param recipe The recipe to calculate nutrition for
 * @returns Basic nutrition facts or undefined if calculation isn't possible
 */
export const calculateNutritionInfo = (recipe: Recipe) => {
  // This is a simplified version - a real app would use a more comprehensive database
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let countedIngredients = 0;
  
  for (const ingredient of recipe.ingredients) {
    // Try to match ingredient with our simple database
    for (const [key, data] of Object.entries(NUTRITION_DATA)) {
      if (ingredient.toLowerCase().includes(key.toLowerCase())) {
        totalCalories += data.calories;
        totalProtein += data.protein;
        totalCarbs += data.carbs;
        totalFat += data.fat;
        countedIngredients++;
        break; // Only count each ingredient once
      }
    }
  }
  
  // Only return data if we could calculate for at least some ingredients
  if (countedIngredients > 0) {
    return {
      calories: Math.round(totalCalories / recipe.servings),
      protein: Math.round(totalProtein / recipe.servings),
      carbs: Math.round(totalCarbs / recipe.servings),
      fat: Math.round(totalFat / recipe.servings),
      approximation: true // Flag that this is an approximation
    };
  }
  
  return undefined;
};

/**
 * Generate shopping list from recipes
 * @param recipes List of recipes to generate shopping list from
 * @param inventory Current inventory to check against
 * @returns List of items needed for recipes
 */
export const generateGroceryList = (
  recipes: Recipe[],
  inventory: FoodItem[] = []
): FoodItem[] => {
  const groceryMap = new Map<string, FoodItem>();
  
  // Process all ingredients from all recipes
  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredientText => {
      // Extract quantity, unit and ingredient name using regex
      // This is a simple implementation - a real app would use more sophisticated parsing
      const match = ingredientText.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?\s+(.+)/);
      
      if (match) {
        const [, quantityStr, unit = "", name] = match;
        const quantity = parseFloat(quantityStr);
        
        // Normalize name for comparison
        const normalizedName = name.trim().toLowerCase();
        
        // Check if we already have this ingredient
        if (groceryMap.has(normalizedName)) {
          // Update quantity if already in list
          const existing = groceryMap.get(normalizedName)!;
          groceryMap.set(normalizedName, {
            ...existing,
            quantity: existing.quantity + quantity
          });
        } else {
          // Create new entry
          groceryMap.set(normalizedName, {
            id: crypto.randomUUID(),
            name: name.trim(),
            quantity: quantity,
            unit: unit || "unit",
            expiryDate: "", // Empty as this is a grocery item
            category: "ingredient",
            inInventory: false
          });
        }
      } else {
        // Fallback for ingredients that don't match the pattern
        groceryMap.set(ingredientText.toLowerCase(), {
          id: crypto.randomUUID(),
          name: ingredientText,
          quantity: 1,
          unit: "unit",
          expiryDate: "",
          category: "ingredient",
          inInventory: false
        });
      }
    });
  });
  
  // Check against inventory
  inventory.forEach(item => {
    const normalizedName = item.name.toLowerCase();
    
    if (groceryMap.has(normalizedName)) {
      const groceryItem = groceryMap.get(normalizedName)!;
      
      // If we have enough in inventory, remove from grocery list
      if (item.quantity >= groceryItem.quantity) {
        groceryMap.delete(normalizedName);
      } else {
        // Otherwise reduce the required quantity
        groceryMap.set(normalizedName, {
          ...groceryItem,
          quantity: groceryItem.quantity - item.quantity
        });
      }
    }
  });
  
  // Convert map back to array
  return Array.from(groceryMap.values());
};

export default {
  isIngredientSafe,
  checkIngredientSafety,
  findIngredientSubstitutions,
  suggestRecipes,
  calculateNutritionInfo,
  generateGroceryList
};
