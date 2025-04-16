
import { supabase } from "@/integrations/supabase/client";
import { FoodItem } from "@/types";
import { v4 as uuidv4 } from 'uuid';

export const fetchUserInventory = async (): Promise<FoodItem[]> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error("Error fetching authenticated user:", userError);
    throw userError;
  }
  
  if (!userData.user) {
    return [];
  }

  const { data, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("expiry_date", { ascending: true });

  if (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }

  return data.map((item) => ({
    id: item.id,
    name: item.name,
    expiryDate: item.expiry_date || new Date().toISOString(),
    category: item.category || "",
    quantity: item.quantity || 1,
    unit: item.unit || "pcs",
  }));
};

export const addInventoryItem = async (item: Omit<FoodItem, "id">): Promise<FoodItem> => {
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
    .from("inventory")
    .insert({
      id: newId,
      user_id: userData.user.id,
      name: item.name,
      expiry_date: item.expiryDate,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding inventory item:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    expiryDate: data.expiry_date || new Date().toISOString(),
    category: data.category || "",
    quantity: data.quantity || 1,
    unit: data.unit || "pcs",
  };
};

export const updateInventoryItem = async (id: string, updates: Partial<FoodItem>): Promise<void> => {
  const { error } = await supabase
    .from("inventory")
    .update({
      name: updates.name,
      expiry_date: updates.expiryDate,
      category: updates.category,
      quantity: updates.quantity,
      unit: updates.unit,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating inventory item:", error);
    throw error;
  }
};

export const deleteInventoryItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("inventory")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting inventory item:", error);
    throw error;
  }
};
