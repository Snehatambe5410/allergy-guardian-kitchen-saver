
import { useState } from 'react';
import { useToast } from '../hooks/use-toast';
import AppLayout from '../components/layout/AppLayout';
import { useAppContext } from '../context/AppContext';
import { Recipe } from '../types';
import RecipeDialog from '../components/recipes/RecipeDialog';
import RecipeDetailDialog from '../components/recipes/RecipeDetailDialog';
import RecipeTabsContainer from '../components/recipes/RecipeTabsContainer';

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

  const handleImportRecipe = (recipe: Recipe) => {
    addRecipe(recipe);
    toast({
      title: "Recipe imported",
      description: `${recipe.name} has been added to your recipes.`,
    });
  };

  return (
    <AppLayout title="Recipes">
      <RecipeTabsContainer
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        recipes={recipes}
        onEditRecipe={handleEditRecipe}
        onDeleteRecipe={removeRecipe}
        onFavoriteToggle={toggleFavoriteRecipe}
        onRecipeSelect={(recipe) => {
          setSelectedRecipe(recipe);
          setShowRecipeDetail(true);
        }}
        onImportRecipe={handleImportRecipe}
      />

      <RecipeDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEditMode={isEditMode}
        formData={formData}
        onInputChange={handleInputChange}
        onArrayItemChange={handleArrayItemChange}
        addArrayItem={addArrayItem}
        removeArrayItem={removeArrayItem}
        onSubmit={handleSubmit}
      />

      <RecipeDetailDialog
        recipe={selectedRecipe}
        isOpen={showRecipeDetail}
        onOpenChange={setShowRecipeDetail}
      />
    </AppLayout>
  );
};

export default RecipesPage;
