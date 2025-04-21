
import { useState, useEffect } from 'react';
import { useToast } from '../../hooks/use-toast';
import { Recipe } from '@/types';
import { useAppContext } from '@/context/AppContext';
import RecipeBrowser from './RecipeBrowser';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Check, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { fetchSampleRecipes, importSampleRecipeToUserCollection } from '@/services/sampleRecipeService';

interface SampleRecipesBrowserProps {
  onImport: (recipe: Recipe) => void;
}

const SampleRecipesBrowser = ({ onImport }: SampleRecipesBrowserProps) => {
  const [sampleRecipes, setSampleRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showRecipeDetail, setShowRecipeDetail] = useState(false);
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();
  const { activeProfile } = useAppContext();

  useEffect(() => {
    const loadSampleRecipes = async () => {
      setLoading(true);
      try {
        const recipes = await fetchSampleRecipes();
        setSampleRecipes(recipes);
      } catch (error) {
        console.error('Error loading sample recipes:', error);
        toast({
          title: 'Failed to load sample recipes',
          description: 'There was an issue loading the sample recipes. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadSampleRecipes();
  }, [toast]);

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeDetail(true);
  };

  const handleImportRecipe = async () => {
    if (!selectedRecipe) return;
    
    setImporting(true);
    try {
      const importedRecipe = await importSampleRecipeToUserCollection(selectedRecipe);
      onImport(importedRecipe);
      
      setShowRecipeDetail(false);
    } catch (error) {
      console.error('Error importing recipe:', error);
      toast({
        title: 'Import failed',
        description: 'There was an issue importing the recipe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  // Check if recipe is safe for current profile
  const isRecipeSafe = (recipe: Recipe) => {
    if (!activeProfile || !activeProfile.allergies || activeProfile.allergies.length === 0) {
      return true;
    }
    
    const profileAllergens = activeProfile.allergies.map(a => a.name.toLowerCase());
    return !recipe.allergens.some(allergen => 
      profileAllergens.includes(allergen.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Sample Recipes</h1>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <RecipeBrowser 
          recipes={sampleRecipes}
          onRecipeSelect={handleSelectRecipe}
        />
      )}
      
      {/* Recipe Detail Dialog */}
      {selectedRecipe && (
        <Dialog open={showRecipeDetail} onOpenChange={setShowRecipeDetail}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedRecipe.name}</DialogTitle>
              {selectedRecipe.description && (
                <DialogDescription>
                  {selectedRecipe.description}
                </DialogDescription>
              )}
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedRecipe.image && (
                <div className="col-span-1 md:col-span-2">
                  <img 
                    src={selectedRecipe.image} 
                    alt={selectedRecipe.name} 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              
              {/* Show safety alert */}
              <div className="col-span-1 md:col-span-2">
                {!isRecipeSafe(selectedRecipe) ? (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Allergen Warning</AlertTitle>
                    <AlertDescription>
                      This recipe contains allergens that may not be safe for {activeProfile?.name || 'the current profile'}.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="mb-4 border-green-500 text-green-800 bg-green-50">
                    <Check className="h-4 w-4 text-green-500" />
                    <AlertTitle>Safe Recipe</AlertTitle>
                    <AlertDescription>
                      This recipe appears to be safe for {activeProfile?.name || 'the current profile'}.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <ul className="space-y-1">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                <ol className="space-y-3 list-decimal list-inside">
                  {selectedRecipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm text-muted-foreground">Preparation Time</p>
                    <p className="font-medium">{selectedRecipe.preparationTime} min</p>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm text-muted-foreground">Servings</p>
                    <p className="font-medium">{selectedRecipe.servings}</p>
                  </div>
                  {selectedRecipe.cuisineType && (
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm text-muted-foreground">Cuisine</p>
                      <p className="font-medium">{selectedRecipe.cuisineType}</p>
                    </div>
                  )}
                  {selectedRecipe.difficulty && (
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm text-muted-foreground">Difficulty</p>
                      <p className="font-medium capitalize">{selectedRecipe.difficulty}</p>
                    </div>
                  )}
                </div>
                
                {selectedRecipe.allergens.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Contains Allergens</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecipe.allergens.map((allergen, index) => (
                        <span 
                          key={index} 
                          className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleImportRecipe} 
                disabled={importing}
              >
                {importing ? 'Importing...' : 'Add to My Recipes'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SampleRecipesBrowser;
