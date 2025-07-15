import React from 'react';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  Wallet,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
  Edit3,
  Leaf,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const profileSections = [
  {
    title: 'Account',
    items: [
      {
        icon: User,
        label: 'Personal Information',
        value: 'Update profile details',
        route: '/profile/personal',
        color: 'text-primary'
      },
      {
        icon: MapPin,
        label: 'Delivery Addresses',
        value: '2 saved addresses',
        route: '/profile/addresses',
        color: 'text-accent'
      },
      {
        icon: CreditCard,
        label: 'Payment Methods',
        value: '3 cards saved',
        route: '/profile/payments',
        color: 'text-warning'
      }
    ]
  },
  {
    title: 'Preferences',
    items: [
      {
        icon: Leaf,
        label: 'Dietary Preferences',
        value: 'Vegetarian',
        route: '/profile/dietary',
        color: 'text-success'
      },
      {
        icon: AlertTriangle,
        label: 'Allergies & Restrictions',
        value: 'Nuts, Dairy',
        route: '/profile/allergies',
        color: 'text-destructive'
      },
      {
        icon: Bell,
        label: 'Notifications',
        value: 'All enabled',
        route: '/profile/notifications',
        color: 'text-accent'
      }
    ]
  },
  {
    title: 'App',
    items: [
      {
        icon: Wallet,
        label: 'Wallet',
        value: '₹1,250',
        route: '/wallet',
        color: 'text-primary'
      },
      {
        icon: HelpCircle,
        label: 'Help & Support',
        value: 'FAQs, Contact us',
        route: '/support',
        color: 'text-muted-foreground'
      },
      {
        icon: Settings,
        label: 'App Settings',
        value: 'Language, Theme',
        route: '/profile/settings',
        color: 'text-muted-foreground'
      },
      {
        icon: Shield,
        label: 'Privacy & Security',
        value: 'Password, Data',
        route: '/profile/privacy',
        color: 'text-muted-foreground'
      }
    ]
  }
];

const userProfile = {
  name: 'Priya Sharma',
  email: 'priya.sharma@email.com',
  phone: '+91 98765 43210',
  avatar: '👩',
  memberSince: 'December 2023',
  subscription: 'Premium Monthly'
};

export const Profile = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Handle sign out logic
    navigate('/login');
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
            <h1 className="text-xl font-bold">Profile</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/profile/edit')}
          >
            <Edit3 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-4 space-y-6 pb-6">
        {/* User Info Card */}
        <Card className="p-6 shadow-card bg-gradient-primary text-primary-foreground">
          <div className="flex items-center space-x-4">
            <div className="text-6xl">{userProfile.avatar}</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{userProfile.name}</h2>
              <p className="text-primary-foreground/80 mb-1">{userProfile.email}</p>
              <p className="text-primary-foreground/80 text-sm">{userProfile.phone}</p>
              <div className="flex items-center space-x-4 mt-3 text-sm">
                <span className="bg-white/20 px-2 py-1 rounded-full">
                  {userProfile.subscription}
                </span>
                <span className="text-primary-foreground/80">
                  Member since {userProfile.memberSince}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-lg font-bold mb-3 px-1">{section.title}</h3>
            <Card className="shadow-card overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    itemIndex !== section.items.length - 1 ? 'border-b border-border' : ''
                  }`}
                  onClick={() => navigate(item.route)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 ${item.color} bg-current/10 rounded-xl flex items-center justify-center`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{item.label}</h4>
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              ))}
            </Card>
          </div>
        ))}

        {/* Quick Stats */}
        <Card className="p-4 bg-gradient-subtle">
          <h3 className="font-semibold mb-3">Your Tiffinly Journey</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">127</div>
              <div className="text-sm text-muted-foreground">Meals Delivered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">₹3,890</div>
              <div className="text-sm text-muted-foreground">Money Saved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">4.8</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </div>
          </div>
        </Card>

        {/* Sign Out */}
        <Card className="shadow-card">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-between p-4 text-destructive hover:bg-destructive/5 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 text-destructive bg-destructive/10 rounded-xl flex items-center justify-center">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="font-medium">Sign Out</h4>
                <p className="text-sm text-muted-foreground">Sign out of your account</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        </Card>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>Tiffinly v2.1.0</p>
          <p>Made with ❤️ for food lovers</p>
        </div>
      </div>
    </div>
  );
};