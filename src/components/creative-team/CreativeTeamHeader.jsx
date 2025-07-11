import React from 'react';
import { ArrowLeft, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CreativeTeamHeader({ currentUser, onBackToAdmin }) {
  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 leading-tight hidden sm:block">HoloFlow – Studio Resource Planner</span>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser && (
              <div className="text-right">
                <p className="font-semibold text-gray-900 truncate max-w-[150px]">{currentUser.name}</p>
                <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">{currentUser.role || 'Creativo'}</p>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={onBackToAdmin}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Panel Admin
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}