
import { FoodItem } from '../../types';

export const createInventoryActions = (
  setInventory: React.Dispatch<React.SetStateAction<FoodItem[]>>
) => {
  const addInventoryItem = (item: FoodItem) => {
    setInventory(prev => [...prev, item]);
  };
  
  const removeInventoryItem = (id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  return {
    addInventoryItem,
    removeInventoryItem
  };
};
