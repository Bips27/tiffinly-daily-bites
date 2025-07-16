import React from 'react';
import { Clock, Flame, Leaf, Star, Edit3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import { Meal } from '@/hooks/useMealData';

interface MealDetailSheetProps {
  meal: Meal | null;
  isOpen: boolean;
  onClose: () => void;
  onCustomize: () => void;
  canCustomize: boolean;
  customizationStatus: {
    canCustomize: boolean;
    status: 'open' | 'customized' | 'closed';
    message: string;
  };
}

export const MealDetailSheet: React.FC<MealDetailSheetProps> = ({
  meal,
  isOpen,
  onClose,
  onCustomize,
  canCustomize,
  customizationStatus
}) => {
  if (!meal) return null;

  const handleCustomizeClick = () => {
    if (canCustomize) {
      onCustomize();
      onClose();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-12 h-1.5 bg-muted rounded-full mt-3 mb-4" />
        
        <DrawerHeader className="text-left pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">{meal.image}</div>
              <div className="flex-1">
                <DrawerTitle className="text-xl font-bold mb-1">
                  {meal.name}
                </DrawerTitle>
                <DrawerDescription className="text-base">
                  {meal.type}
                </DrawerDescription>
              </div>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <X className="w-5 h-5" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-6 pb-6 space-y-6 overflow-y-auto">
          {/* Status & Timing */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{meal.time}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Flame className="w-4 h-4" />
                <span>{meal.calories} cal</span>
              </div>
            </div>
            
            <Badge 
              variant={customizationStatus.status === 'open' ? 'default' : 
                      customizationStatus.status === 'customized' ? 'secondary' : 'destructive'}
              className="px-3 py-1"
            >
              {customizationStatus.status === 'open' && '✅ Customizable'}
              {customizationStatus.status === 'customized' && '🎯 Customized'}
              {customizationStatus.status === 'closed' && '❌ Closed'}
            </Badge>
          </div>

          <Separator />

          {/* Meal Items */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Today's Menu</h3>
            <div className="grid gap-2">
              {meal.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="font-medium">{item}</span>
                  </div>
                  <Leaf className="w-4 h-4 text-success" />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Nutritional Info */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Nutritional Info</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">{meal.calories}</div>
                <div className="text-xs text-muted-foreground">Calories</div>
              </div>
              <div className="text-center p-3 bg-accent/5 rounded-lg">
                <div className="text-2xl font-bold text-accent">18g</div>
                <div className="text-xs text-muted-foreground">Protein</div>
              </div>
              <div className="text-center p-3 bg-warning/5 rounded-lg">
                <div className="text-2xl font-bold text-warning">4.8</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Rating
                </div>
              </div>
            </div>
          </div>

          {/* Customization Fee Notice */}
          {meal.isCustomized && meal.customizationFee && (
            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Customization Fee</span>
                <span className="font-bold text-primary">₹{meal.customizationFee}</span>
              </div>
            </div>
          )}
        </div>

        <DrawerFooter className="pt-4">
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1"
              onClick={onClose}
            >
              Close
            </Button>
            <Button 
              size="lg" 
              className="flex-1"
              onClick={handleCustomizeClick}
              disabled={!canCustomize}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {customizationStatus.status === 'customized' ? 'View Changes' : 'Customize'}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};