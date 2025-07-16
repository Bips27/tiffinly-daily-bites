import React from 'react';
import { Bell, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';

export const TopHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Good Morning!';
      case '/menu':
        return 'Weekly Menu';
      case '/orders':
        return 'Your Orders';
      case '/subscription':
        return 'Subscription';
      case '/profile':
        return 'Profile';
      default:
        return 'Tiffinly';
    }
  };

  const showLocationAndNotifications = location.pathname === '/';

  return (
    <header className="bg-card/95 border-b border-border sticky top-0 z-50 backdrop-blur-lg supports-[backdrop-filter]:bg-card/90">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground">{getPageTitle()}</h1>
            {showLocationAndNotifications && (
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Home • Mumbai</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {showLocationAndNotifications && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/notifications')}
                className="relative h-10 w-10 rounded-xl touch-manipulation"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full border-2 border-background"></span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/profile')}
              className="h-10 w-10 rounded-xl touch-manipulation"
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};