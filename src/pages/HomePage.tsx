
import { useNavigate } from 'react-router-dom';
import { Camera, Shield, Bell, AlertTriangle, CookingPot, ChefHat, Clock, Package } from 'lucide-react';
import MobileAppLayout from '../components/layout/MobileAppLayout';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useEffect } from 'react';
import { Badge } from '../components/ui/badge';

const HomePage = () => {
  const navigate = useNavigate();
  const { 
    userProfile, 
    isOnboarded, 
    inventory, 
    recipes, 
    activeProfile,
    checkIngredientSafety,
    suggestRecipes
  } = useAppContext();

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

  // Get favorite recipes
  const favoriteRecipes = recipes.filter(recipe => recipe.isFavorite);
  
  // Get recommended recipes using our smart function
  const recommendedRecipes = suggestRecipes();

  return (
    <MobileAppLayout title="Allergy Guard" showProfileSwitcher={true}>
      <div className="p-4 space-y-6 animate-fade-in">
        {/* Welcome Section with active profile */}
        <section className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-1">
              Hello, {activeProfile?.name || userProfile?.name || 'Friend'}!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Stay safe and reduce waste with your personal food assistant.
            </p>
          </div>
        </section>

        {/* Quick Actions - now with colorful buttons */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate('/scanner')}
              size="lg"
              className="scan-button h-20 w-full bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 transition-all duration-300"
            >
              <Camera className="mr-2" size={20} />
              Scan Food
            </Button>
            <Button 
              onClick={() => navigate('/emergency')}
              variant="destructive" 
              size="lg"
              className="emergency-button h-20 w-full bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 transition-all duration-300"
            >
              <AlertTriangle className="mr-2" size={20} />
              Emergency Info
            </Button>
          </div>
        </section>

        {/* Recipe Section */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Your Recipes</h3>
            <CookingPot className="text-orange-500" size={20} />
          </div>
          <Card className="border-l-4 border-orange-400 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-md flex items-center justify-between">
                <span>Favorite Recipes</span>
                <ChefHat className="text-orange-500" size={16} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {favoriteRecipes.length > 0 ? (
                <div className="space-y-2">
                  {favoriteRecipes.slice(0, 3).map((recipe) => (
                    <div 
                      key={recipe.id}
                      className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                      onClick={() => navigate('/recipes')}
                    >
                      <span className="font-medium">{recipe.name}</span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        <span>{recipe.preparationTime} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2 text-gray-500">
                  No favorite recipes yet
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                onClick={() => navigate('/recipes')}
                variant="outline" 
                className="w-full border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                View All Recipes
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Allergy Guard */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Allergy Guard</h3>
            <Shield className="text-green-600" size={20} />
          </div>
          <Card className="border-l-4 border-green-400 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-md">
                {activeProfile?.name || userProfile?.name || 'Your'} Allergens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {activeProfile?.allergies?.map((allergy) => (
                  <span 
                    key={allergy.id}
                    className={`px-3 py-1 text-sm rounded-full transform hover:scale-105 transition-transform cursor-pointer ${
                      allergy.severity === 'severe' 
                        ? 'bg-red-100 text-red-800' 
                        : allergy.severity === 'moderate'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                    onClick={() => navigate('/profile')}
                  >
                    {allergy.name}
                  </span>
                ))}
                {(!activeProfile?.allergies || activeProfile?.allergies.length === 0) && (
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
            <Package className="text-blue-600" size={20} />
          </div>
          <Card className="border-l-4 border-blue-400 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              {expiringItems.length > 0 ? (
                <ul className="space-y-2">
                  {expiringItems.slice(0, 3).map((item) => {
                    // Calculate days until expiry
                    const daysUntilExpiry = Math.ceil((new Date(item.expiryDate).getTime() - today.getTime()) / (1000 * 3600 * 24));
                    
                    // Check if the item is safe for current profile
                    const safetyCheck = item.allergens 
                      ? item.allergens.some(allergen => 
                          activeProfile?.allergies.some(a => 
                            a.name.toLowerCase() === allergen.toLowerCase()
                          )
                        )
                      : false;
                    
                    return (
                      <li 
                        key={item.id} 
                        className={`flex justify-between p-2 rounded-lg cursor-pointer ${
                          daysUntilExpiry <= 2 
                            ? 'bg-red-50 dark:bg-red-900/20'
                            : 'bg-yellow-50 dark:bg-yellow-900/20'
                        } hover:bg-opacity-80 transition-colors relative`}
                        onClick={() => navigate('/inventory')}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          {safetyCheck && (
                            <Badge variant="destructive" className="text-xs">Allergen</Badge>
                          )}
                        </div>
                        <span className={`text-sm ${
                          daysUntilExpiry <= 2 ? 'text-red-600' : 'text-orange-600'
                        }`}>
                          {daysUntilExpiry === 0 
                            ? "Today!" 
                            : daysUntilExpiry === 1 
                            ? "Tomorrow" 
                            : `${daysUntilExpiry} days`
                          }
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-center py-2 text-gray-500">
                  No items expiring soon
                </div>
              )}
              <Button 
                onClick={() => navigate('/inventory')}
                variant="outline" 
                className="w-full mt-3 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                View All Items
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </MobileAppLayout>
  );
};

export default HomePage;
