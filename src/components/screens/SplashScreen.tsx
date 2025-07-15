import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tiffinlyLogo from '@/assets/tiffinly-logo.png';

export const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-primary flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-warm opacity-20"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-bounce-subtle"></div>
      <div className="absolute bottom-40 right-8 w-24 h-24 bg-white/15 rounded-full blur-lg animate-bounce-subtle" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Logo and branding */}
      <div className="relative z-10 flex flex-col items-center animate-fade-in">
        <div className="w-32 h-32 mb-8 animate-pulse-glow">
          <img 
            src={tiffinlyLogo} 
            alt="Tiffinly Logo" 
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
          Tiffinly
        </h1>
        
        <p className="text-white/90 text-lg font-medium mb-8">
          Delicious meals, delivered daily
        </p>
        
        {/* Loading indicator */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
      
      {/* Bottom tagline */}
      <div className="absolute bottom-8 text-center">
        <p className="text-white/70 text-sm">
          Your daily dose of homestyle cooking
        </p>
      </div>
    </div>
  );
};