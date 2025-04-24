
import { useState, useEffect } from 'react';
import { Recipe } from '@/types';
import { useAppContext } from '@/context/AppContext';
import RecipeSearchControls from './RecipeSearchControls';
import ActiveFilters from './ActiveFilters';
import RecipeGrid from './RecipeGrid';

interface RecipeBrowserProps {
  recipes: Recipe[];
  onRecipeSelect?: (recipe: Recipe) => void;
  onEditRecipe?: (recipe: Recipe) => void;
  onDeleteRecipe?: (id: string) => void;
  onFavoriteToggle?: (id: string) => void;
}

const RecipeBrowser = ({
  recipes,
  onRecipeSelect,
  onEditRecipe,
  onDeleteRecipe,
  onFavoriteToggle
}: RecipeBrowserProps) => {
  const { activeProfile, isRecipeSafeForProfile, familyMembers } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);
  const [sortBy, setSortBy] = useState<string>('name');
  const [cuisineFilter, setCuisineFilter] = useState<string[]>([]);
  const [allergenFilter, setAllergenFilter] = useState<string[]>([]);
  const [maxPrepTime, setMaxPrepTime] = useState<number>(120);
  const [showOnlySafe, setShowOnlySafe] = useState(true);
  
  // Extract unique values for filters
  const allCuisines = Array.from(new Set(recipes.map(r => r.cuisineType || 'Uncategorized')));
  const allAllergens = Array.from(new Set(recipes.flatMap(r => r.allergens || [])));
  const maxPrepTimeValue = Math.max(...recipes.map(r => r.preparationTime || 0), 60);
  
  // Check recipe safety for the current profile
  const getRecipeSafety = (recipe: Recipe) => {
    return isRecipeSafeForProfile(recipe, activeProfile);
  };
  
  // Check if recipe is safe for all family members
  const isSafeForAllFamily = (recipe: Recipe) => {
    if (!familyMembers || familyMembers.length === 0) return true;
    
    return !familyMembers.some(member => {
      const safetyCheck = isRecipeSafeForProfile(recipe, member);
      return !safetyCheck.safe;
    });
  };
  
  // Filter and sort recipes
  useEffect(() => {
    let result = [...recipes];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(recipe => 
        recipe.name.toLowerCase().includes(query) || 
        recipe.description?.toLowerCase().includes(query) ||
        recipe.ingredients.some(i => i.toLowerCase().includes(query)) ||
        recipe.cuisineType?.toLowerCase().includes(query) ||
        recipe.mealType?.toLowerCase().includes(query)
      );
    }
    
    if (cuisineFilter.length > 0) {
      result = result.filter(recipe => 
        recipe.cuisineType && cuisineFilter.includes(recipe.cuisineType)
      );
    }
    
    if (allergenFilter.length > 0) {
      result = result.filter(recipe => 
        !recipe.allergens.some(allergen => allergenFilter.includes(allergen))
      );
    }
    
    if (maxPrepTime < 120) {
      result = result.filter(recipe => 
        (recipe.preparationTime || 0) <= maxPrepTime
      );
    }
    
    if (showOnlySafe && activeProfile?.allergies?.length > 0) {
      result = result.filter(recipe => {
        const safetyCheck = isRecipeSafeForProfile(recipe, activeProfile);
        return safetyCheck.safe;
      });
    }
    
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'prep-time':
          return (a.preparationTime || 0) - (b.preparationTime || 0);
        case 'servings':
          return (a.servings || 0) - (b.servings || 0);
        case 'newest':
          return (b.id || '').localeCompare(a.id || '');
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return (difficultyOrder[a.difficulty || 'medium'] || 2) - 
                 (difficultyOrder[b.difficulty || 'medium'] || 2);
        default:
          return 0;
      }
    });
    
    setFilteredRecipes(result);
  }, [recipes, searchQuery, sortBy, cuisineFilter, allergenFilter, maxPrepTime, showOnlySafe, activeProfile, isRecipeSafeForProfile]);
  
  return (
    <div className="space-y-6 bg-gradient-to-b from-green-50 to-transparent rounded-lg p-6">
      <RecipeSearchControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        cuisineFilter={cuisineFilter}
        setCuisineFilter={setCuisineFilter}
        allergenFilter={allergenFilter}
        setAllergenFilter={setAllergenFilter}
        maxPrepTime={maxPrepTime}
        setMaxPrepTime={setMaxPrepTime}
        showOnlySafe={showOnlySafe}
        setShowOnlySafe={setShowOnlySafe}
        allCuisines={allCuisines}
        allAllergens={allAllergens}
        maxPrepTimeValue={maxPrepTimeValue}
        activeProfileName={activeProfile?.name}
      />
      
      <ActiveFilters
        cuisineFilter={cuisineFilter}
        allergenFilter={allergenFilter}
        maxPrepTime={maxPrepTime}
        maxPrepTimeValue={maxPrepTimeValue}
        showOnlySafe={showOnlySafe}
        activeProfileName={activeProfile?.name}
        setCuisineFilter={setCuisineFilter}
        setAllergenFilter={setAllergenFilter}
        setMaxPrepTime={setMaxPrepTime}
        setShowOnlySafe={setShowOnlySafe}
      />
      
      <div className="text-sm text-green-700">
        Showing {filteredRecipes.length} of {recipes.length} recipes
      </div>
      
      <RecipeGrid
        recipes={filteredRecipes}
        getRecipeSafety={getRecipeSafety}
        isSafeForAllFamily={isSafeForAllFamily}
        activeProfileName={activeProfile?.name}
        onRecipeSelect={onRecipeSelect}
        onEditRecipe={onEditRecipe}
        onDeleteRecipe={onDeleteRecipe}
        onFavoriteToggle={onFavoriteToggle}
      />
    </div>
  );
};

export default RecipeBrowser;
