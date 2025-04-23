
import { useState, useEffect } from 'react';
import { useToast } from '../../hooks/use-toast';
import { Recipe } from '@/types';
import { useAppContext } from '@/context/AppContext';
import RecipeBrowser from './RecipeBrowser';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Check, AlertCircle, AlertTriangle, ChefHat } from 'lucide-react';
import { Button } from '../ui/button';
import { fetchSampleRecipes, importSampleRecipeToUserCollection } from '@/services/sampleRecipeService';
import { Badge } from '../ui/badge';

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
  const { activeProfile, familyMembers, isRecipeSafeForProfile } = useAppContext();

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
      
      // Show success toast
      toast({
        title: "Recipe imported successfully",
        description: `${importedRecipe.name} has been added to your recipes.`,
        variant: "default",
      });
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

  // Check if recipe is safe for current profile with enhanced detection
  const recipeAllergyCheck = (recipe: Recipe) => {
    if (!activeProfile) return { safe: true, problemIngredients: [] };
    return isRecipeSafeForProfile(recipe, activeProfile);
  };
  
  // Check if recipe contains allergens for any family member
  const getAllergenicFamilyMembers = (recipe: Recipe) => {
    if (!familyMembers || familyMembers.length === 0) return [];
    
    return familyMembers
      .map(member => {
        const safetyCheck = isRecipeSafeForProfile(recipe, member);
        return { member, safe: safetyCheck.safe, problemIngredients: safetyCheck.problemIngredients };
      })
      .filter(result => !result.safe);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-green-700 flex items-center">
          <ChefHat className="h-6 w-6 mr-2 text-green-600" />
          Sample Recipes
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-green-50/30">
            <DialogHeader className="border-b border-green-100 pb-3">
              <DialogTitle className="text-green-800">{selectedRecipe.name}</DialogTitle>
              {selectedRecipe.description && (
                <DialogDescription>
                  {selectedRecipe.description}
                </DialogDescription>
              )}
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3">
              {selectedRecipe.image && (
                <div className="col-span-1 md:col-span-2">
                  <div className="rounded-lg overflow-hidden shadow-md border border-green-100">
                    <img 
                      src={selectedRecipe.image} 
                      alt={selectedRecipe.name} 
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              )}
              
              {/* Show safety alert */}
              <div className="col-span-1 md:col-span-2">
                {(() => {
                  const safetyCheck = recipeAllergyCheck(selectedRecipe);
                  const allergenicMembers = getAllergenicFamilyMembers(selectedRecipe);
                  
                  if (!safetyCheck.safe) {
                    return (
                      <Alert variant="destructive" className="mb-4 border-red-200 bg-red-50 text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Allergen Warning</AlertTitle>
                        <AlertDescription className="space-y-2">
                          <p>This recipe contains allergens that may not be safe for {activeProfile?.name || 'the current profile'}.</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="font-semibold text-sm">Problem ingredients: </span>
                            {safetyCheck.problemIngredients.map((ingredient, i) => (
                              <Badge key={i} variant="outline" className="bg-red-100 text-red-800 border-red-300">
                                {ingredient}
                              </Badge>
                            ))}
                          </div>
                        </AlertDescription>
                      </Alert>
                    );
                  } else if (allergenicMembers.length > 0) {
                    return (
                      <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-800">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <AlertTitle>Safe for {activeProfile?.name}, but not for everyone</AlertTitle>
                        <AlertDescription className="space-y-3">
                          {allergenicMembers.map((result, idx) => (
                            <div key={idx} className="space-y-1">
                              <p className="font-medium">{result.member.name} has allergies to ingredients in this recipe</p>
                              <div className="flex flex-wrap gap-1">
                                <span className="text-sm">Problem ingredients: </span>
                                {result.problemIngredients.map((ingredient, i) => (
                                  <Badge key={i} variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
                                    {ingredient}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </AlertDescription>
                      </Alert>
                    );
                  } else {
                    return (
                      <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
                        <Check className="h-4 w-4 text-green-500" />
                        <AlertTitle>Safe Recipe</AlertTitle>
                        <AlertDescription>
                          This recipe appears to be safe for {activeProfile?.name || 'the current profile'} and all family members.
                        </AlertDescription>
                      </Alert>
                    );
                  }
                })()}
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                <h3 className="text-lg font-semibold mb-2 text-green-800">Ingredients</h3>
                <ul className="space-y-1">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
                <h3 className="text-lg font-semibold mb-2 text-green-800">Instructions</h3>
                <ol className="space-y-3 list-decimal list-inside">
                  {selectedRecipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-semibold mb-2 text-green-800">Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-3 rounded-md shadow-sm border border-green-100">
                    <p className="text-sm text-green-600">Preparation Time</p>
                    <p className="font-medium">{selectedRecipe.preparationTime} min</p>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm border border-green-100">
                    <p className="text-sm text-green-600">Servings</p>
                    <p className="font-medium">{selectedRecipe.servings}</p>
                  </div>
                  {selectedRecipe.cuisineType && (
                    <div className="bg-white p-3 rounded-md shadow-sm border border-green-100">
                      <p className="text-sm text-green-600">Cuisine</p>
                      <p className="font-medium">{selectedRecipe.cuisineType}</p>
                    </div>
                  )}
                  {selectedRecipe.difficulty && (
                    <div className="bg-white p-3 rounded-md shadow-sm border border-green-100">
                      <p className="text-sm text-green-600">Difficulty</p>
                      <p className="font-medium capitalize">{selectedRecipe.difficulty}</p>
                    </div>
                  )}
                </div>
                
                {selectedRecipe.allergens.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2 text-green-800">Contains Allergens</h3>
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
                className="bg-green-600 hover:bg-green-700"
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
