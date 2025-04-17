
import { 
  Allergy, 
  EmergencyContact, 
  FamilyMember, 
  FoodItem, 
  Recipe, 
  UserProfile 
} from '../types';

export interface AppContextType {
  userProfile: UserProfile | null;
  isOnboarded: boolean;
  inventory: FoodItem[];
  familyMembers: FamilyMember[];
  recipes: Recipe[];
  loadingData: boolean;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addAllergy: (allergy: Allergy) => void;
  removeAllergy: (id: string) => void;
  addInventoryItem: (item: FoodItem) => Promise<FoodItem>;
  addInventoryItems: (items: FoodItem[]) => Promise<FoodItem[]>;
  removeInventoryItem: (id: string) => void;
  addFamilyMember: (member: FamilyMember) => Promise<FamilyMember>;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => Promise<void>;
  removeFamilyMember: (id: string) => Promise<void>;
  syncFamilyProfiles: () => Promise<void>;
  importFamilyProfile: (profileData: Omit<FamilyMember, "id">) => Promise<FamilyMember>;
  exportFamilyProfile: (id: string) => Promise<string>;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  removeRecipe: (id: string) => void;
  toggleFavoriteRecipe: (id: string) => void;
}
