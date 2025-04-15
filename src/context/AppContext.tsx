
import { createContext, useContext, useState, ReactNode } from 'react';
import { AppContextType } from './AppContextType';
import { 
  initialUserProfile,
  initialInventory,
  initialFamilyMembers,
  initialRecipes
} from './initialState';
import { createUserProfileActions } from './userProfile/userProfileActions';
import { createInventoryActions } from './inventory/inventoryActions';
import { createFamilyActions } from './family/familyActions';
import { createRecipeActions } from './recipes/recipeActions';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [inventory, setInventory] = useState(initialInventory);
  const [familyMembers, setFamilyMembers] = useState(initialFamilyMembers);
  const [recipes, setRecipes] = useState(initialRecipes);
  
  // Actions for each domain
  const userProfileActions = createUserProfileActions(setUserProfile);
  const inventoryActions = createInventoryActions(setInventory);
  const familyActions = createFamilyActions(setFamilyMembers);
  const recipeActions = createRecipeActions(setRecipes);
  
  return (
    <AppContext.Provider value={{
      userProfile,
      isOnboarded: !!userProfile,
      inventory,
      familyMembers,
      recipes,
      ...userProfileActions,
      ...inventoryActions,
      ...familyActions,
      ...recipeActions
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
