import { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Allergy, 
  EmergencyContact, 
  FamilyMember, 
  FoodItem, 
  Recipe, 
  UserProfile 
} from '../types';

interface AppContextType {
  userProfile: UserProfile | null;
  isOnboarded: boolean;
  inventory: FoodItem[];
  familyMembers: FamilyMember[];
  recipes: Recipe[];
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
  ],
  avatar: undefined,
  bio: "I'm a health-conscious individual who enjoys cooking and trying new recipes.",
  email: "john.doe@example.com",
  phoneNumber: "555-987-6543"
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

const initialFamilyMembers: FamilyMember[] = [
  {
    id: "1",
    name: "Emma Doe",
    relation: "Daughter",
    dietaryPreferences: ["Vegetarian"],
    allergies: [
      { id: "1", name: "Peanuts", severity: "severe", notes: "Anaphylactic reaction" }
    ],
    notes: "Likes fruits and vegetables"
  }
];

const initialRecipes: Recipe[] = [
  {
    id: "1",
    name: "Gluten-Free Pancakes",
    description: "Delicious pancakes without gluten",
    ingredients: [
      "2 cups gluten-free flour",
      "2 eggs",
      "1 cup milk",
      "1 tsp baking powder",
      "2 tbsp sugar",
      "1/4 tsp salt"
    ],
    instructions: [
      "Mix dry ingredients in a bowl",
      "Whisk eggs and milk in another bowl",
      "Combine wet and dry ingredients",
      "Cook on a hot griddle until bubbles form, then flip"
    ],
    allergens: ["Eggs", "Milk"],
    preparationTime: 15,
    servings: 4,
    isFavorite: true
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialUserProfile);
  const [inventory, setInventory] = useState<FoodItem[]>(initialInventory);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  
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

  const addFamilyMember = (member: FamilyMember) => {
    setFamilyMembers(prev => [...prev, member]);
  };

  const updateFamilyMember = (id: string, updates: Partial<FamilyMember>) => {
    setFamilyMembers(prev => 
      prev.map(member => 
        member.id === id ? { ...member, ...updates } : member
      )
    );
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== id));
  };

  const addRecipe = (recipe: Recipe) => {
    setRecipes(prev => [...prev, recipe]);
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes(prev => 
      prev.map(recipe => 
        recipe.id === id ? { ...recipe, ...updates } : recipe
      )
    );
  };

  const removeRecipe = (id: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
  };

  const toggleFavoriteRecipe = (id: string) => {
    setRecipes(prev => 
      prev.map(recipe => 
        recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
      )
    );
  };
  
  return (
    <AppContext.Provider value={{
      userProfile,
      isOnboarded: !!userProfile,
      inventory,
      familyMembers,
      recipes,
      updateUserProfile,
      addAllergy,
      removeAllergy,
      addInventoryItem,
      removeInventoryItem,
      addFamilyMember,
      updateFamilyMember,
      removeFamilyMember,
      addRecipe,
      updateRecipe,
      removeRecipe,
      toggleFavoriteRecipe
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
