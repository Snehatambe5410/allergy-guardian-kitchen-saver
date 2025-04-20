
import { 
  CircleCheck, 
  CircleX, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useAppContext } from '@/context/AppContext';
import { AllergenCheckResult } from '@/types';

interface AllergenResultsProps {
  ingredient: string;
  result: AllergenCheckResult;
}

export function AllergenResults({ ingredient, result }: AllergenResultsProps) {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const { activeProfile } = useAppContext();
  
  return (
    <Card className={`${
      result.safe 
        ? 'border-l-4 border-green-500' 
        : 'border-l-4 border-red-500'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {result.safe ? (
              <CircleCheck className="text-green-500 h-6 w-6" />
            ) : (
              <CircleX className="text-red-500 h-6 w-6" />
            )}
            <span className="font-medium">{ingredient}</span>
          </div>
          
          <div className="flex items-center">
            {result.safe ? (
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Safe
              </span>
            ) : (
              <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                Allergen
              </span>
            )}
          </div>
        </div>
        
        {!result.safe && (
          <>
            <div className="mt-3">
              <p className="text-sm text-gray-500">
                Contains allergens for {activeProfile?.name || 'current profile'}:
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {result.allergies.map(allergy => (
                  <span 
                    key={allergy.id}
                    className={`px-3 py-1 text-xs rounded-full ${
                      allergy.severity === 'severe' 
                        ? 'bg-red-100 text-red-800' 
                        : allergy.severity === 'moderate'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {allergy.name} ({allergy.severity})
                  </span>
                ))}
              </div>
            </div>
            
            {result.alternatives && result.alternatives.length > 0 && (
              <>
                <Separator className="my-3" />
                
                <Button
                  variant="ghost"
                  className="p-0 h-auto flex items-center text-sm text-blue-600"
                  onClick={() => setShowAlternatives(!showAlternatives)}
                >
                  {showAlternatives ? (
                    <ChevronUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-1" />
                  )}
                  {showAlternatives ? "Hide alternatives" : "Show safe alternatives"}
                </Button>
                
                {showAlternatives && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-500">Suggested alternatives:</p>
                    <ul className="space-y-1">
                      {result.alternatives.map((alt, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <span className="text-sm">{alt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
