
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, RotateCw, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import AppLayout from '../components/layout/AppLayout';

const ScannerPage = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  
  const handleStartScan = () => {
    setIsScanning(true);
    // In a real app, we would access the camera here
    // For this demo, we'll just simulate a scan
    setTimeout(() => {
      setIsScanning(false);
      navigate('/scan-result');
    }, 2000);
  };
  
  const handleCancelScan = () => {
    setIsScanning(false);
  };

  return (
    <AppLayout title="Scan Food Item">
      <div className="p-4 flex flex-col items-center justify-center h-full">
        <div className="aspect-square w-full max-w-md bg-black relative rounded-xl overflow-hidden mb-6">
          {isScanning ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-app-green-500 rounded-lg animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-1 w-full bg-app-green-500 animate-scan opacity-50" />
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <Camera size={64} className="text-gray-400" />
              <p className="text-white text-center absolute bottom-10">Position barcode within the frame</p>
            </div>
          )}
        </div>
        
        {isScanning ? (
          <div className="space-y-4 w-full max-w-md">
            <p className="text-center text-gray-500">Scanning...</p>
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
