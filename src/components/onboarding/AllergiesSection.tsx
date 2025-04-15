
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface AllergiesSectionProps {
  allergies: Array<{ name: string; severity: 'mild' | 'moderate' | 'severe' }>;
  updateAllergy: (index: number, field: string, value: string) => void;
  removeAllergy: (index: number) => void;
  addAllergy: () => void;
}

const AllergiesSection = ({
  allergies,
  updateAllergy,
  removeAllergy,
  addAllergy,
}: AllergiesSectionProps) => {
  return (
    <div>
      <Label>Allergies & Sensitivities</Label>
      <div className="mt-2 space-y-2">
        {allergies.map((allergy, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Allergy"
              value={allergy.name}
              onChange={(e) => updateAllergy(index, 'name', e.target.value)}
            />
            <Select 
              value={allergy.severity} 
              onValueChange={(value) => updateAllergy(index, 'severity', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => removeAllergy(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={addAllergy}>
          Add Allergy
        </Button>
      </div>
    </div>
  );
};

export default AllergiesSection;
