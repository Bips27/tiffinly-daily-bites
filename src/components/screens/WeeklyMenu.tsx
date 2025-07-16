import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Flame, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useMealData, Meal } from '@/hooks/useMealData';
import { MealDetailSheet } from '@/components/ui/meal-detail-sheet';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

export const WeeklyMenu = () => {
  const navigate = useNavigate();
  const { meals, getCustomizationStatus } = useMealData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Generate week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Filter meals for selected date (for demo, showing same meals for all dates)
  const mealsForDate = meals;

  const handleMealTap = (meal: Meal) => {
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    setSelectedMeal(meal);
    setIsSheetOpen(true);
  };

  const handleCustomize = () => {
    if (selectedMeal) {
      navigate('/customize', { state: { meal: selectedMeal } });
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = addDays(weekStart, direction === 'next' ? 7 : -7);
    setWeekStart(newWeekStart);
  };

  const getMealStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success/10 text-success border-success/20';
      case 'preparing': return 'bg-warning/10 text-warning border-warning/20';
      case 'out_for_delivery': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getMealStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'preparing': return 'Preparing';
      case 'out_for_delivery': return 'Out for Delivery';
      default: return 'Scheduled';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Sticky Header with Date Selector */}
      <div className="sticky top-16 bg-background/95 backdrop-blur-lg border-b border-border z-40">
        {/* Month Navigation */}
        <div className="flex items-center justify-between px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateWeek('prev')}
            className="h-10 w-10 rounded-xl touch-manipulation"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <div className="text-center">
            <h2 className="text-lg font-bold">{format(weekStart, 'MMMM yyyy')}</h2>
            <p className="text-sm text-muted-foreground">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d')}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateWeek('next')}
            className="h-10 w-10 rounded-xl touch-manipulation"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Horizontal Date Selector */}
        <div 
          className="flex px-4 pb-4 gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {weekDates.map((date, index) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            
            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedDate(date);
                  if (navigator.vibrate) navigator.vibrate(5);
                }}
                className={`min-w-[64px] h-18 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 transform active:scale-95 touch-manipulation ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-elevated scale-105'
                    : isToday
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-card hover:bg-muted hover:scale-105 shadow-sm'
                }`}
              >
                <span className="text-xs font-medium mb-1">
                  {format(date, 'EEE')}
                </span>
                <span className="text-lg font-bold">
                  {format(date, 'd')}
                </span>
                {isToday && (
                  <div className="w-1.5 h-1.5 bg-current rounded-full mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Meal Cards */}
      <div className="px-4 py-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">
            {isSameDay(selectedDate, new Date()) ? "Today's Meals" : format(selectedDate, 'EEEE, MMM d')}
          </h3>
          <Button variant="outline" size="sm" className="h-9 px-3 rounded-xl touch-manipulation">
            <Calendar className="w-4 h-4 mr-2" />
            Week View
          </Button>
        </div>

        <div className="space-y-4">
          {mealsForDate.map((meal) => {
            const customizationStatus = getCustomizationStatus(meal);
            
            return (
              <Card 
                key={meal.id}
                className="p-5 shadow-card hover:shadow-elevated transition-all duration-200 transform active:scale-[0.98] cursor-pointer touch-manipulation"
                onClick={() => handleMealTap(meal)}
              >
                <div className="flex items-start space-x-4">
                  {/* Meal Image */}
                  <div className="w-18 h-18 rounded-2xl bg-gradient-subtle flex items-center justify-center text-4xl shadow-sm flex-shrink-0">
                    {meal.image}
                  </div>
                  
                  {/* Meal Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-lg text-foreground mb-2 leading-tight">
                          {meal.name}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{meal.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Flame className="w-4 h-4" />
                            <span>{meal.calories} cal</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <Badge 
                        variant="outline"
                        className={`text-xs px-3 py-1.5 ml-3 rounded-xl ${getMealStatusColor(meal.status)}`}
                      >
                        {getMealStatusText(meal.status)}
                      </Badge>
                    </div>

                    {/* Items Preview */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {meal.items.slice(0, 2).join(', ')}
                      {meal.items.length > 2 && ` +${meal.items.length - 2} more`}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline"
                        className={`text-xs px-3 py-1.5 rounded-xl font-medium ${
                          customizationStatus.status === 'open' 
                            ? 'bg-success/10 text-success border-success/20' :
                          customizationStatus.status === 'customized' 
                            ? 'bg-primary/10 text-primary border-primary/20' :
                            'bg-destructive/10 text-destructive border-destructive/20'
                        }`}
                      >
                        {customizationStatus.status === 'open' && '✅ Customizable'}
                        {customizationStatus.status === 'customized' && '🎯 Customized'}
                        {customizationStatus.status === 'closed' && '❌ Closed'}
                      </Badge>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        disabled={!customizationStatus.canCustomize}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (customizationStatus.canCustomize) {
                            navigate('/customize', { state: { meal } });
                            if (navigator.vibrate) navigator.vibrate(10);
                          }
                        }}
                        className="h-9 px-4 text-xs disabled:opacity-50 rounded-xl touch-manipulation"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Customize
                      </Button>
                    </div>

                    {/* Customization Fee Notice */}
                    {meal.isCustomized && meal.customizationFee && (
                      <div className="mt-3 p-3 bg-primary/5 border border-primary/10 rounded-xl">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Customization Fee</span>
                          <span className="font-semibold text-primary">₹{meal.customizationFee}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Weekly Summary Card */}
        <Card className="p-6 bg-gradient-subtle mt-8">
          <h3 className="font-semibold text-lg mb-4 text-center">This Week's Nutrition</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">1,190</div>
              <div className="text-xs text-muted-foreground">Avg Calories</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-accent">45g</div>
              <div className="text-xs text-muted-foreground">Protein/Day</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-warning">4.8</div>
              <div className="text-xs text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Sheet for Meal Details */}
      <MealDetailSheet
        meal={selectedMeal}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onCustomize={handleCustomize}
        canCustomize={selectedMeal ? getCustomizationStatus(selectedMeal).canCustomize : false}
        customizationStatus={selectedMeal ? getCustomizationStatus(selectedMeal) : { canCustomize: false, status: 'closed' as const, message: '' }}
      />

    </div>
  );
};