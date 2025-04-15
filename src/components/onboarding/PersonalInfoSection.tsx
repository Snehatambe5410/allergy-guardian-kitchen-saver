
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface PersonalInfoSectionProps {
  name: string;
  setName: (name: string) => void;
}

const PersonalInfoSection = ({ name, setName }: PersonalInfoSectionProps) => {
  return (
    <div>
      <Label htmlFor="name">Your Name</Label>
      <Input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
    </div>
  );
};

export default PersonalInfoSection;
