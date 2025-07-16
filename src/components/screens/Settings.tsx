import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Bell, Globe, Palette, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Settings state
  const [settings, setSettings] = React.useState({
    notifications: {
      orderUpdates: true,
      promotions: true,
      reminders: true,
      pushNotifications: true
    },
    preferences: {
      language: 'en',
      theme: 'system',
      autoReorder: false,
      savePaymentMethods: true
    },
    privacy: {
      dataSharing: false,
      locationAccess: true,
      analytics: true
    }
  });

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
    
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved."
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account."
    });
    navigate('/login');
  };

  const SettingRow = ({ 
    icon, 
    title, 
    description, 
    children, 
    onClick 
  }: { 
    icon: React.ReactNode;
    title: string;
    description?: string;
    children?: React.ReactNode;
    onClick?: () => void;
  }) => (
    <div 
      className={`flex items-center justify-between p-4 ${onClick ? 'cursor-pointer hover:bg-muted/50' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="text-muted-foreground">
          {icon}
        </div>
        <div>
          <p className="font-medium">{title}</p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {children}
        {onClick && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </div>
    </div>
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
          <h1 className="text-lg font-semibold">Settings</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <SettingRow
              icon={<Bell className="h-4 w-4" />}
              title="Order Updates"
              description="Get notified about order status changes"
            >
              <Switch
                checked={settings.notifications.orderUpdates}
                onCheckedChange={(value) => updateSetting('notifications', 'orderUpdates', value)}
              />
            </SettingRow>
            <Separator />
            <SettingRow
              icon={<Bell className="h-4 w-4" />}
              title="Promotions & Offers"
              description="Receive notifications about special deals"
            >
              <Switch
                checked={settings.notifications.promotions}
                onCheckedChange={(value) => updateSetting('notifications', 'promotions', value)}
              />
            </SettingRow>
            <Separator />
            <SettingRow
              icon={<Bell className="h-4 w-4" />}
              title="Meal Reminders"
              description="Reminders to customize upcoming meals"
            >
              <Switch
                checked={settings.notifications.reminders}
                onCheckedChange={(value) => updateSetting('notifications', 'reminders', value)}
              />
            </SettingRow>
            <Separator />
            <SettingRow
              icon={<Bell className="h-4 w-4" />}
              title="Push Notifications"
              description="Allow push notifications on this device"
            >
              <Switch
                checked={settings.notifications.pushNotifications}
                onCheckedChange={(value) => updateSetting('notifications', 'pushNotifications', value)}
              />
            </SettingRow>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <SettingRow
              icon={<Globe className="h-4 w-4" />}
              title="Language"
              description="Choose your preferred language"
            >
              <Select
                value={settings.preferences.language}
                onValueChange={(value) => updateSetting('preferences', 'language', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="mr">मराठी</SelectItem>
                  <SelectItem value="gu">ગુજરાતી</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow
              icon={<Palette className="h-4 w-4" />}
              title="App Theme"
              description="Choose between light, dark, or system theme"
            >
              <Select
                value={settings.preferences.theme}
                onValueChange={(value) => updateSetting('preferences', 'theme', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
            <Separator />
            <SettingRow
              icon={<Palette className="h-4 w-4" />}
              title="Auto Reorder"
              description="Automatically reorder favorite meals"
            >
              <Switch
                checked={settings.preferences.autoReorder}
                onCheckedChange={(value) => updateSetting('preferences', 'autoReorder', value)}
              />
            </SettingRow>
            <Separator />
            <SettingRow
              icon={<Palette className="h-4 w-4" />}
              title="Save Payment Methods"
              description="Remember payment methods for faster checkout"
            >
              <Switch
                checked={settings.preferences.savePaymentMethods}
                onCheckedChange={(value) => updateSetting('preferences', 'savePaymentMethods', value)}
              />
            </SettingRow>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Privacy & Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            <SettingRow
              icon={<Shield className="h-4 w-4" />}
              title="Data Sharing"
              description="Share usage data to improve our service"
            >
              <Switch
                checked={settings.privacy.dataSharing}
                onCheckedChange={(value) => updateSetting('privacy', 'dataSharing', value)}
              />
            </SettingRow>
            <Separator />
            <SettingRow
              icon={<Shield className="h-4 w-4" />}
              title="Location Access"
              description="Allow location access for better delivery"
            >
              <Switch
                checked={settings.privacy.locationAccess}
                onCheckedChange={(value) => updateSetting('privacy', 'locationAccess', value)}
              />
            </SettingRow>
            <Separator />
            <SettingRow
              icon={<Shield className="h-4 w-4" />}
              title="Analytics"
              description="Help us improve by sharing anonymous usage data"
            >
              <Switch
                checked={settings.privacy.analytics}
                onCheckedChange={(value) => updateSetting('privacy', 'analytics', value)}
              />
            </SettingRow>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-0">
            <SettingRow
              icon={<HelpCircle className="h-4 w-4" />}
              title="Help & Support"
              description="Get help or contact customer support"
              onClick={() => navigate('/support')}
            />
            <Separator />
            <SettingRow
              icon={<LogOut className="h-4 w-4" />}
              title="Logout"
              description="Sign out of your account"
              onClick={handleLogout}
            />
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center space-y-2 pt-6">
          <p className="text-sm text-muted-foreground">Tiffinly App</p>
          <p className="text-xs text-muted-foreground">Version 1.0.0</p>
          <p className="text-xs text-muted-foreground">© 2025 Tiffinly. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};