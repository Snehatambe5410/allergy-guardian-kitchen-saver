
import { 
  Allergy, 
  EmergencyContact, 
  FamilyMember, 
  FoodItem, 
  Recipe, 
  UserProfile,
  MealPlan
} from '../types';

export interface AppContextType {
  userProfile: UserProfile | null;
  isOnboarded: boolean;
  inventory: FoodItem[];
  familyMembers: FamilyMember[];
  recipes: Recipe[];
  loadingData: boolean;
  activeProfile: FamilyMember | UserProfile | null;
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
  addFamilyMember: (member: FamilyMember) => Promise<FamilyMember>;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => Promise<void>;
  removeFamilyMember: (id: string) => Promise<void>;
  syncFamilyProfiles: () => Promise<void>;
  importFamilyProfile: (profileData: Omit<FamilyMember, "id">) => Promise<FamilyMember>;
  exportFamilyProfile: (id: string) => Promise<string>;
  
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
  checkIngredientSafety: (ingredientName: string) => {
    safe: boolean;
    allergies: Allergy[];
    alternatives?: string[];
  };
  suggestRecipes: () => Recipe[];
  generateGroceryList: (recipeIds: string[]) => FoodItem[];
}
