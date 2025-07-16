import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Bell, Package, CreditCard, Gift, Clock, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'order' | 'payment' | 'promotion' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  action?: {
    label: string;
    url: string;
  };
}

export const Notifications = () => {
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Lunch Delivered!',
      message: 'Your Dal Rice Bowl has been delivered successfully. Enjoy your meal!',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isRead: false,
      action: {
        label: 'Rate Meal',
        url: '/orders'
      }
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Customize Tomorrow\'s Breakfast',
      message: 'Don\'t forget to customize your breakfast for tomorrow. Cutoff is in 2 hours.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
      action: {
        label: 'Customize Now',
        url: '/menu'
      }
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Successful',
      message: 'Your wallet has been recharged with ₹500. Current balance: ₹1,250',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true,
      action: {
        label: 'View Wallet',
        url: '/wallet'
      }
    },
    {
      id: '4',
      type: 'promotion',
      title: 'Weekend Special Offer',
      message: 'Get 20% off on weekend meal customizations. Valid till Sunday!',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isRead: true,
      action: {
        label: 'Explore Menu',
        url: '/menu'
      }
    },
    {
      id: '5',
      type: 'order',
      title: 'Meal Preparation Started',
      message: 'Your dinner - Paneer Curry Bowl is being prepared. Expected delivery: 8:00 PM',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isRead: true
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package className="h-4 w-4" />;
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'promotion': return <Gift className="h-4 w-4" />;
      case 'reminder': return <Clock className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'payment': return 'bg-green-100 text-green-800 border-green-200';
      case 'promotion': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'reminder': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const filterNotifications = (filter: string) => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.isRead);
    return notifications.filter(n => n.type === filter);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card 
      className={`overflow-hidden transition-all ${
        !notification.isRead ? 'bg-primary/5 border-primary/20' : ''
      }`}
      onClick={() => !notification.isRead && markAsRead(notification.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-sm">{notification.title}</h3>
              <div className="flex items-center space-x-2">
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {notification.message}
            </p>
            
            {notification.action && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(notification.action!.url);
                }}
                className="h-8 text-xs"
              >
                {notification.action.label}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold">Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="default" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="h-10 text-xs"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">
              All
              {notifications.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-1 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="order" className="text-xs">Orders</TabsTrigger>
            <TabsTrigger value="promotion" className="text-xs">Offers</TabsTrigger>
          </TabsList>

          {['all', 'unread', 'order', 'promotion'].map((filterType) => (
            <TabsContent key={filterType} value={filterType} className="space-y-3">
              {filterNotifications(filterType).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-6xl mb-4">🔔</div>
                  <h2 className="text-xl font-semibold mb-2">
                    {filterType === 'unread' ? 'All caught up!' : 'No notifications'}
                  </h2>
                  <p className="text-muted-foreground">
                    {filterType === 'unread' 
                      ? 'You have no unread notifications'
                      : 'Your notifications will appear here'
                    }
                  </p>
                </div>
              ) : (
                filterNotifications(filterType)
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};