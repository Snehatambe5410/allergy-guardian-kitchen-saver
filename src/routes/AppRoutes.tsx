
import { Route, Routes } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import HomePage from '../pages/HomePage';
import OnboardingPage from '../pages/OnboardingPage';
import ScannerPage from '../pages/ScannerPage';
import InventoryPage from '../pages/InventoryPage';
import ProfilePage from '../pages/ProfilePage';
import EmergencyPage from '../pages/EmergencyPage';
import ScanResultPage from '../pages/ScanResultPage';
import FamilyProfilesPage from '../pages/FamilyProfilesPage';
import RecipesPage from '../pages/RecipesPage';
import AuthPage from '../pages/AuthPage';
import ProtectedRoute from '../components/ProtectedRoute';
import { useEffect } from 'react';

// Add this function to ensure proper mobile viewport
const setupMobileViewport = () => {
  // Set the viewport meta tag for mobile devices
  const viewport = document.querySelector("meta[name=viewport]");
  
  if (viewport) {
    viewport.setAttribute(
      "content", 
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    );
  } else {
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    document.getElementsByTagName("head")[0].appendChild(meta);
  }
  
  // Add mobile app theme color
  const themeColor = document.querySelector("meta[name=theme-color]");
  if (!themeColor) {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#10b981"; // Green color for status bar
    document.getElementsByTagName("head")[0].appendChild(meta);
  }
};

const AppRoutes = () => {
  // Setup mobile viewport on load
  useEffect(() => {
    setupMobileViewport();
    
    // Add mobile app styling
    document.body.classList.add('touch-manipulation');
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    
    const handleResize = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <OnboardingPage />
        </ProtectedRoute>
      } />
      
      <Route path="/scanner" element={
        <ProtectedRoute>
          <ScannerPage />
        </ProtectedRoute>
      } />
      
      <Route path="/scan-result" element={
        <ProtectedRoute>
          <ScanResultPage />
        </ProtectedRoute>
      } />
      
      <Route path="/inventory" element={
        <ProtectedRoute>
          <InventoryPage />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      <Route path="/emergency" element={
        <ProtectedRoute>
          <EmergencyPage />
        </ProtectedRoute>
      } />
      
      <Route path="/family" element={
        <ProtectedRoute>
          <FamilyProfilesPage />
        </ProtectedRoute>
      } />
      
      <Route path="/recipes" element={
        <ProtectedRoute>
          <RecipesPage />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
