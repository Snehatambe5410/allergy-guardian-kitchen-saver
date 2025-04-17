import { FoodItem } from '../../types';
import { 
  addInventoryItem as addInventoryItemToDatabase,
  updateInventoryItem,
  deleteInventoryItem
} from '@/services/inventoryService';

export const createInventoryActions = (
  setInventory: React.Dispatch<React.SetStateAction<FoodItem[]>>
) => {
  const addInventoryItem = (item: FoodItem) => {
    // If the item already has an ID, assume it came from the database
    // Otherwise, we would add it to the database here
    setInventory(prev => [...prev, item]);
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
    removeInventoryItem,
    updateInventoryItem
  };
};
