
import { supabase } from "@/integrations/supabase/client";
import { Recipe } from "@/types";
import { v4 as uuidv4 } from 'uuid';

// This interface matches the actual Supabase table schema
interface SupabaseRecipe {
  "Cleaned-Ingredients"?: string;
  "Cuisine"?: string;
  "image-url"?: string;
  "Ingredient-count"?: number;
  "TotalTimeInMins"?: number;
  "TranslatedIngredients"?: string;
  "TranslatedInstructions"?: string;
  "TranslatedRecipeName"?: string;
  "URL"?: string;
}

// Define the type that matches our app's database schema that we would need
// if we were to create a recipes table with our structure
interface UserRecipe {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  allergens: string[];
  preparation_time: number;
  servings: number;
  is_favorite: boolean;
  image_url?: string;
  cuisine_type?: string;
  meal_type?: string;
  created_at: string;
}

// Mock database for user recipes since we can't store them in the current Supabase structure
let localUserRecipes: UserRecipe[] = [];

export const fetchUserRecipes = async (): Promise<Recipe[]> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error("Error fetching authenticated user:", userError);
    throw userError;
  }
  
  if (!userData.user) {
    return [];
  }

  // Filter local recipes by user ID
  const userRecipes = localUserRecipes.filter(recipe => recipe.user_id === userData.user!.id);

  // Convert database format to app format
  return userRecipes.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description || "",
    ingredients: item.ingredients || [],
    instructions: item.instructions || [],
    allergens: item.allergens || [],
    preparationTime: item.preparation_time || 0,
    servings: item.servings || 2,
    isFavorite: item.is_favorite || false,
    image: item.image_url,
    cuisineType: item.cuisine_type,
    mealType: item.meal_type,
  }));
};

export const addRecipe = async (recipe: Omit<Recipe, "id">): Promise<Recipe> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error("Error fetching authenticated user:", userError);
    throw userError;
  }
  
  if (!userData.user) {
    throw new Error("User is not authenticated");
  }

  const newId = uuidv4();
  
  // Convert app format to database format
  const userRecipe: UserRecipe = {
    id: newId,
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
    cuisine_type: recipe.cuisineType,
    meal_type: recipe.mealType,
    created_at: new Date().toISOString()
  };

  // Store in local array instead of database
  localUserRecipes.push(userRecipe);

  // Convert back to app format
  return {
    id: userRecipe.id,
    name: userRecipe.name,
    description: userRecipe.description || "",
    ingredients: userRecipe.ingredients || [],
    instructions: userRecipe.instructions || [],
    allergens: userRecipe.allergens || [],
    preparationTime: userRecipe.preparation_time || 0,
    servings: userRecipe.servings || 2,
    isFavorite: userRecipe.is_favorite || false,
    image: userRecipe.image_url,
    cuisineType: userRecipe.cuisine_type,
    mealType: userRecipe.meal_type,
  };
};

export const updateRecipe = async (id: string, updates: Partial<Recipe>): Promise<void> => {
  // Find the recipe in the local array
  const recipeIndex = localUserRecipes.findIndex(recipe => recipe.id === id);
  if (recipeIndex === -1) {
    throw new Error("Recipe not found");
  }

  // Convert app format to database format
  const dbUpdates: Partial<UserRecipe> = {};
  
  // Only add properties that are actually in the updates object
  if ('name' in updates) dbUpdates.name = updates.name;
  if ('description' in updates) dbUpdates.description = updates.description;
  if ('ingredients' in updates) dbUpdates.ingredients = updates.ingredients;
  if ('instructions' in updates) dbUpdates.instructions = updates.instructions;
  if ('allergens' in updates) dbUpdates.allergens = updates.allergens;
  if ('preparationTime' in updates) dbUpdates.preparation_time = updates.preparationTime;
  if ('servings' in updates) dbUpdates.servings = updates.servings;
  if ('isFavorite' in updates) dbUpdates.is_favorite = updates.isFavorite;
  if ('image' in updates) dbUpdates.image_url = updates.image;
  if ('cuisineType' in updates) dbUpdates.cuisine_type = updates.cuisineType;
  if ('mealType' in updates) dbUpdates.meal_type = updates.mealType;

  // Update the recipe in the local array
  localUserRecipes[recipeIndex] = { 
    ...localUserRecipes[recipeIndex], 
    ...dbUpdates 
  };
};

export const deleteRecipe = async (id: string): Promise<void> => {
  // Remove the recipe from the local array
  localUserRecipes = localUserRecipes.filter(recipe => recipe.id !== id);
};

export const toggleFavoriteRecipe = async (id: string, isFavorite: boolean): Promise<void> => {
  // Find the recipe in the local array
  const recipeIndex = localUserRecipes.findIndex(recipe => recipe.id === id);
  if (recipeIndex === -1) {
    throw new Error("Recipe not found");
  }

  // Update the recipe in the local array
  localUserRecipes[recipeIndex].is_favorite = isFavorite;
};

export const uploadRecipeImage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${uuidv4()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('recipe_images')
    .upload(filePath, file);

  if (error) {
    console.error("Error uploading recipe image:", error);
    throw error;
  }

  const { data } = supabase.storage
    .from('recipe_images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
