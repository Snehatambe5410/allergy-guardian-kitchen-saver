
import { Badge } from '../ui/badge';

interface ActiveFiltersProps {
  cuisineFilter: string[];
  allergenFilter: string[];
  maxPrepTime: number;
  maxPrepTimeValue: number;
  showOnlySafe: boolean;
  activeProfileName?: string;
  setCuisineFilter: (cuisines: string[]) => void;
  setAllergenFilter: (allergens: string[]) => void;
  setMaxPrepTime: (time: number) => void;
  setShowOnlySafe: (safe: boolean) => void;
}

const ActiveFilters = ({
  cuisineFilter,
  allergenFilter,
  maxPrepTime,
  maxPrepTimeValue,
  showOnlySafe,
  activeProfileName,
  setCuisineFilter,
  setAllergenFilter,
  setMaxPrepTime,
  setShowOnlySafe,
}: ActiveFiltersProps) => {
  if (!(cuisineFilter.length > 0 || allergenFilter.length > 0 || maxPrepTime < maxPrepTimeValue || showOnlySafe)) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-green-700">Active filters:</span>
      {cuisineFilter.map(cuisine => (
        <Badge key={cuisine} variant="secondary" className="gap-1 bg-green-100 text-green-800">
          {cuisine}
          <button
            className="ml-1 rounded-full hover:bg-green-200"
            onClick={() => setCuisineFilter(cuisineFilter.filter(c => c !== cuisine))}
          >
            ×
          </button>
        </Badge>
      ))}
      {allergenFilter.map(allergen => (
        <Badge key={allergen} variant="destructive" className="gap-1">
          No {allergen}
          <button
            className="ml-1 rounded-full hover:bg-red-400"
            onClick={() => setAllergenFilter(allergenFilter.filter(a => a !== allergen))}
          >
            ×
          </button>
        </Badge>
      ))}
      {maxPrepTime < maxPrepTimeValue && (
        <Badge variant="secondary" className="gap-1 bg-green-100 text-green-800">
          ≤ {maxPrepTime} min
          <button
            className="ml-1 rounded-full hover:bg-green-200"
            onClick={() => setMaxPrepTime(Math.max(maxPrepTimeValue, 120))}
          >
            ×
          </button>
        </Badge>
      )}
      {showOnlySafe && (
        <Badge variant="secondary" className="gap-1 bg-green-100 text-green-800 hover:bg-green-200">
          Safe for {activeProfileName || 'current profile'}
          <button
            className="ml-1 rounded-full hover:bg-green-200"
            onClick={() => setShowOnlySafe(false)}
          >
            ×
          </button>
        </Badge>
      )}
    </div>
  );
};

export default ActiveFilters;
