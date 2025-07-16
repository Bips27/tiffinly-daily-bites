-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('weekly', 'monthly')),
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  features TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meal categories table
CREATE TABLE public.meal_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dishes table
CREATE TABLE public.dishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.meal_categories(id),
  description TEXT,
  image_url TEXT,
  is_vegetarian BOOLEAN DEFAULT TRUE,
  is_vegan BOOLEAN DEFAULT FALSE,
  allergens TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user meal preferences table
CREATE TABLE public.user_meal_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dish_id UUID NOT NULL REFERENCES public.dishes(id),
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  preference_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, dish_id, meal_type)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_meal_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for subscription plans (public read)
CREATE POLICY "Anyone can view subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (true);

-- Create RLS policies for user subscriptions
CREATE POLICY "Users can view their own subscriptions" 
ON public.user_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions" 
ON public.user_subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
ON public.user_subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for meal categories (public read)
CREATE POLICY "Anyone can view meal categories" 
ON public.meal_categories 
FOR SELECT 
USING (true);

-- Create RLS policies for dishes (public read)
CREATE POLICY "Anyone can view dishes" 
ON public.dishes 
FOR SELECT 
USING (true);

-- Create RLS policies for user meal preferences
CREATE POLICY "Users can view their own meal preferences" 
ON public.user_meal_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meal preferences" 
ON public.user_meal_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal preferences" 
ON public.user_meal_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal preferences" 
ON public.user_meal_preferences 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, phone)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name', 
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.phone
  );
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default meal categories
INSERT INTO public.meal_categories (name, display_order) VALUES
('breakfast', 1),
('lunch', 2),
('dinner', 3);

-- Insert sample subscription plans
INSERT INTO public.subscription_plans (name, type, price, description, features) VALUES
('Weekly Basic', 'weekly', 299.00, 'Perfect for trying out our service', ARRAY['7 meals per week', 'Basic customization', 'Email support']),
('Weekly Premium', 'weekly', 499.00, 'Most popular choice', ARRAY['7 meals per week', 'Full customization', 'Priority support', 'Nutrition tracking']),
('Monthly Basic', 'monthly', 999.00, 'Great value for regular users', ARRAY['30 meals per month', 'Basic customization', 'Email support', '10% savings']),
('Monthly Premium', 'monthly', 1599.00, 'Best value with premium features', ARRAY['30 meals per month', 'Full customization', 'Priority support', 'Nutrition tracking', '20% savings']);

-- Insert sample dishes
INSERT INTO public.dishes (name, category_id, description, is_vegetarian, is_vegan) VALUES
-- Breakfast dishes
((SELECT id FROM public.meal_categories WHERE name = 'breakfast'), 'Poha', 'Flattened rice with vegetables and spices', true, true),
((SELECT id FROM public.meal_categories WHERE name = 'breakfast'), 'Upma', 'Semolina porridge with vegetables', true, true),
((SELECT id FROM public.meal_categories WHERE name = 'breakfast'), 'Idli Sambar', 'Steamed rice cakes with lentil curry', true, true),
((SELECT id FROM public.meal_categories WHERE name = 'breakfast'), 'Dosa', 'Crispy fermented crepe with chutney', true, true),
((SELECT id FROM public.meal_categories WHERE name = 'breakfast'), 'Paratha with Curd', 'Stuffed flatbread with yogurt', true, false),

-- Lunch dishes
((SELECT id FROM public.meal_categories WHERE name = 'lunch'), 'Dal Rice', 'Lentil curry with steamed rice', true, true),
((SELECT id FROM public.meal_categories WHERE name = 'lunch'), 'Rajma Chawal', 'Kidney bean curry with rice', true, true),
((SELECT id FROM public.meal_categories WHERE name = 'lunch'), 'Chole Bhature', 'Chickpea curry with fried bread', true, false),
((SELECT id FROM public.meal_categories WHERE name = 'lunch'), 'Paneer Butter Masala', 'Cottage cheese in rich tomato gravy', true, false),
((SELECT id FROM public.meal_categories WHERE name = 'lunch'), 'Biryani', 'Fragrant rice with vegetables/meat', true, false),

-- Dinner dishes
((SELECT id FROM public.meal_categories WHERE name = 'dinner'), 'Roti Sabzi', 'Flatbread with vegetable curry', true, true),
((SELECT id FROM public.meal_categories WHERE name = 'dinner'), 'Khichdi', 'Rice and lentil porridge', true, true),
((SELECT id FROM public.meal_categories WHERE name = 'dinner'), 'Palak Paneer', 'Spinach curry with cottage cheese', true, false),
((SELECT id FROM public.meal_categories WHERE name = 'dinner'), 'Aloo Gobi', 'Potato and cauliflower curry', true, true),
((SELECT id FROM public.meal_categories WHERE name = 'dinner'), 'Mixed Dal', 'Mixed lentil curry', true, true);