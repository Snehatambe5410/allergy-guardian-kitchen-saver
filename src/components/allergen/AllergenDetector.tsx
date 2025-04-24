
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Loader2, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AllergenCheckResult } from '../../types';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

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
      
      // Show toast notification
      if (checkResults.safe) {
        toast.success("Food is safe to eat!", {
          description: `${ingredient} is safe for ${activeProfile?.name || 'you'}.`,
          duration: 3000,
        });
      } else {
        toast.error("Allergen detected!", {
          description: `${ingredient} contains allergens that may not be safe.`,
          duration: 5000,
        });
      }
      
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
    <Card className="w-full border-green-100 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
        <CardTitle className="text-xl flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-green-600" />
          AllergyGuard Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              placeholder="Enter food or ingredient name"
              onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
              className="border-green-200 focus:border-green-500 focus-visible:ring-green-500"
            />
            <Button 
              onClick={handleCheck} 
              disabled={isChecking || !ingredient.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {isChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
            </Button>
          </div>
          
          {results && (
            <div className={`mt-4 p-4 rounded-lg animate-fade-in ${
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
      <CardFooter className="text-sm text-gray-500 bg-green-50/50">
        <div className="flex items-center justify-between w-full">
          <span>
            AllergyGuard & Kitchen Saver • Protecting {activeProfile?.name || 'you'} from allergic reactions
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AllergenDetector;
