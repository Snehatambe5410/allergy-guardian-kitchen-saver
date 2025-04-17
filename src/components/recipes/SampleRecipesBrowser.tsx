import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CookingPot, Clock, Users, ExternalLink, Download, Info, ShoppingBag, Search, Utensils } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { sampleRecipes, SampleRecipe, RecipeSource } from "@/data/sampleRecipes";
import { useToast } from "@/hooks/use-toast";
import { importSampleRecipeToCollection, importAllSampleRecipes } from "@/services/sampleRecipeService";
import { useAppContext } from "@/context/AppContext";
import RecipeCard from "./RecipeCard";
import { Badge } from "../ui/badge";

const SampleRecipesBrowser = () => {
  const { toast } = useToast();
  const { addRecipe } = useAppContext();
  const [isImporting, setIsImporting] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<SampleRecipe | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Extract unique meal categories based on what's in the data
  const recipeCategories = Array.from(new Set(
    sampleRecipes.map(recipe => {
      // Simple categorization based on recipe names and descriptions
      if (recipe.name.toLowerCase().includes('breakfast') || 
          recipe.description?.toLowerCase().includes('breakfast') ||
          recipe.name.includes('Toast') ||
          recipe.name.includes('Smoothie')) {
        return 'Breakfast';
      } else if (recipe.name.toLowerCase().includes('soup') || 
                recipe.description?.toLowerCase().includes('soup')) {
        return 'Soups';
      } else if (recipe.name.toLowerCase().includes('salad') || 
                recipe.description?.toLowerCase().includes('salad')) {
        return 'Salads';
      } else if (recipe.allergens.includes('Fish') || 
                recipe.name.toLowerCase().includes('fish') ||
                recipe.name.toLowerCase().includes('salmon')) {
        return 'Seafood';
      } else if (recipe.name.toLowerCase().includes('chicken') || 
                recipe.name.toLowerCase().includes('beef') || 
                recipe.name.toLowerCase().includes('pork')) {
        return 'Meat';
      } else if (!recipe.allergens.includes('Milk') && 
                !recipe.allergens.includes('Eggs') && 
                !recipe.allergens.includes('Fish') &&
                !recipe.allergens.includes('Meat')) {
        return 'Vegetarian';
      } else {
        return 'Main Dishes';
      }
    })
  ), []).sort()

  // Filter recipes based on search query and category
  const filteredRecipes = sampleRecipes.filter(recipe => {
    // Search filter
    const matchesSearch = searchQuery 
      ? recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        recipe.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase())) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
      
    // Category filter
    let matchesCategory = true;
    if (selectedCategory) {
      if (selectedCategory === 'Breakfast') {
        matchesCategory = recipe.name.toLowerCase().includes('breakfast') || 
                         (recipe.description?.toLowerCase().includes('breakfast') ?? false) ||
                         recipe.name.includes('Toast') ||
                         recipe.name.includes('Smoothie');
      } else if (selectedCategory === 'Soups') {
        matchesCategory = recipe.name.toLowerCase().includes('soup') || 
                         (recipe.description?.toLowerCase().includes('soup') ?? false);
      } else if (selectedCategory === 'Salads') {
        matchesCategory = recipe.name.toLowerCase().includes('salad') || 
                         (recipe.description?.toLowerCase().includes('salad') ?? false);
      } else if (selectedCategory === 'Seafood') {
        matchesCategory = recipe.allergens.includes('Fish') || 
                         recipe.name.toLowerCase().includes('fish') ||
                         recipe.name.toLowerCase().includes('salmon');
      } else if (selectedCategory === 'Meat') {
        matchesCategory = recipe.name.toLowerCase().includes('chicken') || 
                         recipe.name.toLowerCase().includes('beef') || 
                         recipe.name.toLowerCase().includes('pork');
      } else if (selectedCategory === 'Vegetarian') {
        matchesCategory = !recipe.allergens.includes('Milk') && 
                         !recipe.allergens.includes('Eggs') && 
                         !recipe.allergens.includes('Fish');
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  const handleImportRecipe = async (recipe: SampleRecipe) => {
    setSelectedRecipe(recipe);
    setImportDialogOpen(true);
  };

  const confirmImport = async () => {
    if (!selectedRecipe) return;
    
    try {
      setIsImporting(true);
      const index = sampleRecipes.findIndex(r => 
        r.name === selectedRecipe.name && r.source.url === selectedRecipe.source.url
      );
      
      if (index !== -1) {
        const importedRecipe = await importSampleRecipeToCollection(index);
        if (importedRecipe) {
          addRecipe(importedRecipe);
          toast({
            title: "Recipe imported",
            description: `${importedRecipe.name} has been added to your collection.`,
          });
        }
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error importing this recipe.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      setImportDialogOpen(false);
    }
  };

  const importAll = async () => {
    try {
      setIsImporting(true);
      const importedRecipes = await importAllSampleRecipes();
      
      importedRecipes.forEach(recipe => {
        addRecipe(recipe);
      });
      
      toast({
        title: "All recipes imported",
        description: `${importedRecipes.length} recipes have been added to your collection.`,
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error importing recipes.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Sample Recipes</h2>
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
          <Button onClick={importAll} disabled={isImporting}>
            <Download className="mr-2 h-4 w-4" />
            Import All
          </Button>
        </div>
      </div>

      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          <Button 
            variant={selectedCategory === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="whitespace-nowrap"
          >
            <Utensils className="mr-1 h-4 w-4" />
            All Recipes
          </Button>
          {recipeCategories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center p-6 bg-muted/20 rounded-lg">
          <CookingPot className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-2">No recipes found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredRecipes.map((recipe, index) => (
            <div key={index} className="transition-all duration-200 hover:-translate-y-1">
              <RecipeCard 
                recipe={{
                  ...recipe,
                  id: `sample-${index}` // Temporary ID for the sample recipe card
                }}
                showSource={true}
                sourceUrl={recipe.source.url}
                sourceName={recipe.source.name}
                onFavoriteToggle={() => handleImportRecipe(recipe)}
              />
              <div className="mt-2 text-center">
                <Button 
                  variant="default" 
                  className="w-full" 
                  onClick={() => handleImportRecipe(recipe)}
                  disabled={isImporting}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Import Recipe
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Recipe</DialogTitle>
            <DialogDescription>
              Add this recipe to your personal collection?
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecipe && (
            <>
              <div className="py-4">
                <h3 className="font-medium">{selectedRecipe.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedRecipe.description}</p>
                
                <a 
                  href={selectedRecipe.source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline mt-2"
                >
                  <Info size={14} />
                  <span>Source: {selectedRecipe.source.name}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportDialogOpen(false)} disabled={isImporting}>
                  Cancel
                </Button>
                <Button onClick={confirmImport} disabled={isImporting}>
                  {isImporting ? "Importing..." : "Import Recipe"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SampleRecipesBrowser;
