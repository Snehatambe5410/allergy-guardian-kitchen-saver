
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Upload } from 'lucide-react';
import { useState } from 'react';

interface PersonalInfoSectionProps {
  name: string;
  setName: (name: string) => void;
  avatar?: string;
  setAvatar?: (avatar: string) => void;
}

const PersonalInfoSection = ({ 
  name, 
  setName, 
  avatar,
  setAvatar
}: PersonalInfoSectionProps) => {
  const [previewAvatar, setPreviewAvatar] = useState<string | undefined>(avatar);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && setAvatar) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const result = event.target.result as string;
          setPreviewAvatar(result);
          setAvatar(result);
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
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={previewAvatar} />
            <AvatarFallback className="text-lg bg-primary/10">
              {getInitials(name || 'User')}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0">
            <label htmlFor="avatar-upload-onboarding" className="cursor-pointer">
              <div className="rounded-full bg-primary p-1 text-white">
                <Upload size={16} />
              </div>
              <input 
                type="file" 
                id="avatar-upload-onboarding" 
                className="hidden" 
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
        </div>
      </div>
      
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
    </div>
  );
};

export default PersonalInfoSection;
