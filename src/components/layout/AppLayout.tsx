
import { ReactNode } from 'react';
import Navigation from '../Navigation';
import { useLocation } from 'react-router-dom';
import { ScrollArea } from '../ui/scroll-area';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  hideNavigation?: boolean;
}

const AppLayout = ({ 
  children, 
  title,
  hideNavigation = false
}: AppLayoutProps) => {
  const location = useLocation();
  const isOnboarding = location.pathname === '/onboarding';
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {title && !isOnboarding && (
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm py-4 px-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
        </header>
      )}
      
      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="pb-20">
            {children}
          </div>
        </ScrollArea>
      </main>
      
      {!hideNavigation && !isOnboarding && <Navigation />}
    </div>
  );
};

export default AppLayout;
