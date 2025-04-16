
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

  // New function to search recipes by name or ingredients
  const searchRecipes = (query: string) => {
    return (recipes: Recipe[]) => {
      if (!query.trim()) return recipes;
      
      const lowercaseQuery = query.toLowerCase();
      return recipes.filter(recipe => 
        recipe.name.toLowerCase().includes(lowercaseQuery) || 
        recipe.ingredients.some(ing => ing.toLowerCase().includes(lowercaseQuery))
      );
    };
  };

  return {
    addRecipe,
    updateRecipe,
    removeRecipe,
    toggleFavoriteRecipe,
    searchRecipes
  };
};
