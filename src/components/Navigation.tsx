
import { Home, Camera, Package, User, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Camera, label: 'Scan', path: '/scanner' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-2 px-4 flex justify-around items-center">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={cn(
            "flex flex-col items-center p-2 rounded-lg transition-colors",
            location.pathname === item.path
              ? "text-app-green-600 dark:text-app-green-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          )}
        >
          <item.icon size={24} />
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
      <button
        onClick={() => navigate('/emergency')}
        className="flex flex-col items-center p-2 text-app-red-600 dark:text-app-red-400"
      >
        <AlertTriangle size={24} />
        <span className="text-xs mt-1">Emergency</span>
      </button>
    </div>
  );
};

export default Navigation;
