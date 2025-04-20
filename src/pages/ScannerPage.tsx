
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { Camera, Image, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';
import { AllergenDetector } from '../components/allergen/AllergenDetector';
import { useToast } from '../hooks/use-toast';
import { useAppContext } from '../context/AppContext';
import { AllergenCheckResult } from '../types';

const ScannerPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkIngredientSafety, activeProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState('text');
  const [scanResult, setScanResult] = useState<AllergenCheckResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // This is a mock function since we can't implement actual camera scanning
  const handleCameraCapture = () => {
    setIsScanning(true);
    // Simulating a camera scan with a timeout
    setTimeout(() => {
      // Randomly select an item to simulate camera detection
      const mockDetectedItems = ['Milk', 'Eggs', 'Peanuts', 'Wheat', 'Apples', 'Chicken'];
      const randomItem = mockDetectedItems[Math.floor(Math.random() * mockDetectedItems.length)];
      
      // Get safety check
      const result = checkIngredientSafety(randomItem);
      
      // Set the result and show a toast
      setScanResult(result);
      toast({
        title: `Detected: ${randomItem}`,
        description: result.safe 
          ? 'This item is safe for the current profile.' 
          : 'Warning: This contains allergens for the current profile!',
        variant: result.safe ? 'default' : 'destructive'
      });
      
      setIsScanning(false);
    }, 2000);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsScanning(true);
    
    // In a real app, we would send the image to a backend service
    // For now, we'll just simulate detection after a delay
    setTimeout(() => {
      // Simulate detection based on the file name (for demo purposes)
      let detectedItem = 'Unknown food item';
      
      const filename = file.name.toLowerCase();
      if (filename.includes('milk') || filename.includes('dairy')) {
        detectedItem = 'Milk';
      } else if (filename.includes('egg')) {
        detectedItem = 'Eggs';
      } else if (filename.includes('peanut')) {
        detectedItem = 'Peanuts';
      } else if (filename.includes('wheat') || filename.includes('bread')) {
        detectedItem = 'Wheat bread';
      } else if (filename.includes('apple')) {
        detectedItem = 'Apples';
      }
      
      // Get safety check
      const result = checkIngredientSafety(detectedItem);
      
      // Set the result and show a toast
      setScanResult(result);
      toast({
        title: `Detected: ${detectedItem}`,
        description: result.safe 
          ? 'This item is safe for the current profile.' 
          : 'Warning: This contains allergens for the current profile!',
        variant: result.safe ? 'default' : 'destructive'
      });
      
      setIsScanning(false);
    }, 1500);
  };
  
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
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="text">Text Input</TabsTrigger>
              <TabsTrigger value="camera">Camera</TabsTrigger>
              <TabsTrigger value="image">Upload Image</TabsTrigger>
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
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                    {isScanning ? (
                      <div className="flex flex-col items-center">
                        <Loader2 size={48} className="animate-spin text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Scanning...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Camera size={48} className="text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Camera preview will appear here</p>
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={handleCameraCapture} 
                    disabled={isScanning}
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Capture Food Label
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="image" className="mt-0">
              <Card>
                <CardContent className="pt-6 px-6 pb-4">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                    {isScanning ? (
                      <div className="flex flex-col items-center">
                        <Loader2 size={48} className="animate-spin text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Processing image...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Image size={48} className="text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Upload a food label image</p>
                      </div>
                    )}
                  </div>
                  <label className="w-full">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isScanning}
                    />
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      disabled={isScanning}
                      asChild
                    >
                      <span>
                        <Image className="mr-2 h-4 w-4" />
                        Upload Food Image
                      </span>
                    </Button>
                  </label>
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
