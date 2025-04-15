
import { useNavigate } from 'react-router-dom';
import { Camera, Package, Shield, Bell, AlertTriangle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useEffect } from 'react';

const HomePage = () => {
  const navigate = useNavigate();
  const { userProfile, isOnboarded, inventory } = useAppContext();

  // Redirect to onboarding if not onboarded (in a real app)
  useEffect(() => {
    if (!isOnboarded && !userProfile) {
      navigate('/onboarding');
    }
  }, [isOnboarded, userProfile, navigate]);

  // Calculate items expiring soon
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const expiringItems = inventory.filter(item => {
    const expiryDate = new Date(item.expiryDate);
    return expiryDate > today && expiryDate <= nextWeek;
  });

  return (
    <AppLayout title="Allergy Guard & Kitchen Saver">
      <div className="p-4 space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <section>
          <h2 className="text-2xl font-bold mb-2">
            Hello, {userProfile?.name || 'Friend'}!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Stay safe and reduce waste with your personal food assistant.
          </p>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate('/scanner')}
              size="lg"
              className="scan-button h-20 w-full"
            >
              <Camera className="mr-2" size={20} />
              Scan Food
            </Button>
            <Button 
              onClick={() => navigate('/emergency')}
              variant="destructive" 
              size="lg"
              className="emergency-button h-20 w-full"
            >
              <AlertTriangle className="mr-2" size={20} />
              Emergency Info
            </Button>
          </div>
        </section>

        {/* Allergy Guard */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Allergy Guard</h3>
            <Shield className="text-app-green-600" size={20} />
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Your Allergens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userProfile?.allergies.map((allergy) => (
                  <span 
                    key={allergy.id}
                    className={`px-3 py-1 text-sm rounded-full ${
                      allergy.severity === 'severe' 
                        ? 'bg-app-red-100 text-app-red-800' 
                        : allergy.severity === 'moderate'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {allergy.name}
                  </span>
                ))}
                {(!userProfile?.allergies || userProfile.allergies.length === 0) && (
                  <span className="text-gray-500">No allergies added yet</span>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Kitchen Saver */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Kitchen Saver</h3>
            <Package className="text-app-blue-600" size={20} />
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              {expiringItems.length > 0 ? (
                <ul className="space-y-2">
                  {expiringItems.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="text-app-red-600">
                        Expires: {new Date(item.expiryDate).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-2 text-gray-500">
                  No items expiring soon
                </div>
              )}
              <Button 
                onClick={() => navigate('/inventory')}
                variant="outline" 
                className="w-full mt-3"
              >
                View All Items
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Notifications */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Recent Alerts</h3>
            <Bell className="text-app-blue-600" size={20} />
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-2 text-gray-500">
                No recent alerts
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
};

export default HomePage;
