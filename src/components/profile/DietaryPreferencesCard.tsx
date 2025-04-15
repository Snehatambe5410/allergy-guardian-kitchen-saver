
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

interface DietaryPreferencesCardProps {
  dietaryPreferences: string[];
}

const DietaryPreferencesCard = ({ dietaryPreferences }: DietaryPreferencesCardProps) => {
  // Define all possible dietary options
  const allDietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dietary Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        {dietaryPreferences.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {dietaryPreferences.map((preference, index) => (
              <span 
                key={index}
                className="px-3 py-1 text-sm rounded-full bg-app-blue-100 text-app-blue-800 dark:bg-app-blue-900/30 dark:text-app-blue-300"
              >
                {preference}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-500">No preferences added</span>
        )}
      </CardContent>
    </Card>
  );
};

export default DietaryPreferencesCard;
