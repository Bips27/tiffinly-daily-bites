import { useState, useEffect } from 'react';

export interface Meal {
  id: number;
  type: 'Breakfast' | 'Lunch' | 'Dinner';
  name: string;
  time: string;
  status: 'delivered' | 'preparing' | 'scheduled' | 'out_for_delivery';
  items: string[];
  calories: number;
  image: string;
  deliveryTime: Date;
}

export const useMealData = () => {
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: 1,
      type: 'Breakfast',
      name: 'Poha Bowl',
      time: '8:00 AM',
      status: 'delivered',
      items: ['Poha', 'Masala Tea', 'Fresh Fruits'],
      calories: 320,
      image: '🥣',
      deliveryTime: new Date(new Date().setHours(8, 0, 0, 0))
    },
    {
      id: 2,
      type: 'Lunch',
      name: 'Dal Rice Bowl',
      time: '1:00 PM',
      status: 'preparing',
      items: ['Dal Rice', 'Mixed Vegetables', 'Roti', 'Pickle'],
      calories: 450,
      image: '🍛',
      deliveryTime: new Date(new Date().setHours(13, 0, 0, 0))
    },
    {
      id: 3,
      type: 'Dinner',
      name: 'Paneer Curry Bowl',
      time: '7:30 PM',
      status: 'scheduled',
      items: ['Paneer Curry', 'Jeera Rice', 'Chapati', 'Salad'],
      calories: 420,
      image: '🍽️',
      deliveryTime: new Date(new Date().setHours(19, 30, 0, 0))
    }
  ]);

  const [loading, setLoading] = useState(false);

  const getNextMeal = () => {
    const now = new Date();
    return meals.find(meal => meal.deliveryTime > now) || meals[0];
  };

  const getMealCountdown = (deliveryTime: Date) => {
    const now = new Date();
    const diff = deliveryTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ready to deliver';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const canCustomizeMeal = (deliveryTime: Date) => {
    const now = new Date();
    const cutoffTime = new Date(deliveryTime.getTime() - 2 * 60 * 60 * 1000); // 2 hours before
    return now < cutoffTime;
  };

  const refreshMeals = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return {
    meals,
    loading,
    getNextMeal,
    getMealCountdown,
    canCustomizeMeal,
    refreshMeals
  };
};