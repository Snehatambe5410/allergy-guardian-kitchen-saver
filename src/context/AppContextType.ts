
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
  addInventoryItem: (item: FoodItem) => void;
  removeInventoryItem: (id: string) => void;
  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  removeFamilyMember: (id: string) => void;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  removeRecipe: (id: string) => void;
  toggleFavoriteRecipe: (id: string) => void;
}
