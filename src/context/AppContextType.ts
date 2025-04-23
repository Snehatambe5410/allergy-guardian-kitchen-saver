
import {
  UserProfile,
  FamilyMember,
  Recipe,
  FoodItem,
  Allergy,
  MealPlan,
  AllergenCheckResult
} from '../types';

export interface AppContextType {
  // User profile state
  userProfile: UserProfile | null;
  isOnboarded: boolean;
  inventory: FoodItem[];
  familyMembers: FamilyMember[];
  recipes: Recipe[];
  loadingData: boolean;
  activeProfile: UserProfile | FamilyMember | null;
  mealPlans: MealPlan[];
  
  // Profile management
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addAllergy: (allergy: Allergy) => void;
  removeAllergy: (id: string) => void;
  setActiveProfile: (profileId: string | null) => void;
  
  // Inventory management
  addInventoryItem: (item: FoodItem) => Promise<FoodItem>;
  addInventoryItems: (items: FoodItem[]) => Promise<FoodItem[]>;
  removeInventoryItem: (id: string) => void;
  updateInventoryItem: (id: string, updates: Partial<FoodItem>) => Promise<void>;
  
  // Family profiles
  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  removeFamilyMember: (id: string) => void;
  syncFamilyProfiles: () => void;
  importFamilyProfile: (profileData: Omit<FamilyMember, "id">) => void;
  exportFamilyProfile: (id: string) => Omit<FamilyMember, "id">;
  
  // Recipe management
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  removeRecipe: (id: string) => void;
  toggleFavoriteRecipe: (id: string) => void;
  
  // Meal planning
  addMealPlan: (plan: MealPlan) => void;
  updateMealPlan: (id: string, updates: Partial<MealPlan>) => void;
  removeMealPlan: (id: string) => void;
  
  // Smart features
  checkIngredientSafety: (ingredientName: string) => AllergenCheckResult;
  isRecipeSafeForProfile: (recipe: Recipe, profile: UserProfile | FamilyMember | null) => { safe: boolean; problemIngredients: string[] };
  suggestRecipes: () => Recipe[];
  generateGroceryList: (recipeIds: string[]) => FoodItem[];
}
