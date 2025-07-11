import React from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TaskFileUpload({ formData, handleFileUpload, removeFile }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Archivos de Referencia
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 mb-2">Arrastra archivos aquí o haz clic para seleccionar</p>
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('file-upload').click()}
        >
          Seleccionar Archivos
        </Button>
      </div>
      
      {formData.archivos.length > 0 && (
        <div className="mt-4 space-y-2">
          {formData.archivos.map((archivo, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-700">{archivo}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}