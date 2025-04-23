
import { supabase } from "@/integrations/supabase/client";
import { Recipe } from "@/types";
import { v4 as uuidv4 } from 'uuid';

// Define the actual types that match our database schema
interface DatabaseRecipe {
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

export const fetchUserRecipes = async (): Promise<Recipe[]> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error("Error fetching authenticated user:", userError);
    throw userError;
  }
  
  if (!userData.user) {
    return [];
  }

  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }

  // Convert database format to app format
  return (data as DatabaseRecipe[]).map((item) => ({
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
  const dbRecipe = {
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
  };

  const { data, error } = await supabase
    .from("recipes")
    .insert(dbRecipe)
    .select()
    .single();

  if (error) {
    console.error("Error adding recipe:", error);
    throw error;
  }

  // Convert database response back to app format
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
    cuisineType: data.cuisine_type,
    mealType: data.meal_type,
  };
};

export const updateRecipe = async (id: string, updates: Partial<Recipe>): Promise<void> => {
  // Convert app format to database format
  const dbUpdates: any = {};
  
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

  const { error } = await supabase
    .from("recipes")
    .update(dbUpdates)
    .eq("id", id);

  if (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
};

export const deleteRecipe = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
};

export const toggleFavoriteRecipe = async (id: string, isFavorite: boolean): Promise<void> => {
  const { error } = await supabase
    .from("recipes")
    .update({ is_favorite: isFavorite })
    .eq("id", id);

  if (error) {
    console.error("Error toggling favorite recipe:", error);
    throw error;
  }
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
