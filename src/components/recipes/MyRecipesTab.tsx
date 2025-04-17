
import { useState } from 'react';
import { Search, Plus, Heart, CookingPot, BookOpen, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Recipe } from '../../types';
import RecipeCard from './RecipeCard';
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface MyRecipesTabProps {
  recipes: Recipe[];
  onAddRecipe: () => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
  onFavoriteToggle: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

const MyRecipesTab = ({ 
  recipes, 
  onAddRecipe,
  onEditRecipe,
  onDeleteRecipe,
  onFavoriteToggle,
  setActiveTab,
}: MyRecipesTabProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'prep-time' | 'serves'>('name');

  // Extract all unique allergens from recipes
  const allAllergens = Array.from(new Set(recipes.flatMap(recipe => recipe.allergens)));
  const [selectedAllergen, setSelectedAllergen] = useState<string | null>(null);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFavorite = filterFavorites ? recipe.isFavorite : true;
    const matchesAllergen = selectedAllergen ? recipe.allergens.includes(selectedAllergen) : true;
    return matchesSearch && matchesFavorite && matchesAllergen;
  });

  // Sort recipes
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'prep-time') {
      return a.preparationTime - b.preparationTime;
    } else {
      return a.servings - b.servings;
    }
  });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Recipe Collection</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className={filterFavorites ? "bg-rose-100 text-rose-800 border-rose-200" : ""}
            onClick={() => setFilterFavorites(!filterFavorites)}
          >
            <Heart className={`h-4 w-4 mr-1 ${filterFavorites ? "fill-rose-500" : ""}`} />
            Favorites
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setSortBy('name')}>
                  Name {sortBy === 'name' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('prep-time')}>
                  Preparation Time {sortBy === 'prep-time' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('serves')}>
                  Servings {sortBy === 'serves' && '✓'}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              {allAllergens.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Allergen</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => setSelectedAllergen(null)}>
                    All {selectedAllergen === null && '✓'}
                  </DropdownMenuItem>
                  {allAllergens.map(allergen => (
                    <DropdownMenuItem key={allergen} onClick={() => setSelectedAllergen(allergen)}>
                      {allergen} {selectedAllergen === allergen && '✓'}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={onAddRecipe}>
            <Plus className="mr-2 h-4 w-4" />
            Add Recipe
          </Button>
        </div>
      </div>
      
      {filteredRecipes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-muted p-3 mb-4">
              <CookingPot className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {searchQuery || filterFavorites || selectedAllergen ? "No matching recipes found" : "No recipes added yet"}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery || filterFavorites || selectedAllergen
                ? "Try adjusting your search or filters"
                : "Add recipes to build your collection"}
            </p>
            <div className="flex gap-4">
              <Button onClick={onAddRecipe}>
                <Plus className="mr-2 h-4 w-4" />
                Add Recipe
              </Button>
              <Button onClick={() => setActiveTab("sample-recipes")} variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Sample Recipes
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedRecipes.map(recipe => (
            <div key={recipe.id} className="transition-all duration-200 hover:-translate-y-1">
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onEdit={onEditRecipe}
                onDelete={onDeleteRecipe}
                onFavoriteToggle={onFavoriteToggle}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default MyRecipesTab;
