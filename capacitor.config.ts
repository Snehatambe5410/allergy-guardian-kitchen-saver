
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.74de64cb76aa438e9d184ff06dc37fd5',
  appName: 'allergy-guardian-kitchen-saver',
  webDir: 'dist',
  server: {
    url: 'https://74de64cb-76aa-438e-9d18-4ff06dc37fd5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#10b981",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#ffffff",
    }
  }
};

export default config;
