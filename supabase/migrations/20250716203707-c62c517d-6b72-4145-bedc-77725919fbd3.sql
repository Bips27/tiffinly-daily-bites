-- Insert sample dishes
INSERT INTO public.dishes (name, category_id, description, is_vegetarian, is_vegan) VALUES
-- Breakfast dishes
('Poha', (SELECT id FROM public.meal_categories WHERE name = 'breakfast'), 'Flattened rice with vegetables and spices', true, true),
('Upma', (SELECT id FROM public.meal_categories WHERE name = 'breakfast'), 'Semolina porridge with vegetables', true, true),
('Idli Sambar', (SELECT id FROM public.meal_categories WHERE name = 'breakfast'), 'Steamed rice cakes with lentil curry', true, true),
('Dosa', (SELECT id FROM public.meal_categories WHERE name = 'breakfast'), 'Crispy fermented crepe with chutney', true, true),
('Paratha with Curd', (SELECT id FROM public.meal_categories WHERE name = 'breakfast'), 'Stuffed flatbread with yogurt', true, false),

-- Lunch dishes
('Dal Rice', (SELECT id FROM public.meal_categories WHERE name = 'lunch'), 'Lentil curry with steamed rice', true, true),
('Rajma Chawal', (SELECT id FROM public.meal_categories WHERE name = 'lunch'), 'Kidney bean curry with rice', true, true),
('Chole Bhature', (SELECT id FROM public.meal_categories WHERE name = 'lunch'), 'Chickpea curry with fried bread', true, false),
('Paneer Butter Masala', (SELECT id FROM public.meal_categories WHERE name = 'lunch'), 'Cottage cheese in rich tomato gravy', true, false),
('Biryani', (SELECT id FROM public.meal_categories WHERE name = 'lunch'), 'Fragrant rice with vegetables/meat', true, false),

-- Dinner dishes
('Roti Sabzi', (SELECT id FROM public.meal_categories WHERE name = 'dinner'), 'Flatbread with vegetable curry', true, true),
('Khichdi', (SELECT id FROM public.meal_categories WHERE name = 'dinner'), 'Rice and lentil porridge', true, true),
('Palak Paneer', (SELECT id FROM public.meal_categories WHERE name = 'dinner'), 'Spinach curry with cottage cheese', true, false),
('Aloo Gobi', (SELECT id FROM public.meal_categories WHERE name = 'dinner'), 'Potato and cauliflower curry', true, true),
('Mixed Dal', (SELECT id FROM public.meal_categories WHERE name = 'dinner'), 'Mixed lentil curry', true, true);