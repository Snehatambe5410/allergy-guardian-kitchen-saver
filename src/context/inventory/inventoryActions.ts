import { FoodItem } from '../../types';
import { 
  addInventoryItem as addInventoryItemToDatabase,
  updateInventoryItem,
  deleteInventoryItem,
  addMultipleInventoryItems
} from '@/services/inventoryService';

export const createInventoryActions = (
  setInventory: React.Dispatch<React.SetStateAction<FoodItem[]>>
) => {
  const addInventoryItem = async (item: FoodItem) => {
    try {
      // If the item already has an ID, assume it came from the database
      // Otherwise, add it to the database
      const savedItem = item.id ? item : await addInventoryItemToDatabase(item);
      
      // Update local state
      setInventory(prev => [...prev, savedItem]);
      
      return savedItem;
    } catch (error) {
      console.error("Error adding inventory item:", error);
      throw error;
    }
  };
  
  const addInventoryItems = async (items: FoodItem[]) => {
    try {
      // Add multiple items to database
      const savedItems = await addMultipleInventoryItems(items);
      
      // Update local state
      setInventory(prev => [...prev, ...savedItems]);
      
      return savedItems;
    } catch (error) {
      console.error("Error adding multiple inventory items:", error);
      throw error;
    }
  };
  
  const removeInventoryItem = async (id: string) => {
    try {
      // Delete from database
      await deleteInventoryItem(id);
      
      // Update local state
      setInventory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing inventory item:", error);
      throw error;
    }
  };

  const updateInventoryItem = async (id: string, updates: Partial<FoodItem>) => {
    try {
      // Update in database
      await updateInventoryItem(id, updates);
      
      // Update local state
      setInventory(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
    } catch (error) {
      console.error("Error updating inventory item:", error);
      throw error;
    }
  };

  return {
    addInventoryItem,
    addInventoryItems,
    removeInventoryItem,
    updateInventoryItem
  };
};
