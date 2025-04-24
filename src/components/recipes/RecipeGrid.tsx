
import { Recipe } from '@/types';
import { Utensils } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import RecipeCard from './RecipeCard';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Check, AlertTriangle } from 'lucide-react';

interface RecipeGridProps {
  recipes: Recipe[];
  getRecipeSafety: (recipe: Recipe) => { safe: boolean };
  isSafeForAllFamily: (recipe: Recipe) => boolean;
  activeProfileName?: string;
  onRecipeSelect?: (recipe: Recipe) => void;
  onEditRecipe?: (recipe: Recipe) => void;
  onDeleteRecipe?: (id: string) => void;
  onFavoriteToggle?: (id: string) => void;
}

const RecipeGrid = ({
  recipes,
  getRecipeSafety,
  isSafeForAllFamily,
  activeProfileName,
  onRecipeSelect,
  onEditRecipe,
  onDeleteRecipe,
  onFavoriteToggle
}: RecipeGridProps) => {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-white/80">
        <Utensils className="mx-auto h-12 w-12 text-green-300 opacity-50" />
        <h3 className="mt-4 text-lg font-medium text-green-800">No recipes found</h3>
        <p className="mt-2 text-sm text-green-600 max-w-sm mx-auto">
          Try adjusting your filters or search criteria to find recipes.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-270px)]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-4">
        {recipes.map(recipe => {
          const safetyCheck = getRecipeSafety(recipe);
          const safeForAllFamily = isSafeForAllFamily(recipe);
          
          return (
            <div 
              key={recipe.id} 
              className="transition-all duration-200 hover:-translate-y-1 relative"
              onClick={() => onRecipeSelect && onRecipeSelect(recipe)}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute top-2 right-2 z-10">
                      {safetyCheck.safe ? (
                        <div className={`rounded-full p-1 ${safeForAllFamily ? 'bg-green-500' : 'bg-amber-400'}`}>
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      ) : (
                        <div className="rounded-full p-1 bg-red-500">
                          <AlertTriangle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {safetyCheck.safe ? (
                      safeForAllFamily ? 
                        "Safe for everyone" : 
                        `Safe for ${activeProfileName || 'you'}, but not for all family members`
                    ) : (
                      `Not safe for ${activeProfileName || 'you'}: Contains allergens`
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <RecipeCard 
                recipe={recipe} 
                onEdit={onEditRecipe}
                onDelete={onDeleteRecipe}
                onFavoriteToggle={onFavoriteToggle}
              />
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default RecipeGrid;
