
export interface Allergy {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  expiryDate: string;
  category: string;
  quantity: number;
  unit: string;
  allergens?: string[];
  barcode?: string;
  nutritionInfo?: NutritionInfo;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface UserProfile {
  id?: string; // Added optional id field
  name: string;
  dietaryPreferences: string[];
  allergies: Allergy[];
  emergencyContacts: EmergencyContact[];
  avatar?: string;
  bio?: string;
  phoneNumber?: string;
  email?: string;
  age?: number;
  gender?: string;
  favoriteCuisines?: string[];
  healthGoals?: string[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  dietaryPreferences: string[];
  allergies: Allergy[];
  notes?: string;
  age?: number;
  gender?: string;
  avatar?: string;
  favoriteCuisines?: string[];
  healthGoals?: string[];
}

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  allergens: string[];
  preparationTime: number;
  servings: number;
  isFavorite: boolean;
  image?: string;
  cuisineType?: string;
  mealType?: string;
  calories?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
}

export interface MealPlan {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  meals: MealPlanItem[];
  profileIds: string[];
}

export interface MealPlanItem {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId?: string;
  notes?: string;
}

export interface AllergenCheckResult {
  safe: boolean;
  allergies: Allergy[];
  alternatives?: string[];
}

export interface IngredientSubstitution {
  original: string;
  substitute: string;
  ratio: string;
  notes?: string;
}

export interface GroceryListItem extends FoodItem {
  inInventory: boolean;
  recipeId?: string;
}
