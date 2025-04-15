
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAppContext } from '../context/AppContext';
import { Checkbox } from '../components/ui/checkbox';
import { cn } from '../lib/utils';
import { useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useAppContext();

  // State variables
  const [name, setName] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [allergies, setAllergies] = useState([{ name: '', severity: 'mild' as 'mild' | 'moderate' | 'severe' }]);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: '', relation: '', phone: '', email: '' },
  ]);

  // New allergy form state
  const [newAllergy, setNewAllergy] = useState({ name: '', severity: 'mild' as 'mild' | 'moderate' | 'severe' });

  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '', email: '' });

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setDietaryPreferences(userProfile.dietaryPreferences || []);
      setAllergies(userProfile.allergies || [{ name: '', severity: 'mild' }]);
      setEmergencyContacts(userProfile.emergencyContacts || [
        { name: '', relation: '', phone: '', email: '' },
      ]);
    }
  }, [userProfile]);

  // Dietary preferences options
  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
  ];

  // Handlers for adding/removing dietary preferences
  const toggleDietaryPreference = (option: string) => {
    if (dietaryPreferences.includes(option)) {
      setDietaryPreferences(dietaryPreferences.filter((pref) => pref !== option));
    } else {
      setDietaryPreferences([...dietaryPreferences, option]);
    }
  };

  // Handlers for allergies
  const addAllergy = () => {
    setAllergies([...allergies, { name: '', severity: 'mild' as 'mild' | 'moderate' | 'severe' }]);
  };

  const updateAllergy = (index: number, field: string, value: string) => {
    const updatedAllergies = [...allergies];
    // Typescript complains if I don't use `any` here
    (updatedAllergies[index] as any)[field] = value;
    setAllergies(updatedAllergies);
  };

  const removeAllergy = (index: number) => {
    const updatedAllergies = [...allergies];
    updatedAllergies.splice(index, 1);
    setAllergies(updatedAllergies);
  };

  // Handlers for emergency contacts
  const addContact = () => {
    setEmergencyContacts([
      ...emergencyContacts,
      { name: '', relation: '', phone: '', email: '' },
    ]);
  };

  const updateContact = (index: number, field: string, value: string) => {
    const updatedContacts = [...emergencyContacts];
    // Typescript complains if I don't use `any` here
    (updatedContacts[index] as any)[field] = value;
    setEmergencyContacts(updatedContacts);
  };

  const removeContact = (index: number) => {
    const updatedContacts = [...emergencyContacts];
    updatedContacts.splice(index, 1);
    setEmergencyContacts(updatedContacts);
  };

  // Submit handler
  const handleSubmit = () => {
    const profileData = {
      name,
      dietaryPreferences,
      allergies,
      emergencyContacts,
    };
    updateUserProfile(profileData);
    navigate('/inventory');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <Card className="divide-y divide-gray-200">
          <CardHeader className="px-5 py-4">
            <CardTitle className="text-lg font-semibold">
              Welcome! Tell us about yourself.
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 py-6">
            <div className="space-y-4">
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

              <div>
                <Label>Allergies & Sensitivities</Label>
                <div className="mt-2 space-y-2">
                  {allergies.map((allergy, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        type="text"
                        placeholder="Allergy"
                        value={allergy.name}
                        onChange={(e) =>
                          updateAllergy(index, 'name', e.target.value)
                        }
                      />
                      <Select value={allergy.severity} onValueChange={(value) => updateAllergy(index, 'severity', value)}>
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

              <div>
                <Label>Emergency Contacts</Label>
                <div className="mt-2 space-y-2">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex space-x-2">
                        <Input
                          type="text"
                          placeholder="Contact Name"
                          value={contact.name}
                          onChange={(e) =>
                            updateContact(index, 'name', e.target.value)
                          }
                        />
                        <Input
                          type="text"
                          placeholder="Relation"
                          value={contact.relation}
                          onChange={(e) =>
                            updateContact(index, 'relation', e.target.value)
                          }
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Input
                          type="tel"
                          placeholder="Phone"
                          value={contact.phone}
                          onChange={(e) =>
                            updateContact(index, 'phone', e.target.value)
                          }
                        />
                        <Input
                          type="email"
                          placeholder="Email"
                          value={contact.email}
                          onChange={(e) =>
                            updateContact(index, 'email', e.target.value)
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeContact(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="secondary" onClick={addContact}>
                    Add Contact
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <div className="px-5 py-4">
            <Button className="w-full" onClick={handleSubmit}>
              Save & Continue
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
