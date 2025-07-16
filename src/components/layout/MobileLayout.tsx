import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';
import { TopHeader } from './TopHeader';

const MobileLayout = () => {
  const location = useLocation();
  
  // Hide header and nav on splash and auth screens
  const hideLayoutPaths = ['/splash', '/login', '/register', '/onboarding'];
  const hideLayout = hideLayoutPaths.some(path => location.pathname.startsWith(path));

  if (hideLayout) {
    return (
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopHeader />
      <main className="flex-1 overflow-auto">
        <div className="pb-24"> {/* Add padding bottom to prevent content being covered */}
          <Outlet />
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};

export default MobileLayout;