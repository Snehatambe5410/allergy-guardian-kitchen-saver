
import { Recipe } from '@/types';
import { Utensils, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import RecipeCard from './RecipeCard';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Badge } from '../ui/badge';

interface RecipeGridProps {
  recipes: Recipe[];
  getRecipeSafety: (recipe: Recipe) => { safe: boolean; problemIngredients?: string[] };
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
              className="transition-all duration-200 hover:-translate-y-1 relative group"
              onClick={() => onRecipeSelect && onRecipeSelect(recipe)}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute top-2 right-2 z-10">
                      {safetyCheck.safe ? (
                        <div className={`rounded-full p-1.5 ${safeForAllFamily ? 'bg-green-500' : 'bg-amber-400'} shadow-md transition-transform duration-200 group-hover:scale-110`}>
                          {safeForAllFamily ? 
                            <ShieldCheck className="h-5 w-5 text-white" /> :
                            <Check className="h-5 w-5 text-white" />
                          }
                        </div>
                      ) : (
                        <div className="rounded-full p-1.5 bg-red-500 shadow-md transition-transform duration-200 group-hover:scale-110">
                          <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    {safetyCheck.safe ? (
                      safeForAllFamily ? 
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-green-700">Safe for everyone</span>
                          <span className="text-xs">This recipe is safe for all family members</span>
                        </div> : 
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-amber-600">Safe for {activeProfileName || 'you'}</span>
                          <span className="text-xs">But not for all family members</span>
                        </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-red-600">Not safe for {activeProfileName || 'you'}</span>
                        {safetyCheck.problemIngredients && safetyCheck.problemIngredients.length > 0 && (
                          <div>
                            <span className="text-xs">Contains allergens:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {safetyCheck.problemIngredients.map((allergen, idx) => (
                                <Badge key={idx} variant="destructive" className="text-xs py-0">{allergen}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
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
