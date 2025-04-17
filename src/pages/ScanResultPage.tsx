
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft, Plus, Save } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import AppLayout from '../components/layout/AppLayout';
import { useAppContext } from '../context/AppContext';
import { Input } from '../components/ui/input';
import { addInventoryItem } from '@/services/inventoryService';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

// Mock barcode database for demonstration
const barcodeDatabase: Record<string, any> = {
  '073000131367': {
    name: "Almond Milk",
    brand: "Nature's Best",
    ingredients: [
      "Water",
      "Almonds",
      "Calcium Carbonate",
      "Salt",
      "Stabilizers (Gellan Gum)",
      "Vitamins (D2, B12)"
    ],
    allergens: ["Tree Nuts (Almonds)"],
    nutritionalInfo: {
      calories: 30,
      fat: 2.5,
      carbs: 1,
      protein: 1.2
    },
    category: "Dairy",
    expiryDays: 10 // Days until expiry from now
  },
  '022000124210': {
    name: "Honey Nut Cheerios",
    brand: "General Mills",
    ingredients: [
      "Whole Grain Oats",
      "Sugar",
      "Honey",
      "Brown Sugar Syrup", 
      "Salt",
      "Vitamin E"
    ],
    allergens: ["Gluten"],
    nutritionalInfo: {
      calories: 110,
      fat: 1.5,
      carbs: 23,
      protein: 2
    },
    category: "Breakfast",
    expiryDays: 180 // Days until expiry from now
  },
  '073000136365': {
    name: "Organic Baby Spinach",
    brand: "Fresh Farms",
    ingredients: ["Organic Baby Spinach"],
    allergens: [],
    nutritionalInfo: {
      calories: 20,
      fat: 0,
      carbs: 3,
      protein: 2
    },
    category: "Vegetable",
    expiryDays: 7 // Days until expiry from now
  }
};

const ScanResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, inventory, addInventoryItem: addToInventoryContext } = useAppContext();
  const { toast } = useToast();
  
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("pcs");
  const [customExpiryDate, setCustomExpiryDate] = useState("");
  
  // Get barcode from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const barcode = queryParams.get('barcode');
  
  // Check if we have a result for this barcode in our database
  const [scanResult, setScanResult] = useState<any>(null);
  
  useEffect(() => {
    // Try to look up the barcode
    if (barcode) {
      // Look for an exact match
      if (barcodeDatabase[barcode]) {
        const result = barcodeDatabase[barcode];
        // Calculate expiry date
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + result.expiryDays);
        
        setScanResult({
          ...result,
          expiryDate: expiryDate.toISOString().split('T')[0]
        });
      } else {
        // If no exact match, try the first entry as a fallback for demo
        const fallbackEntry = Object.values(barcodeDatabase)[0];
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + fallbackEntry.expiryDays);
        
        setScanResult({
          ...fallbackEntry,
          name: `${fallbackEntry.name} (Similar)`,
          expiryDate: expiryDate.toISOString().split('T')[0]
        });
      }
    }
  }, [barcode]);
  
  // Set default expiry date when scan result changes
  useEffect(() => {
    if (scanResult) {
      setCustomExpiryDate(scanResult.expiryDate);
    }
  }, [scanResult]);
  
  // Check for allergy conflicts
  const allergies = userProfile?.allergies || [];
  const allergyConflicts = scanResult ? allergies.filter(allergy => 
    scanResult.ingredients.some((ingredient: string) => 
      ingredient.toLowerCase().includes(allergy.name.toLowerCase())
    ) || 
    scanResult.allergens.some((allergen: string) => 
      allergen.toLowerCase().includes(allergy.name.toLowerCase())
    )
  ) : [];
  
  const hasSevereAllergy = allergyConflicts.some(allergy => allergy.severity === 'severe');
  const hasModerateAllergy = allergyConflicts.some(allergy => allergy.severity === 'moderate');
  
  const addToInventory = async () => {
    if (!scanResult) return;
    
    try {
      setIsAdding(true);
      
      const newItem = {
        name: scanResult.name,
        expiryDate: customExpiryDate,
        category: scanResult.category,
        quantity: quantity,
        unit: unit
      };
      
      // Add to Supabase database
      const addedItem = await addInventoryItem(newItem);
      
      // Add to local state
      addToInventoryContext(addedItem);
      
      toast({
        title: "Success",
        description: `${scanResult.name} added to inventory`,
        variant: "default",
      });
      
      navigate('/inventory');
    } catch (error) {
      console.error("Error adding to inventory:", error);
      toast({
        title: "Error",
        description: "Failed to add item to inventory",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  // If scan result is still loading
  if (!scanResult) {
    return (
      <AppLayout title="Scan Result">
        <div className="p-4 flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-app-green-600 mx-auto mb-4"></div>
            <p>Processing barcode result...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Scan Result">
      <div className="p-4 space-y-6">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/scanner')} 
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Scanner
        </button>
        
        {/* Allergy Alert */}
        {allergyConflicts.length > 0 && (
          <div className={`p-4 rounded-lg mb-4 ${
            hasSevereAllergy 
              ? 'bg-app-red-100 border-l-4 border-app-red-600' 
              : hasModerateAllergy 
              ? 'bg-orange-100 border-l-4 border-orange-600'
              : 'bg-yellow-100 border-l-4 border-yellow-600'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {hasSevereAllergy ? (
                  <XCircle className="h-5 w-5 text-app-red-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  hasSevereAllergy ? 'text-app-red-800' : 'text-orange-800'
                }`}>
                  {hasSevereAllergy 
                    ? 'Warning: Contains allergens you are severely allergic to!' 
                    : 'Caution: Contains allergens you are sensitive to.'
                  }
                </h3>
                <div className="mt-2 text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    {allergyConflicts.map((allergy, index) => (
                      <li key={index} className={`${
                        allergy.severity === 'severe' 
                          ? 'text-app-red-700' 
                          : allergy.severity === 'moderate'
                          ? 'text-orange-700'
                          : 'text-yellow-700'
                      }`}>
                        {allergy.name} ({allergy.severity})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Product Info */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{scanResult.name}</h2>
                  <p className="text-gray-500">{scanResult.brand}</p>
                </div>
                {allergyConflicts.length === 0 && (
                  <CheckCircle className="h-6 w-6 text-app-green-600" />
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Ingredients:</h3>
                <p className="text-sm text-gray-700">
                  {scanResult.ingredients.join(', ')}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Allergens:</h3>
                <div className="flex flex-wrap gap-2">
                  {scanResult.allergens.map((allergen: string, index: number) => (
                    <span 
                      key={index}
                      className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                    >
                      {allergen}
                    </span>
                  ))}
                  {scanResult.allergens.length === 0 && (
                    <span className="text-sm text-gray-500">None declared</span>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Nutritional Information:</h3>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-500">Calories</p>
                    <p className="font-medium">{scanResult.nutritionalInfo.calories}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-500">Fat (g)</p>
                    <p className="font-medium">{scanResult.nutritionalInfo.fat}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-500">Carbs (g)</p>
                    <p className="font-medium">{scanResult.nutritionalInfo.carbs}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-500">Protein (g)</p>
                    <p className="font-medium">{scanResult.nutritionalInfo.protein}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 border-t border-gray-200 pt-4 mt-4">
                <h3 className="font-semibold">Add to Inventory:</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Quantity</label>
                    <Input 
                      type="number" 
                      min="1"
                      value={quantity} 
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Unit</label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger>
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
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Expiry Date</label>
                  <Input
                    type="date"
                    value={customExpiryDate}
                    onChange={(e) => setCustomExpiryDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Actions */}
        <div className="space-y-3">
          <Button 
            className="w-full" 
            disabled={hasSevereAllergy || isAdding} 
            onClick={addToInventory}
          >
            {isAdding ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                Adding...
              </>
            ) : (
              <>
                <Plus size={16} className="mr-2" />
                Add to Inventory
              </>
            )}
          </Button>
          
          {hasSevereAllergy && (
            <p className="text-center text-sm text-app-red-600">
              Cannot add items with severe allergens to inventory
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ScanResultPage;
