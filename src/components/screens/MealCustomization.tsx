import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Plus, Minus, AlertTriangle, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

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
  const [selectedExtras, setSelectedExtras] = useState<{[key: number]: number}>({});
  const [selectedAlternative, setSelectedAlternative] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState('1h 45m');
  const [canCustomize, setCanCustomize] = useState(true);

  useEffect(() => {
    // Simulate countdown to cutoff time
    const updateTime = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(11, 0, 0, 0); // 2 hours before 1 PM
      
      if (now > cutoff) {
        setCanCustomize(false);
        setTimeRemaining('Cutoff passed');
      }
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

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
    navigate('/checkout', { 
      state: { 
        meal: currentMeal, 
        extras: selectedExtras, 
        alternative: selectedAlternative,
        totalExtra: getTotalExtra() 
      } 
    });
  };

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
            <h1 className="text-xl font-bold">Customize Meal</h1>
            <p className="text-sm text-muted-foreground">
              {currentMeal.type} • {currentMeal.time}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6 pb-32">
        {/* Cutoff Warning */}
        <Card className={`p-4 ${canCustomize ? 'bg-accent/10 border-accent' : 'bg-destructive/10 border-destructive'}`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              canCustomize ? 'bg-accent/20' : 'bg-destructive/20'
            }`}>
              {canCustomize ? (
                <Clock className={`w-5 h-5 ${canCustomize ? 'text-accent' : 'text-destructive'}`} />
              ) : (
                <AlertTriangle className="w-5 h-5 text-destructive" />
              )}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${canCustomize ? 'text-accent' : 'text-destructive'}`}>
                {canCustomize ? 'Customization Available' : 'Customization Closed'}
              </p>
              <p className="text-sm text-muted-foreground">
                {canCustomize 
                  ? `Time remaining: ${timeRemaining}` 
                  : 'Changes allowed up to 2 hours before delivery'}
              </p>
            </div>
          </div>
        </Card>

        {/* Current Meal */}
        <section>
          <h2 className="text-lg font-bold mb-3">Current Meal</h2>
          <Card className="p-4 shadow-card">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{currentMeal.image}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{currentMeal.name}</h3>
                <div className="mt-2 space-y-1">
                  {currentMeal.items.map(item => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
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
                className={`p-4 shadow-card cursor-pointer transition-all duration-200 ${
                  selectedAlternative === item.id ? 'ring-2 ring-primary bg-primary/5' : ''
                } ${!canCustomize ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={() => canCustomize && setSelectedAlternative(
                  selectedAlternative === item.id ? null : item.id
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.image}</span>
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">+₹{item.price}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${
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
              <Card key={item.id} className="p-4 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.image}</span>
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
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
                      className="w-8 h-8"
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
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border">
          <Card className="p-4 shadow-elevated">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Extra charges:</span>
              <span className="text-lg font-bold text-primary">₹{getTotalExtra()}</span>
            </div>
            <Button 
              className="w-full" 
              onClick={handleCheckout}
              disabled={!canCustomize}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Proceed to Checkout
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};