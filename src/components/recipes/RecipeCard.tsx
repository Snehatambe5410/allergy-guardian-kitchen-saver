
import { CookingPot, Clock, Users, Edit, Trash2, Heart } from 'lucide-react';
import { Recipe } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onFavoriteToggle: (id: string) => void;
}

const RecipeCard = ({ 
  recipe, 
  onEdit, 
  onDelete, 
  onFavoriteToggle 
}: RecipeCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {recipe.image ? (
          <img 
            src={recipe.image} 
            alt={recipe.name} 
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-32 bg-muted flex items-center justify-center">
            <CookingPot className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 rounded-full"
          onClick={() => onFavoriteToggle(recipe.id)}
        >
          <Heart className={`h-5 w-5 text-white ${recipe.isFavorite ? "fill-white" : ""}`} />
        </Button>
      </div>
      
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
        {recipe.description && (
          <CardDescription>{recipe.description}</CardDescription>
        )}
        
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
      </CardHeader>
      
      <CardContent className="space-y-3">
        {recipe.allergens.length > 0 && (
          <div>
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
      </CardContent>
      
      <CardFooter className="justify-between pt-1">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(recipe)}
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="text-red-500"
          onClick={() => onDelete(recipe.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Remove
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
