
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AllergenCheckResult } from '../../types';
import { Badge } from '../ui/badge';

interface AllergenDetectorProps {
  onResultsFound?: (results: AllergenCheckResult) => void;
  onDetectionComplete?: () => void;
  compact?: boolean;
}

export const AllergenDetector: React.FC<AllergenDetectorProps> = ({ 
  onResultsFound,
  onDetectionComplete,
  compact = false
}) => {
  const { checkIngredientSafety, activeProfile } = useAppContext();
  const [ingredient, setIngredient] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<AllergenCheckResult | null>(null);
  
  const handleCheck = () => {
    if (!ingredient.trim()) return;
    
    setIsChecking(true);
    // Small artificial delay to show loading state (remove in production)
    setTimeout(() => {
      const checkResults = checkIngredientSafety(ingredient);
      setResults(checkResults);
      if (onResultsFound) {
        onResultsFound(checkResults);
      }
      setIsChecking(false);
      
      // Call onDetectionComplete if provided
      if (onDetectionComplete) {
        // Small delay to show results before resetting
        setTimeout(() => {
          onDetectionComplete();
        }, 3000);
      }
    }, 500);
  };
  
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          placeholder="Enter ingredient to check"
          className="flex-1"
        />
        <Button onClick={handleCheck} disabled={isChecking || !ingredient.trim()}>
          {isChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
        </Button>
      </div>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          Allergy Detector
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              placeholder="Enter food or ingredient name"
              onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
            />
            <Button onClick={handleCheck} disabled={isChecking || !ingredient.trim()}>
              {isChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
            </Button>
          </div>
          
          {results && (
            <div className={`mt-4 p-4 rounded-lg ${
              results.safe 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200' 
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {results.safe ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800 dark:text-green-300">
                      Safe for {activeProfile?.name || 'current profile'}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-800 dark:text-red-300">
                      Not safe - contains allergens!
                    </span>
                  </>
                )}
              </div>
              
              {!results.safe && results.allergies.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Allergens detected:</p>
                  <div className="flex flex-wrap gap-1">
                    {results.allergies.map(allergy => (
                      <Badge 
                        key={allergy.id}
                        variant="destructive"
                        className={
                          allergy.severity === 'severe' 
                            ? 'bg-red-600' 
                            : allergy.severity === 'moderate'
                            ? 'bg-orange-600'
                            : 'bg-yellow-600'
                        }
                      >
                        {allergy.name} ({allergy.severity})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {!results.safe && results.alternatives && results.alternatives.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-1">Suggested alternatives:</p>
                  <div className="flex flex-wrap gap-1">
                    {results.alternatives.map((alt, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="bg-green-50 text-green-800 border-green-300"
                      >
                        {alt}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        Enter any ingredient or food item to check if it's safe for {activeProfile?.name || 'the current profile'}
      </CardFooter>
    </Card>
  );
};

export default AllergenDetector;
