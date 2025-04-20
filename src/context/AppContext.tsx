
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppContextType } from './AppContextType';
import { 
  initialUserProfile,
  initialInventory,
  initialFamilyMembers,
  initialRecipes
} from './initialState';
import { createUserProfileActions } from './userProfile/userProfileActions';
import { createInventoryActions } from './inventory/inventoryActions';
import { createFamilyActions } from './family/familyActions';
import { createRecipeActions } from './recipes/recipeActions';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchUserProfile, 
  fetchFamilyMembers, 
  fetchUserInventory, 
  fetchUserRecipes 
} from '@/services';
import { FamilyMember, MealPlan, Recipe, Allergy, FoodItem } from '@/types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [inventory, setInventory] = useState(initialInventory);
  const [familyMembers, setFamilyMembers] = useState(initialFamilyMembers);
  const [recipes, setRecipes] = useState(initialRecipes);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeProfile, setActiveProfileState] = useState<FamilyMember | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Actions for each domain
  const userProfileActions = createUserProfileActions(setUserProfile);
  const inventoryActions = createInventoryActions(setInventory);
  const familyActions = createFamilyActions(setFamilyMembers);
  const recipeActions = createRecipeActions(setRecipes);
  
  // Set active profile
  const setActiveProfile = (profileId: string | null) => {
    if (!profileId) {
      setActiveProfileState(null);
      return;
    }
    
    if (profileId === 'primary' && userProfile) {
      setActiveProfileState(userProfile as unknown as FamilyMember);
      return;
    }
    
    const member = familyMembers.find(m => m.id === profileId);
    if (member) {
      setActiveProfileState(member);
    }
  };
  
  // Smart feature: Check ingredient safety
  const checkIngredientSafety = (ingredientName: string) => {
    const profile = activeProfile || userProfile;
    if (!profile) return { safe: true, allergies: [] };
    
    const lowerCaseIngredient = ingredientName.toLowerCase();
    const allergies = profile.allergies.filter(allergy => 
      lowerCaseIngredient.includes(allergy.name.toLowerCase())
    );
    
    // Generate alternatives (simplified version)
    const alternatives = allergies.length > 0 ? [
      "coconut milk", "oat milk", "almond milk", "sunflower butter",
      "rice flour", "cassava flour", "tofu", "coconut yogurt"
    ].filter(alt => !alt.includes(allergies[0]?.name.toLowerCase())) : [];
    
    return {
      safe: allergies.length === 0,
      allergies,
      alternatives: allergies.length > 0 ? alternatives : undefined
    };
  };
  
  // Smart feature: Suggest recipes
  const suggestRecipes = () => {
    const profile = activeProfile || userProfile;
    if (!profile) return [];
    
    // Filter recipes that don't contain allergens
    const userAllergens = profile.allergies.map(a => a.name.toLowerCase());
    
    return recipes.filter(recipe => {
      const recipeAllergens = recipe.allergens.map(a => a.toLowerCase());
      return !recipeAllergens.some(allergen => userAllergens.includes(allergen));
    }).slice(0, 5); // Return top 5
  };
  
  // Smart feature: Generate grocery list
  const generateGroceryList = (recipeIds: string[]) => {
    const selectedRecipes = recipes.filter(r => recipeIds.includes(r.id));
    
    // Simple implementation - just extract ingredients as food items
    return selectedRecipes.flatMap(recipe => 
      recipe.ingredients.map(ingredient => ({
        id: crypto.randomUUID(),
        name: ingredient,
        category: 'Other',
        quantity: 1,
        unit: 'item',
        expiryDate: ''
      }))
    );
  };
  
  // Meal plan features
  const addMealPlan = (plan: MealPlan) => {
    setMealPlans(prev => [...prev, plan]);
  };
  
  const updateMealPlan = (id: string, updates: Partial<MealPlan>) => {
    setMealPlans(prev => 
      prev.map(plan => plan.id === id ? { ...plan, ...updates } : plan)
    );
  };
  
  const removeMealPlan = (id: string) => {
    setMealPlans(prev => prev.filter(plan => plan.id !== id));
  };
  
  // Fetch all user data when authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Load user profile
        const profile = await fetchUserProfile();
        if (profile) {
          setUserProfile(profile);
        }

        // Load family members
        const members = await fetchFamilyMembers();
        if (members) {
          setFamilyMembers(members);
        }

        // Load inventory
        const items = await fetchUserInventory();
        if (items) {
          setInventory(items);
        }

        // Load recipes
        const recipeData = await fetchUserRecipes();
        if (recipeData) {
          setRecipes(recipeData);
        }
        
        // Set the primary profile as active by default
        setActiveProfile('primary');
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading your data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user, toast]);
  
  return (
    <AppContext.Provider value={{
      userProfile,
      isOnboarded: !!userProfile,
      inventory,
      familyMembers,
      recipes,
      loadingData: isLoading,
      activeProfile: activeProfile || userProfile,
      mealPlans,
      setActiveProfile,
      checkIngredientSafety,
      suggestRecipes,
      generateGroceryList,
      addMealPlan,
      updateMealPlan,
      removeMealPlan,
      ...userProfileActions,
      ...inventoryActions,
      ...familyActions,
      ...recipeActions
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
