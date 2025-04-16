
import { supabase } from "@/integrations/supabase/client";
import { Recipe } from "@/types";
import { v4 as uuidv4 } from 'uuid';

export const fetchUserRecipes = async (): Promise<Recipe[]> => {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }

  return data.map((item) => ({
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
  }));
};

export const addRecipe = async (recipe: Omit<Recipe, "id">): Promise<Recipe> => {
  const newId = uuidv4();
  
  const { data, error } = await supabase
    .from("recipes")
    .insert({
      id: newId,
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      allergens: recipe.allergens,
      preparation_time: recipe.preparationTime,
      servings: recipe.servings,
      is_favorite: recipe.isFavorite,
      image_url: recipe.image,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding recipe:", error);
    throw error;
  }

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
  };
};

export const updateRecipe = async (id: string, updates: Partial<Recipe>): Promise<void> => {
  const { error } = await supabase
    .from("recipes")
    .update({
      name: updates.name,
      description: updates.description,
      ingredients: updates.ingredients,
      instructions: updates.instructions,
      allergens: updates.allergens,
      preparation_time: updates.preparationTime,
      servings: updates.servings,
      is_favorite: updates.isFavorite,
      image_url: updates.image,
    })
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
