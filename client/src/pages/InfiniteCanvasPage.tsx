import React from 'react';
import WrappedInfiniteCanvasSupreme from '@/components/InfiniteCanvasSupreme';
import { NavigationHeader } from '@/components/NavigationHeader';

export default function InfiniteCanvasPage() {
  return (
    <div className="min-h-screen">
      <NavigationHeader />
      <WrappedInfiniteCanvasSupreme />
    </div>
  );
}