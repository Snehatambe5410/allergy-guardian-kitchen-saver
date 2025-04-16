
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchUserProfile, 
  fetchFamilyMembers, 
  fetchUserInventory, 
  fetchUserRecipes 
} from '@/services';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState(initialUserProfile);
  const [inventory, setInventory] = useState(initialInventory);
  const [familyMembers, setFamilyMembers] = useState(initialFamilyMembers);
  const [recipes, setRecipes] = useState(initialRecipes);
  const [loadingData, setLoadingData] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Actions for each domain
  const userProfileActions = createUserProfileActions(setUserProfile);
  const inventoryActions = createInventoryActions(setInventory);
  const familyActions = createFamilyActions(setFamilyMembers);
  const recipeActions = createRecipeActions(setRecipes);
  
  // Fetch all user data when authenticated
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      setLoadingData(true);
      try {
        // Load user profile
        const profile = await fetchUserProfile();
        if (profile) {
          setUserProfile(profile);
        }

        // Load family members
        const members = await fetchFamilyMembers();
        if (members) {
          setFamilyMembers(members);
        }

        // Load inventory
        const items = await fetchUserInventory();
        if (items) {
          setInventory(items);
        }

        // Load recipes
        const recipeData = await fetchUserRecipes();
        if (recipeData) {
          setRecipes(recipeData);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading your data.",
          variant: "destructive",
        });
      } finally {
        setLoadingData(false);
      }
    };

    loadUserData();
  }, [user, toast]);
  
  return (
    <AppContext.Provider value={{
      userProfile,
      isOnboarded: !!userProfile,
      inventory,
      familyMembers,
      recipes,
      loadingData,
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
