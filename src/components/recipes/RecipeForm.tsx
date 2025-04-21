
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../ui/select";
import { Plus, Minus, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface FormData {
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
  formData: FormData;
  onInputChange: (field: string, value: any) => void;
  onArrayItemChange: (field: 'ingredients' | 'instructions', index: number, value: string) => void;
  addArrayItem: (field: 'ingredients' | 'instructions') => void;
  removeArrayItem: (field: 'ingredients' | 'instructions', index: number) => void;
  onSubmit: () => void;
}

const RecipeForm = ({
  formData,
  onInputChange,
  onArrayItemChange,
  addArrayItem,
  removeArrayItem,
  onSubmit
}: RecipeFormProps) => {
  const commonAllergens = [
    'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree nuts',
    'Peanuts', 'Wheat', 'Soybeans', 'Sesame'
  ];
  
  const cuisineTypes = [
    'Indian', 'Italian', 'American', 'Mexican', 'Chinese', 
    'Thai', 'Japanese', 'Mediterranean', 'International'
  ];
  
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
  
  const commonTags = [
    'Quick', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
    'Low-Carb', 'Keto', 'High-Protein', 'Budget-Friendly', 'Kid-Friendly',
    'One-Pot', 'Healthy', 'Comfort Food', 'Spicy', 'Sweet'
  ];
  
  const toggleAllergen = (allergen: string) => {
    const allergens = [...formData.allergens];
    if (allergens.includes(allergen)) {
      onInputChange('allergens', allergens.filter(a => a !== allergen));
    } else {
      onInputChange('allergens', [...allergens, allergen]);
    }
  };
  
  const toggleTag = (tag: string) => {
    const tags = [...(formData.tags || [])];
    if (tags.includes(tag)) {
      onInputChange('tags', tags.filter(t => t !== tag));
    } else {
      onInputChange('tags', [...tags, tag]);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label htmlFor="recipe-name" className="block text-sm font-medium mb-1">
            Recipe Name*
          </label>
          <Input
            id="recipe-name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Enter recipe name"
          />
        </div>
        
        <div>
          <label htmlFor="recipe-description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea
            id="recipe-description"
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder="Brief description of your recipe"
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="prep-time" className="block text-sm font-medium mb-1">
              Preparation Time (minutes)*
            </label>
            <Input
              id="prep-time"
              type="number"
              min="1"
              value={formData.preparationTime}
              onChange={(e) => onInputChange('preparationTime', parseInt(e.target.value) || 0)}
            />
          </div>
          <div>
            <label htmlFor="servings" className="block text-sm font-medium mb-1">
              Servings*
            </label>
            <Input
              id="servings"
              type="number"
              min="1"
              value={formData.servings}
              onChange={(e) => onInputChange('servings', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cuisine Type</label>
            <Select
              value={formData.cuisineType}
              onValueChange={(value) => onInputChange('cuisineType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cuisine" />
              </SelectTrigger>
              <SelectContent>
                {cuisineTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meal Type</label>
            <Select
              value={formData.mealType}
              onValueChange={(value) => onInputChange('mealType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                {mealTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Difficulty</label>
          <Select
            value={formData.difficulty}
            onValueChange={(value: 'easy' | 'medium' | 'hard') => onInputChange('difficulty', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="recipe-image" className="block text-sm font-medium mb-1">
            Image URL
          </label>
          <Input
            id="recipe-image"
            value={formData.image || ''}
            onChange={(e) => onInputChange('image', e.target.value)}
            placeholder="Enter image URL"
          />
          {formData.image && (
            <div className="mt-2 relative w-full h-40 bg-muted rounded-md overflow-hidden">
              <img 
                src={formData.image} 
                alt="Recipe preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/600x400?text=Image+Preview";
                }}
              />
              <button 
                className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
                onClick={() => onInputChange('image', '')}
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      {/* Ingredients */}
      <div>
        <label className="block text-lg font-medium mb-2">
          Ingredients*
        </label>
        <div className="space-y-3">
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={ingredient}
                onChange={(e) =>
                  onArrayItemChange('ingredients', index, e.target.value)
                }
                placeholder={`Ingredient ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem('ingredients', index)}
                disabled={formData.ingredients.length <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('ingredients')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Ingredient
          </Button>
        </div>
      </div>
      
      <Separator />
      
      {/* Instructions */}
      <div>
        <label className="block text-lg font-medium mb-2">
          Instructions*
        </label>
        <div className="space-y-3">
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-shrink-0 font-medium text-muted-foreground">
                {index + 1}.
              </div>
              <Textarea
                value={instruction}
                onChange={(e) =>
                  onArrayItemChange('instructions', index, e.target.value)
                }
                placeholder={`Step ${index + 1}`}
                rows={2}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem('instructions', index)}
                disabled={formData.instructions.length <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('instructions')}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Step
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="additional">
          <AccordionTrigger>Additional Information</AccordionTrigger>
          <AccordionContent>
            {/* Allergens */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Allergens (Check all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {commonAllergens.map((allergen) => (
                  <Badge
                    key={allergen}
                    variant={formData.allergens.includes(allergen) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleAllergen(allergen)}
                  >
                    {allergen}
                  </Badge>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  placeholder="Add custom allergen"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      toggleAllergen(e.currentTarget.value.trim());
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input.value.trim()) {
                      toggleAllergen(input.value.trim());
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {commonTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={(formData.tags || []).includes(tag) ? "secondary" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  placeholder="Add custom tag"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      toggleTag(e.currentTarget.value.trim());
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input.value.trim()) {
                      toggleTag(input.value.trim());
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => onSubmit()}>
          Cancel
        </Button>
        <Button onClick={() => onSubmit()}>
          {formData.id ? 'Save Changes' : 'Create Recipe'}
        </Button>
      </div>
    </div>
  );
};

export default RecipeForm;
