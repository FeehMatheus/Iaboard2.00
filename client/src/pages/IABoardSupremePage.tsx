import React from 'react';
import IABoardSupreme from '@/components/IABoardSupreme';
import { NavigationHeader } from '@/components/NavigationHeader';

export default function IABoardSupremePage() {
  return (
    <div className="min-h-screen">
      <NavigationHeader />
      <IABoardSupreme />
    </div>
  );
}