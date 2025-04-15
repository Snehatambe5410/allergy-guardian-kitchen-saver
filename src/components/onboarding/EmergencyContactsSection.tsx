
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface EmergencyContactsSectionProps {
  emergencyContacts: Array<{
    name: string;
    relation: string;
    phone: string;
    email: string;
  }>;
  updateContact: (index: number, field: string, value: string) => void;
  removeContact: (index: number) => void;
  addContact: () => void;
}

const EmergencyContactsSection = ({
  emergencyContacts,
  updateContact,
  removeContact,
  addContact,
}: EmergencyContactsSectionProps) => {
  return (
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
                onChange={(e) => updateContact(index, 'name', e.target.value)}
              />
              <Input
                type="text"
                placeholder="Relation"
                value={contact.relation}
                onChange={(e) => updateContact(index, 'relation', e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Input
                type="tel"
                placeholder="Phone"
                value={contact.phone}
                onChange={(e) => updateContact(index, 'phone', e.target.value)}
              />
              <Input
                type="email"
                placeholder="Email"
                value={contact.email}
                onChange={(e) => updateContact(index, 'email', e.target.value)}
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
  );
};

export default EmergencyContactsSection;
