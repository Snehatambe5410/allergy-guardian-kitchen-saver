
import { useState } from 'react';
import { Package, Plus, Search, Trash } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import AppLayout from '../components/layout/AppLayout';
import { useAppContext } from '../context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { FoodItem } from '../types';

const InventoryPage = () => {
  const { inventory, addInventoryItem, removeInventoryItem } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'expiry'>('expiry');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [newItem, setNewItem] = useState<Partial<FoodItem>>({
    name: '',
    expiryDate: new Date().toISOString().split('T')[0],
    category: 'Other',
    quantity: 1,
    unit: 'pcs'
  });
  
  // Get all unique categories
  const categories = ['all', ...Array.from(new Set(inventory.map(item => item.category)))];
  
  // Filter and sort items
  const filteredItems = inventory.filter(item => {
    // Filter by search term
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    // Filter by category
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else { // sort by expiry
      return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    }
  });
  
  // Add a new item
  const handleAddItem = () => {
    if (!newItem.name) return;
    
    addInventoryItem({
      id: Date.now().toString(),
      name: newItem.name || '',
      expiryDate: newItem.expiryDate || new Date().toISOString().split('T')[0],
      category: newItem.category || 'Other',
      quantity: newItem.quantity || 1,
      unit: newItem.unit || 'pcs'
    });
    
    // Reset form
    setNewItem({
      name: '',
      expiryDate: new Date().toISOString().split('T')[0],
      category: 'Other',
      quantity: 1,
      unit: 'pcs'
    });
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  // Check if item is expiring soon (within 3 days)
  const isExpiringSoon = (dateString: string) => {
    const today = new Date();
    const expiryDate = new Date(dateString);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  };
  
  // Check if item is expired
  const isExpired = (dateString: string) => {
    const today = new Date();
    const expiryDate = new Date(dateString);
    return expiryDate < today;
  };

  return (
    <AppLayout title="Kitchen Inventory">
      <div className="p-4 space-y-4">
        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category, index) => (
                <SelectItem key={`category-${index}`} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={sortBy} 
            onValueChange={(value: string) => setSortBy(value as 'name' | 'expiry')}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="expiry">Expiry Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Add New Item Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-app-green-600 hover:bg-app-green-700">
              <Plus size={18} className="mr-2" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Item to Inventory</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input 
                  id="itemName" 
                  value={newItem.name || ''}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="e.g., Milk, Apples"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newItem.category} 
                  onValueChange={(value) => setNewItem({...newItem, category: value})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dairy">Dairy</SelectItem>
                    <SelectItem value="Meat">Meat</SelectItem>
                    <SelectItem value="Fruit">Fruit</SelectItem>
                    <SelectItem value="Vegetable">Vegetable</SelectItem>
                    <SelectItem value="Bakery">Bakery</SelectItem>
                    <SelectItem value="Snacks">Snacks</SelectItem>
                    <SelectItem value="Condiments">Condiments</SelectItem>
                    <SelectItem value="Beverages">Beverages</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input 
                  id="expiryDate" 
                  type="date"
                  value={newItem.expiryDate || ''}
                  onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity" 
                    type="number"
                    min="1"
                    value={newItem.quantity || 1}
                    onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select 
                    value={newItem.unit} 
                    onValueChange={(value) => setNewItem({...newItem, unit: value})}
                  >
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">Pieces</SelectItem>
                      <SelectItem value="lbs">Pounds</SelectItem>
                      <SelectItem value="kg">Kilograms</SelectItem>
                      <SelectItem value="oz">Ounces</SelectItem>
                      <SelectItem value="carton">Carton</SelectItem>
                      <SelectItem value="bottle">Bottle</SelectItem>
                      <SelectItem value="can">Can</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="bag">Bag</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                className="w-full mt-4 bg-app-green-600 hover:bg-app-green-700"
                onClick={handleAddItem}
                disabled={!newItem.name}
              >
                <Plus size={18} className="mr-2" />
                Add to Inventory
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Inventory Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-gray-500 text-sm mb-1">Total Items</p>
              <p className="text-2xl font-semibold">{inventory.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-gray-500 text-sm mb-1">Expiring Soon</p>
              <p className="text-2xl font-semibold text-amber-500">
                {inventory.filter(item => isExpiringSoon(item.expiryDate)).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-gray-500 text-sm mb-1">Expired</p>
              <p className="text-2xl font-semibold text-app-red-600">
                {inventory.filter(item => isExpired(item.expiryDate)).length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Inventory List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <Package size={48} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">No items found</p>
              <p className="text-gray-400 text-sm">Add items to your inventory to track them</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const expired = isExpired(item.expiryDate);
              const expiringSoon = isExpiringSoon(item.expiryDate);
              
              return (
                <Card 
                  key={item.id}
                  className={`
                    border-l-4
                    ${expired ? 'border-l-app-red-600' : expiringSoon ? 'border-l-amber-500' : 'border-l-app-green-600'}
                  `}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{item.name}</h3>
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Qty: {item.quantity} {item.unit}
                      </div>
                      <div className={`text-sm mt-1 ${
                        expired 
                          ? 'text-app-red-600' 
                          : expiringSoon 
                          ? 'text-amber-500' 
                          : 'text-gray-500'
                      }`}>
                        {expired 
                          ? 'Expired: ' 
                          : expiringSoon 
                          ? 'Expires soon: ' 
                          : 'Expires: '
                        }
                        {formatDate(item.expiryDate)}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeInventoryItem(item.id)}
                    >
                      <Trash size={16} className="text-app-red-500" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default InventoryPage;
