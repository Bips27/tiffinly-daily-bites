import React, { useState, useEffect } from 'react';
import { Clock, Edit3, CreditCard, Wallet, ChevronRight, Bell, RefreshCw, Calendar, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useMealData } from '@/hooks/useMealData';
import { useWallet } from '@/hooks/useWallet';
import { DashboardSkeleton, LoadingSpinner } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import heroTiffin from '@/assets/hero-tiffin.jpg';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { meals, loading, getNextMeal, getMealCountdown, canCustomizeMeal, getCustomizationStatus, refreshMeals } = useMealData();
  const { balance } = useWallet();
  const [refreshing, setRefreshing] = useState(false);
  const [nextMealCountdown, setNextMealCountdown] = useState('');
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [isPlanPaused, setIsPlanPaused] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const nextMeal = getNextMeal();
      if (nextMeal) {
        const countdown = getMealCountdown(nextMeal.deliveryTime);
        const mealType = nextMeal.type;
        setNextMealCountdown(`${mealType} in ${countdown}`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute for real-time
    return () => clearInterval(interval);
  }, [meals, getNextMeal, getMealCountdown]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshMeals();
      toast({
        title: "Refreshed",
        description: "Meal data updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleCustomizeMeal = (meal?: any) => {
    const targetMeal = meal || getNextMeal();
    if (!targetMeal) return;

    const customizationStatus = getCustomizationStatus(targetMeal);
    if (!customizationStatus.canCustomize) {
      toast({
        title: "Customization Not Available",
        description: customizationStatus.message,
        variant: "destructive",
      });
      return;
    }

    navigate('/customize', { state: { meal: targetMeal } });
  };

  const handleViewWeeklyMenu = () => {
    navigate('/menu');
  };

  const handlePausePlan = () => {
    setShowPauseDialog(true);
  };

  const confirmPausePlan = () => {
    setIsPlanPaused(!isPlanPaused);
    setShowPauseDialog(false);
    toast({
      title: isPlanPaused ? "Plan Resumed" : "Plan Paused",
      description: isPlanPaused ? "Your meal plan is now active" : "Your meal plan has been paused",
    });
  };

  const handleMealAction = (meal: any) => {
    // Check if meal is paid and en route
    if (meal.status === 'out_for_delivery' || meal.status === 'preparing') {
      // Redirect to live tracking
      navigate('/tracking', { state: { meal } });
    } else {
      // Show customization or other options
      handleCustomizeMeal(meal);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-success bg-success/10';
      case 'preparing': return 'text-warning bg-warning/10';
      case 'scheduled': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'preparing': return 'Preparing';
      case 'scheduled': return 'Scheduled';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <div className="relative overflow-hidden bg-gradient-primary rounded-b-3xl mx-4 mb-6">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroTiffin} 
            alt="Delicious tiffin meals" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative p-6 text-primary-foreground">
          <h2 className="text-2xl font-bold mb-2">Today's Menu</h2>
          <p className="text-primary-foreground/90 mb-4">Fresh meals prepared with love</p>
          
          {/* Next meal countdown */}
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-white/80">{isPlanPaused ? 'Plan Paused' : 'Next meal'}</p>
                <p className="font-bold text-lg">{isPlanPaused ? 'Tap to resume' : nextMealCountdown}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white/10 hover:bg-white/20 text-white w-8 h-8"
              >
                {refreshing ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  const nextMeal = getNextMeal();
                  if (nextMeal) handleMealAction(nextMeal);
                }}
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {(() => {
                  const nextMeal = getNextMeal();
                  if (nextMeal?.status === 'out_for_delivery' || nextMeal?.status === 'preparing') {
                    return 'Track';
                  }
                  return 'Customize';
                })()}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Today's Meals */}
        <section>
          <h3 className="text-xl font-bold mb-4">Today's Meals</h3>
          <div className="space-y-3">
            {meals.map((meal) => {
              const customizationStatus = getCustomizationStatus(meal);
              return (
                <Card 
                  key={meal.id} 
                  className="p-4 shadow-card hover:shadow-elevated transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{meal.image}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-foreground truncate">{meal.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(meal.status)}`}>
                          {getStatusText(meal.status)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{meal.time} • {meal.calories} calories</p>
                      <p className="text-sm text-muted-foreground truncate mb-2">{meal.items.join(', ')}</p>
                      
                      {/* Customization Status */}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          customizationStatus.status === 'open' ? 'bg-success/10 text-success' :
                          customizationStatus.status === 'customized' ? 'bg-primary/10 text-primary' :
                          'bg-destructive/10 text-destructive'
                        }`}>
                          {customizationStatus.status === 'open' && '✅ Customizable'}
                          {customizationStatus.status === 'customized' && '🎯 Customized'}
                          {customizationStatus.status === 'closed' && '❌ Customization Closed'}
                        </span>
                        
                        <div className="flex space-x-2">
                          {(meal.status === 'out_for_delivery' || meal.status === 'preparing') ? (
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => navigate('/tracking', { state: { meal } })}
                              className="text-xs bg-primary text-primary-foreground"
                            >
                              Track Live
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate('/tracking', { state: { meal } })}
                              className="text-xs"
                            >
                              Track
                            </Button>
                          )}
                          {customizationStatus.canCustomize && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCustomizeMeal(meal)}
                              className="text-xs"
                            >
                              Customize
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card 
              className="p-4 shadow-card hover:shadow-elevated transition-all duration-200 cursor-pointer active:scale-[0.98]"
              onClick={handleViewWeeklyMenu}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">Weekly Menu</h4>
                <p className="text-sm text-muted-foreground">View full menu</p>
              </div>
            </Card>
            
            <Card 
              className="p-4 shadow-card hover:shadow-elevated transition-all duration-200 cursor-pointer active:scale-[0.98]"
              onClick={handlePausePlan}
            >
              <div className="text-center">
                <div className={`w-12 h-12 ${isPlanPaused ? 'bg-success/10' : 'bg-warning/10'} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  {isPlanPaused ? (
                    <Play className="w-6 h-6 text-success" />
                  ) : (
                    <Pause className="w-6 h-6 text-warning" />
                  )}
                </div>
                <h4 className="font-semibold mb-1">{isPlanPaused ? 'Resume' : 'Pause'} Plan</h4>
                <p className="text-sm text-muted-foreground">{isPlanPaused ? 'Activate meals' : 'Temporarily stop'}</p>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="p-4 shadow-card hover:shadow-elevated transition-all duration-200 cursor-pointer active:scale-[0.98]"
              onClick={() => navigate('/subscription')}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-semibold mb-1">Subscription</h4>
                <p className="text-sm text-muted-foreground">Manage your plan</p>
              </div>
            </Card>
            
            <Card 
              className="p-4 shadow-card hover:shadow-elevated transition-all duration-200 cursor-pointer active:scale-[0.98]"
              onClick={() => navigate('/wallet')}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Wallet className="w-6 h-6 text-success" />
                </div>
                <h4 className="font-semibold mb-1">Wallet</h4>
                <p className="text-sm text-muted-foreground">₹{balance.toLocaleString()} balance</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Subscription Status */}
        <Card className={`p-4 shadow-card ${isPlanPaused ? 'bg-warning/10 border-warning/20' : 'bg-gradient-accent text-accent-foreground'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold mb-1">
                {isPlanPaused ? 'Plan Paused' : 'Premium Monthly Plan'}
              </h4>
              <p className={`text-sm ${isPlanPaused ? 'text-warning' : 'text-accent-foreground/80'}`}>
                {isPlanPaused ? 'Meals delivery stopped' : 'Active until Dec 31, 2024'}
              </p>
            </div>
            <Button 
              variant={isPlanPaused ? "default" : "secondary"} 
              size="sm" 
              onClick={() => navigate('/subscription')}
            >
              Manage
            </Button>
          </div>
        </Card>
      </div>

      {/* Pause Plan Confirmation Dialog */}
      <ConfirmationDialog
        open={showPauseDialog}
        onOpenChange={setShowPauseDialog}
        onConfirm={confirmPausePlan}
        title={isPlanPaused ? "Resume Meal Plan?" : "Pause Meal Plan?"}
        description={
          isPlanPaused 
            ? "Your daily meals will resume as scheduled. You can pause again anytime."
            : "Your scheduled meals will be paused. You can resume anytime without losing your subscription."
        }
        confirmText={isPlanPaused ? "Resume Plan" : "Pause Plan"}
        cancelText="Cancel"
      />
    </div>
  );
};