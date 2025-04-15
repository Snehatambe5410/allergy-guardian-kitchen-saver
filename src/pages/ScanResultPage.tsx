
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import AppLayout from '../components/layout/AppLayout';
import { useAppContext } from '../context/AppContext';

const ScanResultPage = () => {
  const navigate = useNavigate();
  const { userProfile } = useAppContext();
  
  // In a real app, this would come from scanning a product barcode
  // For demo purposes, we're hardcoding a mock result
  const [scanResult] = useState({
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
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  
  // Check for allergy conflicts
  const allergies = userProfile?.allergies || [];
  const allergyConflicts = allergies.filter(allergy => 
    scanResult.ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(allergy.name.toLowerCase())
    ) || 
    scanResult.allergens.some(allergen => 
      allergen.toLowerCase().includes(allergy.name.toLowerCase())
    )
  );
  
  const hasSevereAllergy = allergyConflicts.some(allergy => allergy.severity === 'severe');
  const hasModerateAllergy = allergyConflicts.some(allergy => allergy.severity === 'moderate');
  
  const addToInventory = () => {
    // Add to inventory logic would go here
    navigate('/inventory');
  };

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
                  {scanResult.allergens.map((allergen, index) => (
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
              
              <div>
                <h3 className="font-semibold mb-2">Expiry Date:</h3>
                <p>{scanResult.expiryDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Actions */}
        <div className="space-y-3">
          <Button 
            className="w-full" 
            disabled={hasSevereAllergy} 
            onClick={addToInventory}
          >
            Add to Inventory
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
