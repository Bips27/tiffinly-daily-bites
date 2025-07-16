import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'success';
  onConfirm: () => void;
}

export const ConfirmationDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
}: ConfirmationDialogProps) => {
  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <AlertTriangle className="w-6 h-6 text-destructive" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-success" />;
      default:
        return <Info className="w-6 h-6 text-primary" />;
    }
  };

  const getConfirmVariant = () => {
    switch (variant) {
      case 'destructive':
        return 'destructive';
      case 'success':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm mx-4">
        <AlertDialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            {getIcon()}
            <AlertDialogTitle className="text-lg">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="w-full sm:w-auto">{cancelText}</AlertDialogCancel>
          <AlertDialogAction 
            className={`w-full sm:w-auto ${variant === 'destructive' ? 'bg-destructive hover:bg-destructive/90' : ''}`}
            onClick={onConfirm}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};