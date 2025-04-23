
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import AllergenDetector from './AllergenDetector';

const AllergenCameraScanner = () => {
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
        <AllergenDetector 
          imagePath={imagePath} 
          onDetectionComplete={resetDetection} 
        />
      )}
    </div>
  );
};

export default AllergenCameraScanner;
