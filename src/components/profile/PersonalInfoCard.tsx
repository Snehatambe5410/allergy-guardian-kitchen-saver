
import { useState } from 'react';
import { User, Save, Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { UserProfile } from '../../types';

interface PersonalInfoCardProps {
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const PersonalInfoCard = ({ userProfile, updateUserProfile }: PersonalInfoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  
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

  return (
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
  );
};

export default PersonalInfoCard;
