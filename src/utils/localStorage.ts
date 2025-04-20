
import { 
  UserProfile, 
  FamilyMember, 
  FoodItem, 
  Recipe, 
  MealPlan
} from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'allergyGuard_userProfile',
  FAMILY_MEMBERS: 'allergyGuard_familyMembers',
  INVENTORY: 'allergyGuard_inventory',
  RECIPES: 'allergyGuard_recipes',
  MEAL_PLANS: 'allergyGuard_mealPlans',
  IS_ONBOARDED: 'allergyGuard_isOnboarded',
  ACTIVE_PROFILE_ID: 'allergyGuard_activeProfileId'
};

// Generic function to save data to local storage
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
};

// Generic function to load data from local storage
export const loadFromLocalStorage = <T>(key: string, fallback: T): T => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return fallback;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
    return fallback;
  }
};

// Specific functions for each data type
export const saveUserProfile = (profile: UserProfile | null): void => {
  saveToLocalStorage(STORAGE_KEYS.USER_PROFILE, profile);
};

export const loadUserProfile = (fallback: UserProfile | null = null): UserProfile | null => {
  return loadFromLocalStorage(STORAGE_KEYS.USER_PROFILE, fallback);
};

export const saveFamilyMembers = (members: FamilyMember[]): void => {
  saveToLocalStorage(STORAGE_KEYS.FAMILY_MEMBERS, members);
};

export const loadFamilyMembers = (fallback: FamilyMember[] = []): FamilyMember[] => {
  return loadFromLocalStorage(STORAGE_KEYS.FAMILY_MEMBERS, fallback);
};

export const saveInventory = (inventory: FoodItem[]): void => {
  saveToLocalStorage(STORAGE_KEYS.INVENTORY, inventory);
};

export const loadInventory = (fallback: FoodItem[] = []): FoodItem[] => {
  return loadFromLocalStorage(STORAGE_KEYS.INVENTORY, fallback);
};

export const saveRecipes = (recipes: Recipe[]): void => {
  saveToLocalStorage(STORAGE_KEYS.RECIPES, recipes);
};

export const loadRecipes = (fallback: Recipe[] = []): Recipe[] => {
  return loadFromLocalStorage(STORAGE_KEYS.RECIPES, fallback);
};

export const saveMealPlans = (mealPlans: MealPlan[]): void => {
  saveToLocalStorage(STORAGE_KEYS.MEAL_PLANS, mealPlans);
};

export const loadMealPlans = (fallback: MealPlan[] = []): MealPlan[] => {
  return loadFromLocalStorage(STORAGE_KEYS.MEAL_PLANS, fallback);
};

export const saveIsOnboarded = (isOnboarded: boolean): void => {
  saveToLocalStorage(STORAGE_KEYS.IS_ONBOARDED, isOnboarded);
};

export const loadIsOnboarded = (fallback: boolean = false): boolean => {
  return loadFromLocalStorage(STORAGE_KEYS.IS_ONBOARDED, fallback);
};

export const saveActiveProfileId = (profileId: string | null): void => {
  saveToLocalStorage(STORAGE_KEYS.ACTIVE_PROFILE_ID, profileId);
};

export const loadActiveProfileId = (fallback: string | null = null): string | null => {
  return loadFromLocalStorage(STORAGE_KEYS.ACTIVE_PROFILE_ID, fallback);
};

// For importing/exporting data
export const exportAllData = (): string => {
  const data = {
    userProfile: loadUserProfile(),
    familyMembers: loadFamilyMembers(),
    inventory: loadInventory(),
    recipes: loadRecipes(),
    mealPlans: loadMealPlans(),
    isOnboarded: loadIsOnboarded(),
    activeProfileId: loadActiveProfileId()
  };
  
  return JSON.stringify(data);
};

export const importAllData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    // Validate essential properties
    if (!data.userProfile || !Array.isArray(data.familyMembers)) {
      return false;
    }
    
    // Save all data to local storage
    saveUserProfile(data.userProfile);
    saveFamilyMembers(data.familyMembers || []);
    saveInventory(data.inventory || []);
    saveRecipes(data.recipes || []);
    saveMealPlans(data.mealPlans || []);
    saveIsOnboarded(data.isOnboarded || false);
    saveActiveProfileId(data.activeProfileId || null);
    
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
};

export default {
  saveUserProfile,
  loadUserProfile,
  saveFamilyMembers,
  loadFamilyMembers,
  saveInventory,
  loadInventory,
  saveRecipes,
  loadRecipes,
  saveMealPlans,
  loadMealPlans,
  saveIsOnboarded,
  loadIsOnboarded,
  saveActiveProfileId,
  loadActiveProfileId,
  exportAllData,
  importAllData
};
