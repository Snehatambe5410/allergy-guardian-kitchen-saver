
import { Allergy, EmergencyContact, FamilyMember, FoodItem, Recipe, UserProfile } from '../types';

export const initialUserProfile: UserProfile = {
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

export const initialInventory: FoodItem[] = [
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

export const initialFamilyMembers: FamilyMember[] = [
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

export const initialRecipes: Recipe[] = [
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
