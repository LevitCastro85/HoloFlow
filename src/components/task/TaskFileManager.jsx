import React from 'react';
import { Button } from '@/components/ui/button';

export default function TaskFileManager({ formData, onFileUpload, onRemoveFile, onInputChange }) {
  return (
    <>
      {/* Archivos */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Archivos de referencia
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            onChange={onFileUpload}
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
                  onClick={() => onRemoveFile(index)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notas adicionales */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas adicionales
        </label>
        <textarea
          name="notas"
          value={formData.notas}
          onChange={onInputChange}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Información adicional, consideraciones especiales..."
        />
      </div>
    </>
  );
}