import { FamilyMember } from '../../types';
import { 
  addFamilyMember as addFamilyMemberToDb,
  updateFamilyMember as updateFamilyMemberInDb,
  deleteFamilyMember as deleteFamilyMemberFromDb,
  fetchFamilyMembers
} from '@/services/familyService';

export const createFamilyActions = (
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>
) => {
  const addFamilyMember = async (member: FamilyMember): Promise<FamilyMember> => {
    try {
      // If the member doesn't have an ID, add to database
      if (!member.id) {
        const savedMember = await addFamilyMemberToDb(member);
        setFamilyMembers(prev => [...prev, savedMember]);
        return savedMember;
      }
      
      // Otherwise, it's already in the database (or being imported)
      setFamilyMembers(prev => [...prev, member]);
      return member;
    } catch (error) {
      console.error("Error adding family member:", error);
      throw error;
    }
  };

  const updateFamilyMember = async (id: string, updates: Partial<FamilyMember>): Promise<void> => {
    try {
      // Update in database
      await updateFamilyMemberInDb(id, updates);
      
      // Update local state
      setFamilyMembers(prev => 
        prev.map(member => 
          member.id === id ? { ...member, ...updates } : member
        )
      );
    } catch (error) {
      console.error("Error updating family member:", error);
      throw error;
    }
  };

  const removeFamilyMember = async (id: string): Promise<void> => {
    try {
      // Delete from database
      await deleteFamilyMemberFromDb(id);
      
      // Update local state
      setFamilyMembers(prev => prev.filter(member => member.id !== id));
    } catch (error) {
      console.error("Error removing family member:", error);
      throw error;
    }
  };

  // Sync family profiles with the database
  const syncFamilyProfiles = async (): Promise<void> => {
    try {
      const members = await fetchFamilyMembers();
      setFamilyMembers(members);
    } catch (error) {
      console.error("Error syncing family profiles:", error);
      throw error;
    }
  };

  // Import a family profile from data (e.g., from a QR code or file)
  const importFamilyProfile = async (profileData: Omit<FamilyMember, "id">): Promise<FamilyMember> => {
    try {
      // Add the imported profile to the database
      const savedMember = await addFamilyMemberToDb(profileData);
      
      // Update local state
      setFamilyMembers(prev => [...prev, savedMember]);
      return savedMember;
    } catch (error) {
      console.error("Error importing family profile:", error);
      throw error;
    }
  };

  // Export a family profile as a JSON string
  const exportFamilyProfile = async (id: string): Promise<string> => {
    try {
      const member = await setFamilyMembers(prev => {
        const foundMember = prev.find(m => m.id === id);
        if (!foundMember) {
          throw new Error("Family member not found");
        }
        return prev;
      }).then(members => members.find(m => m.id === id));
      
      if (!member) {
        throw new Error("Family member not found");
      }
      
      // Create a shareable version (removing internal IDs)
      const shareableData = {
        name: member.name,
        relation: member.relation,
        dietaryPreferences: member.dietaryPreferences,
        allergies: member.allergies.map(a => ({
          name: a.name,
          severity: a.severity,
          notes: a.notes
        })),
        notes: member.notes
      };
      
      return JSON.stringify(shareableData);
    } catch (error) {
      console.error("Error exporting family profile:", error);
      throw error;
    }
  };

  return {
    addFamilyMember,
    updateFamilyMember,
    removeFamilyMember,
    syncFamilyProfiles,
    importFamilyProfile,
    exportFamilyProfile
  };
};
