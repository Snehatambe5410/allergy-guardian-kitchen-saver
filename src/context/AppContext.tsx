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
import * as initialState from './initialState';
import * as userProfileActions from './userProfile/userProfileActions';
import * as inventoryActions from './inventory/inventoryActions';
import * as recipeActions from './recipes/recipeActions';
import * as familyActions from './family/familyActions';
import smartFeaturesService from '../services/smartFeaturesService';
import * as localStorage from '../utils/localStorage';

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
    localStorage.loadUserProfile(initialState.initialUserProfile)
  );
  const [isOnboarded, setIsOnboarded] = useState<boolean>(
    localStorage.loadIsOnboarded(false)
  );
  const [inventory, setInventory] = useState<FoodItem[]>(
    localStorage.loadInventory(initialState.initialInventory)
  );
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(
    localStorage.loadFamilyMembers(initialState.initialFamilyMembers)
  );
  const [recipes, setRecipes] = useState<Recipe[]>(
    localStorage.loadRecipes(initialState.initialRecipes)
  );
  const [loadingData, setLoadingData] = useState<boolean>(false);
  
  const [activeProfileId, setActiveProfileId] = useState<string | null>(
    localStorage.loadActiveProfileId(null)
  );
  
  const [activeProfile, setActiveProfileState] = useState<UserProfile | FamilyMember | null>(
    userProfile
  );
  
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(
    localStorage.loadMealPlans([])
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
    if (userProfile) {
      const updated = { ...userProfile, ...profile };
      setUserProfile(updated);
      
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
    } else if (profile.name) {
      // Create new profile if none exists
      const newProfile = {
        id: crypto.randomUUID(),
        name: profile.name,
        dietaryPreferences: profile.dietaryPreferences || [],
        allergies: profile.allergies || [],
        emergencyContacts: profile.emergencyContacts || [],
        ...profile
      } as UserProfile;
      
      setUserProfile(newProfile);
      setActiveProfileState(newProfile);
      setIsOnboarded(true);
    }
  };
  
  const addAllergy = (allergy: Allergy) => {
    if (userProfile) {
      const updated = {
        ...userProfile,
        allergies: [...userProfile.allergies, allergy]
      };
      setUserProfile(updated);
    }
  };
  
  const removeAllergy = (id: string) => {
    if (userProfile) {
      const updated = {
        ...userProfile,
        allergies: userProfile.allergies.filter(allergy => allergy.id !== id)
      };
      setUserProfile(updated);
    }
  };
  
  // Active profile management
  const setActiveProfile = (profileId: string | null) => {
    setActiveProfileId(profileId);
  };

  // Inventory Management
  const addInventoryItem = (item: FoodItem) => {
    const newItem = { ...item };
    if (!newItem.id) {
      newItem.id = crypto.randomUUID();
    }
    setInventory(prev => [...prev, newItem]);
    return Promise.resolve(newItem);
  };
  
  const addInventoryItems = (items: FoodItem[]) => {
    const newItems = items.map(item => ({
      ...item,
      id: item.id || crypto.randomUUID()
    }));
    setInventory(prev => [...prev, ...newItems]);
    return Promise.resolve(newItems);
  };
  
  const removeInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };
  
  const updateInventoryItem = (id: string, updates: Partial<FoodItem>) => {
    setInventory(prev => 
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
    return Promise.resolve();
  };

  // Family Profile Management
  const familyActionsInstance = familyActions.createFamilyActions(setFamilyMembers);

  const addFamilyMember = (member: FamilyMember) => {
    return familyActionsInstance.addFamilyMember(member);
  };
  
  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    return familyActionsInstance.updateFamilyMember(id, updates);
  };
  
  const removeFamilyMember = (id: string) => {
    return familyActionsInstance.removeFamilyMember(id);
  };
  
  const syncFamilyProfiles = () => {
    return familyActionsInstance.syncFamilyProfiles();
  };
  
  const importFamilyProfile = (profileData: Omit<FamilyMember, "id">) => {
    return familyActionsInstance.importFamilyProfile(profileData);
  };
  
  const exportFamilyProfile = (id: string) => {
    return familyActionsInstance.exportFamilyProfile(id);
  };

  // Recipe Management
  const addRecipe = (recipe: Recipe) => {
    const newRecipe = { ...recipe };
    if (!newRecipe.id) {
      newRecipe.id = crypto.randomUUID();
    }
    setRecipes(prev => [...prev, newRecipe]);
  };
  
  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes(prev => 
      prev.map(recipe => recipe.id === id ? { ...recipe, ...updates } : recipe)
    );
  };
  
  const removeRecipe = (id: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
  };
  
  const toggleFavoriteRecipe = (id: string) => {
    setRecipes(prev => 
      prev.map(recipe => 
        recipe.id === id 
          ? { ...recipe, isFavorite: !recipe.isFavorite } 
          : recipe
      )
    );
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
