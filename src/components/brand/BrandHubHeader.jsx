import React from 'react';
import { ArrowLeft, Plus, Lock, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BrandHubHeader({ 
  title, 
  subtitle, 
  canEdit, 
  currentUser, 
  onBack, 
  onAddBrand,
  showAddButton = false
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Palette className="w-8 h-8 mr-3 text-purple-600" />
            {title}
          </h1>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>
      </div>
      
      {showAddButton && (
        <div className="flex items-center space-x-3">
          {!canEdit && (
            <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
              <Lock className="w-4 h-4 mr-2" />
              Solo lectura
            </div>
          )}
          
          <Button 
            onClick={onAddBrand}
            disabled={!canEdit}
            className={!canEdit ? 'opacity-50 cursor-not-allowed' : ''}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Marca
          </Button>
        </div>
      )}
    </div>
  );
}