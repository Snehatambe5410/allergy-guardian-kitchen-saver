
import { Search, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { Slider } from '../ui/slider';

interface RecipeSearchControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  cuisineFilter: string[];
  setCuisineFilter: (cuisines: string[]) => void;
  allergenFilter: string[];
  setAllergenFilter: (allergens: string[]) => void;
  maxPrepTime: number;
  setMaxPrepTime: (time: number) => void;
  showOnlySafe: boolean;
  setShowOnlySafe: (safe: boolean) => void;
  allCuisines: string[];
  allAllergens: string[];
  maxPrepTimeValue: number;
  activeProfileName?: string;
}

const RecipeSearchControls = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  cuisineFilter,
  setCuisineFilter,
  allergenFilter,
  setAllergenFilter,
  maxPrepTime,
  setMaxPrepTime,
  showOnlySafe,
  setShowOnlySafe,
  allCuisines,
  allAllergens,
  maxPrepTimeValue,
  activeProfileName
}: RecipeSearchControlsProps) => {
  return (
    <div className="flex flex-col space-y-4">
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
            <SelectItem value="difficulty">Difficulty</SelectItem>
          </SelectContent>
        </Select>
        
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
                Show only safe for {activeProfileName || 'current profile'}
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
    </div>
  );
};

export default RecipeSearchControls;
