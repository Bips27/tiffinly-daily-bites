import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Clock, MapPin, Star } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

interface Order {
  id: string;
  date: Date;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner';
  mealName: string;
  status: 'delivered' | 'cancelled' | 'pending';
  amount: number;
  deliveryTime: string;
  customizations?: string[];
  rating?: number;
}

export const OrderHistory = () => {
  const navigate = useNavigate();
  
  // Mock order data
  const orders: Order[] = [
    {
      id: 'ORD001',
      date: new Date(),
      mealType: 'Lunch',
      mealName: 'Dal Rice Bowl',
      status: 'delivered',
      amount: 0,
      deliveryTime: '1:00 PM',
      rating: 5
    },
    {
      id: 'ORD002',
      date: new Date(),
      mealType: 'Breakfast',
      mealName: 'Poha Bowl',
      status: 'delivered',
      amount: 25,
      deliveryTime: '8:30 AM',
      customizations: ['Extra Tea'],
      rating: 4
    },
    {
      id: 'ORD003',
      date: subDays(new Date(), 1),
      mealType: 'Dinner',
      mealName: 'Paneer Curry Bowl',
      status: 'delivered',
      amount: 80,
      deliveryTime: '8:00 PM',
      customizations: ['Extra Roti', 'Paneer Upgrade'],
      rating: 5
    },
    {
      id: 'ORD004',
      date: subDays(new Date(), 2),
      mealType: 'Lunch',
      mealName: 'Dal Rice Bowl',
      status: 'cancelled',
      amount: 0,
      deliveryTime: '1:00 PM'
    },
  ];

  // Group orders by week
  const groupOrdersByWeek = (orders: Order[]) => {
    const grouped: { [key: string]: Order[] } = {};
    
    orders.forEach(order => {
      const weekStart = startOfWeek(order.date, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(order.date, { weekStartsOn: 1 });
      const weekKey = `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd, yyyy')}`;
      
      if (!grouped[weekKey]) {
        grouped[weekKey] = [];
      }
      grouped[weekKey].push(order);
    });
    
    return grouped;
  };

  const filterOrders = (type: string) => {
    if (type === 'all') return orders;
    return orders.filter(order => order.mealType.toLowerCase() === type);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="overflow-hidden hover:shadow-elevated transition-all duration-200 active:scale-[0.98] cursor-pointer touch-manipulation">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold text-base">{order.mealName}</h3>
              <Badge variant="outline" className="text-xs px-2 py-1 rounded-xl">
                {order.mealType}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{format(order.date, 'MMM dd')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{order.deliveryTime}</span>
              </div>
            </div>
          </div>
          <div className="text-right ml-3">
            <Badge className={`${getStatusColor(order.status)} rounded-xl px-3 py-1.5`}>
              {order.status}
            </Badge>
            {order.amount > 0 && (
              <p className="text-sm font-semibold mt-2">+₹{order.amount}</p>
            )}
          </div>
        </div>

        {order.customizations && order.customizations.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Customizations:</p>
            <div className="flex flex-wrap gap-2">
              {order.customizations.map((custom, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-1 rounded-xl">
                  {custom}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Order ID:</span>
            <span className="text-xs font-mono font-medium">{order.id}</span>
          </div>
          {order.rating && order.status === 'delivered' && (
            <div className="flex items-center space-x-1">
              {renderStars(order.rating)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-xl touch-manipulation"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Order History</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="breakfast" className="text-xs">Breakfast</TabsTrigger>
            <TabsTrigger value="lunch" className="text-xs">Lunch</TabsTrigger>
            <TabsTrigger value="dinner" className="text-xs">Dinner</TabsTrigger>
          </TabsList>

          {['all', 'breakfast', 'lunch', 'dinner'].map((filterType) => (
            <TabsContent key={filterType} value={filterType} className="space-y-6">
              {Object.entries(groupOrdersByWeek(filterOrders(filterType))).map(([week, weekOrders]) => (
                <div key={week}>
                  <h2 className="text-sm font-semibold text-muted-foreground mb-3 sticky top-[73px] bg-background py-2">
                    {week}
                  </h2>
                  <div className="space-y-3">
                    {weekOrders
                      .sort((a, b) => b.date.getTime() - a.date.getTime())
                      .map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                  </div>
                </div>
              ))}
              
              {filterOrders(filterType).length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <h2 className="text-xl font-semibold mb-2">No orders found</h2>
                  <p className="text-muted-foreground mb-6">
                    Your order history will appear here
                  </p>
                  <Button onClick={() => navigate('/menu')}>
                    Order Now
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};