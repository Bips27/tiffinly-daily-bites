import React from 'react';
import { Home, Calendar, ShoppingBag, CreditCard, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/menu', label: 'Menu', icon: Calendar },
  { path: '/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/subscription', label: 'Plans', icon: CreditCard },
  { path: '/profile', label: 'Profile', icon: User },
];

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 border-t border-border z-50 backdrop-blur-lg supports-[backdrop-filter]:bg-card/90">
      <div className="grid grid-cols-5 h-18 px-2">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center justify-center space-y-1.5 transition-all duration-200 touch-manipulation rounded-xl mx-1 my-2",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 transition-all duration-200",
                  isActive && "scale-110"
                )} 
              />
              <span className={cn(
                "text-xs font-medium transition-all duration-200 leading-none",
                isActive && "font-semibold"
              )}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};