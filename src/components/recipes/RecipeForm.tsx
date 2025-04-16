
import { Recipe } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { DialogFooter } from '../ui/dialog';

interface RecipeFormProps {
  formData: {
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    allergens: string[];
    preparationTime: number;
    servings: number;
    isFavorite: boolean;
    image?: string;
  };
  onInputChange: (field: string, value: any) => void;
  onArrayItemChange: (field: 'ingredients' | 'instructions', index: number, value: string) => void;
  addArrayItem: (field: 'ingredients' | 'instructions') => void;
  removeArrayItem: (field: 'ingredients' | 'instructions', index: number) => void;
  toggleAllergen: (allergen: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditMode: boolean;
  commonAllergens: string[];
}

const RecipeForm = ({
  formData,
  onInputChange,
  onArrayItemChange,
  addArrayItem,
  removeArrayItem,
  toggleAllergen,
  onSubmit,
  onCancel,
  isEditMode,
  commonAllergens
}: RecipeFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Recipe Name</Label>
        <Input 
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder="e.g., Creamy Mushroom Pasta"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="A brief description of the recipe..."
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="preparationTime">Preparation Time (minutes)</Label>
          <Input 
            id="preparationTime"
            type="number"
            min={1}
            value={formData.preparationTime}
            onChange={(e) => onInputChange('preparationTime', parseInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="servings">Servings</Label>
          <Input 
            id="servings"
            type="number"
            min={1}
            value={formData.servings}
            onChange={(e) => onInputChange('servings', parseInt(e.target.value))}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Ingredients</Label>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => addArrayItem('ingredients')}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="space-y-2">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={ingredient}
                onChange={(e) => onArrayItemChange('ingredients', index, e.target.value)}
                placeholder={`Ingredient ${index + 1}`}
                className="flex-1"
              />
              {formData.ingredients.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeArrayItem('ingredients', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Instructions</Label>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => addArrayItem('instructions')}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        
        <div className="space-y-2">
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-none flex items-center justify-center bg-muted rounded-full w-6 h-6 text-xs font-medium">
                {index + 1}
              </div>
              <Input
                value={instruction}
                onChange={(e) => onArrayItemChange('instructions', index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                className="flex-1"
              />
              {formData.instructions.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeArrayItem('instructions', index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Allergens</Label>
        <div className="flex flex-wrap gap-2">
          {commonAllergens.map((allergen) => (
            <Badge
              key={allergen}
              variant="outline"
              className={`cursor-pointer ${
                formData.allergens.includes(allergen) 
                  ? "bg-red-100 text-red-800 border-red-200" 
                  : ""
              }`}
              onClick={() => toggleAllergen(allergen)}
            >
              {allergen}
            </Badge>
          ))}
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {isEditMode ? 'Save Changes' : 'Add Recipe'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default RecipeForm;
