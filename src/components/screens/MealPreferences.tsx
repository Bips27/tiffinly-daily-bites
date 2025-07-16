import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Coffee, Sun, Moon, ChefHat, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Dish {
  id: string;
  name: string;
  category_id: string;
  description?: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
}

interface MealCategory {
  id: string;
  name: string;
  display_order: number;
}

interface MealPreferencesProps {}

export const MealPreferences: React.FC<MealPreferencesProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();
  
  const selectedPlan = location.state?.plan;
  
  const [categories, setCategories] = useState<MealCategory[]>([]);
  const [dishes, setDishes] = useState<{ [key: string]: Dish[] }>({});
  const [preferences, setPreferences] = useState({
    breakfast: [] as string[],
    lunch: [] as string[],
    dinner: [] as string[]
  });
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadMealData();
  }, [user, navigate]);

  const loadMealData = async () => {
    try {
      // Load meal categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('meal_categories')
        .select('*')
        .order('display_order');

      if (categoriesError) throw categoriesError;

      // Load dishes grouped by category
      const { data: dishesData, error: dishesError } = await supabase
        .from('dishes')
        .select(`
          *,
          meal_categories!inner(name)
        `);

      if (dishesError) throw dishesError;

      setCategories(categoriesData || []);
      
      // Group dishes by category name
      const dishesByCategory: { [key: string]: Dish[] } = {};
      dishesData?.forEach(dish => {
        const categoryName = (dish as any).meal_categories.name;
        if (!dishesByCategory[categoryName]) {
          dishesByCategory[categoryName] = [];
        }
        dishesByCategory[categoryName].push(dish);
      });

      setDishes(dishesByCategory);
      setLoading(false);
    } catch (error) {
      console.error('Error loading meal data:', error);
      toast({
        title: "Error",
        description: "Failed to load meal options. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleMealToggle = (mealType: keyof typeof preferences, dishId: string) => {
    setPreferences(prev => {
      const currentSelection = prev[mealType];
      let newSelection;
      
      if (currentSelection.includes(dishId)) {
        newSelection = currentSelection.filter(id => id !== dishId);
      } else {
        if (currentSelection.length >= 5) {
          toast({
            title: "Selection Limit",
            description: `You can select maximum 5 dishes for ${mealType}`,
            variant: "destructive"
          });
          return prev;
        }
        newSelection = [...currentSelection, dishId];
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

    if (!user) return;

    setIsProcessing(true);
    
    try {
      // Save meal preferences to database
      const preferenceInserts = [];
      
      for (const [mealType, dishIds] of Object.entries(preferences)) {
        for (let i = 0; i < dishIds.length; i++) {
          preferenceInserts.push({
            user_id: user.id,
            dish_id: dishIds[i],
            meal_type: mealType,
            preference_order: i + 1
          });
        }
      }

      // Clear existing preferences first
      await supabase
        .from('user_meal_preferences')
        .delete()
        .eq('user_id', user.id);

      // Insert new preferences
      const { error: preferencesError } = await supabase
        .from('user_meal_preferences')
        .insert(preferenceInserts);

      if (preferencesError) throw preferencesError;

      // Create user subscription if plan is selected
      if (selectedPlan) {
        const { error: subscriptionError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            plan_id: selectedPlan.id,
            status: 'active'
          });

        if (subscriptionError) throw subscriptionError;
      }

      // Mark onboarding as completed
      await updateProfile({ onboarding_completed: true });
      
      toast({
        title: "Preferences Saved!",
        description: "Your meal preferences have been saved successfully",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading meal options...</p>
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
                ₹{selectedPlan.price} • {selectedPlan.type}
              </p>
            </div>
          </div>
        </Card>

        {/* Meal Types */}
        {categories.map(category => {
          const mealType = category.name;
          const options = dishes[mealType] || [];
          const Icon = getMealIcon(mealType);
          const selectedCount = preferences[mealType as keyof typeof preferences]?.length || 0;
          const isComplete = selectedCount >= 3;
          
          return (
            <section key={category.id} className="space-y-4">
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
                {options.map(dish => {
                  const isSelected = preferences[mealType as keyof typeof preferences]?.includes(dish.id) || false;
                  
                  return (
                    <Card
                      key={dish.id}
                      className={`p-3 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'ring-2 ring-primary bg-primary/5 border-primary' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleMealToggle(mealType as keyof typeof preferences, dish.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{dish.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {dish.is_vegan ? 'Vegan' : dish.is_vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
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
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
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