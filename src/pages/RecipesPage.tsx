
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import AppLayout from '../components/layout/AppLayout';
import { useAppContext } from '../context/AppContext';
import { Recipe } from '../types';
import SampleRecipesBrowser from '../components/recipes/SampleRecipesBrowser';
import MyRecipesTab from '../components/recipes/MyRecipesTab';
import RecipeForm from '../components/recipes/RecipeForm';

const RecipesPage = () => {
  const { recipes, addRecipe, updateRecipe, removeRecipe, toggleFavoriteRecipe } = useAppContext();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("my-recipes");
  
  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    allergens: string[];
    preparationTime: number;
    servings: number;
    isFavorite: boolean;
    image?: string;
  }>({
    name: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    allergens: [],
    preparationTime: 30,
    servings: 4,
    isFavorite: false,
    image: undefined
  });
  
  const commonAllergens = [
    'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree nuts',
    'Peanuts', 'Wheat', 'Soybeans', 'Sesame'
  ];
  
  const handleAddRecipe = () => {
    setIsEditMode(false);
    setFormData({
      name: '',
      description: '',
      ingredients: [''],
      instructions: [''],
      allergens: [],
      preparationTime: 30,
      servings: 4,
      isFavorite: false,
      image: undefined
    });
    setIsDialogOpen(true);
  };
  
  const handleEditRecipe = (recipe: Recipe) => {
    setIsEditMode(true);
    setEditingRecipeId(recipe.id);
    setFormData({
      name: recipe.name,
      description: recipe.description || '',
      ingredients: [...recipe.ingredients],
      instructions: [...recipe.instructions],
      allergens: [...recipe.allergens],
      preparationTime: recipe.preparationTime,
      servings: recipe.servings,
      isFavorite: recipe.isFavorite,
      image: recipe.image
    });
    setIsDialogOpen(true);
  };
  
  const handleDeleteRecipe = (id: string) => {
    removeRecipe(id);
    toast({
      title: "Recipe removed",
      description: "The recipe has been successfully removed.",
    });
  };
  
  const handleFavoriteToggle = (id: string) => {
    toggleFavoriteRecipe(id);
  };
  
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const handleArrayItemChange = (field: 'ingredients' | 'instructions', index: number, value: string) => {
    const items = [...formData[field]];
    items[index] = value;
    handleInputChange(field, items);
  };
  
  const addArrayItem = (field: 'ingredients' | 'instructions') => {
    handleInputChange(field, [...formData[field], '']);
  };
  
  const removeArrayItem = (field: 'ingredients' | 'instructions', index: number) => {
    const items = [...formData[field]];
    items.splice(index, 1);
    handleInputChange(field, items);
  };
  
  const toggleAllergen = (allergen: string) => {
    const allergens = [...formData.allergens];
    if (allergens.includes(allergen)) {
      handleInputChange('allergens', allergens.filter(a => a !== allergen));
    } else {
      handleInputChange('allergens', [...allergens, allergen]);
    }
  };
  
  const handleSubmit = () => {
    if (!formData.name || formData.ingredients.filter(i => i.trim()).length === 0 || 
        formData.instructions.filter(i => i.trim()).length === 0) {
      toast({
        title: "Missing information",
        description: "Please provide a name, ingredients, and instructions.",
        variant: "destructive"
      });
      return;
    }
    
    const recipeData: Recipe = {
      id: isEditMode && editingRecipeId ? editingRecipeId : crypto.randomUUID(),
      name: formData.name,
      description: formData.description || undefined,
      ingredients: formData.ingredients.filter(i => i.trim()),
      instructions: formData.instructions.filter(i => i.trim()),
      allergens: formData.allergens,
      preparationTime: formData.preparationTime,
      servings: formData.servings,
      isFavorite: formData.isFavorite,
      image: formData.image
    };
    
    if (isEditMode && editingRecipeId) {
      updateRecipe(editingRecipeId, recipeData);
      toast({
        title: "Recipe updated",
        description: `${recipeData.name} has been updated.`
      });
    } else {
      addRecipe(recipeData);
      toast({
        title: "Recipe added",
        description: `${recipeData.name} has been added to your recipes.`
      });
    }
    
    setIsDialogOpen(false);
  };

  return (
    <AppLayout title="Recipes">
      <div className="p-4 max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="my-recipes">My Recipes</TabsTrigger>
            <TabsTrigger value="sample-recipes">Sample Recipes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-recipes" className="mt-0">
            <MyRecipesTab
              recipes={recipes}
              onAddRecipe={handleAddRecipe}
              onEditRecipe={handleEditRecipe}
              onDeleteRecipe={handleDeleteRecipe}
              onFavoriteToggle={handleFavoriteToggle}
              setActiveTab={setActiveTab}
            />
          </TabsContent>
          
          <TabsContent value="sample-recipes" className="mt-0">
            <SampleRecipesBrowser />
          </TabsContent>
        </Tabs>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              onInputChange={handleInputChange}
              onArrayItemChange={handleArrayItemChange}
              addArrayItem={addArrayItem}
              removeArrayItem={removeArrayItem}
              toggleAllergen={toggleAllergen}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
              isEditMode={isEditMode}
              commonAllergens={commonAllergens}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default RecipesPage;
