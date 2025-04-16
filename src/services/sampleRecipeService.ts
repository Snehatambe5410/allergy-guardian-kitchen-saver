
import { Recipe } from "../types";
import { sampleRecipes, importSampleRecipe } from "../data/sampleRecipes";
import { addRecipe } from "./recipeService";
import { toast } from "../hooks/use-toast";

export const getSampleRecipes = () => {
  return sampleRecipes;
};

export const importSampleRecipeToCollection = async (index: number): Promise<Recipe | null> => {
  try {
    if (index >= 0 && index < sampleRecipes.length) {
      const recipeToImport = importSampleRecipe(sampleRecipes[index]);
      
      // Add recipe to database
      const savedRecipe = await addRecipe(recipeToImport);
      
      return savedRecipe;
    }
    return null;
  } catch (error) {
    console.error("Error importing sample recipe:", error);
    throw error;
  }
};

export const importAllSampleRecipes = async (): Promise<Recipe[]> => {
  try {
    const importPromises = sampleRecipes.map(recipe => {
      const recipeToImport = importSampleRecipe(recipe);
      return addRecipe(recipeToImport);
    });
    
    const importedRecipes = await Promise.all(importPromises);
    
    return importedRecipes;
  } catch (error) {
    console.error("Error importing all sample recipes:", error);
    throw error;
  }
};
