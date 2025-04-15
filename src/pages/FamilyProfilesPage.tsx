
import { useState } from 'react';
import { PlusCircle, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { useToast } from '../hooks/use-toast';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import AppLayout from '../components/layout/AppLayout';
import { useAppContext } from '../context/AppContext';
import { Allergy, FamilyMember } from '../types';

const FamilyProfilesPage = () => {
  const { familyMembers, addFamilyMember, updateFamilyMember, removeFamilyMember } = useAppContext();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    relation: string;
    dietaryPreferences: string[];
    allergies: Array<{
      name: string;
      severity: 'mild' | 'moderate' | 'severe';
      notes?: string;
    }>;
    notes: string;
  }>({
    name: '',
    relation: '',
    dietaryPreferences: [],
    allergies: [],
    notes: '',
  });
  
  // Dietary options
  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Pescatarian',
    'Low FODMAP',
    'Keto',
    'Paleo',
  ];
  
  const handleAddMember = () => {
    setIsEditMode(false);
    setFormData({
      name: '',
      relation: '',
      dietaryPreferences: [],
      allergies: [],
      notes: '',
    });
    setIsDialogOpen(true);
  };
  
  const handleEditMember = (member: FamilyMember) => {
    setIsEditMode(true);
    setEditingMemberId(member.id);
    setFormData({
      name: member.name,
      relation: member.relation,
      dietaryPreferences: [...member.dietaryPreferences],
      allergies: member.allergies.map(a => ({
        name: a.name,
        severity: a.severity,
        notes: a.notes
      })),
      notes: member.notes || '',
    });
    setIsDialogOpen(true);
  };
  
  const handleDeleteMember = (id: string) => {
    removeFamilyMember(id);
    toast({
      title: "Family member removed",
      description: "The family member has been successfully removed.",
    });
  };
  
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  const toggleDietaryPreference = (option: string) => {
    const preferences = [...formData.dietaryPreferences];
    if (preferences.includes(option)) {
      handleInputChange('dietaryPreferences', 
        preferences.filter(pref => pref !== option));
    } else {
      handleInputChange('dietaryPreferences', 
        [...preferences, option]);
    }
  };
  
  const addAllergy = () => {
    setFormData({
      ...formData,
      allergies: [
        ...formData.allergies, 
        { name: '', severity: 'mild' as const }
      ]
    });
  };
  
  const updateAllergy = (index: number, field: string, value: string) => {
    const allergies = [...formData.allergies];
    if (field === 'name') {
      allergies[index].name = value;
    } else if (field === 'severity') {
      allergies[index].severity = value as 'mild' | 'moderate' | 'severe';
    } else if (field === 'notes') {
      allergies[index].notes = value;
    }
    handleInputChange('allergies', allergies);
  };
  
  const removeAllergy = (index: number) => {
    const allergies = [...formData.allergies];
    allergies.splice(index, 1);
    handleInputChange('allergies', allergies);
  };
  
  const handleSubmit = () => {
    if (!formData.name || !formData.relation) {
      toast({
        title: "Missing information",
        description: "Please provide both name and relation.",
        variant: "destructive"
      });
      return;
    }
    
    // Format allergies with IDs
    const allergies: Allergy[] = formData.allergies
      .filter(a => a.name.trim() !== '')
      .map(a => ({
        id: crypto.randomUUID(),
        name: a.name,
        severity: a.severity,
        notes: a.notes
      }));
    
    const memberData: FamilyMember = {
      id: isEditMode && editingMemberId ? editingMemberId : crypto.randomUUID(),
      name: formData.name,
      relation: formData.relation,
      dietaryPreferences: formData.dietaryPreferences,
      allergies,
      notes: formData.notes || undefined
    };
    
    if (isEditMode && editingMemberId) {
      updateFamilyMember(editingMemberId, memberData);
      toast({
        title: "Profile updated",
        description: `${memberData.name}'s profile has been updated.`
      });
    } else {
      addFamilyMember(memberData);
      toast({
        title: "Profile added",
        description: `${memberData.name} has been added to your family profiles.`
      });
    }
    
    setIsDialogOpen(false);
  };
  
  return (
    <AppLayout title="Family Profiles">
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Family Profiles</h1>
          <Button onClick={handleAddMember}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Family Member
          </Button>
        </div>
        
        {familyMembers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-muted p-3 mb-4">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">No family profiles yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Add family members to track their dietary needs and allergies
              </p>
              <Button onClick={handleAddMember}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Family Member
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {familyMembers.map(member => (
              <Card key={member.id}>
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.relation}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {member.dietaryPreferences.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Dietary Preferences</h3>
                      <div className="flex flex-wrap gap-2">
                        {member.dietaryPreferences.map((pref, index) => (
                          <Badge key={index} variant="secondary">{pref}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {member.allergies.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Allergies</h3>
                      <div className="flex flex-wrap gap-2">
                        {member.allergies.map((allergy) => (
                          <Badge 
                            key={allergy.id} 
                            className={
                              allergy.severity === 'severe' 
                                ? 'bg-red-100 text-red-800' 
                                : allergy.severity === 'moderate'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {allergy.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {member.notes && (
                    <div>
                      <h3 className="text-sm font-medium mb-1">Notes</h3>
                      <p className="text-sm text-muted-foreground">{member.notes}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditMember(member)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Edit Family Member' : 'Add Family Member'}
              </DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? 'Update this family member\'s information and preferences.' 
                  : 'Add a new family member to track their dietary needs and allergies.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relation">Relation</Label>
                  <Input 
                    id="relation"
                    value={formData.relation}
                    onChange={(e) => handleInputChange('relation', e.target.value)}
                    placeholder="e.g., Spouse, Child, Parent"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Dietary Preferences</Label>
                <div className="grid grid-cols-2 gap-2">
                  {dietaryOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`diet-${option}`} 
                        checked={formData.dietaryPreferences.includes(option)}
                        onCheckedChange={() => toggleDietaryPreference(option)}
                      />
                      <Label 
                        htmlFor={`diet-${option}`}
                        className="text-sm"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Allergies</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={addAllergy}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                {formData.allergies.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No allergies added</p>
                ) : (
                  <div className="space-y-2">
                    {formData.allergies.map((allergy, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={allergy.name}
                          onChange={(e) => updateAllergy(index, 'name', e.target.value)}
                          placeholder="Allergy name"
                          className="flex-1"
                        />
                        <Select 
                          value={allergy.severity}
                          onValueChange={(value) => updateAllergy(index, 'severity', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mild">Mild</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="severe">Severe</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeAllergy(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any additional information..."
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {isEditMode ? 'Save Changes' : 'Add Member'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default FamilyProfilesPage;
