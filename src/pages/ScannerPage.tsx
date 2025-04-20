
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, RotateCw, X, Upload, CheckCircle2, Search, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import MobileAppLayout from '../components/layout/MobileAppLayout';
import { Input } from '../components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';
import { AllergenResults } from '@/components/allergen/AllergenResults';

const ScannerPage = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [manualIngredient, setManualIngredient] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { checkIngredientSafety, activeProfile } = useAppContext();
  const [scanResult, setScanResult] = useState<{
    ingredient: string;
    result: ReturnType<typeof checkIngredientSafety>;
  } | null>(null);
  
  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate a scan for demonstration purposes
    // In a real app, this would use a barcode scanning library
    setTimeout(() => {
      setIsScanning(false);
      // Example: Detect "peanut butter" from barcode
      const mockIngredient = "peanut butter";
      const result = checkIngredientSafety(mockIngredient);
      setScanResult({
        ingredient: mockIngredient,
        result
      });
      
      if (!result.safe) {
        toast({
          title: "Allergen Detected!",
          description: `${mockIngredient} contains allergens for ${activeProfile?.name || 'current profile'}.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Safe Ingredient",
          description: `${mockIngredient} is safe for ${activeProfile?.name || 'current profile'}.`,
        });
      }
    }, 2000);
  };
  
  const handleCancelScan = () => {
    setIsScanning(false);
    setUploadedImage(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Only accept image files
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Create a preview of the image
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Simulate processing the barcode from the image
    setTimeout(() => {
      setIsUploading(false);
      // Example: Detect "milk" from image
      const mockIngredient = "milk";
      const result = checkIngredientSafety(mockIngredient);
      setScanResult({
        ingredient: mockIngredient,
        result
      });
      
      if (!result.safe) {
        toast({
          title: "Allergen Detected!",
          description: `${mockIngredient} contains allergens for ${activeProfile?.name || 'current profile'}.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Safe Ingredient",
          description: `${mockIngredient} is safe for ${activeProfile?.name || 'current profile'}.`,
        });
      }
    }, 2000);
  };

  const handleManualCheck = () => {
    if (!manualIngredient.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter an ingredient name.",
        variant: "destructive",
      });
      return;
    }
    
    setIsChecking(true);
    setTimeout(() => {
      const result = checkIngredientSafety(manualIngredient);
      setScanResult({
        ingredient: manualIngredient,
        result
      });
      setIsChecking(false);
      setManualIngredient('');
    }, 800);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <MobileAppLayout title="Allergen Scanner">
      <div className="p-4 flex flex-col items-center justify-start">
        <div className="aspect-square w-full max-w-md bg-black relative rounded-xl overflow-hidden mb-6">
          {uploadedImage ? (
            // Show uploaded image
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={uploadedImage} 
                alt="Uploaded barcode" 
                className="w-full h-full object-contain"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-32 h-32 border-4 border-green-500 rounded-lg animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-1 w-full bg-green-500 animate-scan opacity-50" />
                  </div>
                </div>
              )}
            </div>
          ) : isScanning ? (
            // Show scanning animation
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-green-500 rounded-lg animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-1 w-full bg-green-500 animate-scan opacity-50" />
              </div>
            </div>
          ) : (
            // Show camera placeholder
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <Camera size={64} className="text-gray-400" />
              <p className="text-white text-center absolute bottom-10">Position barcode within the frame</p>
            </div>
          )}
        </div>
        
        {/* Manual ingredient check */}
        <div className="w-full max-w-md mb-6">
          <div className="flex items-center gap-2">
            <Input
              value={manualIngredient}
              onChange={(e) => setManualIngredient(e.target.value)}
              placeholder="Enter ingredient name..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleManualCheck();
                }
              }}
            />
            <Button 
              onClick={handleManualCheck}
              disabled={isChecking}
              className="min-w-[90px]"
            >
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Check
                </>
              )}
            </Button>
          </div>
        </div>
        
        {scanResult && (
          <div className="w-full max-w-md mb-6">
            <h3 className="text-lg font-medium mb-2">Scan Result</h3>
            <AllergenResults 
              ingredient={scanResult.ingredient}
              result={scanResult.result}
            />
          </div>
        )}
        
        {isScanning || isUploading ? (
          <div className="space-y-4 w-full max-w-md">
            <p className="text-center text-gray-500">
              {isScanning ? "Scanning..." : "Processing uploaded image..."}
            </p>
            <Button 
              onClick={handleCancelScan}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <X className="mr-2" size={18} />
              Cancel
            </Button>
          </div>
        ) : (
          <div className="space-y-4 w-full max-w-md">
            <Button 
              onClick={handleStartScan}
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Camera className="mr-2" size={18} />
              Scan Barcode
            </Button>
            
            <div className="relative">
              <Button 
                variant="outline"
                size="lg"
                className="w-full"
                onClick={triggerFileUpload}
              >
                <Upload className="mr-2" size={18} />
                Upload Barcode Image
              </Button>
              <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>
            
            <Button 
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate('/inventory')}
            >
              <RotateCw className="mr-2" size={18} />
              Go To Inventory
            </Button>
          </div>
        )}
      </div>
    </MobileAppLayout>
  );
};

export default ScannerPage;
