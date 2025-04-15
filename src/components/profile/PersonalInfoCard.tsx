
import { useState } from 'react';
import { User, Save, Edit, Upload, Mail, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { UserProfile } from '../../types';

interface PersonalInfoCardProps {
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const PersonalInfoCard = ({ userProfile, updateUserProfile }: PersonalInfoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => prev ? { ...prev, [name]: value } : null);
  };
  
  const handleSaveProfile = () => {
    if (editedProfile) {
      updateUserProfile(editedProfile);
      setIsEditing(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditedProfile(prev => 
            prev ? { ...prev, avatar: event.target?.result as string } : null
          );
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarImage src={editedProfile?.avatar} />
              <AvatarFallback className="text-lg bg-primary/10">
                {getInitials(editedProfile?.name || 'User')}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <div className="absolute bottom-0 right-0">
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="rounded-full bg-primary p-1 text-white">
                    <Upload size={16} />
                  </div>
                  <input 
                    type="file" 
                    id="avatar-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
            )}
          </div>
          <div className="flex-1">
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
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">About Me</Label>
          <Textarea 
            id="bio" 
            name="bio" 
            value={editedProfile?.bio || ''}
            onChange={handleProfileChange}
            disabled={!isEditing}
            placeholder={isEditing ? "Tell us a bit about yourself..." : "No bio added yet"}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center">
              <Mail size={16} className="mr-2" />
              Email Address
            </Label>
            <Input 
              id="email" 
              name="email" 
              type="email"
              value={editedProfile?.email || ''}
              onChange={handleProfileChange}
              disabled={!isEditing}
              placeholder={isEditing ? "your@email.com" : "No email added"}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="flex items-center">
              <Phone size={16} className="mr-2" />
              Phone Number
            </Label>
            <Input 
              id="phoneNumber" 
              name="phoneNumber" 
              value={editedProfile?.phoneNumber || ''}
              onChange={handleProfileChange}
              disabled={!isEditing}
              placeholder={isEditing ? "(123) 456-7890" : "No phone added"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
