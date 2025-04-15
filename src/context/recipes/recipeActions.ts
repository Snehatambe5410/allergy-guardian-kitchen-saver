
import { Recipe } from '../../types';

export const createRecipeActions = (
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>
) => {
  const addRecipe = (recipe: Recipe) => {
    setRecipes(prev => [...prev, recipe]);
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes(prev => 
      prev.map(recipe => 
        recipe.id === id ? { ...recipe, ...updates } : recipe
      )
    );
  };

  const removeRecipe = (id: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
  };

  const toggleFavoriteRecipe = (id: string) => {
    setRecipes(prev => 
      prev.map(recipe => 
        recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
      )
    );
  };

  return {
    addRecipe,
    updateRecipe,
    removeRecipe,
    toggleFavoriteRecipe
  };
};
