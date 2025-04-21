
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
        cuisine_type: recipe.cuisineType || null,
        meal_type: recipe.mealType || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error importing recipe:", error);
      throw error;
    }

    // Convert Supabase format to app format
    return {
      id: data.id,
      name: data.name,
      description: data.description || "",
      ingredients: data.ingredients || [],
      instructions: data.instructions || [],
      allergens: data.allergens || [],
      preparationTime: data.preparation_time || 0,
      servings: data.servings || 2,
      isFavorite: data.is_favorite || false,
      image: data.image_url,
      cuisineType: data.cuisine_type || undefined,
      mealType: data.meal_type || undefined,
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
