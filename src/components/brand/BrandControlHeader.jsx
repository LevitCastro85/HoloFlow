import React from 'react';
import { ArrowLeft, Plus, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BrandControlHeader({ 
  client, 
  canEdit, 
  currentUser, 
  onBack, 
  onAddBrand 
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Clientes
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brand Control</h1>
          <p className="text-gray-600">Cliente: {client.nombre}</p>
        </div>
      </div>
      
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
    </div>
  );
}