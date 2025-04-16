
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Allergy, EmergencyContact } from "@/types";
import { v4 as uuidv4 } from 'uuid';

export const fetchUserProfile = async (): Promise<UserProfile | null> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error("Error fetching authenticated user:", userError);
    throw userError;
  }

  if (!userData.user) {
    return null;
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  if (profileError) {
    if (profileError.code === 'PGRST116') {
      // No profile found, return null
      return null;
    }
    console.error("Error fetching user profile:", profileError);
    throw profileError;
  }

  // Fetch allergies
  const { data: allergiesData, error: allergiesError } = await supabase
    .from("allergies")
    .select("*")
    .eq("user_id", userData.user.id);

  if (allergiesError) {
    console.error("Error fetching user allergies:", allergiesError);
    throw allergiesError;
  }

  // Fetch emergency contacts
  const { data: contactsData, error: contactsError } = await supabase
    .from("emergency_contacts")
    .select("*")
    .eq("user_id", userData.user.id);

  if (contactsError) {
    console.error("Error fetching emergency contacts:", contactsError);
    throw contactsError;
  }

  return {
    name: profileData.name || "",
    dietaryPreferences: [], // We need to add this field to the profiles table
    allergies: allergiesData.map((allergy) => ({
      id: allergy.id,
      name: allergy.name,
      severity: allergy.severity as "mild" | "moderate" | "severe",
      notes: allergy.notes || undefined,
    })),
    emergencyContacts: contactsData.map((contact) => ({
      id: contact.id,
      name: contact.name,
      relation: contact.relation,
      phone: contact.phone,
      email: contact.email || undefined,
    })),
    avatar: profileData.avatar_url || undefined,
    bio: profileData.bio || undefined,
    phoneNumber: profileData.phone_number || undefined,
    email: profileData.email || userData.user.email || "",
  };
};

export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<void> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error("Error fetching authenticated user:", userError);
    throw userError;
  }

  if (!userData.user) {
    throw new Error("User is not authenticated");
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      name: updates.name,
      bio: updates.bio,
      avatar_url: updates.avatar,
      phone_number: updates.phoneNumber,
      email: updates.email,
    })
    .eq("id", userData.user.id);

  if (profileError) {
    console.error("Error updating user profile:", profileError);
    throw profileError;
  }

  // Handle allergies separately if provided
  if (updates.allergies) {
    // Delete existing allergies
    const { error: deleteError } = await supabase
      .from("allergies")
      .delete()
      .eq("user_id", userData.user.id);

    if (deleteError) {
      console.error("Error deleting user allergies:", deleteError);
      throw deleteError;
    }

    // Add new allergies
    for (const allergy of updates.allergies) {
      const { error: allergyError } = await supabase
        .from("allergies")
        .insert({
          user_id: userData.user.id,
          name: allergy.name,
          severity: allergy.severity,
          notes: allergy.notes,
        });

      if (allergyError) {
        console.error("Error adding user allergy:", allergyError);
        throw allergyError;
      }
    }
  }

  // Handle emergency contacts separately if provided
  if (updates.emergencyContacts) {
    // Delete existing emergency contacts
    const { error: deleteError } = await supabase
      .from("emergency_contacts")
      .delete()
      .eq("user_id", userData.user.id);

    if (deleteError) {
      console.error("Error deleting emergency contacts:", deleteError);
      throw deleteError;
    }

    // Add new emergency contacts
    for (const contact of updates.emergencyContacts) {
      const { error: contactError } = await supabase
        .from("emergency_contacts")
        .insert({
          user_id: userData.user.id,
          name: contact.name,
          relation: contact.relation,
          phone: contact.phone,
          email: contact.email,
        });

      if (contactError) {
        console.error("Error adding emergency contact:", contactError);
        throw contactError;
      }
    }
  }
};

export const addAllergy = async (allergy: Omit<Allergy, "id">): Promise<Allergy> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error("Error fetching authenticated user:", userError);
    throw userError;
  }

  if (!userData.user) {
    throw new Error("User is not authenticated");
  }

  const newId = uuidv4();
  
  const { data, error } = await supabase
    .from("allergies")
    .insert({
      id: newId,
      user_id: userData.user.id,
      name: allergy.name,
      severity: allergy.severity,
      notes: allergy.notes,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding allergy:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    severity: data.severity as "mild" | "moderate" | "severe",
    notes: data.notes || undefined,
  };
};

export const removeAllergy = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("allergies")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error removing allergy:", error);
    throw error;
  }
};

export const uploadAvatar = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      upsert: true
    });

  if (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return data.publicUrl;
};
