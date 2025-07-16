import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SubscriptionPlans } from './SubscriptionPlans';
import { MealPreferences } from './MealPreferences';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ 
  children, 
  step, 
  totalSteps, 
  title, 
  subtitle,
  showBack = true 
}) => {
  const navigate = useNavigate();
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border p-4 z-50">
        <div className="flex items-center space-x-4 mb-4">
          {showBack && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Step {step} of {totalSteps}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {children}
    </div>
  );
};

const OnboardingSuccess = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 text-center max-w-md w-full">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Welcome to Tiffinly!</h2>
        <p className="text-muted-foreground mb-6">
          Your account is set up and ready. You can now start ordering delicious meals.
        </p>
        
        <div className="space-y-3">
          <Button 
            className="w-full"
            onClick={() => navigate('/dashboard')}
          >
            Start Ordering
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/weekly-menu')}
          >
            View Menu
          </Button>
        </div>
      </Card>
    </div>
  );
};

const ModifiedSubscriptionPlans = () => {
  const navigate = useNavigate();
  
  const handlePlanSelect = async (plan: any) => {
    // Simulate plan selection process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to meal preferences with selected plan
    navigate('/onboarding/preferences', { 
      state: { plan }
    });
  };

  return (
    <div className="px-4 pt-4">
      <SubscriptionPlans 
        onPlanSelect={handlePlanSelect}
        isOnboarding={true}
      />
    </div>
  );
};

const OnboardingMealPreferences = () => {
  return (
    <div className="px-4 pt-4">
      <MealPreferences />
    </div>
  );
};

export const OnboardingFlow = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/onboarding/plans" replace />} />
      <Route path="/plans" element={<ModifiedSubscriptionPlans />} />
      <Route path="/preferences" element={<OnboardingMealPreferences />} />
      <Route path="/success" element={<OnboardingSuccess />} />
    </Routes>
  );
};