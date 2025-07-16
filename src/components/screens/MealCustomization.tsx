import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Plus, Minus, AlertTriangle, ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useToast } from '@/hooks/use-toast';
import { useMealData } from '@/hooks/useMealData';

const currentMeal = {
  type: 'Lunch',
  name: 'Rajma Rice Bowl',
  time: '1:00 PM',
  image: '🍛',
  items: [
    { id: 1, name: 'Rajma Curry', included: true, price: 0 },
    { id: 2, name: 'Basmati Rice', included: true, price: 0 },
    { id: 3, name: 'Mixed Salad', included: true, price: 0 },
    { id: 4, name: 'Pickle', included: true, price: 0 }
  ]
};

const extraItems = [
  { id: 5, name: 'Extra Roti', price: 15, image: '🫓' },
  { id: 6, name: 'Papad', price: 10, image: '🥨' },
  { id: 7, name: 'Raita', price: 20, image: '🥛' },
  { id: 8, name: 'Extra Dal', price: 25, image: '🍲' }
];

const alternatives = [
  { id: 9, name: 'Chole Rice Bowl', price: 30, image: '🍛' },
  { id: 10, name: 'Paneer Rice Bowl', price: 50, image: '🍛' }
];

export const MealCustomization = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { canCustomizeMeal, getMealCountdown, getCustomizationStatus, customizeMeal } = useMealData();
  
  const [selectedExtras, setSelectedExtras] = useState<{[key: number]: number}>({});
  const [selectedAlternative, setSelectedAlternative] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('1h 45m');
  const [canCustomize, setCanCustomize] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Get meal from navigation state or use default
  const meal = location.state?.meal || currentMeal;

  useEffect(() => {
    const updateTime = () => {
      if (meal.deliveryTime) {
        const customizationStatus = getCustomizationStatus(meal);
        setCanCustomize(customizationStatus.canCustomize);
        
        if (customizationStatus.canCustomize) {
          const cutoffTime = new Date(meal.deliveryTime.getTime() - 2 * 60 * 60 * 1000);
          setTimeRemaining(getMealCountdown(cutoffTime));
        } else {
          setTimeRemaining(customizationStatus.message);
        }
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [meal]);

  const getTotalExtra = () => {
    let total = 0;
    Object.entries(selectedExtras).forEach(([id, quantity]) => {
      const item = extraItems.find(item => item.id === parseInt(id));
      if (item) total += item.price * quantity;
    });
    if (selectedAlternative) {
      const alt = alternatives.find(item => item.id === selectedAlternative);
      if (alt) total += alt.price;
    }
    return total;
  };

  const updateExtraQuantity = (id: number, change: number) => {
    setSelectedExtras(prev => {
      const current = prev[id] || 0;
      const newQuantity = Math.max(0, current + change);
      if (newQuantity === 0) {
        const { [id]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQuantity };
    });
  };

  const handleCheckout = () => {
    const customizationStatus = getCustomizationStatus(meal);
    if (!customizationStatus.canCustomize) {
      toast({
        title: "Customization Not Available",
        description: customizationStatus.message,
        variant: "destructive",
      });
      return;
    }

    if (getTotalExtra() === 0) {
      toast({
        title: "No Changes",
        description: "Please select items to customize or go back",
        variant: "destructive",
      });
      return;
    }

    navigate('/checkout', { 
      state: { 
        meal, 
        extras: selectedExtras, 
        alternative: selectedAlternative,
        totalExtra: getTotalExtra(),
        customizeMeal: customizeMeal // Pass the function to checkout
      } 
    });
  };

  const handleCancelChanges = () => {
    if (getTotalExtra() > 0 || selectedAlternative) {
      setShowCancelDialog(true);
    } else {
      navigate(-1);
    }
  };

  const confirmCancelChanges = () => {
    setSelectedExtras({});
    setSelectedAlternative(null);
    setShowCancelDialog(false);
    navigate(-1);
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border p-4 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleCancelChanges}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-xl font-bold">Customize Meal</h1>
                <p className="text-sm text-muted-foreground">
                  {meal.type} • {meal.time}
                </p>
              </div>
            </div>
            {(getTotalExtra() > 0 || selectedAlternative) && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowCancelDialog(true)}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        <div className="px-4 space-y-6 pb-32">
        {/* Customization Status */}
        <Card className={`p-4 ${canCustomize ? 'bg-success/10 border-success' : 'bg-destructive/10 border-destructive'}`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              canCustomize ? 'bg-success/20' : 'bg-destructive/20'
            }`}>
              {canCustomize ? (
                <Clock className="w-5 h-5 text-success" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-destructive" />
              )}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${canCustomize ? 'text-success' : 'text-destructive'}`}>
                {canCustomize ? '✅ Customization Available' : '❌ Customization Closed'}
              </p>
              <p className="text-sm text-muted-foreground">
                {canCustomize 
                  ? `Changes allowed until 2 hours before delivery (${meal.time})` 
                  : timeRemaining}
              </p>
            </div>
          </div>
        </Card>

          {/* Current Meal */}
          <section>
            <h2 className="text-lg font-bold mb-3">Current Meal</h2>
            <Card className="p-4 shadow-card">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{meal.image}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{meal.name}</h3>
                  <div className="mt-2 space-y-1">
                    {meal.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Alternative Meals */}
          <section>
            <h2 className="text-lg font-bold mb-3">Switch to Different Meal</h2>
            <div className="space-y-3">
              {alternatives.map(item => (
                <Card 
                  key={item.id}
                  className={`p-4 shadow-card cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                    selectedAlternative === item.id ? 'ring-2 ring-primary bg-primary/5' : ''
                  } ${!canCustomize ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={() => canCustomize && setSelectedAlternative(
                    selectedAlternative === item.id ? null : item.id
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">{item.image}</span>
                      <div className="min-w-0">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">+₹{item.price}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                      selectedAlternative === item.id 
                        ? 'bg-primary border-primary' 
                        : 'border-border'
                    }`}>
                      {selectedAlternative === item.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Extra Items */}
          <section>
            <h2 className="text-lg font-bold mb-3">Add Extra Items</h2>
            <div className="space-y-3">
              {extraItems.map(item => (
                <Card key={item.id} className={`p-4 shadow-card ${!canCustomize ? 'opacity-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span className="text-2xl flex-shrink-0">{item.image}</span>
                      <div className="min-w-0">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 touch-manipulation"
                        onClick={() => updateExtraQuantity(item.id, -1)}
                        disabled={!canCustomize || !selectedExtras[item.id]}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {selectedExtras[item.id] || 0}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 touch-manipulation"
                        onClick={() => updateExtraQuantity(item.id, 1)}
                        disabled={!canCustomize}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Fixed Bottom Checkout */}
        {(getTotalExtra() > 0 || selectedAlternative) && (
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border z-50">
            <Card className="p-4 shadow-elevated">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Extra charges:</span>
                <span className="text-lg font-bold text-primary">₹{getTotalExtra()}</span>
              </div>
              <Button 
                className="w-full touch-manipulation" 
                onClick={handleCheckout}
                disabled={!canCustomize}
                size="lg"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              {!canCustomize && (
                <p className="text-xs text-destructive mt-2 text-center">
                  Customization window has closed
                </p>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Changes?"
        description="You have unsaved changes. Are you sure you want to go back? All changes will be lost."
        confirmText="Yes, Cancel"
        cancelText="Keep Editing"
        variant="destructive"
        onConfirm={confirmCancelChanges}
      />
    </>
  );
};