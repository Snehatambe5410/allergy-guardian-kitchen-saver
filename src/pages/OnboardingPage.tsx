
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAppContext } from '../context/AppContext';
import { Allergy } from '../types';
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
