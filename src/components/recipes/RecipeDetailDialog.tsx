
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Recipe } from '@/types';

interface RecipeDetailDialogProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const RecipeDetailDialog = ({ recipe, isOpen, onOpenChange }: RecipeDetailDialogProps) => {
  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{recipe.name}</DialogTitle>
          {recipe.description && (
            <DialogDescription>
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
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
            <ul className="space-y-1">
              {recipe.ingredients.map((ingredient, index) => (
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
              {recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Preparation Time</p>
                <p className="font-medium">{recipe.preparationTime} min</p>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm text-muted-foreground">Servings</p>
                <p className="font-medium">{recipe.servings}</p>
              </div>
              {recipe.cuisineType && (
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Cuisine</p>
                  <p className="font-medium">{recipe.cuisineType}</p>
                </div>
              )}
              {recipe.difficulty && (
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">Difficulty</p>
                  <p className="font-medium capitalize">{recipe.difficulty}</p>
                </div>
              )}
            </div>
            
            {recipe.allergens.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Contains Allergens</h3>
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
