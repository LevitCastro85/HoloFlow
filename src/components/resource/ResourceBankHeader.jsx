import React from 'react';
import { Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ResourceBankHeader({ onFileUpload }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Banco de Recursos</h1>
        <p className="text-gray-600 mt-1">Gestiona archivos, plantillas y recursos creativos con trazabilidad completa</p>
      </div>
      
      <div className="flex space-x-3">
        <Button
          onClick={onFileUpload}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Subir Recursos
        </Button>
      </div>
    </div>
  );
}