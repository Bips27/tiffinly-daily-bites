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
  
  const handlePlanSelect = async (planId: string) => {
    // Simulate plan selection process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get plan data from the existing plans array
    const plans = [
      {
        id: 'weekly',
        name: 'Weekly Plan',
        duration: '7 days',
        price: 899,
        originalPrice: 1050,
        meals: 21,
        mealsPerDay: '3 meals/day',
        icon: 'Calendar',
        color: 'text-accent',
        bgColor: 'bg-accent/10',
        features: [
          'Breakfast, Lunch & Dinner',
          'Fresh ingredients daily',
          'Cancel anytime',
          'Free delivery'
        ],
        popular: false
      },
      {
        id: 'monthly',
        name: 'Monthly Plan',
        duration: '30 days',
        price: 2999,
        originalPrice: 4200,
        meals: 90,
        mealsPerDay: '3 meals/day',
        icon: 'Crown',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        features: [
          'Breakfast, Lunch & Dinner',
          'Premium meal options',
          'Priority customer support',
          'Free delivery',
          'Customization included',
          'Nutrition tracking'
        ],
        popular: true,
        savings: '29% OFF'
      },
      {
        id: 'premium',
        name: 'Premium Monthly',
        duration: '30 days',
        price: 4999,
        originalPrice: 6300,
        meals: 90,
        mealsPerDay: '3 meals/day',
        icon: 'Star',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        features: [
          'Gourmet meal options',
          'Chef specials included',
          'Unlimited customizations',
          'Premium ingredients',
          'Dedicated support',
          'Free delivery',
          'Nutrition consultation'
        ],
        popular: false,
        savings: '21% OFF'
      }
    ];
    
    const selectedPlanData = plans.find(p => p.id === planId);
    
    // Navigate to meal preferences with selected plan
    navigate('/onboarding/preferences', { 
      state: { plan: selectedPlanData }
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