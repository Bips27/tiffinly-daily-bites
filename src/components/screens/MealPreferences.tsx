import React, { useState } from 'react';
import { ArrowLeft, Check, Coffee, Sun, Moon, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const mealOptions = {
  breakfast: [
    { id: 'poha', name: 'Poha', type: 'vegetarian' },
    { id: 'upma', name: 'Upma', type: 'vegetarian' },
    { id: 'idli-sambhar', name: 'Idli Sambhar', type: 'vegetarian' },
    { id: 'dosa', name: 'Masala Dosa', type: 'vegetarian' },
    { id: 'paratha', name: 'Stuffed Paratha', type: 'vegetarian' },
    { id: 'omelette', name: 'Masala Omelette', type: 'non-vegetarian' },
    { id: 'sandwich', name: 'Grilled Sandwich', type: 'vegetarian' },
    { id: 'pancakes', name: 'Wheat Pancakes', type: 'vegetarian' }
  ],
  lunch: [
    { id: 'dal-rice', name: 'Dal Rice', type: 'vegetarian' },
    { id: 'rajma-chawal', name: 'Rajma Chawal', type: 'vegetarian' },
    { id: 'chicken-curry', name: 'Chicken Curry', type: 'non-vegetarian' },
    { id: 'paneer-butter', name: 'Paneer Butter Masala', type: 'vegetarian' },
    { id: 'chole-bhature', name: 'Chole Bhature', type: 'vegetarian' },
    { id: 'fish-curry', name: 'Fish Curry', type: 'non-vegetarian' },
    { id: 'veg-thali', name: 'Veg Thali', type: 'vegetarian' },
    { id: 'biryani', name: 'Chicken Biryani', type: 'non-vegetarian' }
  ],
  dinner: [
    { id: 'roti-sabzi', name: 'Roti Sabzi', type: 'vegetarian' },
    { id: 'khichdi', name: 'Khichdi', type: 'vegetarian' },
    { id: 'mutton-curry', name: 'Mutton Curry', type: 'non-vegetarian' },
    { id: 'palak-paneer', name: 'Palak Paneer', type: 'vegetarian' },
    { id: 'egg-curry', name: 'Egg Curry', type: 'non-vegetarian' },
    { id: 'dal-tadka', name: 'Dal Tadka', type: 'vegetarian' },
    { id: 'veg-pulao', name: 'Veg Pulao', type: 'vegetarian' },
    { id: 'grilled-chicken', name: 'Grilled Chicken', type: 'non-vegetarian' }
  ]
};

interface MealPreferencesProps {}

export const MealPreferences: React.FC<MealPreferencesProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const selectedPlan = location.state?.plan;
  
  const [preferences, setPreferences] = useState({
    breakfast: [] as string[],
    lunch: [] as string[],
    dinner: [] as string[]
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMealToggle = (mealType: keyof typeof preferences, mealId: string) => {
    setPreferences(prev => {
      const currentSelection = prev[mealType];
      let newSelection;
      
      if (currentSelection.includes(mealId)) {
        newSelection = currentSelection.filter(id => id !== mealId);
      } else {
        if (currentSelection.length >= 5) {
          toast({
            title: "Selection Limit",
            description: `You can select maximum 5 dishes for ${mealType}`,
            variant: "destructive"
          });
          return prev;
        }
        newSelection = [...currentSelection, mealId];
      }
      
      return {
        ...prev,
        [mealType]: newSelection
      };
    });
  };

  const isValidSelection = () => {
    return Object.values(preferences).every(meals => meals.length >= 3);
  };

  const handleComplete = async () => {
    if (!isValidSelection()) {
      toast({
        title: "Incomplete Selection",
        description: "Please select at least 3 dishes for each meal type",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate storing preferences
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store preferences in localStorage (in real app, would be sent to backend)
    const userPreferences = {
      plan: selectedPlan,
      mealPreferences: preferences,
      completedAt: new Date().toISOString()
    };
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    
    setIsProcessing(false);
    
    toast({
      title: "Preferences Saved!",
      description: "Your meal preferences have been saved successfully",
    });
    
    navigate('/dashboard');
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return Coffee;
      case 'lunch': return Sun;
      case 'dinner': return Moon;
      default: return ChefHat;
    }
  };

  const getProgress = () => {
    const totalSelected = Object.values(preferences).reduce((sum, meals) => sum + meals.length, 0);
    const minRequired = 9; // 3 for each meal type
    return Math.min((totalSelected / minRequired) * 100, 100);
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Plan Not Found</h2>
          <p className="text-muted-foreground mb-4">Please select a subscription plan first</p>
          <Button onClick={() => navigate('/onboarding/plans')}>
            Select Plan
          </Button>
        </Card>
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
          <div className="flex-1">
            <h1 className="text-xl font-bold">Meal Preferences</h1>
            <p className="text-sm text-muted-foreground">
              Select 3-5 dishes for each meal type
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(getProgress())}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 space-y-8 pb-32">
        {/* Selected Plan */}
        <Card className="p-4 bg-primary/5 border-primary">
          <div className="flex items-center space-x-3">
            <ChefHat className="w-6 h-6 text-primary" />
            <div>
              <p className="font-semibold">{selectedPlan.name}</p>
              <p className="text-sm text-muted-foreground">
                ₹{selectedPlan.price} • {selectedPlan.meals} meals
              </p>
            </div>
          </div>
        </Card>

        {/* Meal Types */}
        {Object.entries(mealOptions).map(([mealType, options]) => {
          const Icon = getMealIcon(mealType);
          const selectedCount = preferences[mealType as keyof typeof preferences].length;
          const isComplete = selectedCount >= 3;
          
          return (
            <section key={mealType} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isComplete ? 'bg-success/10' : 'bg-muted'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isComplete ? 'text-success' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold capitalize">{mealType}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedCount}/5 selected • Min 3 required
                    </p>
                  </div>
                </div>
                
                {isComplete && (
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    <Check className="w-3 h-3 mr-1" />
                    Complete
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {options.map(option => {
                  const isSelected = preferences[mealType as keyof typeof preferences].includes(option.id);
                  
                  return (
                    <Card
                      key={option.id}
                      className={`p-3 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'ring-2 ring-primary bg-primary/5 border-primary' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleMealToggle(mealType as keyof typeof preferences, option.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{option.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {option.type}
                          </p>
                        </div>
                        
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected 
                            ? 'bg-primary border-primary' 
                            : 'border-border'
                        }`}>
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Fixed Bottom Complete */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border">
        <Card className="p-4 shadow-elevated">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Selection Progress</span>
              <span className="font-medium">
                {Object.values(preferences).reduce((sum, meals) => sum + meals.length, 0)} dishes selected
              </span>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleComplete}
              disabled={!isValidSelection() || isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Saving Preferences...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Complete Setup
                </>
              )}
            </Button>
            
            {!isValidSelection() && (
              <p className="text-xs text-muted-foreground text-center">
                Select at least 3 dishes for each meal type to continue
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};