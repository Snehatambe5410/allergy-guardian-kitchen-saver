
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

const AppRoutes = () => {
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
