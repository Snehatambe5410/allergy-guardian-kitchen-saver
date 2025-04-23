
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Recipe } from '@/types';
import { Leaf, Clock, Users, Utensils, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useAppContext } from '@/context/AppContext';

interface RecipeDetailDialogProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const RecipeDetailDialog = ({ recipe, isOpen, onOpenChange }: RecipeDetailDialogProps) => {
  const { activeProfile, familyMembers, isRecipeSafeForProfile } = useAppContext();
  
  if (!recipe) return null;
  
  // Check if the recipe is safe for the active profile
  const safetyCheck = isRecipeSafeForProfile(recipe, activeProfile);
  
  // Check if the recipe is safe for all family members
  const familyAllergies = familyMembers
    .map(member => {
      const safety = isRecipeSafeForProfile(recipe, member);
      return !safety.safe ? { name: member.name, allergens: safety.problemIngredients } : null;
    })
    .filter(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto border-green-200">
        <DialogHeader className="bg-gradient-to-r from-green-50 to-green-100 p-4 -mx-4 -mt-4 mb-4 rounded-t-lg">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <DialogTitle className="text-green-800">{recipe.name}</DialogTitle>
          </div>
          {recipe.description && (
            <DialogDescription className="text-green-700 mt-2">
              {recipe.description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipe.image && (
            <div className="col-span-1 md:col-span-2">
              <img 
                src={recipe.image} 
                alt={recipe.name} 
                className="w-full h-64 object-cover rounded-lg border border-green-200 shadow-sm"
              />
            </div>
          )}
          
          {!safetyCheck.safe && (
            <div className="col-span-1 md:col-span-2 bg-red-50 border border-red-200 p-4 rounded-md flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Allergy Warning</h4>
                <p className="text-red-700 text-sm">This recipe contains allergens that may affect {activeProfile?.name || 'you'}.</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {safetyCheck.problemIngredients.map((ingredient, i) => (
                    <Badge key={i} variant="outline" className="bg-red-100 text-red-800 border-red-200">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {familyAllergies.length > 0 && (
            <div className="col-span-1 md:col-span-2 bg-amber-50 border border-amber-200 p-4 rounded-md">
              <h4 className="font-medium text-amber-800 mb-2">Family Allergy Notice</h4>
              <div className="space-y-2">
                {familyAllergies.map((member, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-amber-700 text-sm">
                        <span className="font-medium">{member?.name}</span> may be allergic to:
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {member?.allergens?.map((allergen, i) => (
                          <Badge key={i} variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-green-50/50 p-4 rounded-lg border border-green-100">
            <h3 className="text-lg font-semibold mb-3 text-green-800 flex items-center gap-2">
              <Utensils className="h-5 w-5 text-green-600" />
              Ingredients
            </h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 mt-2"></span>
                  <span className="text-green-900">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-green-50/50 p-4 rounded-lg border border-green-100">
            <h3 className="text-lg font-semibold mb-3 text-green-800">Instructions</h3>
            <ol className="space-y-3 list-decimal list-inside">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="text-green-900">{step}</li>
              ))}
            </ol>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-3 text-green-800">Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-3 rounded-md border border-green-100">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-700">Preparation Time</p>
                </div>
                <p className="font-medium text-green-900 mt-1">{recipe.preparationTime} min</p>
              </div>
              <div className="bg-green-50 p-3 rounded-md border border-green-100">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-700">Servings</p>
                </div>
                <p className="font-medium text-green-900 mt-1">{recipe.servings}</p>
              </div>
              {recipe.cuisineType && (
                <div className="bg-green-50 p-3 rounded-md border border-green-100">
                  <p className="text-sm text-green-700">Cuisine</p>
                  <p className="font-medium text-green-900 mt-1">{recipe.cuisineType}</p>
                </div>
              )}
              {recipe.difficulty && (
                <div className="bg-green-50 p-3 rounded-md border border-green-100">
                  <p className="text-sm text-green-700">Difficulty</p>
                  <p className="font-medium text-green-900 mt-1 capitalize">{recipe.difficulty}</p>
                </div>
              )}
            </div>
            
            {recipe.allergens.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-green-800">Contains Allergens</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.allergens.map((allergen, index) => (
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
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetailDialog;
