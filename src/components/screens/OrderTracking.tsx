import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, CheckCircle, Package, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const orderSteps = [
  {
    id: 'confirmed',
    title: 'Order Confirmed',
    description: 'Your meal is confirmed',
    time: '10:30 AM',
    icon: CheckCircle,
    completed: true
  },
  {
    id: 'preparing',
    title: 'Meal Preparing',
    description: 'Chef is preparing your meal',
    time: '11:45 AM',
    icon: Package,
    completed: true
  },
  {
    id: 'out_for_delivery',
    title: 'Out for Delivery',
    description: 'Delivery partner is on the way',
    time: '12:15 PM',
    icon: Truck,
    completed: true,
    active: true
  },
  {
    id: 'delivered',
    title: 'Delivered',
    description: 'Enjoy your meal!',
    time: 'ETA 12:30 PM',
    icon: CheckCircle,
    completed: false
  }
];

const deliveryPartner = {
  name: 'Rajesh Kumar',
  phone: '+91 98765 43210',
  rating: 4.8,
  vehicle: 'KA 01 AB 1234',
  avatar: '👨'
};

export const OrderTracking = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(2);
  const [estimatedTime, setEstimatedTime] = useState('15 min');

  useEffect(() => {
    // Simulate order progress
    const timer = setTimeout(() => {
      if (currentStep < orderSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentStep]);

  const currentOrder = {
    id: 'TF2024001',
    type: 'Lunch',
    items: ['Dal Rice', 'Mixed Vegetables', 'Roti', 'Pickle'],
    time: '1:00 PM',
    address: '123 MG Road, Apartment 4B, Bangalore 560001'
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-md border-b border-border p-4 z-40">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-xl touch-manipulation"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">Track Order</h1>
            <p className="text-sm text-muted-foreground">Order #{currentOrder.id}</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6 pb-6 pt-4">
        {/* Order Status Card */}
        <Card className="p-6 shadow-card bg-gradient-primary text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-2">{orderSteps[currentStep]?.title}</h3>
              <p className="text-primary-foreground/80">{orderSteps[currentStep]?.description}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-sm text-primary-foreground/80 mb-1">ETA</p>
              <p className="text-xl font-bold">{estimatedTime}</p>
            </div>
          </div>
        </Card>

        {/* Order Progress */}
        <Card className="p-5 shadow-card">
          <h3 className="font-semibold text-lg mb-5">Order Progress</h3>
          <div className="space-y-6">
            {orderSteps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  step.completed 
                    ? 'bg-success text-success-foreground shadow-sm' 
                    : step.active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className={`font-semibold ${
                      step.completed || step.active ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </h4>
                    <span className={`text-sm font-medium flex-shrink-0 ml-3 ${
                      step.completed || step.active ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Delivery Partner */}
        {currentStep >= 2 && (
          <Card className="p-5 shadow-card">
            <h3 className="font-semibold text-lg mb-4">Delivery Partner</h3>
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-subtle flex items-center justify-center text-4xl flex-shrink-0">
                {deliveryPartner.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-base mb-1">{deliveryPartner.name}</h4>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <span>⭐ {deliveryPartner.rating}</span>
                  <span>•</span>
                  <span>{deliveryPartner.vehicle}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl touch-manipulation">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl touch-manipulation">
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Order Details */}
        <Card className="p-4 shadow-card">
          <h3 className="font-semibold mb-4">Order Details</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{currentOrder.type}</span>
              <span className="text-muted-foreground">{currentOrder.time}</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Items:</p>
              <p className="text-sm">{currentOrder.items.join(', ')}</p>
            </div>
          </div>
        </Card>

        {/* Delivery Address */}
        <Card className="p-4 shadow-card">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-primary mt-1" />
            <div>
              <h4 className="font-medium mb-1">Delivery Address</h4>
              <p className="text-sm text-muted-foreground">{currentOrder.address}</p>
            </div>
          </div>
        </Card>

        {/* Live Map Placeholder */}
        <Card className="p-4 shadow-card">
          <h3 className="font-semibold mb-4">Live Tracking</h3>
          <div className="h-40 bg-muted rounded-xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Live map will be shown here</p>
            </div>
          </div>
        </Card>

        {/* Delivery Instructions */}
        <Card className="p-4 bg-muted/30">
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-accent mt-1" />
            <div>
              <h4 className="font-medium mb-1">Delivery Instructions</h4>
              <p className="text-sm text-muted-foreground">
                Please call when you arrive. Ring doorbell for apartment 4B.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};