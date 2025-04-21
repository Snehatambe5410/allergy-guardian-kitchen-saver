
import { Recipe } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { importSampleRecipe, sampleRecipes } from "@/data/sampleRecipes";

export const fetchSampleRecipes = async (): Promise<Recipe[]> => {
  // Return the sample recipes directly, converted to Recipe type with ID
  return sampleRecipes.map(sampleRecipe => importSampleRecipe(sampleRecipe));
};

export const importSampleRecipeToUserCollection = async (recipe: Recipe): Promise<Recipe> => {
  try {
    // First check if user is authenticated
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      // If not authenticated, just return the recipe with a new ID
      return {
        ...recipe,
        id: crypto.randomUUID()
      };
    }

    // Otherwise, save to Supabase
    const { data, error } = await supabase
      .from("recipes")
      .insert({
        user_id: userData.user.id,
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        allergens: recipe.allergens,
        preparation_time: recipe.preparationTime,
        servings: recipe.servings,
        is_favorite: recipe.isFavorite,
        image_url: recipe.image,
        // Add these properties to the insert operation if they exist in the recipe
        ...(recipe.cuisineType && { cuisine_type: recipe.cuisineType }),
        ...(recipe.mealType && { meal_type: recipe.mealType }),
      })
      .select()
      .single();

    if (error) {
      console.error("Error importing recipe:", error);
      throw error;
    }

    // Convert Supabase format to app format
    // Use type assertion to tell TypeScript that additional properties might exist
    const recipeData = data as typeof data & { 
      cuisine_type?: string; 
      meal_type?: string;
    };

    return {
      id: recipeData.id,
      name: recipeData.name,
      description: recipeData.description || "",
      ingredients: recipeData.ingredients || [],
      instructions: recipeData.instructions || [],
      allergens: recipeData.allergens || [],
      preparationTime: recipeData.preparation_time || 0,
      servings: recipeData.servings || 2,
      isFavorite: recipeData.is_favorite || false,
      image: recipeData.image_url,
      // Safely extract these properties if they exist in the database response
      cuisineType: recipeData.cuisine_type || undefined,
      mealType: recipeData.meal_type || undefined,
    };
  } catch (error) {
    console.error("Error in importSampleRecipeToUserCollection:", error);
    // Fallback to local handling if Supabase fails
    return {
      ...recipe,
      id: crypto.randomUUID()
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
