
import { useState } from 'react';
import { User, Save, Edit, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';
import { useAppContext } from '@/context/AppContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Allergy, EmergencyContact } from '@/types';

const ProfilePage = () => {
  const { userProfile, updateUserProfile, addAllergy, removeAllergy } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  
  // New allergy form state
  const [newAllergy, setNewAllergy] = useState({ name: '', severity: 'mild' as 'mild' | 'moderate' | 'severe' });
  
  // New emergency contact form state
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({
    name: '',
    relation: '',
    phone: '',
    email: ''
  });
  
  if (!userProfile) {
    return <div>Loading profile...</div>;
  }
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => prev ? { ...prev, [name]: value } : null);
  };
  
  const handleSaveProfile = () => {
    if (editedProfile) {
      updateUserProfile(editedProfile);
      setIsEditing(false);
    }
  };
  
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
  
  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) return;
    
    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name,
      relation: newContact.relation || '',
      phone: newContact.phone,
      email: newContact.email
    };
    
    if (editedProfile) {
      const updatedContacts = [...editedProfile.emergencyContacts, contact];
      setEditedProfile({
        ...editedProfile,
        emergencyContacts: updatedContacts
      });
      
      updateUserProfile({
        ...editedProfile,
        emergencyContacts: updatedContacts
      });
    }
    
    setNewContact({
      name: '',
      relation: '',
      phone: '',
      email: ''
    });
  };
  
  const handleRemoveContact = (id: string) => {
    if (editedProfile) {
      const updatedContacts = editedProfile.emergencyContacts.filter(
        contact => contact.id !== id
      );
      
      setEditedProfile({
        ...editedProfile,
        emergencyContacts: updatedContacts
      });
      
      updateUserProfile({
        ...editedProfile,
        emergencyContacts: updatedContacts
      });
    }
  };

  return (
    <AppLayout title="Your Profile">
      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <User className="mr-2 text-app-green-600" size={20} />
              Personal Information
            </CardTitle>
            {!isEditing ? (
              <Button variant="ghost" onClick={() => setIsEditing(true)}>
                <Edit size={18} className="mr-2" />
                Edit
              </Button>
            ) : (
              <Button onClick={handleSaveProfile}>
                <Save size={18} className="mr-2" />
                Save
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={editedProfile?.name || ''}
                onChange={handleProfileChange}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Allergies Card */}
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
              {userProfile.allergies.map((allergy) => (
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
              {userProfile.allergies.length === 0 && (
                <span className="text-gray-500">No allergies added yet</span>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Dietary Preferences Card */}
        <Card>
          <CardHeader>
            <CardTitle>Dietary Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userProfile.dietaryPreferences.map((preference, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 text-sm rounded-full bg-app-blue-100 text-app-blue-800 dark:bg-app-blue-900/30 dark:text-app-blue-300"
                >
                  {preference}
                </span>
              ))}
              {userProfile.dietaryPreferences.length === 0 && (
                <span className="text-gray-500">No preferences added</span>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Emergency Contacts Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Emergency Contacts</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus size={16} className="mr-2" />
                  Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Emergency Contact</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input 
                      id="contactName" 
                      value={newContact.name || ''}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                      placeholder="Enter contact name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactRelation">Relation</Label>
                    <Input 
                      id="contactRelation" 
                      value={newContact.relation || ''}
                      onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                      placeholder="e.g., Spouse, Parent, Friend"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone Number</Label>
                    <Input 
                      id="contactPhone" 
                      value={newContact.phone || ''}
                      onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email (Optional)</Label>
                    <Input 
                      id="contactEmail" 
                      value={newContact.email || ''}
                      onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleAddContact}
                    disabled={!newContact.name || !newContact.phone}
                  >
                    Add Contact
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userProfile.emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <h4 className="font-medium">{contact.name}</h4>
                    <p className="text-gray-500 text-sm">{contact.relation}</p>
                    <p className="text-sm">{contact.phone}</p>
                    {contact.email && <p className="text-sm text-gray-500">{contact.email}</p>}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveContact(contact.id)}
                  >
                    <Trash size={16} className="text-app-red-500" />
                  </Button>
                </div>
              ))}
              {userProfile.emergencyContacts.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No emergency contacts added
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
