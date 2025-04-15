
import { AlertTriangle, Phone, User, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import AppLayout from '../components/layout/AppLayout';
import { useAppContext } from '../context/AppContext';
import { Allergy } from '../types';

const EmergencyPage = () => {
  const { userProfile } = useAppContext();

  if (!userProfile) {
    return <div>Loading profile...</div>;
  }

  // Get severe allergies
  const severeAllergies = userProfile.allergies.filter(
    allergy => allergy.severity === 'severe'
  );

  return (
    <AppLayout title="Emergency Information">
      <div className="p-4 space-y-6">
        {/* Emergency Banner */}
        <div className="bg-app-red-600 text-white p-4 rounded-lg flex items-center shadow-lg">
          <AlertTriangle size={32} className="mr-4" />
          <div>
            <h2 className="text-xl font-bold">Emergency Information</h2>
            <p>Quick access to critical health information in case of emergency</p>
          </div>
        </div>
        
        {/* User Information */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <User size={24} className="text-app-green-600 mr-3" />
              <h3 className="text-lg font-bold">Personal Information</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{userProfile.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Severe Allergies */}
        <Card className="border-2 border-app-red-400">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle size={24} className="text-app-red-600 mr-3" />
              <h3 className="text-lg font-bold">Severe Allergies</h3>
            </div>
            {severeAllergies.length > 0 ? (
              <ul className="space-y-2">
                {severeAllergies.map((allergy: Allergy) => (
                  <li 
                    key={allergy.id}
                    className="flex items-center p-3 bg-app-red-50 dark:bg-app-red-900/30 rounded-lg"
                  >
                    <span className="font-medium text-app-red-800 dark:text-app-red-300">{allergy.name}</span>
                    {allergy.notes && (
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        ({allergy.notes})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No severe allergies recorded</p>
            )}
          </CardContent>
        </Card>
        
        {/* Other Allergies */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle size={24} className="text-amber-500 mr-3" />
              <h3 className="text-lg font-bold">Other Allergies & Sensitivities</h3>
            </div>
            {userProfile.allergies.filter(a => a.severity !== 'severe').length > 0 ? (
              <ul className="space-y-2">
                {userProfile.allergies
                  .filter(a => a.severity !== 'severe')
                  .map((allergy: Allergy) => (
                    <li 
                      key={allergy.id}
                      className={`flex items-center p-3 rounded-lg ${
                        allergy.severity === 'moderate' 
                          ? 'bg-orange-50 dark:bg-orange-900/30'
                          : 'bg-yellow-50 dark:bg-yellow-900/30'
                      }`}
                    >
                      <span className={`font-medium ${
                        allergy.severity === 'moderate'
                          ? 'text-orange-800 dark:text-orange-300'
                          : 'text-yellow-800 dark:text-yellow-300'
                      }`}>
                        {allergy.name}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({allergy.severity})
                      </span>
                    </li>
                  ))
                }
              </ul>
            ) : (
              <p className="text-gray-500">No other allergies recorded</p>
            )}
          </CardContent>
        </Card>
        
        {/* Emergency Contacts */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Phone size={24} className="text-app-green-600 mr-3" />
              <h3 className="text-lg font-bold">Emergency Contacts</h3>
            </div>
            {userProfile.emergencyContacts.length > 0 ? (
              <div className="space-y-4">
                {userProfile.emergencyContacts.map((contact) => (
                  <div key={contact.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium">{contact.name}</h4>
                      <span className="text-gray-500 text-sm">{contact.relation}</span>
                    </div>
                    <a 
                      href={`tel:${contact.phone}`}
                      className="flex items-center text-app-blue-600 hover:text-app-blue-800"
                    >
                      <Phone size={16} className="mr-2" />
                      {contact.phone}
                    </a>
                    {contact.email && (
                      <a 
                        href={`mailto:${contact.email}`}
                        className="text-gray-500 text-sm mt-1 hover:text-gray-700"
                      >
                        {contact.email}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No emergency contacts added</p>
            )}
          </CardContent>
        </Card>
        
        {/* Emergency Services */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Clock size={24} className="text-app-red-600 mr-3" />
              <h3 className="text-lg font-bold">Emergency Services</h3>
            </div>
            <div className="space-y-3">
              <Button 
                className="w-full py-6 text-lg bg-app-red-600 hover:bg-app-red-700"
                onClick={() => window.location.href = 'tel:911'}
              >
                <Phone className="mr-2" size={20} />
                Call 911 (Emergency)
              </Button>
              
              <Button 
                variant="outline"
                className="w-full py-6 text-lg border-app-red-200 text-app-red-700"
                onClick={() => window.location.href = 'tel:800-222-1222'}
              >
                Poison Control: 800-222-1222
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Instructions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-3">In Case of Allergic Reaction:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <span className="font-medium">Assess severity:</span> Look for difficulty breathing, throat swelling, or loss of consciousness.
              </li>
              <li>
                <span className="font-medium">Use epinephrine:</span> If prescribed and available, administer immediately.
              </li>
              <li>
                <span className="font-medium">Call emergency services:</span> Dial 911 or local emergency number.
              </li>
              <li>
                <span className="font-medium">Position person:</span> If having trouble breathing, have them sit up. If unconscious, lay them on their side.
              </li>
              <li>
                <span className="font-medium">Stay with them:</span> Monitor breathing and consciousness until help arrives.
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default EmergencyPage;
