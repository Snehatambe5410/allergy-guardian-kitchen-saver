
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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {title && !isOnboarding && (
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md py-4 px-6 border-b border-green-100">
          <h1 className="text-xl font-bold text-green-800 dark:text-green-300">{title}</h1>
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
