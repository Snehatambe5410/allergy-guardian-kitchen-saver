
import { createContext, useContext, useState, ReactNode } from 'react';

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

interface AppContextType {
  userProfile: UserProfile | null;
  isOnboarded: boolean;
  inventory: FoodItem[];
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addAllergy: (allergy: Allergy) => void;
  removeAllergy: (id: string) => void;
  addInventoryItem: (item: FoodItem) => void;
  removeInventoryItem: (id: string) => void;
}

const initialUserProfile: UserProfile = {
  name: "John Doe",
  dietaryPreferences: ["Vegetarian"],
  allergies: [
    { id: "1", name: "Peanuts", severity: "severe", notes: "Anaphylactic reaction" },
    { id: "2", name: "Lactose", severity: "moderate", notes: "Stomach pain" },
  ],
  emergencyContacts: [
    {
      id: "1",
      name: "Jane Doe",
      relation: "Spouse",
      phone: "555-123-4567",
      email: "jane@example.com"
    }
  ]
};

const initialInventory: FoodItem[] = [
  {
    id: "1",
    name: "Milk",
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Dairy",
    quantity: 1,
    unit: "carton"
  },
  {
    id: "2",
    name: "Bread",
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Bakery",
    quantity: 1,
    unit: "loaf"
  },
  {
    id: "3",
    name: "Apples",
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Fruit",
    quantity: 5,
    unit: "pcs"
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialUserProfile);
  const [inventory, setInventory] = useState<FoodItem[]>(initialInventory);
  
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => {
      if (!prev) return profile as UserProfile;
      return { ...prev, ...profile };
    });
  };
  
  const addAllergy = (allergy: Allergy) => {
    setUserProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        allergies: [...prev.allergies, allergy]
      };
    });
  };
  
  const removeAllergy = (id: string) => {
    setUserProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        allergies: prev.allergies.filter(allergy => allergy.id !== id)
      };
    });
  };
  
  const addInventoryItem = (item: FoodItem) => {
    setInventory(prev => [...prev, item]);
  };
  
  const removeInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };
  
  return (
    <AppContext.Provider value={{
      userProfile,
      isOnboarded: !!userProfile,
      inventory,
      updateUserProfile,
      addAllergy,
      removeAllergy,
      addInventoryItem,
      removeInventoryItem
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
