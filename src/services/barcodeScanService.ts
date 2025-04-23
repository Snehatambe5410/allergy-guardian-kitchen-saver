
import { Toast } from "@/components/ui/use-toast";
import { AllergenCheckResult, FoodItem } from "@/types";
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export interface BarcodeResult {
  hasContent: boolean;
  content?: string;
}

export const startBarcodeScanner = async (): Promise<BarcodeResult> => {
  try {
    // Check camera permission
    const status = await BarcodeScanner.checkPermission({ force: true });
    
    if (status.granted) {
      // Make the webview transparent
      await BarcodeScanner.hideBackground();
      document.body.classList.add('barcode-scanner-active');
      
      const result = await BarcodeScanner.startScan();
      
      // Clean up
      document.body.classList.remove('barcode-scanner-active');
      
      if (result.hasContent) {
        return {
          hasContent: true,
          content: result.content
        };
      }
    }
    
    return { hasContent: false };
  } catch (error) {
    console.error('Barcode scanner error:', error);
    document.body.classList.remove('barcode-scanner-active');
    return { hasContent: false };
  } finally {
    await BarcodeScanner.stopScan();
    await BarcodeScanner.showBackground();
  }
};

// Mock function - In a real app, this would query a product database
export const searchProductByBarcode = async (barcode: string): Promise<FoodItem | null> => {
  console.log(`Searching for product with barcode: ${barcode}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock database of products
  const mockProducts: Record<string, FoodItem> = {
    '737628064502': {
      id: '1',
      name: 'Chocolate Chip Cookies',
      category: 'Snacks',
      expiryDate: '2023-12-31',
      quantity: 1,
      unit: 'pack',
      allergens: ['Wheat', 'Milk', 'Soy'],
      barcode: '737628064502',
    },
    '041196910759': {
      id: '2',
      name: 'Almond Milk',
      category: 'Dairy Alternative',
      expiryDate: '2023-10-15',
      quantity: 1,
      unit: 'carton',
      allergens: ['Tree Nuts'],
      barcode: '041196910759',
    },
    '038000138416': {
      id: '3',
      name: 'Peanut Butter',
      category: 'Spread',
      expiryDate: '2023-11-30',
      quantity: 1,
      unit: 'jar',
      allergens: ['Peanuts'],
      barcode: '038000138416',
    },
    '011110038364': {
      id: '4',
      name: 'Gluten Free Bread',
      category: 'Bread',
      expiryDate: '2023-09-25',
      quantity: 1,
      unit: 'loaf',
      allergens: [],
      barcode: '011110038364',
    }
  };
  
  return mockProducts[barcode] || null;
};

// Add CSS styles for barcode scanning
export const addBarcodeScannerStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .barcode-scanner-active {
      background: transparent !important;
    }
    
    .barcode-scanner-active * {
      visibility: hidden;
    }
    
    .scanner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .scanner-frame {
      width: 80%;
      max-width: 300px;
      height: 300px;
      border: 2px solid white;
      border-radius: 10px;
      box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.5);
      position: relative;
    }
    
    .scanner-line {
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: 2px;
      background-color: #10b981;
      animation: scan 2s linear infinite;
    }
    
    .scanner-cancel {
      margin-top: 30px;
      padding: 10px 20px;
      background-color: white;
      color: black;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      visibility: visible !important;
    }
    
    @keyframes scan {
      0% {
        top: 20%;
      }
      50% {
        top: 80%;
      }
      100% {
        top: 20%;
      }
    }
  `;
  document.head.appendChild(styleElement);
};
