
import { ReactNode } from 'react';
import { Home, Utensils, Search, BookOpen, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProfileSwitcher } from '../profile/ProfileSwitcher';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';

interface MobileAppLayoutProps {
  children: ReactNode;
  title?: string;
  showProfileSwitcher?: boolean;
}

export default function MobileAppLayout({
  children,
  title,
  showProfileSwitcher = true,
}: MobileAppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Utensils, label: 'Kitchen', path: '/inventory' },
    { icon: Search, label: 'Scan', path: '/scanner' },
    { icon: BookOpen, label: 'Recipes', path: '/recipes' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 border-b flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        {showProfileSwitcher && (
          <ProfileSwitcher />
        )}
      </header>
      
      {/* Main Content Area with ScrollArea */}
      <ScrollArea className="flex-1 overflow-y-auto pb-16">
        <main className="max-w-3xl mx-auto">
          {children}
        </main>
      </ScrollArea>
      
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-1 flex-1",
                  isActive 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-gray-500 dark:text-gray-400"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon 
                  className={cn(
                    "h-5 w-5 mb-1",
                    isActive && "text-green-600 dark:text-green-400"
                  )} 
                />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
