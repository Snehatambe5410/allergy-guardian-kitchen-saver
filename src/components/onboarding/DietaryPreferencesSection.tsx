
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface DietaryPreferencesSectionProps {
  dietaryPreferences: string[];
  toggleDietaryPreference: (option: string) => void;
}

const DietaryPreferencesSection = ({
  dietaryPreferences,
  toggleDietaryPreference,
}: DietaryPreferencesSectionProps) => {
  // Dietary preferences options
  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
  ];

  return (
    <div>
      <Label>Dietary Preferences</Label>
      <div className="mt-2 space-y-1">
        {dietaryOptions.map((option) => (
          <div key={option} className="flex items-center">
            <Checkbox
              id={`dietary-${option}`}
              checked={dietaryPreferences.includes(option)}
              onCheckedChange={() => toggleDietaryPreference(option)}
            />
            <Label
              htmlFor={`dietary-${option}`}
              className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DietaryPreferencesSection;
