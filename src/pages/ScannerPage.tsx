
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { AlertCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';
import AllergenDetector from '../components/allergen/AllergenDetector';
import AllergenCameraScanner from '../components/allergen/AllergenCameraScanner';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';
import { AllergenCheckResult } from '../types';

const ScannerPage = () => {
  const navigate = useNavigate();
  const { checkIngredientSafety, activeProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState('text');
  const [scanResult, setScanResult] = useState<AllergenCheckResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanResultFound = (results: AllergenCheckResult) => {
    setScanResult(results);
  };

  return (
    <AppLayout title="Food Scanner">
      <div className="p-4 max-w-lg mx-auto">
        <div className="mb-6">
          <h2 className="text-lg font-medium flex items-center gap-2 mb-2">
            <AlertCircle className="text-orange-500" size={20} />
            Allergy Detection
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            Scan food labels or enter ingredients to check if they're safe for {activeProfile?.name || 'your profile'}.
          </p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="text">Text Input</TabsTrigger>
              <TabsTrigger value="camera">Camera</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="mt-0">
              <Card>
                <CardContent className="p-4">
                  <AllergenDetector onResultsFound={handleScanResultFound} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="camera" className="mt-0">
              <Card>
                <CardContent className="pt-6 px-6 pb-4">
                  <AllergenCameraScanner
                    isScanning={isScanning}
                    setIsScanning={setIsScanning}
                    onResultsFound={handleScanResultFound}
                    checkIngredientSafety={checkIngredientSafety}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Results section */}
        {scanResult && (
          <div className={`mt-6 p-4 rounded-lg ${
            scanResult.safe 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200'
          }`}>
            <div className="flex justify-between">
              <div>
                <h3 className="font-medium mb-2">Scan Results</h3>
                <div className="flex flex-wrap gap-2">
                  {scanResult.safe ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      Safe
                    </span>
                  ) : (
                    <>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                        Not Safe
                      </span>
                      {scanResult.allergies.map((allergy, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-red-50 text-red-800 border border-red-200"
                        >
                          {allergy.name}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>
              
              <Button 
                size="sm" 
                onClick={() => {
                  navigate('/scan-result', { 
                    state: { scanResult } 
                  });
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ScannerPage;
