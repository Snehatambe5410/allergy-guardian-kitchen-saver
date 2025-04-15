
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
}

export interface UserProfile {
  name: string;
  dietaryPreferences: string[];
  allergies: Allergy[];
  emergencyContacts: EmergencyContact[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  dietaryPreferences: string[];
  allergies: Allergy[];
  notes?: string;
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
}
