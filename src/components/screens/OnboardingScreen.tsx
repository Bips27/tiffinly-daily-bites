import React, { useState } from 'react';
import { ChevronRight, Clock, Utensils, Truck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const onboardingSteps = [
  {
    id: 1,
    title: "Subscribe to Plans",
    description: "Choose from weekly or monthly meal plans tailored to your needs",
    icon: Star,
    image: "📱",
    color: "bg-gradient-primary"
  },
  {
    id: 2,
    title: "Customize Your Meals",
    description: "Change ingredients or add items up to 2 hours before delivery",
    icon: Utensils,
    image: "🍽️",
    color: "bg-gradient-accent"
  },
  {
    id: 3,
    title: "Get Fresh Meals",
    description: "Enjoy 3 delicious meals daily delivered right to your doorstep",
    icon: Truck,
    image: "🚚",
    color: "bg-gradient-warm"
  }
];

export const OnboardingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/login');
    }
  };

  const skip = () => {
    navigate('/login');
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end p-4">
        <Button variant="ghost" onClick={skip}>
          Skip
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Illustration */}
        <div className={`w-80 h-80 rounded-3xl ${step.color} flex items-center justify-center mb-8 shadow-floating animate-slide-up`}>
          <div className="text-8xl">{step.image}</div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Icon className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground">
            {step.title}
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-sm leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Progress indicators */}
        <div className="flex space-x-2 mt-12">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStep ? 'bg-primary w-8' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom button */}
      <div className="p-6">
        <Button 
          onClick={nextStep}
          className="w-full"
          size="lg"
        >
          {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};