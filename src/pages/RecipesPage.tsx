
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
import RecipeBrowser from '../components/recipes/RecipeBrowser';
import { ScrollArea } from '../components/ui/scroll-area';

const RecipesPage = () => {
  const { recipes, addRecipe, updateRecipe, removeRecipe, toggleFavoriteRecipe } = useAppContext();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("my-recipes");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showRecipeDetail, setShowRecipeDetail] = useState(false);
  
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
    cuisineType?: string;
    mealType?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
  }>({
    name: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    allergens: [],
    preparationTime: 30,
    servings: 4,
    isFavorite: false,
    image: undefined,
    cuisineType: undefined,
    mealType: undefined,
    difficulty: 'medium',
    tags: []
  });
  
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
      image: undefined,
      cuisineType: undefined,
      mealType: undefined,
      difficulty: 'medium',
      tags: []
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
      image: recipe.image,
      cuisineType: recipe.cuisineType,
      mealType: recipe.mealType,
      difficulty: recipe.difficulty || 'medium',
      tags: recipe.tags || []
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
  
  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeDetail(true);
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
      image: formData.image,
      cuisineType: formData.cuisineType,
      mealType: formData.mealType,
      difficulty: formData.difficulty,
      tags: formData.tags
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
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="p-4 max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="my-recipes">My Recipes</TabsTrigger>
              <TabsTrigger value="sample-recipes">Sample Recipes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-recipes" className="mt-0">
              <RecipeBrowser 
                recipes={recipes}
                onEditRecipe={handleEditRecipe}
                onDeleteRecipe={handleDeleteRecipe}
                onFavoriteToggle={handleFavoriteToggle}
                onRecipeSelect={handleSelectRecipe}
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
                onSubmit={handleSubmit}
              />
            </DialogContent>
          </Dialog>
          
          {/* Recipe Detail Dialog */}
          {selectedRecipe && (
            <Dialog open={showRecipeDetail} onOpenChange={setShowRecipeDetail}>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{selectedRecipe.name}</DialogTitle>
                  {selectedRecipe.description && (
                    <DialogDescription>
                      {selectedRecipe.description}
                    </DialogDescription>
                  )}
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedRecipe.image && (
                    <div className="col-span-1 md:col-span-2">
                      <img 
                        src={selectedRecipe.image} 
                        alt={selectedRecipe.name} 
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                    <ul className="space-y-1">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
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
                      {selectedRecipe.instructions.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-lg font-semibold mb-2">Details</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">Preparation Time</p>
                        <p className="font-medium">{selectedRecipe.preparationTime} min</p>
                      </div>
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm text-muted-foreground">Servings</p>
                        <p className="font-medium">{selectedRecipe.servings}</p>
                      </div>
                      {selectedRecipe.cuisineType && (
                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm text-muted-foreground">Cuisine</p>
                          <p className="font-medium">{selectedRecipe.cuisineType}</p>
                        </div>
                      )}
                      {selectedRecipe.difficulty && (
                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm text-muted-foreground">Difficulty</p>
                          <p className="font-medium capitalize">{selectedRecipe.difficulty}</p>
                        </div>
                      )}
                    </div>
                    
                    {selectedRecipe.allergens.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Contains Allergens</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedRecipe.allergens.map((allergen, index) => (
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
          )}
        </div>
      </ScrollArea>
    </AppLayout>
  );
};

export default RecipesPage;
