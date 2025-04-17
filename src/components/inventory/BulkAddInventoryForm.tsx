
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FoodItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Clipboard, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface BulkAddInventoryFormProps {
  onAdd: (items: FoodItem[]) => Promise<void>;
  onClose: () => void;
}

const CATEGORIES = [
  'Dairy', 'Meat', 'Fruit', 'Vegetable', 'Bakery', 
  'Snacks', 'Condiments', 'Beverages', 'Other'
];

const UNITS = [
  'pcs', 'lbs', 'kg', 'oz', 'carton', 
  'bottle', 'can', 'box', 'bag'
];

const DEFAULT_EXPIRY_DAYS = {
  'Dairy': 10,
  'Meat': 5,
  'Fruit': 7,
  'Vegetable': 7,
  'Bakery': 4,
  'Snacks': 60,
  'Condiments': 90,
  'Beverages': 30,
  'Other': 14
};

const BulkAddInventoryForm = ({ onAdd, onClose }: BulkAddInventoryFormProps) => {
  const [items, setItems] = useState<Omit<FoodItem, 'id'>[]>([{
    name: '',
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    category: 'Other',
    quantity: 1,
    unit: 'pcs'
  }]);
  const [bulkText, setBulkText] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const addItem = () => {
    setItems([...items, {
      name: '',
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category: 'Other',
      quantity: 1,
      unit: 'pcs'
    }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof Omit<FoodItem, 'id'>, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    // If category is changed, update the expiry date based on default expiry days
    if (field === 'category') {
      const category = value as string;
      const expiryDays = DEFAULT_EXPIRY_DAYS[category as keyof typeof DEFAULT_EXPIRY_DAYS] || 7;
      
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiryDays);
      updatedItems[index].expiryDate = expiryDate.toISOString().split('T')[0];
    }
    
    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    // Validate items
    const invalidItems = items.filter(item => !item.name || !item.expiryDate);
    if (invalidItems.length > 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields for each item.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(items as FoodItem[]);
      toast({
        title: "Success",
        description: `${items.length} items added to inventory.`
      });
      onClose();
    } catch (error) {
      console.error("Error adding items:", error);
      toast({
        title: "Error",
        description: "Failed to add items to inventory.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const processBulkImport = () => {
    try {
      // Split by lines, remove empty lines, and parse
      const lines = bulkText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line);
      
      const newItems: Omit<FoodItem, 'id'>[] = lines.map(line => {
        // Format expected: Name, Quantity, Unit, Category
        const parts = line.split(',').map(part => part.trim());
        
        const name = parts[0] || '';
        const quantity = parseInt(parts[1]) || 1;
        const unit = parts[2] || 'pcs';
        const category = parts[3] || 'Other';
        
        const expiryDays = DEFAULT_EXPIRY_DAYS[category as keyof typeof DEFAULT_EXPIRY_DAYS] || 7;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiryDays);
        
        return {
          name,
          quantity,
          unit,
          category,
          expiryDate: expiryDate.toISOString().split('T')[0]
        };
      });
      
      if (newItems.length === 0) {
        throw new Error("No valid items found");
      }
      
      // Replace current items with parsed ones
      setItems(newItems);
      setShowBulkImport(false);
      
      toast({
        title: "Bulk import processed",
        description: `${newItems.length} items ready to be added.`
      });
    } catch (error) {
      toast({
        title: "Error processing bulk import",
        description: "Please check the format and try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add Multiple Inventory Items</DialogTitle>
      </DialogHeader>

      {showBulkImport ? (
        <div className="space-y-4">
          <div>
            <Label>Paste your items (one item per line)</Label>
            <p className="text-sm text-gray-500 mb-2">
              Format: Name, Quantity, Unit, Category
            </p>
            <Textarea
              placeholder="Milk, 1, carton, Dairy
Apples, 6, pcs, Fruit
Bread, 1, loaf, Bakery"
              className="h-64"
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setShowBulkImport(false)}
            >
              Cancel
            </Button>
            <Button onClick={processBulkImport}>
              Process Items
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setShowBulkImport(true)}
              className="flex items-center gap-2"
            >
              <Clipboard size={16} />
              Bulk Import
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addItem}
              className="flex items-center gap-2"
            >
              <PlusCircle size={16} />
              Add Another Item
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end border p-4 rounded-md relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 text-gray-500 hover:text-red-500"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                >
                  <Trash2 size={16} />
                </Button>
                
                <div className="col-span-12 md:col-span-6">
                  <Label htmlFor={`item-name-${index}`}>Name*</Label>
                  <Input 
                    id={`item-name-${index}`}
                    placeholder="e.g., Milk"
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="col-span-4 md:col-span-2">
                  <Label htmlFor={`item-qty-${index}`}>Quantity</Label>
                  <Input 
                    id={`item-qty-${index}`}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-full"
                  />
                </div>

                <div className="col-span-8 md:col-span-4">
                  <Label htmlFor={`item-unit-${index}`}>Unit</Label>
                  <Select 
                    value={item.unit} 
                    onValueChange={(value) => updateItem(index, 'unit', value)}
                  >
                    <SelectTrigger id={`item-unit-${index}`}>
                      <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map(unit => (
                        <SelectItem key={unit} value={unit}>
                          {unit.charAt(0).toUpperCase() + unit.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-6">
                  <Label htmlFor={`item-category-${index}`}>Category</Label>
                  <Select 
                    value={item.category} 
                    onValueChange={(value) => updateItem(index, 'category', value)}
                  >
                    <SelectTrigger id={`item-category-${index}`}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-6">
                  <Label htmlFor={`item-expiry-${index}`}>Expiry Date*</Label>
                  <Input 
                    id={`item-expiry-${index}`}
                    type="date"
                    value={item.expiryDate}
                    onChange={(e) => updateItem(index, 'expiryDate', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || items.length === 0 || !items.some(item => item.name)}
              className="space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  <span>Adding Items...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save All Items</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  );
};

export default BulkAddInventoryForm;
