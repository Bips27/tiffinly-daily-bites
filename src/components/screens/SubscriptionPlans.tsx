import React, { useState } from 'react';
import { ArrowLeft, Check, Crown, Zap, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    id: 'weekly',
    name: 'Weekly Plan',
    duration: '7 days',
    price: 899,
    originalPrice: 1050,
    meals: 21,
    mealsPerDay: '3 meals/day',
    icon: Calendar,
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
    icon: Crown,
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
    icon: Star,
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

interface SubscriptionPlansProps {
  onPlanSelect?: (planId: string) => Promise<void>;
  isOnboarding?: boolean;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  onPlanSelect,
  isOnboarding = false 
}) => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async (planId: string) => {
    setIsProcessing(true);
    
    if (onPlanSelect) {
      await onPlanSelect(planId);
    } else {
      // Default behavior for non-onboarding flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/subscription-success', { 
        state: { 
          plan: plans.find(p => p.id === planId)
        } 
      });
    }
    
    setIsProcessing(false);
  };

  const currentPlan = plans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border p-4 z-40">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Subscription Plans</h1>
            <p className="text-sm text-muted-foreground">Choose your meal plan</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6 pb-32">
        {/* Plan Cards */}
        <section className="space-y-4">
          {plans.map(plan => (
            <Card 
              key={plan.id}
              className={`relative p-6 shadow-card cursor-pointer transition-all duration-200 ${
                selectedPlan === plan.id ? 'ring-2 ring-primary bg-primary/5' : ''
              } ${plan.popular ? 'border-primary' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-6 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </div>
              )}

              {/* Savings Badge */}
              {plan.savings && (
                <div className="absolute -top-3 right-6 bg-success text-success-foreground px-3 py-1 rounded-full text-xs font-medium">
                  {plan.savings}
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${plan.bgColor} rounded-xl flex items-center justify-center`}>
                    <plan.icon className={`w-6 h-6 ${plan.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.duration}</p>
                  </div>
                </div>
                
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === plan.id 
                    ? 'bg-primary border-primary' 
                    : 'border-border'
                }`}>
                  {selectedPlan === plan.id && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-primary">₹{plan.price}</span>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{plan.originalPrice}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.meals} meals • {plan.mealsPerDay}
                </p>
                <p className="text-sm font-medium text-success">
                  ₹{Math.round(plan.price / plan.meals)} per meal
                </p>
              </div>

              {/* Features */}
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-success" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </section>

        {/* Plan Comparison */}
        <Card className="p-4 bg-gradient-subtle">
          <h3 className="font-semibold mb-3">Why Choose Tiffinly?</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl mb-2">🥘</div>
              <div className="text-sm font-medium">Fresh Daily</div>
              <div className="text-xs text-muted-foreground">Cooked fresh every day</div>
            </div>
            <div>
              <div className="text-2xl mb-2">🚚</div>
              <div className="text-sm font-medium">Free Delivery</div>
              <div className="text-xs text-muted-foreground">No delivery charges</div>
            </div>
            <div>
              <div className="text-2xl mb-2">📱</div>
              <div className="text-sm font-medium">Easy Customize</div>
              <div className="text-xs text-muted-foreground">Change meals anytime</div>
            </div>
          </div>
        </Card>

        {/* Current Subscription */}
        <Card className="p-4 border-accent bg-accent/5">
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-accent" />
            <div>
              <p className="font-medium text-accent">Current Plan</p>
              <p className="text-sm text-muted-foreground">
                Premium Monthly - Active until Dec 31, 2024
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Fixed Bottom Subscribe */}
      {currentPlan && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border">
          <Card className="p-4 shadow-elevated">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium">{currentPlan.name}</p>
                <p className="text-sm text-muted-foreground">
                  ₹{Math.round(currentPlan.price / currentPlan.meals)} per meal
                </p>
              </div>
              <span className="text-xl font-bold text-primary">₹{currentPlan.price}</span>
            </div>
            <Button 
              className="w-full" 
              onClick={() => handleSubscribe(currentPlan.id)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Subscribe Now
                </>
              )}
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};