
import { useState } from 'react';
import { CookingPot, Search, Plus, Edit, Trash2, Heart, Clock, Users, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import AppLayout from '../components/layout/AppLayout';
import { useAppContext } from '../context/AppContext';
import { Recipe } from '../types';
import SampleRecipesBrowser from '../components/recipes/SampleRecipesBrowser';

const RecipesPage = () => {
  const { recipes, addRecipe, updateRecipe, removeRecipe, toggleFavoriteRecipe } = useAppContext();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);
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
  
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFavorite = filterFavorites ? recipe.isFavorite : true;
    return matchesSearch && matchesFavorite;
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
  
  const MyRecipesContent = () => (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Recipe Collection</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className={filterFavorites ? "bg-rose-100 text-rose-800 border-rose-200" : ""}
            onClick={() => setFilterFavorites(!filterFavorites)}
          >
            <Heart className={`h-4 w-4 mr-1 ${filterFavorites ? "fill-rose-500" : ""}`} />
            Favorites
          </Button>
          <Button onClick={handleAddRecipe}>
            <Plus className="mr-2 h-4 w-4" />
            Add Recipe
          </Button>
        </div>
      </div>
      
      {filteredRecipes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-muted p-3 mb-4">
              <CookingPot className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {searchQuery || filterFavorites ? "No matching recipes found" : "No recipes added yet"}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery || filterFavorites 
                ? "Try adjusting your search or filters"
                : "Add recipes to build your collection"}
            </p>
            <div className="flex gap-4">
              <Button onClick={handleAddRecipe}>
                <Plus className="mr-2 h-4 w-4" />
                Add Recipe
              </Button>
              <Button onClick={() => setActiveTab("sample-recipes")} variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Sample Recipes
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecipes.map(recipe => (
            <Card key={recipe.id} className="overflow-hidden">
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
                  onClick={() => handleFavoriteToggle(recipe.id)}
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
                  onClick={() => handleEditRecipe(recipe)}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500"
                  onClick={() => handleDeleteRecipe(recipe.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
  
  return (
    <AppLayout title="Recipes">
      <div className="p-4 max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="my-recipes">My Recipes</TabsTrigger>
            <TabsTrigger value="sample-recipes">Sample Recipes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-recipes" className="mt-0">
            <MyRecipesContent />
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
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Recipe Name</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Creamy Mushroom Pasta"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
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
                    onChange={(e) => handleInputChange('preparationTime', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="servings">Servings</Label>
                  <Input 
                    id="servings"
                    type="number"
                    min={1}
                    value={formData.servings}
                    onChange={(e) => handleInputChange('servings', parseInt(e.target.value))}
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
                        onChange={(e) => handleArrayItemChange('ingredients', index, e.target.value)}
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
                        onChange={(e) => handleArrayItemChange('instructions', index, e.target.value)}
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
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {isEditMode ? 'Save Changes' : 'Add Recipe'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default RecipesPage;
