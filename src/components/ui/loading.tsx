import React from 'react';
import { Skeleton } from './skeleton';

export const MealCardSkeleton = () => (
  <div className="p-4 space-y-3">
    <div className="flex items-center space-x-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="relative overflow-hidden bg-gradient-primary rounded-b-3xl mx-4 mb-6">
      <div className="relative p-6 text-white">
        <Skeleton className="h-8 w-48 mb-2 bg-white/20" />
        <Skeleton className="h-4 w-64 mb-4 bg-white/20" />
        
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-xl bg-white/20" />
            <div>
              <Skeleton className="h-3 w-20 mb-1 bg-white/20" />
              <Skeleton className="h-5 w-16 bg-white/20" />
            </div>
          </div>
          <Skeleton className="w-24 h-8 rounded-md bg-white/20" />
        </div>
      </div>
    </div>

    <div className="px-4 space-y-6">
      <section>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="border rounded-xl">
              <MealCardSkeleton />
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
);

export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-primary/20 border-t-primary rounded-full animate-spin`} />
  );
};