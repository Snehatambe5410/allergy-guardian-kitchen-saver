
import React, { useState } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Button } from '../ui/button';
import { Camera as CameraIcon, Image, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { AllergenCheckResult } from '@/types';

interface AllergenCameraScannerProps {
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
  onResultsFound: (result: AllergenCheckResult) => void;
  checkIngredientSafety: (ingredientText: string) => AllergenCheckResult;
}

export const AllergenCameraScanner: React.FC<AllergenCameraScannerProps> = ({
  isScanning,
  setIsScanning,
  onResultsFound,
  checkIngredientSafety
}) => {
  const { toast } = useToast();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const captureImage = async () => {
    try {
      setIsScanning(true);
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: 'CAMERA'
      });
      
      setPreviewImage(image.dataUrl || null);
      
      // In a real app, we would send this image to a backend OCR service
      // For now, we'll simulate detection after a delay
      setTimeout(() => {
        // Simulate ingredient text extraction from the image
        const detectedIngredients = simulateOCRExtraction();
        
        // Process the detected ingredients for allergens
        const result = checkIngredientSafety(detectedIngredients);
        
        // Show results
        toast({
          title: `Scan Complete`,
          description: result.safe 
            ? 'No allergens detected in the scanned item.' 
            : `Warning: Allergens detected!`,
          variant: result.safe ? 'default' : 'destructive',
        });
        
        onResultsFound(result);
        setIsScanning(false);
      }, 2000);
      
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: 'Camera Error',
        description: 'Could not access camera. Please check permissions.',
        variant: 'destructive',
      });
      setIsScanning(false);
    }
  };
  
  const uploadImage = async () => {
    try {
      setIsScanning(true);
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: 'PHOTOS'
      });
      
      setPreviewImage(image.dataUrl || null);
      
      // Simulate OCR processing like above
      setTimeout(() => {
        const detectedIngredients = simulateOCRExtraction();
        const result = checkIngredientSafety(detectedIngredients);
        
        toast({
          title: `Scan Complete`,
          description: result.safe 
            ? 'No allergens detected in the scanned item.' 
            : `Warning: Allergens detected!`,
          variant: result.safe ? 'default' : 'destructive',
        });
        
        onResultsFound(result);
        setIsScanning(false);
      }, 2000);
      
    } catch (error) {
      console.error('Photo selection error:', error);
      toast({
        title: 'Image Error',
        description: 'Could not access photos. Please check permissions.',
        variant: 'destructive',
      });
      setIsScanning(false);
    }
  };
  
  // Simulate OCR text extraction (in a real app, this would call an OCR service)
  const simulateOCRExtraction = (): string => {
    // Array of common ingredients and allergens
    const ingredients = [
      "Milk, Sugar, Cocoa Butter, Chocolate, Soy Lecithin, Vanilla",
      "Wheat Flour, Water, Vegetable Oil, Salt, Yeast",
      "Peanuts, Sugar, Salt, Hydrogenated Vegetable Oil",
      "Almonds, Cashews, Walnuts, Peanuts, Salt, Vegetable Oil",
      "Eggs, Milk, Wheat Flour, Sugar, Baking Powder, Salt"
    ];
    
    return ingredients[Math.floor(Math.random() * ingredients.length)];
  };
  
  return (
    <div className="space-y-4">
      {previewImage ? (
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <img 
            src={previewImage} 
            alt="Scanned item" 
            className="w-full h-full object-cover"
          />
          {isScanning && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Loader2 size={48} className="animate-spin text-white mb-2" />
                <p className="text-sm text-white">Processing image...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          {isScanning ? (
            <div className="flex flex-col items-center">
              <Loader2 size={48} className="animate-spin text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Initializing camera...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <CameraIcon size={48} className="text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Ready to scan</p>
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant={previewImage ? "outline" : "default"}
          className="w-full" 
          onClick={captureImage} 
          disabled={isScanning}
        >
          <CameraIcon className="mr-2 h-4 w-4" />
          {previewImage ? 'Rescan' : 'Capture Image'}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={uploadImage} 
          disabled={isScanning}
        >
          <Image className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      </div>
      
      {previewImage && !isScanning && (
        <div className="pt-2">
          <p className="text-sm text-muted-foreground flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            Tap Rescan to try again with a clearer image
          </p>
        </div>
      )}
    </div>
  );
};
