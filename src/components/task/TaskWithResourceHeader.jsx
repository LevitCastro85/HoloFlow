import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TaskWithResourceHeader({ onCancel }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Banco
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tarea con Recurso</h1>
          <p className="text-gray-600 mt-1">Crea una nueva tarea usando un recurso existente como input</p>
        </div>
      </div>
    </div>
  );
}