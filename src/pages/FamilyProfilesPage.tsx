
import { useState } from 'react';
import { PlusCircle, Edit, Trash2, AlertCircle, Share2, Upload, RefreshCw } from 'lucide-react';
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
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FamilyProfilesPage = () => {
  const { 
    familyMembers, 
    addFamilyMember, 
    updateFamilyMember, 
    removeFamilyMember,
    syncFamilyProfiles,
    importFamilyProfile,
    exportFamilyProfile
  } = useAppContext();
  
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [exportProfileData, setExportProfileData] = useState("");
  const [importProfileData, setImportProfileData] = useState("");
  const [selectedProfileToExport, setSelectedProfileToExport] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState(false);
  
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

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncFamilyProfiles();
      toast({
        title: "Profiles synchronized",
        description: "Your family profiles have been synchronized with the database."
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Failed to synchronize family profiles.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
      setIsSyncDialogOpen(false);
    }
  };

  const handleExportProfile = async () => {
    if (!selectedProfileToExport) {
      toast({
        title: "No profile selected",
        description: "Please select a profile to export.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const data = await exportFamilyProfile(selectedProfileToExport);
      setExportProfileData(data);
      toast({
        title: "Profile exported",
        description: "You can now copy the profile data."
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export the profile.",
        variant: "destructive"
      });
    }
  };

  const handleImportProfile = async () => {
    if (!importProfileData) {
      toast({
        title: "No data provided",
        description: "Please enter profile data to import.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const profileData = JSON.parse(importProfileData);
      await importFamilyProfile(profileData);
      toast({
        title: "Profile imported",
        description: "The family profile has been successfully imported."
      });
      setIsImportDialogOpen(false);
      setImportProfileData("");
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Failed to import the profile. Please check the data format.",
        variant: "destructive"
      });
    }
  };
  
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
  
  const handleDeleteMember = async (id: string) => {
    try {
      await removeFamilyMember(id);
      toast({
        title: "Family member removed",
        description: "The family member has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Removal failed",
        description: "Failed to remove the family member.",
        variant: "destructive"
      });
    }
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
  
  const handleSubmit = async () => {
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
    
    try {
      if (isEditMode && editingMemberId) {
        await updateFamilyMember(editingMemberId, memberData);
        toast({
          title: "Profile updated",
          description: `${memberData.name}'s profile has been updated.`
        });
      } else {
        await addFamilyMember(memberData);
        toast({
          title: "Profile added",
          description: `${memberData.name} has been added to your family profiles.`
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Operation failed",
        description: isEditMode ? "Failed to update profile." : "Failed to add profile.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <AppLayout title="Family Profiles">
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Family Profiles</h1>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" onClick={() => setIsSyncDialogOpen(true)}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sync Profiles</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button onClick={handleAddMember}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Family Member
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="profiles" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="profiles">Profiles</TabsTrigger>
            <TabsTrigger value="sync">Sync Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profiles">
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
                      <CardTitle className="flex items-center justify-between">
                        {member.name}
                        <div className="flex items-center space-x-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => {
                                    setSelectedProfileToExport(member.id);
                                    setIsExportDialogOpen(true);
                                  }}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Export Profile</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardTitle>
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
          </TabsContent>
          
          <TabsContent value="sync">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Import Profile</CardTitle>
                  <CardDescription>Add a family member by importing their data</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setIsImportDialogOpen(true)}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Import Profile
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Export Profile</CardTitle>
                  <CardDescription>Share a family member's profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select onValueChange={setSelectedProfileToExport} value={selectedProfileToExport}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a family member" />
                    </SelectTrigger>
                    <SelectContent>
                      {familyMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => setIsExportDialogOpen(true)}
                    className="w-full mt-4"
                    disabled={!selectedProfileToExport}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Export Profile
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Sync Profiles</CardTitle>
                  <CardDescription>Synchronize family profiles with the database</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => setIsSyncDialogOpen(true)}
                    className="w-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Family Profiles
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Add/Edit Dialog */}
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
        
        {/* Sync Dialog */}
        <Dialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Sync Family Profiles</DialogTitle>
              <DialogDescription>
                Synchronize your family profiles with the database to ensure all data is up to date.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-center mb-4">This will update all your family profiles with the latest data from the server.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSyncDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSync} disabled={isSyncing}>
                {isSyncing ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Now
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Export Dialog */}
        <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Export Family Profile</DialogTitle>
              <DialogDescription>
                Share this family profile with others.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {!exportProfileData ? (
                <Button onClick={handleExportProfile} className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Generate Export Data
                </Button>
              ) : (
                <>
                  <Label htmlFor="exportData" className="mb-2 block">Profile Data</Label>
                  <Textarea
                    id="exportData"
                    value={exportProfileData}
                    readOnly
                    rows={8}
                    className="font-mono text-xs"
                  />
                  <p className="mt-2 text-sm text-gray-500">Copy this data to share the profile.</p>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsExportDialogOpen(false);
                setExportProfileData("");
              }}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Import Dialog */}
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Import Family Profile</DialogTitle>
              <DialogDescription>
                Add a family member by importing their profile data.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="importData" className="mb-2 block">Profile Data</Label>
                <Textarea
                  id="importData"
                  value={importProfileData}
                  onChange={(e) => setImportProfileData(e.target.value)}
                  placeholder="Paste the profile data here..."
                  rows={8}
                  className="font-mono text-xs"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsImportDialogOpen(false);
                setImportProfileData("");
              }}>
                Cancel
              </Button>
              <Button onClick={handleImportProfile}>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default FamilyProfilesPage;
