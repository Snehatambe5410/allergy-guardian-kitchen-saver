
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Shield, ChefHat, Utensils, Scan, Users } from 'lucide-react';
import { ProfileSwitcher } from '../components/profile/ProfileSwitcher';
import { useAppContext } from '../context/AppContext';

const Index = () => {
  const navigate = useNavigate();
  const { activeProfile, isOnboarded } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Allergy Guard & Kitchen Saver
          </h1>
          <div className="flex items-center gap-2">
            <ProfileSwitcher />
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto p-4">
        {/* Welcome section */}
        <section className="mb-8 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold mb-2">
              {isOnboarded 
                ? `Welcome${activeProfile ? `, ${activeProfile.name}` : ''}!` 
                : 'Welcome to Allergy Guard & Kitchen Saver'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Your personal food safety assistant and smart kitchen companion
            </p>
          </div>
        </section>
        
        {/* Main features */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold">Allergy Detection</h3>
              </div>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Scan ingredients, check recipes, and stay safe with personalized allergy alerts.
              </p>
              <Button 
                className="w-full" 
                onClick={() => navigate('/scanner')}
              >
                <Scan className="mr-2 h-4 w-4" />
                Scan Food
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <ChefHat className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold">Smart Recipes</h3>
              </div>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                Discover safe recipes tailored to your dietary needs and preferences.
              </p>
              <Button 
                className="w-full" 
                onClick={() => navigate('/recipes')}
              >
                <Utensils className="mr-2 h-4 w-4" />
                Browse Recipes
              </Button>
            </CardContent>
          </Card>
        </section>
        
        {/* Secondary features */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center gap-1 bg-white/60 dark:bg-gray-800/60"
            onClick={() => navigate('/inventory')}
          >
            <span>Kitchen Inventory</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Manage your food items</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center gap-1 bg-white/60 dark:bg-gray-800/60"
            onClick={() => navigate('/family')}
          >
            <span>Family Profiles</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Manage health profiles</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center justify-center gap-1 bg-white/60 dark:bg-gray-800/60"
            onClick={() => navigate('/emergency')}
          >
            <span>Emergency Info</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Quick access to critical data</span>
          </Button>
        </section>
        
        {!isOnboarded && (
          <section className="text-center mt-8">
            <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Get Started</h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  Set up your profile to get personalized allergy alerts, recipes, and more.
                </p>
                <Button 
                  className="w-full max-w-xs" 
                  onClick={() => navigate('/onboarding')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Setup Your Profile
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 text-center text-sm text-gray-500">
        <p>Allergy Guard & Kitchen Saver © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
