
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CookingPot, Clock, Users, ExternalLink, Download, Info, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { sampleRecipes, SampleRecipe, RecipeSource } from "@/data/sampleRecipes";
import { useToast } from "@/hooks/use-toast";
import { importSampleRecipeToCollection, importAllSampleRecipes } from "@/services/sampleRecipeService";
import { useAppContext } from "@/context/AppContext";

const RecipeSourceLink = ({ source }: { source: RecipeSource }) => (
  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
    <Info size={12} />
    <span>Source: </span>
    <a 
      href={source.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1"
    >
      {source.name}
      <ExternalLink size={12} />
    </a>
  </div>
);

const SampleRecipesImportDialog = () => {
  const { toast } = useToast();
  const { addRecipe } = useAppContext();
  const [isImporting, setIsImporting] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<SampleRecipe | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sample Recipes</h2>
        <Button onClick={importAll} disabled={isImporting}>
          <Download className="mr-2 h-4 w-4" />
          Import All Recipes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {sampleRecipes.map((recipe, index) => (
          <Card key={index} className="overflow-hidden">
            {recipe.image && (
              <div className="w-full h-40 overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
              <CardDescription>{recipe.description}</CardDescription>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  {recipe.preparationTime} min
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4" />
                  Serves {recipe.servings}
                </div>
              </div>

              <RecipeSourceLink source={recipe.source} />
            </CardHeader>
            
            <CardContent>
              {recipe.allergens.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-sm font-medium mb-1">Contains:</h3>
                  <div className="flex flex-wrap gap-1">
                    {recipe.allergens.map((allergen, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary"
                        className="bg-red-100 text-red-800 hover:bg-red-200"
                      >
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-3">
                <h3 className="text-sm font-medium mb-1">Ingredients:</h3>
                <p className="text-sm text-muted-foreground">
                  {recipe.ingredients.length} ingredients including{' '}
                  {recipe.ingredients.slice(0, 3).join(', ')}
                  {recipe.ingredients.length > 3 ? '...' : ''}
                </p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant="default" 
                className="w-full" 
                onClick={() => handleImportRecipe(recipe)}
                disabled={isImporting}
              >
                <Download className="mr-2 h-4 w-4" />
                Import Recipe
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

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
                <RecipeSourceLink source={selectedRecipe.source} />
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

export default SampleRecipesImportDialog;
