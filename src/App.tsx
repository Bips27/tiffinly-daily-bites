import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MobileLayout from "./components/layout/MobileLayout";
import { SplashScreen } from "./components/screens/SplashScreen";
import { OnboardingScreen } from "./components/screens/OnboardingScreen";
import { LoginScreen } from "./components/screens/LoginScreen";
import { Dashboard } from "./components/screens/Dashboard";
import { WeeklyMenu } from "./components/screens/WeeklyMenu";
import { MealCustomization } from "./components/screens/MealCustomization";
import { Checkout } from "./components/screens/Checkout";
import { SubscriptionPlans } from "./components/screens/SubscriptionPlans";
import { OrderTracking } from "./components/screens/OrderTracking";
import { Profile } from "./components/screens/Profile";
import { Wallet } from "./components/screens/Wallet";
import { Cart } from "./components/screens/Cart";
import { OrderHistory } from "./components/screens/OrderHistory";
import { SavedAddresses } from "./components/screens/SavedAddresses";
import { Notifications } from "./components/screens/Notifications";
import { Settings } from "./components/screens/Settings";
import { HelpSupport } from "./components/screens/HelpSupport";
import { OnboardingFlow } from "./components/screens/OnboardingFlow";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/onboarding/*" element={<OnboardingFlow />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={<MobileLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="menu" element={<WeeklyMenu />} />
            <Route path="customize" element={<MealCustomization />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="subscription" element={<SubscriptionPlans />} />
            <Route path="orders" element={<OrderTracking />} />
            <Route path="profile" element={<Profile />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="cart" element={<Cart />} />
            <Route path="order-history" element={<OrderHistory />} />
            <Route path="addresses" element={<SavedAddresses />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="support" element={<HelpSupport />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
