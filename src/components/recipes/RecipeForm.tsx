
import { useState, useEffect } from 'react';
import { Trash2, Plus, X, Clock, Users, ChevronDown, Tag, CornerUpRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { Slider } from '../ui/slider';
import { CuisineType, MealType, DifficultyLevel } from '@/data/types';

interface RecipeFormData {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  allergens: string[];
  preparationTime: number;
  servings: number;
  isFavorite: boolean;
  image?: string;
  cuisineType?: string;
  mealType?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

interface RecipeFormProps {
  formData: RecipeFormData;
  onInputChange: (field: string, value: any) => void;
  onArrayItemChange: (field: 'ingredients' | 'instructions', index: number, value: string) => void;
  addArrayItem: (field: 'ingredients' | 'instructions') => void;
  removeArrayItem: (field: 'ingredients' | 'instructions', index: number) => void;
  onSubmit: () => void;
}

const cuisineTypes: CuisineType[] = [
  'Indian',
  'Italian',
  'American',
  'Mexican',
  'Chinese',
  'Thai',
  'Japanese',
  'Mediterranean',
  'International'
];

const mealTypes: MealType[] = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack',
  'Dessert'
];

const difficultyLevels: DifficultyLevel[] = ['easy', 'medium', 'hard'];

// Common allergens for the dropdown
const commonAllergens = [
  'Milk',
  'Eggs',
  'Peanuts',
  'Tree nuts',
  'Fish',
  'Shellfish',
  'Wheat',
  'Soy',
  'Sesame',
  'Mustard',
  'Celery',
  'Lupin',
  'Molluscs',
  'Sulphites'
];

const RecipeForm: React.FC<RecipeFormProps> = ({
  formData,
  onInputChange,
  onArrayItemChange,
  addArrayItem,
  removeArrayItem,
  onSubmit
}) => {
  const [newAllergen, setNewAllergen] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | undefined>(formData.image);

  useEffect(() => {
    setImagePreview(formData.image);
  }, [formData.image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        onInputChange('image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAllergen = () => {
    if (newAllergen && !formData.allergens.includes(newAllergen)) {
      onInputChange('allergens', [...formData.allergens, newAllergen]);
      setNewAllergen('');
    }
  };

  const handleRemoveAllergen = (allergen: string) => {
    onInputChange('allergens', formData.allergens.filter(a => a !== allergen));
  };

  const handleAddTag = () => {
    if (newTag && formData.tags && !formData.tags.includes(newTag)) {
      onInputChange('tags', [...(formData.tags || []), newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (formData.tags) {
      onInputChange('tags', formData.tags.filter(t => t !== tag));
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      {/* Basic Info Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-md font-semibold">Recipe Name</Label>
          <Input 
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Enter recipe name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-md font-semibold">Description</Label>
          <Textarea 
            id="description"
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder="Brief description of the recipe"
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Recipe Image */}
        <div>
          <Label htmlFor="image" className="text-md font-semibold">Recipe Image</Label>
          <div className="mt-1 flex items-center gap-4">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="max-w-xs"
            />
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Recipe preview"
                  className="h-16 w-16 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(undefined);
                    onInputChange('image', undefined);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="cuisineType" className="text-md font-semibold flex items-center gap-2">
            Cuisine Type
          </Label>
          <Select 
            value={formData.cuisineType} 
            onValueChange={(value) => onInputChange('cuisineType', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select cuisine type" />
            </SelectTrigger>
            <SelectContent>
              {cuisineTypes.map(cuisine => (
                <SelectItem key={cuisine} value={cuisine}>
                  {cuisine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="mealType" className="text-md font-semibold flex items-center gap-2">
            Meal Type
          </Label>
          <Select 
            value={formData.mealType} 
            onValueChange={(value) => onInputChange('mealType', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select meal type" />
            </SelectTrigger>
            <SelectContent>
              {mealTypes.map(meal => (
                <SelectItem key={meal} value={meal}>
                  {meal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="difficulty" className="text-md font-semibold flex items-center gap-2">
            Difficulty
          </Label>
          <Select 
            value={formData.difficulty} 
            onValueChange={(value) => onInputChange('difficulty', value as DifficultyLevel)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficultyLevels.map(level => (
                <SelectItem key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recipe Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="preparationTime" className="text-md font-semibold flex items-center gap-2">
            <Clock size={16} />
            Preparation Time (minutes): {formData.preparationTime}
          </Label>
          <Slider
            value={[formData.preparationTime]}
            min={5}
            max={180}
            step={5}
            className="mt-2"
            onValueChange={(value) => onInputChange('preparationTime', value[0])}
          />
        </div>
        
        <div>
          <Label htmlFor="servings" className="text-md font-semibold flex items-center gap-2">
            <Users size={16} />
            Servings: {formData.servings}
          </Label>
          <Slider
            value={[formData.servings]}
            min={1}
            max={12}
            step={1}
            className="mt-2"
            onValueChange={(value) => onInputChange('servings', value[0])}
          />
        </div>
      </div>

      {/* Ingredients Section */}
      <div>
        <Label className="text-md font-semibold">Ingredients</Label>
        <div className="space-y-2 mt-2">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input 
                value={ingredient}
                onChange={(e) => onArrayItemChange('ingredients', index, e.target.value)}
                placeholder={`Ingredient ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem('ingredients', index)}
              >
                <Trash2 size={16} className="text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('ingredients')}
            className="mt-2"
          >
            <Plus size={16} className="mr-1" /> Add Ingredient
          </Button>
        </div>
      </div>

      {/* Instructions Section */}
      <div>
        <Label className="text-md font-semibold">Instructions</Label>
        <div className="space-y-2 mt-2">
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="mt-2 font-medium text-muted-foreground w-6 text-right">
                {index + 1}.
              </div>
              <Textarea 
                value={instruction}
                onChange={(e) => onArrayItemChange('instructions', index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                rows={2}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem('instructions', index)}
              >
                <Trash2 size={16} className="text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('instructions')}
            className="mt-2"
          >
            <Plus size={16} className="mr-1" /> Add Step
          </Button>
        </div>
      </div>

      {/* Allergens Section */}
      <div>
        <Label className="text-md font-semibold flex items-center gap-2">
          Allergens
        </Label>
        <div className="flex items-center gap-2 mt-2">
          <Select 
            value={newAllergen} 
            onValueChange={setNewAllergen}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select allergen" />
            </SelectTrigger>
            <SelectContent>
              {commonAllergens.map(allergen => (
                <SelectItem key={allergen} value={allergen}>
                  {allergen}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddAllergen}
            disabled={!newAllergen}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {formData.allergens.length === 0 && (
            <span className="text-sm text-muted-foreground">No allergens added</span>
          )}
          {formData.allergens.map((allergen, index) => (
            <Badge 
              key={index}
              variant="destructive"
              className="flex items-center gap-1"
            >
              {allergen}
              <button
                type="button"
                onClick={() => handleRemoveAllergen(allergen)}
                className="ml-1 hover:bg-red-600 rounded-full"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Tags Section */}
      <div>
        <Label className="text-md font-semibold flex items-center gap-2">
          <Tag size={16} />
          Tags
        </Label>
        <div className="flex items-center gap-2 mt-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Enter a tag"
            className="max-w-[200px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddTag}
            disabled={!newTag}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {(!formData.tags || formData.tags.length === 0) && (
            <span className="text-sm text-muted-foreground">No tags added</span>
          )}
          {formData.tags && formData.tags.map((tag, index) => (
            <Badge 
              key={index}
              variant="outline"
              className="flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:bg-muted rounded-full"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit">
          Save Recipe
        </Button>
      </div>
    </form>
  );
};

export default RecipeForm;
