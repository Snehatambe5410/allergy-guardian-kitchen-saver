import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { useAppContext } from '../context/AppContext';
import { Allergy } from '../types';
import { toast } from 'sonner';
import PersonalInfoSection from '../components/onboarding/PersonalInfoSection';
import DietaryPreferencesSection from '../components/onboarding/DietaryPreferencesSection';
import AllergiesSection from '../components/onboarding/AllergiesSection';
import EmergencyContactsSection from '../components/onboarding/EmergencyContactsSection';

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

  // Load user profile data if available
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

  // Handlers for dietary preferences
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

  // Validate form before submission
  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return false;
    }

    // Validate allergies
    const validAllergies = allergies.filter(a => a.name.trim());
    if (validAllergies.length === 0) {
      toast.error('Please add at least one allergy');
      return false;
    }

    // Validate emergency contacts
    const validContacts = emergencyContacts.filter(c => 
      c.name.trim() && c.phone.trim()
    );
    if (validContacts.length === 0) {
      toast.error('Please add at least one emergency contact');
      return false;
    }

    return true;
  };

  // Submit handler
  const handleSubmit = () => {
    if (!validateForm()) return;

    // Convert the allergies to the correct format with IDs
    const formattedAllergies: Allergy[] = allergies
      .filter(a => a.name.trim() !== '')
      .map(a => ({
        id: crypto.randomUUID(),
        name: a.name,
        severity: a.severity
      }));
    
    // Convert contacts to the correct format with IDs
    const formattedContacts = emergencyContacts
      .filter(c => c.name.trim() !== '')
      .map(c => ({
        id: crypto.randomUUID(),
        name: c.name,
        relation: c.relation,
        phone: c.phone,
        email: c.email || undefined
      }));
    
    const profileData = {
      name,
      dietaryPreferences,
      allergies: formattedAllergies,
      emergencyContacts: formattedContacts,
    };
    
    updateUserProfile(profileData);
    toast.success('Profile updated successfully!');
    navigate('/inventory');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-6 px-4">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader className="px-5 py-4">
            <CardTitle className="text-xl font-semibold text-center text-green-800 dark:text-green-300">
              Welcome! Tell us about yourself.
            </CardTitle>
          </CardHeader>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <CardContent className="px-5 py-6">
              <div className="space-y-8">
                <PersonalInfoSection name={name} setName={setName} />
                
                <DietaryPreferencesSection 
                  dietaryPreferences={dietaryPreferences}
                  toggleDietaryPreference={toggleDietaryPreference}
                />
                
                <AllergiesSection 
                  allergies={allergies}
                  updateAllergy={updateAllergy}
                  removeAllergy={removeAllergy}
                  addAllergy={addAllergy}
                />
                
                <EmergencyContactsSection 
                  emergencyContacts={emergencyContacts}
                  updateContact={updateContact}
                  removeContact={removeContact}
                  addContact={addContact}
                />
              </div>
            </CardContent>
          </ScrollArea>
          <div className="px-5 py-4 border-t">
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
