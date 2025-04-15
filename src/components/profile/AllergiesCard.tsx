
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Allergy } from '../../types';

interface AllergiesCardProps {
  allergies: Allergy[];
  addAllergy: (allergy: Allergy) => void;
  removeAllergy: (id: string) => void;
}

const AllergiesCard = ({ allergies, addAllergy, removeAllergy }: AllergiesCardProps) => {
  const [newAllergy, setNewAllergy] = useState({ name: '', severity: 'mild' as 'mild' | 'moderate' | 'severe' });
  
  const handleAddAllergy = () => {
    if (!newAllergy.name) return;
    
    const allergy: Allergy = {
      id: Date.now().toString(),
      name: newAllergy.name,
      severity: newAllergy.severity,
    };
    
    addAllergy(allergy);
    setNewAllergy({ name: '', severity: 'mild' });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Allergies & Sensitivities</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus size={16} className="mr-2" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Allergy or Sensitivity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="allergyName">Allergy or Sensitivity</Label>
                <Input 
                  id="allergyName" 
                  value={newAllergy.name}
                  onChange={(e) => setNewAllergy({...newAllergy, name: e.target.value})}
                  placeholder="e.g., Peanuts, Gluten"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <select 
                  id="severity"
                  value={newAllergy.severity}
                  onChange={(e) => setNewAllergy({
                    ...newAllergy, 
                    severity: e.target.value as 'mild' | 'moderate' | 'severe'
                  })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
              
              <Button onClick={handleAddAllergy} disabled={!newAllergy.name}>
                Add Allergy
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {allergies.map((allergy) => (
            <div 
              key={allergy.id}
              className={`
                px-3 py-1 text-sm rounded-full flex items-center
                ${
                  allergy.severity === 'severe' 
                    ? 'bg-app-red-100 text-app-red-800' 
                    : allergy.severity === 'moderate'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-yellow-100 text-yellow-800'
                }
              `}
            >
              {allergy.name}
              <button 
                className="ml-2 text-gray-600"
                onClick={() => removeAllergy(allergy.id)}
              >
                ×
              </button>
            </div>
          ))}
          {allergies.length === 0 && (
            <span className="text-gray-500">No allergies added yet</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AllergiesCard;
