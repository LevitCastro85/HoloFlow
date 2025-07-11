import React from 'react';
import { Upload, Link } from 'lucide-react';

export default function DeliveryMethodSelector({ deliveryMethod, setDeliveryMethod }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Método de entrega</h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setDeliveryMethod('file')}
          className={`p-4 border-2 rounded-lg text-left transition-colors ${
            deliveryMethod === 'file' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Upload className="w-6 h-6 text-blue-600 mb-2" />
          <h4 className="font-medium text-gray-900">Subir Archivos</h4>
          <p className="text-sm text-gray-600">Sube archivos directamente desde tu dispositivo</p>
        </button>

        <button
          onClick={() => setDeliveryMethod('url')}
          className={`p-4 border-2 rounded-lg text-left transition-colors ${
            deliveryMethod === 'url' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Link className="w-6 h-6 text-blue-600 mb-2" />
          <h4 className="font-medium text-gray-900">URL de Descarga</h4>
          <p className="text-sm text-gray-600">Comparte enlaces de Google Drive, Dropbox, etc.</p>
        </button>
      </div>
    </div>
  );
}