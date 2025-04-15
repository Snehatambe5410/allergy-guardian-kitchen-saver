
import { Allergy, UserProfile } from '../../types';

export const createUserProfileActions = (
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>
) => {
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

  return {
    updateUserProfile,
    addAllergy,
    removeAllergy
  };
};
