
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import AllergenDetector from './AllergenDetector';

interface AllergenCameraScannerProps {
  isScanning?: boolean;
  setIsScanning?: (scanning: boolean) => void;
  onResultsFound?: (results: any) => void;
  checkIngredientSafety?: (ingredient: string) => any;
}

const AllergenCameraScanner = ({
  isScanning,
  setIsScanning,
  onResultsFound,
  checkIngredientSafety,
}: AllergenCameraScannerProps) => {
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const takePicture = async () => {
    try {
      const image: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      const path = image.webPath || image.path;
      if (path) {
        setImagePath(path);
        setIsDetecting(true);
        if (setIsScanning) {
          setIsScanning(true);
        }
      } else {
        toast.error('Failed to capture image');
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast.error('Failed to take picture');
    }
  };

  const selectFromGallery = async () => {
    try {
      const image: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });

      const path = image.webPath || image.path;
      if (path) {
        setImagePath(path);
        setIsDetecting(true);
        if (setIsScanning) {
          setIsScanning(true);
        }
      } else {
        toast.error('Failed to select image');
      }
    } catch (error) {
      console.error('Gallery selection error:', error);
      toast.error('Failed to select picture');
    }
  };

  const resetDetection = () => {
    setImagePath(null);
    setIsDetecting(false);
    if (setIsScanning) {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      {!imagePath && (
        <div className="flex space-x-4">
          <Button onClick={takePicture}>Take Photo</Button>
          <Button variant="outline" onClick={selectFromGallery}>
            Select from Gallery
          </Button>
        </div>
      )}

      {imagePath && isDetecting && (
        <div className="mt-4">
          <img src={imagePath} alt="Captured" className="w-full rounded-md mb-4" />
          <AllergenDetector 
            onResultsFound={onResultsFound}
            onDetectionComplete={resetDetection} 
          />
        </div>
      )}
    </div>
  );
};

export default AllergenCameraScanner;
