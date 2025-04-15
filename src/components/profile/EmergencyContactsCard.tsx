
import { useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { EmergencyContact, UserProfile } from '../../types';

interface EmergencyContactsCardProps {
  contacts: EmergencyContact[];
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  userProfile: UserProfile;
}

const EmergencyContactsCard = ({ contacts, updateUserProfile, userProfile }: EmergencyContactsCardProps) => {
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({
    name: '',
    relation: '',
    phone: '',
    email: ''
  });
  
  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) return;
    
    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name,
      relation: newContact.relation || '',
      phone: newContact.phone,
      email: newContact.email
    };
    
    const updatedContacts = [...contacts, contact];
    
    updateUserProfile({
      ...userProfile,
      emergencyContacts: updatedContacts
    });
    
    setNewContact({
      name: '',
      relation: '',
      phone: '',
      email: ''
    });
  };
  
  const handleRemoveContact = (id: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    
    updateUserProfile({
      ...userProfile,
      emergencyContacts: updatedContacts
    });
  };

  return (
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
          {contacts.map((contact) => (
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
          {contacts.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No emergency contacts added
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyContactsCard;
