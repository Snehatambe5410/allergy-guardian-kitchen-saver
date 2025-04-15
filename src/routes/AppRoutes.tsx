
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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/scanner" element={<ScannerPage />} />
      <Route path="/scan-result" element={<ScanResultPage />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/emergency" element={<EmergencyPage />} />
      <Route path="/family" element={<FamilyProfilesPage />} />
      <Route path="/recipes" element={<RecipesPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
