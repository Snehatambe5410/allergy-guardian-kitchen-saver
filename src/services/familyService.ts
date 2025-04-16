
import { supabase } from "@/integrations/supabase/client";
import { FamilyMember, Allergy } from "@/types";
import { v4 as uuidv4 } from 'uuid';

export const fetchFamilyMembers = async (): Promise<FamilyMember[]> => {
  const { data, error } = await supabase
    .from("family_members")
    .select("*");

  if (error) {
    console.error("Error fetching family members:", error);
    throw error;
  }

  // Get all family member allergies in one query for better performance
  const familyMemberIds = data.map(member => member.id);
  const { data: allergiesData, error: allergiesError } = await supabase
    .from("family_member_allergies")
    .select("*")
    .in("family_member_id", familyMemberIds);

  if (allergiesError) {
    console.error("Error fetching family member allergies:", allergiesError);
    throw allergiesError;
  }

  // Map allergies to family members
  return data.map((member) => {
    const memberAllergies = allergiesData
      ? allergiesData
          .filter((allergy) => allergy.family_member_id === member.id)
          .map((allergy) => ({
            id: allergy.id,
            name: allergy.name,
            severity: allergy.severity as "mild" | "moderate" | "severe",
            notes: allergy.notes || undefined,
          }))
      : [];

    return {
      id: member.id,
      name: member.name,
      relation: member.relation,
      dietaryPreferences: member.dietary_preferences || [],
      allergies: memberAllergies,
      notes: member.notes || undefined,
    };
  });
};

export const addFamilyMember = async (member: Omit<FamilyMember, "id">): Promise<FamilyMember> => {
  const newId = uuidv4();
  
  const { data, error } = await supabase
    .from("family_members")
    .insert({
      id: newId,
      name: member.name,
      relation: member.relation,
      dietary_preferences: member.dietaryPreferences,
      notes: member.notes,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding family member:", error);
    throw error;
  }

  // Add allergies if there are any
  const newAllergies: Allergy[] = [];
  if (member.allergies && member.allergies.length > 0) {
    for (const allergy of member.allergies) {
      const { data: allergyData, error: allergyError } = await supabase
        .from("family_member_allergies")
        .insert({
          family_member_id: newId,
          name: allergy.name,
          severity: allergy.severity,
          notes: allergy.notes,
        })
        .select()
        .single();

      if (allergyError) {
        console.error("Error adding family member allergy:", allergyError);
        throw allergyError;
      }

      newAllergies.push({
        id: allergyData.id,
        name: allergyData.name,
        severity: allergyData.severity as "mild" | "moderate" | "severe",
        notes: allergyData.notes || undefined,
      });
    }
  }

  return {
    id: data.id,
    name: data.name,
    relation: data.relation,
    dietaryPreferences: data.dietary_preferences || [],
    allergies: newAllergies,
    notes: data.notes || undefined,
  };
};

export const updateFamilyMember = async (
  id: string,
  updates: Partial<FamilyMember>
): Promise<void> => {
  const { error } = await supabase
    .from("family_members")
    .update({
      name: updates.name,
      relation: updates.relation,
      dietary_preferences: updates.dietaryPreferences,
      notes: updates.notes,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating family member:", error);
    throw error;
  }

  // Handle allergies separately if provided
  if (updates.allergies) {
    // Delete existing allergies
    const { error: deleteError } = await supabase
      .from("family_member_allergies")
      .delete()
      .eq("family_member_id", id);

    if (deleteError) {
      console.error("Error deleting family member allergies:", deleteError);
      throw deleteError;
    }

    // Add new allergies
    for (const allergy of updates.allergies) {
      const { error: allergyError } = await supabase
        .from("family_member_allergies")
        .insert({
          family_member_id: id,
          name: allergy.name,
          severity: allergy.severity,
          notes: allergy.notes,
        });

      if (allergyError) {
        console.error("Error adding family member allergy:", allergyError);
        throw allergyError;
      }
    }
  }
};

export const deleteFamilyMember = async (id: string): Promise<void> => {
  // Delete all allergies for this family member first
  const { error: allergyDeleteError } = await supabase
    .from("family_member_allergies")
    .delete()
    .eq("family_member_id", id);

  if (allergyDeleteError) {
    console.error("Error deleting family member allergies:", allergyDeleteError);
    throw allergyDeleteError;
  }

  // Now delete the family member
  const { error } = await supabase
    .from("family_members")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting family member:", error);
    throw error;
  }
};
