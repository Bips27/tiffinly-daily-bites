import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Crown, Zap, Star, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  features: string[];
}

interface SubscriptionPlansProps {
  onPlanSelect?: (plan: SubscriptionPlan) => Promise<void>;
  isOnboarding?: boolean;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  onPlanSelect,
  isOnboarding = false 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price');

      if (error) throw error;

      setPlans(data || []);
      // Set default selection to the second plan (usually the most popular)
      if (data && data.length > 1) {
        setSelectedPlan(data[1].id);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading plans:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    setIsProcessing(true);
    
    try {
      if (onPlanSelect) {
        await onPlanSelect(plan);
      } else {
        // Default behavior for non-onboarding flow
        await new Promise(resolve => setTimeout(resolve, 2000));
        navigate('/subscription-success', { 
          state: { plan }
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getPlanIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'weekly': return Calendar;
      case 'monthly': return Crown;
      case 'premium': return Star;
      default: return Crown;
    }
  };

  const getPlanColor = (type: string, index: number) => {
    const colors = [
      { color: 'text-accent', bgColor: 'bg-accent/10' },
      { color: 'text-primary', bgColor: 'bg-primary/10' },
      { color: 'text-warning', bgColor: 'bg-warning/10' }
    ];
    return colors[index % colors.length];
  };

  const isPopular = (index: number) => index === 1; // Make the second plan popular

  const currentPlan = plans.find(p => p.id === selectedPlan);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

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
          {plans.map((plan, index) => {
            const Icon = getPlanIcon(plan.type);
            const colors = getPlanColor(plan.type, index);
            const popular = isPopular(index);
            
            return (
              <Card 
                key={plan.id}
                className={`relative p-6 shadow-card cursor-pointer transition-all duration-200 ${
                  selectedPlan === plan.id ? 'ring-2 ring-primary bg-primary/5' : ''
                } ${popular ? 'border-primary' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {/* Popular Badge */}
                {popular && (
                  <div className="absolute -top-3 left-6 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${colors.bgColor} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${colors.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{plan.type}</p>
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
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-success" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
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
      </div>

      {/* Fixed Bottom Subscribe */}
      {currentPlan && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border">
          <Card className="p-4 shadow-elevated">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium">{currentPlan.name}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {currentPlan.type} plan
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
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
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