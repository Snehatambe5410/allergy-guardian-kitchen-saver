import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useAppContext } from '../context/AppContext';
import { useIsMobile } from '../hooks/useIsMobile';
import WelcomeScreen from '../components/onboarding/WelcomeScreen';

const HomePage = () => {
  const { isOnboarded, userProfile, activeProfile } = useAppContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Redirect to onboarding if not onboarded
  useEffect(() => {
    if (!isOnboarded) {
      navigate('/onboarding');
    }
  }, [isOnboarded, navigate]);

  if (!isOnboarded) {
    return null;
  }

  return (
    <AppLayout title="Allergy Guardian">
      <div className="p-4">
        {/* Welcome section */}
        <div className="mb-6">
          <WelcomeScreen />
        </div>
        
        {/* Main content area */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Welcome, {activeProfile?.name || userProfile?.name || 'User'}!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Explore our features to manage your allergies and discover safe food options.
          </p>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/scanner')}
              className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium">Scan Food Labels</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Quickly check products for allergens.
              </p>
            </button>
            
            <button 
              onClick={() => navigate('/inventory')}
              className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium">Manage Your Kitchen</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Track your food items and expiration dates.
              </p>
            </button>
          </div>
          
          {/* Tips and Information */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-md">
            <h4 className="font-medium">Tip of the Day</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Always double-check ingredient lists, as formulations can change.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default HomePage;
