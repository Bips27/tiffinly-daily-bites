import React, { useState } from 'react';
import { Calendar, Leaf, Clock, Flame, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dates = [25, 26, 27, 28, 29, 30, 1];

const mealData = {
  breakfast: {
    name: 'Masala Dosa & Sambar',
    time: '8:00 AM',
    calories: 320,
    type: 'veg',
    image: '🥞',
    ingredients: ['Dosa batter', 'Potato filling', 'Sambar', 'Coconut chutney'],
    allergens: ['Gluten'],
    rating: 4.5
  },
  lunch: {
    name: 'Rajma Rice Bowl',
    time: '1:00 PM',
    calories: 450,
    type: 'veg',
    image: '🍛',
    ingredients: ['Rajma curry', 'Basmati rice', 'Mixed salad', 'Pickle'],
    allergens: ['None'],
    rating: 4.7
  },
  dinner: {
    name: 'Paneer Butter Masala',
    time: '7:30 PM',
    calories: 420,
    type: 'veg',
    image: '🍽️',
    ingredients: ['Paneer', 'Butter masala', 'Naan', 'Basmati rice'],
    allergens: ['Dairy', 'Gluten'],
    rating: 4.8
  }
};

export const WeeklyMenu = () => {
  const [selectedDay, setSelectedDay] = useState(2); // Wednesday
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleMealClick = (mealType: string) => {
    setSelectedMeal(mealType);
  };

  const handleCustomize = () => {
    navigate('/customize');
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Date Selector */}
      <div className="sticky top-16 bg-background/95 backdrop-blur-md border-b border-border p-4 z-40">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">December 2024</h2>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            This Week
          </Button>
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {weekDays.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`min-w-16 h-16 rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${
                selectedDay === index
                  ? 'bg-primary text-primary-foreground shadow-card'
                  : 'bg-card hover:bg-muted'
              }`}
            >
              <span className="text-xs font-medium">{day}</span>
              <span className="text-lg font-bold">{dates[index]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-4 mt-4">
        {/* Meals for selected day */}
        <div className="space-y-4">
          {Object.entries(mealData).map(([mealType, meal]) => (
            <Card 
              key={mealType}
              className={`p-4 shadow-card hover:shadow-elevated transition-all duration-200 cursor-pointer ${
                selectedMeal === mealType ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleMealClick(mealType)}
            >
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{meal.image}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg capitalize">{mealType}</h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-warning">★</span>
                      <span className="text-sm font-medium">{meal.rating}</span>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-foreground mb-2">{meal.name}</h4>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{meal.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Flame className="w-4 h-4" />
                      <span>{meal.calories} cal</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Leaf className="w-4 h-4 text-success" />
                      <span className="capitalize">{meal.type}</span>
                    </div>
                  </div>

                  {selectedMeal === mealType && (
                    <div className="animate-slide-up space-y-3 border-t border-border pt-3">
                      <div>
                        <h5 className="font-medium mb-2">Ingredients:</h5>
                        <p className="text-sm text-muted-foreground">
                          {meal.ingredients.join(', ')}
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Allergens:</h5>
                        <p className="text-sm text-muted-foreground">
                          {meal.allergens.join(', ')}
                        </p>
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMeal(null);
                          }}
                        >
                          Close
                        </Button>
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCustomize();
                          }}
                        >
                          Customize
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Weekly nutrition summary */}
        <Card className="p-4 bg-gradient-subtle">
          <h3 className="font-semibold mb-3">Weekly Nutrition</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">1,190</div>
              <div className="text-sm text-muted-foreground">Avg Calories/Day</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">45g</div>
              <div className="text-sm text-muted-foreground">Protein/Day</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">8</div>
              <div className="text-sm text-muted-foreground">Servings/Day</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};