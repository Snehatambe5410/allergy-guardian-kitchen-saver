
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Camera, ShieldCheck, User, BookOpen } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl shadow-sm">
    <div className="flex flex-col items-center text-center">
      <div className="h-12 w-12 bg-green-600 text-white rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </div>
);

const WelcomeScreen = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="w-full max-w-md mx-auto border-green-200">
      <CardHeader className="text-center bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Welcome to Allergy Guardian</CardTitle>
        <CardDescription className="text-green-100">
          Your pocket companion for food safety
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <FeatureCard
            icon={<Camera size={24} />}
            title="Scan Labels"
            description="Quickly scan food packages to identify potential allergens"
          />
          
          <FeatureCard
            icon={<ShieldCheck size={24} />}
            title="Allergen Alerts"
            description="Get immediate warnings about unsafe ingredients"
          />
          
          <FeatureCard
            icon={<User size={24} />}
            title="Family Profiles"
            description="Manage multiple allergy profiles for your family"
          />
          
          <FeatureCard
            icon={<BookOpen size={24} />}
            title="Recipe Check"
            description="Find and save allergen-free recipes"
          />
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-800 rounded mb-6">
          <p className="font-medium mb-1">Important Note</p>
          <p>This app is designed to help identify potential allergens, but always double-check ingredients yourself. Your safety is our priority!</p>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3">
        <Button 
          onClick={() => navigate('/scanner')} 
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Start Scanning
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/profile')} 
          className="w-full"
        >
          Set Up Your Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WelcomeScreen;
