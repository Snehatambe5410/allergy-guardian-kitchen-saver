
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Recipe } from '@/types';
import RecipeBrowser from './RecipeBrowser';
import SampleRecipesBrowser from './SampleRecipesBrowser';
import { ScrollArea } from '../ui/scroll-area';

interface RecipeTabsContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  recipes: Recipe[];
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
  onFavoriteToggle: (id: string) => void;
  onRecipeSelect: (recipe: Recipe) => void;
  onImportRecipe: (recipe: Recipe) => void;
}

const RecipeTabsContainer = ({
  activeTab,
  setActiveTab,
  recipes,
  onEditRecipe,
  onDeleteRecipe,
  onFavoriteToggle,
  onRecipeSelect,
  onImportRecipe
}: RecipeTabsContainerProps) => {
  return (
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
              onEditRecipe={onEditRecipe}
              onDeleteRecipe={onDeleteRecipe}
              onFavoriteToggle={onFavoriteToggle}
              onRecipeSelect={onRecipeSelect}
            />
          </TabsContent>
          
          <TabsContent value="sample-recipes" className="mt-0">
            <SampleRecipesBrowser onImport={onImportRecipe} />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default RecipeTabsContainer;
