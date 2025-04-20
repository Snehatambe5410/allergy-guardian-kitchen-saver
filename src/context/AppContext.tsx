
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AppContextType } from './AppContextType';
import { 
  UserProfile, 
  Allergy, 
  FoodItem, 
  Recipe, 
  FamilyMember,
  MealPlan,
  AllergenCheckResult
} from '../types';
import initialState from './initialState';
import * as userProfileActions from './userProfile/userProfileActions';
import * as inventoryActions from './inventory/inventoryActions';
import * as recipeActions from './recipes/recipeActions';
import * as familyActions from './family/familyActions';
import smartFeaturesService from '../services/smartFeaturesService';
import localStorage from '../utils/localStorage';

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // State setup from local storage or initial state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(
    localStorage.loadUserProfile(initialState.userProfile)
  );
  const [isOnboarded, setIsOnboarded] = useState<boolean>(
    localStorage.loadIsOnboarded(initialState.isOnboarded)
  );
  const [inventory, setInventory] = useState<FoodItem[]>(
    localStorage.loadInventory(initialState.inventory)
  );
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(
    localStorage.loadFamilyMembers(initialState.familyMembers)
  );
  const [recipes, setRecipes] = useState<Recipe[]>(
    localStorage.loadRecipes(initialState.recipes)
  );
  const [loadingData, setLoadingData] = useState<boolean>(false);
  
  const [activeProfileId, setActiveProfileId] = useState<string | null>(
    localStorage.loadActiveProfileId(null)
  );
  
  const [activeProfile, setActiveProfileState] = useState<UserProfile | FamilyMember | null>(
    userProfile
  );
  
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(
    localStorage.loadMealPlans(initialState.mealPlans)
  );

  // Persist data to local storage when it changes
  useEffect(() => {
    localStorage.saveUserProfile(userProfile);
  }, [userProfile]);

  useEffect(() => {
    localStorage.saveIsOnboarded(isOnboarded);
  }, [isOnboarded]);
  
  useEffect(() => {
    localStorage.saveInventory(inventory);
  }, [inventory]);
  
  useEffect(() => {
    localStorage.saveFamilyMembers(familyMembers);
  }, [familyMembers]);
  
  useEffect(() => {
    localStorage.saveRecipes(recipes);
  }, [recipes]);
  
  useEffect(() => {
    localStorage.saveMealPlans(mealPlans);
  }, [mealPlans]);
  
  useEffect(() => {
    localStorage.saveActiveProfileId(activeProfileId);
  }, [activeProfileId]);

  // Set active profile based on activeProfileId
  useEffect(() => {
    if (!activeProfileId && userProfile) {
      setActiveProfileState(userProfile);
      return;
    }
    
    if (activeProfileId && userProfile && userProfile.id === activeProfileId) {
      setActiveProfileState(userProfile);
      return;
    }
    
    if (activeProfileId) {
      const familyMember = familyMembers.find(member => member.id === activeProfileId);
      if (familyMember) {
        setActiveProfileState(familyMember);
        return;
      }
    }
    
    // Fallback to user profile
    setActiveProfileState(userProfile);
  }, [activeProfileId, userProfile, familyMembers]);

  // Profile Management
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    userProfileActions.updateUserProfile(profile, setUserProfile);
    
    // If active profile is the user profile, update it too
    if (activeProfile && (!activeProfile.id || activeProfile.id === userProfile?.id)) {
      setActiveProfileState({
        ...activeProfile,
        ...profile
      });
    }
    
    // If this is the first update, set onboarded to true
    if (!isOnboarded && profile.name) {
      setIsOnboarded(true);
    }
  };
  
  const addAllergy = (allergy: Allergy) => {
    userProfileActions.addAllergy(allergy, userProfile, setUserProfile);
  };
  
  const removeAllergy = (id: string) => {
    userProfileActions.removeAllergy(id, userProfile, setUserProfile);
  };
  
  // Active profile management
  const setActiveProfile = (profileId: string | null) => {
    setActiveProfileId(profileId);
  };

  // Inventory Management
  const addInventoryItem = (item: FoodItem) => {
    return inventoryActions.addInventoryItem(item, inventory, setInventory);
  };
  
  const addInventoryItems = (items: FoodItem[]) => {
    return inventoryActions.addInventoryItems(items, inventory, setInventory);
  };
  
  const removeInventoryItem = (id: string) => {
    inventoryActions.removeInventoryItem(id, inventory, setInventory);
  };
  
  const updateInventoryItem = (id: string, updates: Partial<FoodItem>) => {
    return inventoryActions.updateInventoryItem(id, updates, inventory, setInventory);
  };

  // Family Profile Management
  const addFamilyMember = (member: FamilyMember) => {
    return familyActions.addFamilyMember(member, familyMembers, setFamilyMembers);
  };
  
  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    return familyActions.updateFamilyMember(id, updates, familyMembers, setFamilyMembers);
  };
  
  const removeFamilyMember = (id: string) => {
    return familyActions.removeFamilyMember(id, familyMembers, setFamilyMembers);
  };
  
  const syncFamilyProfiles = () => {
    return familyActions.syncFamilyProfiles();
  };
  
  const importFamilyProfile = (profileData: Omit<FamilyMember, "id">) => {
    return familyActions.importFamilyProfile(profileData, familyMembers, setFamilyMembers);
  };
  
  const exportFamilyProfile = (id: string) => {
    return familyActions.exportFamilyProfile(id, familyMembers);
  };

  // Recipe Management
  const addRecipe = (recipe: Recipe) => {
    recipeActions.addRecipe(recipe, recipes, setRecipes);
  };
  
  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    recipeActions.updateRecipe(id, updates, recipes, setRecipes);
  };
  
  const removeRecipe = (id: string) => {
    recipeActions.removeRecipe(id, recipes, setRecipes);
  };
  
  const toggleFavoriteRecipe = (id: string) => {
    recipeActions.toggleFavoriteRecipe(id, recipes, setRecipes);
  };

  // Meal Planning
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
  
  // Smart Features
  const checkIngredientSafety = (ingredientName: string): AllergenCheckResult => {
    return smartFeaturesService.checkIngredientSafety(ingredientName, activeProfile);
  };
  
  const suggestRecipes = (): Recipe[] => {
    return smartFeaturesService.suggestRecipes(inventory, recipes, activeProfile);
  };
  
  const generateGroceryList = (recipeIds: string[]): FoodItem[] => {
    const selectedRecipes = recipes.filter(recipe => recipeIds.includes(recipe.id));
    return smartFeaturesService.generateGroceryList(selectedRecipes, inventory);
  };

  // Context value
  const contextValue: AppContextType = {
    userProfile,
    isOnboarded,
    inventory,
    familyMembers,
    recipes,
    loadingData,
    activeProfile,
    mealPlans,
    
    // Profile management
    updateUserProfile,
    addAllergy,
    removeAllergy,
    setActiveProfile,
    
    // Inventory management
    addInventoryItem,
    addInventoryItems,
    removeInventoryItem,
    updateInventoryItem,
    
    // Family profiles
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
    syncFamilyProfiles,
    importFamilyProfile,
    exportFamilyProfile,
    
    // Recipe management
    addRecipe,
    updateRecipe,
    removeRecipe,
    toggleFavoriteRecipe,
    
    // Meal planning
    addMealPlan,
    updateMealPlan,
    removeMealPlan,
    
    // Smart features
    checkIngredientSafety,
    suggestRecipes,
    generateGroceryList
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
