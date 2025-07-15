import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Wallet, Smartphone, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';

const paymentMethods = [
  {
    id: 'wallet',
    name: 'Tiffinly Wallet',
    balance: 1250,
    icon: Wallet,
    color: 'text-accent'
  },
  {
    id: 'card',
    name: 'Card ending •••• 4567',
    icon: CreditCard,
    color: 'text-primary'
  },
  {
    id: 'upi',
    name: 'UPI Payment',
    icon: Smartphone,
    color: 'text-warning'
  }
];

export const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPayment, setSelectedPayment] = useState('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { meal, extras, alternative, totalExtra } = location.state || {};

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    navigate('/order-success', { 
      state: { 
        orderType: 'customization',
        amount: totalExtra,
        paymentMethod: selectedPayment 
      } 
    });
  };

  if (!meal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No order data found</p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
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
            <h1 className="text-xl font-bold">Checkout</h1>
            <p className="text-sm text-muted-foreground">Review and pay</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6 pb-32">
        {/* Order Summary */}
        <section>
          <h2 className="text-lg font-bold mb-3">Order Summary</h2>
          <Card className="p-4 shadow-card">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl">{meal.image}</span>
              <div>
                <h3 className="font-semibold">{meal.name}</h3>
                <p className="text-sm text-muted-foreground">{meal.type} • {meal.time}</p>
              </div>
            </div>

            {/* Customizations */}
            <div className="space-y-3 border-t border-border pt-4">
              {alternative && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Meal change</span>
                  <span className="text-sm font-medium">+₹{alternative}</span>
                </div>
              )}
              
              {extras && Object.entries(extras).map(([id, quantity]) => {
                const extraItems = [
                  { id: 5, name: 'Extra Roti', price: 15 },
                  { id: 6, name: 'Papad', price: 10 },
                  { id: 7, name: 'Raita', price: 20 },
                  { id: 8, name: 'Extra Dal', price: 25 }
                ];
                const item = extraItems.find(item => item.id === parseInt(id));
                const qty = Number(quantity);
                if (!item || qty === 0) return null;
                
                return (
                  <div key={id} className="flex justify-between items-center">
                    <span className="text-sm">{item.name} × {qty}</span>
                    <span className="text-sm font-medium">+₹{item.price * qty}</span>
                  </div>
                );
              })}

              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="font-semibold">Total Extra</span>
                <span className="text-lg font-bold text-primary">₹{totalExtra}</span>
              </div>
            </div>
          </Card>
        </section>

        {/* Payment Methods */}
        <section>
          <h2 className="text-lg font-bold mb-3">Payment Method</h2>
          <div className="space-y-3">
            {paymentMethods.map(method => (
              <Card 
                key={method.id}
                className={`p-4 shadow-card cursor-pointer transition-all duration-200 ${
                  selectedPayment === method.id ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedPayment(method.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${method.color} bg-current/10 rounded-xl flex items-center justify-center`}>
                      <method.icon className={`w-5 h-5 ${method.color}`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{method.name}</h4>
                      {method.balance && (
                        <p className="text-sm text-muted-foreground">
                          Balance: ₹{method.balance}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    selectedPayment === method.id 
                      ? 'bg-primary border-primary' 
                      : 'border-border'
                  }`}>
                    {selectedPayment === method.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Security Note */}
        <Card className="p-4 bg-muted/30">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-success" />
            <div>
              <p className="text-sm font-medium">Secure Payment</p>
              <p className="text-xs text-muted-foreground">
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Fixed Bottom Payment */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border">
        <Card className="p-4 shadow-elevated">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Amount to pay:</span>
            <span className="text-xl font-bold text-primary">₹{totalExtra}</span>
          </div>
          <Button 
            className="w-full" 
            onClick={handlePayment}
            disabled={isProcessing || (selectedPayment === 'wallet' && totalExtra > 1250)}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Pay ₹{totalExtra}
              </>
            )}
          </Button>
          {selectedPayment === 'wallet' && totalExtra > 1250 && (
            <p className="text-xs text-destructive mt-2 text-center">
              Insufficient wallet balance
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};