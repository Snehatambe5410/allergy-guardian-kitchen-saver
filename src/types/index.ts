
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
