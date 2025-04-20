
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger 
} from '../ui/drawer';
import { Button } from '../ui/button';
import { ChevronDown, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfileSwitcher = () => {
  const { activeProfile, userProfile, familyMembers, setActiveProfile } = useAppContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  // Combine user profile and family members
  const allProfiles = [
    ...(userProfile ? [{ ...userProfile, id: 'primary' }] : []),
    ...familyMembers
  ];
  
  const handleProfileSelect = (profileId: string) => {
    setActiveProfile(profileId);
    setIsOpen(false);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const activeProfileName = activeProfile?.name || userProfile?.name || 'Select Profile';
  
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2"
        >
          <Avatar className="h-6 w-6">
            <AvatarImage src={activeProfile?.avatar} />
            <AvatarFallback className="text-xs">
              {activeProfileName ? getInitials(activeProfileName) : '?'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium truncate max-w-[100px]">{activeProfileName}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-center">
          <DrawerTitle>Family Profiles</DrawerTitle>
          <DrawerDescription>
            Switch to another profile or create a new one
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="grid grid-cols-3 gap-4 p-4">
          {allProfiles.map((profile) => (
            <Button
              key={profile.id}
              variant="ghost"
              className={`flex flex-col items-center justify-center h-24 gap-2 ${
                activeProfile?.id === profile.id ? 'bg-primary/10 border-2 border-primary' : ''
              }`}
              onClick={() => handleProfileSelect(profile.id)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-center truncate w-full">{profile.name}</span>
            </Button>
          ))}
          
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center h-24 gap-2 border-2 border-dashed"
            onClick={() => {
              setIsOpen(false);
              navigate('/family');
            }}
          >
            <UserPlus className="h-10 w-10 opacity-50" />
            <span className="text-sm">Add Profile</span>
          </Button>
        </div>
        
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
