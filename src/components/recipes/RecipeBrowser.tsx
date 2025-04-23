
import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Utensils, Clock, Users, Check, AlertTriangle } from 'lucide-react';
import { Recipe } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import RecipeCard from './RecipeCard';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { ScrollArea } from '../ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

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
  const [showOnlySafe, setShowOnlySafe] = useState(true); // Default to showing only safe recipes
  
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
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(recipe => 
        recipe.name.toLowerCase().includes(query) || 
        recipe.description?.toLowerCase().includes(query) ||
        recipe.ingredients.some(i => i.toLowerCase().includes(query))
      );
    }
    
    // Cuisine filter
    if (cuisineFilter.length > 0) {
      result = result.filter(recipe => 
        recipe.cuisineType && cuisineFilter.includes(recipe.cuisineType)
      );
    }
    
    // Allergen filter
    if (allergenFilter.length > 0) {
      result = result.filter(recipe => 
        !recipe.allergens.some(allergen => allergenFilter.includes(allergen))
      );
    }
    
    // Prep time filter
    result = result.filter(recipe => 
      (recipe.preparationTime || 0) <= maxPrepTime
    );
    
    // Safe for current profile
    if (showOnlySafe && activeProfile?.allergies?.length > 0) {
      result = result.filter(recipe => {
        const safetyCheck = isRecipeSafeForProfile(recipe, activeProfile);
        return safetyCheck.safe;
      });
    }
    
    // Sort
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
        default:
          return 0;
      }
    });
    
    setFilteredRecipes(result);
  }, [recipes, searchQuery, sortBy, cuisineFilter, allergenFilter, maxPrepTime, showOnlySafe, activeProfile, isRecipeSafeForProfile]);
  
  return (
    <div className="space-y-6 bg-gradient-to-b from-green-50 to-transparent rounded-lg p-6">
      <div className="flex flex-col space-y-4">
        {/* Search and filter controls */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-green-600" />
            <Input
              placeholder="Search recipes..."
              className="pl-8 border-green-200 focus:border-green-500 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] border-green-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="prep-time">Preparation Time</SelectItem>
              <SelectItem value="servings">Servings</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-green-200 text-green-700">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {(cuisineFilter.length > 0 || allergenFilter.length > 0 || maxPrepTime < maxPrepTimeValue || showOnlySafe) && (
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                    {cuisineFilter.length + allergenFilter.length + (maxPrepTime < maxPrepTimeValue ? 1 : 0) + (showOnlySafe ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-4" align="end">
              <DropdownMenuLabel>Cuisine Types</DropdownMenuLabel>
              <div className="flex flex-wrap gap-2 my-2">
                {allCuisines.map(cuisine => (
                  <Badge
                    key={cuisine}
                    variant={cuisineFilter.includes(cuisine) ? "default" : "outline"}
                    className={`cursor-pointer ${cuisineFilter.includes(cuisine) ? 'bg-green-600' : 'hover:bg-green-100'}`}
                    onClick={() => {
                      setCuisineFilter(prev => 
                        prev.includes(cuisine)
                          ? prev.filter(c => c !== cuisine)
                          : [...prev, cuisine]
                      );
                    }}
                  >
                    {cuisine}
                  </Badge>
                ))}
              </div>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Exclude Allergens</DropdownMenuLabel>
              <ScrollArea className="h-32 my-2">
                <div className="flex flex-wrap gap-2">
                  {allAllergens.map(allergen => (
                    <Badge
                      key={allergen}
                      variant={allergenFilter.includes(allergen) ? "destructive" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setAllergenFilter(prev => 
                          prev.includes(allergen)
                            ? prev.filter(a => a !== allergen)
                            : [...prev, allergen]
                        );
                      }}
                    >
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Maximum Preparation Time: {maxPrepTime} min</DropdownMenuLabel>
              <Slider
                value={[maxPrepTime]}
                min={10}
                max={Math.max(maxPrepTimeValue, 120)}
                step={5}
                className="my-4"
                onValueChange={value => setMaxPrepTime(value[0])}
              />
              
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showOnlySafe}
                onCheckedChange={setShowOnlySafe}
                className="flex items-center gap-2"
              >
                <span className={showOnlySafe ? "text-green-700 font-medium" : ""}>
                  Show only safe for {activeProfile?.name || 'current profile'}
                </span>
              </DropdownMenuCheckboxItem>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setCuisineFilter([]);
                    setAllergenFilter([]);
                    setMaxPrepTime(Math.max(maxPrepTimeValue, 120));
                    setShowOnlySafe(true);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Active filters display */}
        {(cuisineFilter.length > 0 || allergenFilter.length > 0 || maxPrepTime < maxPrepTimeValue || showOnlySafe) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-green-700">Active filters:</span>
            {cuisineFilter.map(cuisine => (
              <Badge key={cuisine} variant="secondary" className="gap-1 bg-green-100 text-green-800">
                {cuisine}
                <button
                  className="ml-1 rounded-full hover:bg-green-200"
                  onClick={() => setCuisineFilter(prev => prev.filter(c => c !== cuisine))}
                >
                  ×
                </button>
              </Badge>
            ))}
            {allergenFilter.map(allergen => (
              <Badge key={allergen} variant="destructive" className="gap-1">
                No {allergen}
                <button
                  className="ml-1 rounded-full hover:bg-red-400"
                  onClick={() => setAllergenFilter(prev => prev.filter(a => a !== allergen))}
                >
                  ×
                </button>
              </Badge>
            ))}
            {maxPrepTime < maxPrepTimeValue && (
              <Badge variant="secondary" className="gap-1 bg-green-100 text-green-800">
                ≤ {maxPrepTime} min
                <button
                  className="ml-1 rounded-full hover:bg-green-200"
                  onClick={() => setMaxPrepTime(Math.max(maxPrepTimeValue, 120))}
                >
                  ×
                </button>
              </Badge>
            )}
            {showOnlySafe && (
              <Badge variant="secondary" className="gap-1 bg-green-100 text-green-800 hover:bg-green-200">
                Safe for {activeProfile?.name || 'current profile'}
                <button
                  className="ml-1 rounded-full hover:bg-green-200"
                  onClick={() => setShowOnlySafe(false)}
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
      
      {/* Results count */}
      <div className="text-sm text-green-700">
        Showing {filteredRecipes.length} of {recipes.length} recipes
      </div>
      
      {/* Recipe grid with improved scrolling */}
      <ScrollArea className="h-[calc(100vh-270px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-4">
          {filteredRecipes.map(recipe => {
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
                          `Safe for ${activeProfile?.name || 'you'}, but not for all family members`
                      ) : (
                        `Not safe for ${activeProfile?.name || 'you'}: Contains allergens`
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
        
        {filteredRecipes.length === 0 && (
          <div className="text-center py-12 border rounded-lg bg-white/80">
            <Utensils className="mx-auto h-12 w-12 text-green-300 opacity-50" />
            <h3 className="mt-4 text-lg font-medium text-green-800">No recipes found</h3>
            <p className="mt-2 text-sm text-green-600 max-w-sm mx-auto">
              Try adjusting your filters or search criteria to find recipes.
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default RecipeBrowser;
