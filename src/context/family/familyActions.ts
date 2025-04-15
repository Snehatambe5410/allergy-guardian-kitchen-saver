
import { FamilyMember } from '../../types';

export const createFamilyActions = (
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>
) => {
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

  return {
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember
  };
};
