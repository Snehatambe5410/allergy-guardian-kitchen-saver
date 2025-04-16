
import { useNavigate } from 'react-router-dom';
import { Camera, Package, Shield, Bell, AlertTriangle, CookingPot, ChefHat, Clock } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useEffect } from 'react';
import { Badge } from '../components/ui/badge';

const HomePage = () => {
  const navigate = useNavigate();
  const { userProfile, isOnboarded, inventory, recipes } = useAppContext();

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
  
  // Simple recommendation algorithm based on user's dietary preferences
  const recommendedRecipes = recipes.filter(recipe => {
    // Don't recommend recipes that contain allergens the user is allergic to
    const userAllergens = userProfile?.allergies.map(allergy => allergy.name.toLowerCase()) || [];
    const recipeAllergens = recipe.allergens.map(allergen => allergen.toLowerCase());
    const hasAllergen = recipeAllergens.some(allergen => userAllergens.includes(allergen));
    
    if (hasAllergen) return false;
    
    // Recommend recipes that match dietary preferences
    const userPreferences = userProfile?.dietaryPreferences.map(pref => pref.toLowerCase()) || [];
    
    // For now, just return recipes that don't contain allergens
    // In a real app, this would be more sophisticated
    return true;
  }).slice(0, 2); // Limit to 2 recommendations

  return (
    <AppLayout title="Allergy Guard & Kitchen Saver">
      <div className="p-4 space-y-6 animate-fade-in">
        {/* Welcome Section - now with gradient background */}
        <section className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-2">
            Hello, {userProfile?.name || 'Friend'}!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Stay safe and reduce waste with your personal food assistant.
          </p>
        </section>

        {/* Quick Actions - now with colorful buttons */}
        <section>
          <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
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

        {/* New Recipe Section */}
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

        {/* Recommended Recipes Section */}
        <section className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Recommended for You</h3>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              Smart Suggestions
            </Badge>
          </div>
          
          {recommendedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {recommendedRecipes.map((recipe) => (
                <div 
                  key={recipe.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate('/recipes')}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{recipe.name}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {recipe.description || `${recipe.ingredients.length} ingredients`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-800/40 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                      <Clock size={12} />
                      <span>{recipe.preparationTime} min</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="bg-white/80 dark:bg-gray-800/80">
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">
                  No recommendations yet. Add more recipes to get started!
                </p>
                <Button 
                  onClick={() => navigate('/recipes')}
                  variant="ghost" 
                  className="mt-2"
                >
                  Browse Recipes
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Allergy Guard - now with interactive hover styling */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Allergy Guard</h3>
            <Shield className="text-app-green-600" size={20} />
          </div>
          <Card className="border-l-4 border-green-400 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Your Allergens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userProfile?.allergies.map((allergy) => (
                  <span 
                    key={allergy.id}
                    className={`px-3 py-1 text-sm rounded-full transform hover:scale-105 transition-transform cursor-pointer ${
                      allergy.severity === 'severe' 
                        ? 'bg-app-red-100 text-app-red-800' 
                        : allergy.severity === 'moderate'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                    onClick={() => navigate('/profile')}
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

        {/* Kitchen Saver - now with better styling */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Kitchen Saver</h3>
            <Package className="text-app-blue-600" size={20} />
          </div>
          <Card className="border-l-4 border-blue-400 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              {expiringItems.length > 0 ? (
                <ul className="space-y-2">
                  {expiringItems.map((item) => {
                    // Calculate days until expiry
                    const daysUntilExpiry = Math.ceil((new Date(item.expiryDate).getTime() - today.getTime()) / (1000 * 3600 * 24));
                    
                    return (
                      <li 
                        key={item.id} 
                        className={`flex justify-between p-2 rounded-lg ${
                          daysUntilExpiry <= 2 
                            ? 'bg-red-50 dark:bg-red-900/20'
                            : 'bg-yellow-50 dark:bg-yellow-900/20'
                        } hover:bg-opacity-80 transition-colors cursor-pointer`}
                        onClick={() => navigate('/inventory')}
                      >
                        <span className="font-medium">{item.name}</span>
                        <span className={`text-sm ${
                          daysUntilExpiry <= 2 ? 'text-red-600' : 'text-orange-600'
                        }`}>
                          {daysUntilExpiry === 0 
                            ? "Expires today!" 
                            : daysUntilExpiry === 1 
                            ? "Expires tomorrow" 
                            : `${daysUntilExpiry} days left`
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

        {/* Notifications - now with interactive elements */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Recent Alerts</h3>
            <Bell className="text-app-blue-600" size={20} />
          </div>
          <Card className="border-l-4 border-purple-400 hover:shadow-lg transition-shadow">
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
