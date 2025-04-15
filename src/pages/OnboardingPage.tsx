
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
import { Allergy } from '../types';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useAppContext();

  // State variables
  const [name, setName] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<Array<{
    name: string;
    severity: 'mild' | 'moderate' | 'severe';
  }>>([{ name: '', severity: 'mild' }]);
  
  const [emergencyContacts, setEmergencyContacts] = useState<Array<{
    name: string;
    relation: string;
    phone: string;
    email: string;
  }>>([{ name: '', relation: '', phone: '', email: '' }]);

  // New allergy form state
  const [newAllergy, setNewAllergy] = useState({ name: '', severity: 'mild' as 'mild' | 'moderate' | 'severe' });

  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '', email: '' });

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || '');
      setDietaryPreferences(userProfile.dietaryPreferences || []);
      
      if (userProfile.allergies && userProfile.allergies.length > 0) {
        setAllergies(userProfile.allergies.map(a => ({
          name: a.name,
          severity: a.severity
        })));
      }
      
      if (userProfile.emergencyContacts && userProfile.emergencyContacts.length > 0) {
        setEmergencyContacts(userProfile.emergencyContacts.map(c => ({
          name: c.name,
          relation: c.relation,
          phone: c.phone,
          email: c.email || ''
        })));
      }
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
    setAllergies([...allergies, { name: '', severity: 'mild' }]);
  };

  const updateAllergy = (index: number, field: string, value: string) => {
    const updatedAllergies = [...allergies];
    if (field === 'name') {
      updatedAllergies[index].name = value;
    } else if (field === 'severity') {
      updatedAllergies[index].severity = value as 'mild' | 'moderate' | 'severe';
    }
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
    if (field === 'name') {
      updatedContacts[index].name = value;
    } else if (field === 'relation') {
      updatedContacts[index].relation = value;
    } else if (field === 'phone') {
      updatedContacts[index].phone = value;
    } else if (field === 'email') {
      updatedContacts[index].email = value;
    }
    setEmergencyContacts(updatedContacts);
  };

  const removeContact = (index: number) => {
    const updatedContacts = [...emergencyContacts];
    updatedContacts.splice(index, 1);
    setEmergencyContacts(updatedContacts);
  };

  // Submit handler
  const handleSubmit = () => {
    // Convert the allergies to the correct format with IDs
    const formattedAllergies: Allergy[] = allergies
      .filter(a => a.name.trim() !== '') // Filter out empty allergies
      .map(a => ({
        id: crypto.randomUUID(), // Generate a unique ID
        name: a.name,
        severity: a.severity
      }));
    
    // Convert contacts to the correct format with IDs
    const formattedContacts = emergencyContacts
      .filter(c => c.name.trim() !== '') // Filter out empty contacts
      .map(c => ({
        id: crypto.randomUUID(), // Generate a unique ID
        name: c.name,
        relation: c.relation,
        phone: c.phone,
        email: c.email || undefined // Make email optional
      }));
    
    const profileData = {
      name,
      dietaryPreferences,
      allergies: formattedAllergies,
      emergencyContacts: formattedContacts,
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
