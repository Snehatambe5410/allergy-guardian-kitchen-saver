import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { CheckCircle2, AlertTriangle, ArrowLeft, BookOpen, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { AllergenCheckResult, Recipe } from '../types';
import { useAppContext } from '../context/AppContext';

const ScanResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeProfile, recipes, suggestRecipes } = useAppContext();
  
  // Get scan result from location state
  const scanResult = location.state?.scanResult as AllergenCheckResult | undefined;
  
  // If no scan result is available, redirect back to scanner
  React.useEffect(() => {
    if (!scanResult) {
      navigate('/scanner');
    }
  }, [scanResult, navigate]);
  
  if (!scanResult) {
    return null; // Will redirect via the effect above
  }
  
  // Find recipes that don't contain the allergens
  const safeRecipes = recipes.filter(recipe => {
    // If the scan result is safe, all recipes are potentially good
    if (scanResult.safe) return true;
    
    // Otherwise, filter out recipes containing the allergens
    for (const allergen of scanResult.allergies) {
      if (recipe.allergens.includes(allergen.name)) {
        return false;
      }
    }
    return true;
  }).slice(0, 3); // Limit to 3 recipes for display
  
  const handleViewRecipes = () => {
    navigate('/recipes');
  };
  
  const handleAddToGroceryList = () => {
    // This would typically add the item to a grocery list
    // For now, just navigate to inventory
    navigate('/inventory');
  };

  return (
    <AppLayout title="Scan Results">
      <div className="p-4 max-w-lg mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Scanner
        </Button>
        
        <div className="space-y-6">
          {/* Results card */}
          <Card className={scanResult.safe 
            ? "border-l-4 border-green-400" 
            : "border-l-4 border-red-400"
          }>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                {scanResult.safe ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Safe for {activeProfile?.name || 'current profile'}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span>Contains allergens!</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {!scanResult.safe && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-2">Allergens detected:</p>
                  <div className="flex flex-wrap gap-2">
                    {scanResult.allergies.map((allergy, index) => (
                      <Badge 
                        key={index}
                        variant="destructive"
                        className={
                          allergy.severity === 'severe' 
                            ? 'bg-red-600' 
                            : allergy.severity === 'moderate'
                            ? 'bg-orange-600'
                            : 'bg-yellow-600'
                        }
                      >
                        {allergy.name} ({allergy.severity})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {!scanResult.safe && scanResult.alternatives && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Suggested safe alternatives:</p>
                  <div className="flex flex-wrap gap-2">
                    {scanResult.alternatives.map((alternative, index) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                      >
                        {alternative}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {scanResult.safe && (
                <div className="py-2 text-sm text-green-600">
                  This item does not contain any allergens for {activeProfile?.name || 'the current profile'}.
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={handleViewRecipes}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Find Recipes
              </Button>
              <Button 
                variant={scanResult.safe ? "default" : "ghost"}
                className="flex-1" 
                onClick={handleAddToGroceryList}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to List
              </Button>
            </CardFooter>
          </Card>
          
          {/* Recommended Recipes */}
          <div>
            <h3 className="text-lg font-medium mb-3">Safe Recipes For You</h3>
            <div className="space-y-3">
              {safeRecipes.length > 0 ? (
                safeRecipes.map(recipe => (
                  <Card key={recipe.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <div 
                        className="h-20 w-20 bg-gray-100 shrink-0"
                        style={{
                          backgroundImage: recipe.image ? `url(${recipe.image})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      <div className="p-3">
                        <h4 className="font-medium text-sm">{recipe.name}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span className="mr-2">{recipe.preparationTime} min</span>
                          <span>{recipe.difficulty || 'medium'}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No safe recipes found matching these criteria
                </div>
              )}
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleViewRecipes}
              >
                View All Safe Recipes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ScanResultPage;
