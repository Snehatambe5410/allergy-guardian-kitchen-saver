
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Recipe } from '@/types';
import RecipeForm from './RecipeForm';
import { useToast } from '@/hooks/use-toast';

interface RecipeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
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
    cuisineType?: string;
    mealType?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
  };
  onInputChange: (field: string, value: any) => void;
  onArrayItemChange: (field: 'ingredients' | 'instructions', index: number, value: string) => void;
  addArrayItem: (field: 'ingredients' | 'instructions') => void;
  removeArrayItem: (field: 'ingredients' | 'instructions', index: number) => void;
  onSubmit: () => void;
}

const RecipeDialog = ({
  isOpen,
  onOpenChange,
  isEditMode,
  formData,
  onInputChange,
  onArrayItemChange,
  addArrayItem,
  removeArrayItem,
  onSubmit
}: RecipeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Recipe' : 'Add New Recipe'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update recipe details and instructions.' 
              : 'Fill in the details for your new recipe.'}
          </DialogDescription>
        </DialogHeader>
        
        <RecipeForm
          formData={formData}
          onInputChange={onInputChange}
          onArrayItemChange={onArrayItemChange}
          addArrayItem={addArrayItem}
          removeArrayItem={removeArrayItem}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDialog;
