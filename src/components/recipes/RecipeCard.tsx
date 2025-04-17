
import { CookingPot, Clock, Users, Edit, Trash2, Heart, ExternalLink } from 'lucide-react';
import { Recipe } from '../../types';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "../ui/tooltip";
import { useState } from 'react';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (id: string) => void;
  onFavoriteToggle?: (id: string) => void;
  showSource?: boolean;
  sourceUrl?: string;
  sourceName?: string;
}

const RecipeCard = ({ 
  recipe, 
  onEdit, 
  onDelete, 
  onFavoriteToggle,
  showSource = false,
  sourceUrl,
  sourceName
}: RecipeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="overflow-hidden transition-all duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {recipe.image ? (
          <div className="overflow-hidden h-48">
            <img 
              src={recipe.image} 
              alt={recipe.name} 
              className={`w-full h-48 object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
          </div>
        ) : (
          <div className="w-full h-32 bg-muted flex items-center justify-center">
            <CookingPot className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        {onFavoriteToggle && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 rounded-full"
                  onClick={() => onFavoriteToggle(recipe.id)}
                >
                  <Heart className={`h-5 w-5 text-white ${recipe.isFavorite ? "fill-white" : ""}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
        {recipe.description && (
          <CardDescription>{recipe.description}</CardDescription>
        )}
        
        {showSource && sourceUrl && sourceName && (
          <a 
            href={sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground mt-1 hover:text-blue-600"
          >
            <span>Source: {sourceName}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
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
        
        <div>
          <h3 className="text-sm font-medium mb-1">Ingredients:</h3>
          <p className="text-sm text-muted-foreground">
            {recipe.ingredients.length} items including{' '}
            {recipe.ingredients.slice(0, 2).join(', ')}
            {recipe.ingredients.length > 2 ? '...' : ''}
          </p>
        </div>
      </CardContent>
      
      {(onEdit || onDelete) && (
        <CardFooter className="justify-between pt-1">
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(recipe)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-500"
              onClick={() => onDelete(recipe.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Remove
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default RecipeCard;
