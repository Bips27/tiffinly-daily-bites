import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  mealId: number;
  mealName: string;
  mealType: string;
  originalPrice: number;
  customizations: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalExtra: number;
}

export const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock cart data
  const [cartItems, setCartItems] = React.useState<CartItem[]>([
    {
      id: 'cart1',
      mealId: 2,
      mealName: 'Dal Rice Bowl',
      mealType: 'Lunch',
      originalPrice: 0,
      customizations: [
        { id: 'extra1', name: 'Extra Roti', price: 15, quantity: 2 },
        { id: 'extra2', name: 'Paneer Upgrade', price: 50, quantity: 1 }
      ],
      totalExtra: 80
    }
  ]);

  const updateQuantity = (cartId: string, customizationId: string, change: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === cartId) {
        const updatedCustomizations = item.customizations.map(custom => {
          if (custom.id === customizationId) {
            const newQuantity = Math.max(0, custom.quantity + change);
            return { ...custom, quantity: newQuantity };
          }
          return custom;
        }).filter(custom => custom.quantity > 0);
        
        const totalExtra = updatedCustomizations.reduce((sum, custom) => 
          sum + (custom.price * custom.quantity), 0
        );
        
        return { ...item, customizations: updatedCustomizations, totalExtra };
      }
      return item;
    }).filter(item => item.customizations.length > 0));
  };

  const removeItem = (cartId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== cartId));
    toast({
      title: "Item removed from cart",
      description: "Customization has been removed."
    });
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalExtra, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some customizations before proceeding.",
        variant: "destructive"
      });
      return;
    }
    navigate('/checkout', { state: { cartItems, totalAmount } });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">Cart</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some meal customizations to get started
            </p>
            <Button onClick={() => navigate('/menu')}>
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{item.mealName}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {item.mealType}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {item.customizations.map((custom) => (
                    <div key={custom.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{custom.name}</p>
                        <p className="text-sm text-muted-foreground">₹{custom.price} each</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, custom.id, -1)}
                          className="h-8 w-8 rounded-full"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{custom.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, custom.id, 1)}
                          className="h-8 w-8 rounded-full"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="w-16 text-right font-medium">
                        ₹{custom.price * custom.quantity}
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center font-semibold">
                    <span>Item Total</span>
                    <span>₹{item.totalExtra}</span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Order Summary */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span>₹{Math.round(totalAmount * 0.05)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{totalAmount + Math.round(totalAmount * 0.05)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Bottom Action */}
      {cartItems.length > 0 && (
        <div className="sticky bottom-0 bg-background border-t p-4">
          <Button 
            onClick={handleCheckout}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            Proceed to Checkout • ₹{totalAmount + Math.round(totalAmount * 0.05)}
          </Button>
        </div>
      )}
    </div>
  );
};