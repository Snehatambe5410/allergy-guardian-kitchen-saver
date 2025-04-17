
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, RotateCw, X, Upload, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import AppLayout from '../components/layout/AppLayout';
import { Input } from '../components/ui/input';
import { useToast } from '@/hooks/use-toast';

const ScannerPage = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleStartScan = () => {
    setIsScanning(true);
    // Simulate a scan for demonstration purposes
    // In a real app, this would use a barcode scanning library
    setTimeout(() => {
      setIsScanning(false);
      // Pass a mock barcode result
      navigateToScanResult('073000136365');
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
      // Navigate to scan result with a mock barcode
      navigateToScanResult('022000124210');
    }, 2000);
  };

  const navigateToScanResult = (barcode: string) => {
    // Pass the barcode to the scan result page
    navigate(`/scan-result?barcode=${barcode}`);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <AppLayout title="Scan Food Item">
      <div className="p-4 flex flex-col items-center justify-center h-full">
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
                  <div className="w-32 h-32 border-4 border-app-green-500 rounded-lg animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-1 w-full bg-app-green-500 animate-scan opacity-50" />
                  </div>
                </div>
              )}
            </div>
          ) : isScanning ? (
            // Show scanning animation
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-app-green-500 rounded-lg animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-1 w-full bg-app-green-500 animate-scan opacity-50" />
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
              className="w-full bg-app-green-600 hover:bg-app-green-700"
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
              Enter Manually
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ScannerPage;
