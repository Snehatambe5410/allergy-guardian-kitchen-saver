
import { Recipe } from "@/types";
import { importSampleRecipe, sampleRecipes } from "@/data/sampleRecipes";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

export const fetchSampleRecipes = async (): Promise<Recipe[]> => {
  // Return the sample recipes directly, converted to Recipe type with ID
  return sampleRecipes.map(sampleRecipe => importSampleRecipe(sampleRecipe));
};

// We're now using the local storage approach for user recipes
export const importSampleRecipeToUserCollection = async (recipe: Recipe): Promise<Recipe> => {
  try {
    // First check if user is authenticated
    const { data: userData } = await supabase.auth.getUser();
    
    // Create a new recipe with a unique ID
    const importedRecipe = {
      ...recipe,
      id: uuidv4()
    };
    
    // If authenticated, store the recipe in our local collection
    if (userData.user) {
      // We would normally save to Supabase here, but since we're using a local array
      // in recipeService.ts, we'll just return the imported recipe with a new ID
      console.log("Recipe would be imported for user:", userData.user.id);
    }

    return importedRecipe;
  } catch (error) {
    console.error("Error in importSampleRecipeToUserCollection:", error);
    // Fallback to local handling
    return {
      ...recipe,
      id: uuidv4()
    };
  }
};

export const searchSampleRecipes = (
  query: string,
  cuisineFilter?: string[],
  allergenFilter?: string[],
  maxPrepTime?: number
): Recipe[] => {
  let filteredRecipes = sampleRecipes.map(sampleRecipe => importSampleRecipe(sampleRecipe));
  
  // Apply search query
  if (query && query.trim() !== '') {
    const lowercaseQuery = query.toLowerCase();
    filteredRecipes = filteredRecipes.filter(recipe => 
      recipe.name.toLowerCase().includes(lowercaseQuery) ||
      recipe.description?.toLowerCase().includes(lowercaseQuery) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(lowercaseQuery))
    );
  }
  
  // Apply cuisine filter
  if (cuisineFilter && cuisineFilter.length > 0) {
    filteredRecipes = filteredRecipes.filter(recipe => 
      recipe.cuisineType && cuisineFilter.includes(recipe.cuisineType)
    );
  }
  
  // Apply allergen filter (exclude recipes with these allergens)
  if (allergenFilter && allergenFilter.length > 0) {
    filteredRecipes = filteredRecipes.filter(recipe => 
      !recipe.allergens.some(allergen => allergenFilter.includes(allergen))
    );
  }
  
  // Apply preparation time filter
  if (maxPrepTime) {
    filteredRecipes = filteredRecipes.filter(recipe => 
      recipe.preparationTime <= maxPrepTime
    );
  }
  
  return filteredRecipes;
};

export default {
  fetchSampleRecipes,
  importSampleRecipeToUserCollection,
  searchSampleRecipes
};
