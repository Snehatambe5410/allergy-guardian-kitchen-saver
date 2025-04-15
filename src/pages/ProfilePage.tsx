
import AppLayout from '../components/layout/AppLayout';
import { useAppContext } from '../context/AppContext';
import PersonalInfoCard from '../components/profile/PersonalInfoCard';
import AllergiesCard from '../components/profile/AllergiesCard';
import DietaryPreferencesCard from '../components/profile/DietaryPreferencesCard';
import EmergencyContactsCard from '../components/profile/EmergencyContactsCard';

const ProfilePage = () => {
  const { userProfile, updateUserProfile, addAllergy, removeAllergy } = useAppContext();
  
  if (!userProfile) {
    return <div>Loading profile...</div>;
  }

  return (
    <AppLayout title="Your Profile">
      <div className="p-4 space-y-6">
        {/* Personal Information Card */}
        <PersonalInfoCard 
          userProfile={userProfile} 
          updateUserProfile={updateUserProfile} 
        />
        
        {/* Allergies Card */}
        <AllergiesCard 
          allergies={userProfile.allergies}
          addAllergy={addAllergy}
          removeAllergy={removeAllergy}
        />
        
        {/* Dietary Preferences Card */}
        <DietaryPreferencesCard 
          dietaryPreferences={userProfile.dietaryPreferences} 
        />
        
        {/* Emergency Contacts Card */}
        <EmergencyContactsCard 
          contacts={userProfile.emergencyContacts}
          updateUserProfile={updateUserProfile}
          userProfile={userProfile}
        />
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
