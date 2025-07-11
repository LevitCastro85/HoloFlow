import React from 'react';
import { Link, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UrlUploadSection({ 
  newUrl, 
  setNewUrl,
  urlDescription, 
  setUrlDescription,
  urlDeliveries,
  onAddUrl,
  onRemoveUrl 
}) {
  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-3">Agregar URL de Descarga</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de descarga *
          </label>
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://drive.google.com/file/d/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción (opcional)
          </label>
          <input
            type="text"
            value={urlDescription}
            onChange={(e) => setUrlDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Diseño final, Video editado, etc."
          />
        </div>

        <Button onClick={onAddUrl} className="w-full">
          <Link className="w-4 h-4 mr-2" />
          Agregar URL
        </Button>
      </div>

      {urlDeliveries.length > 0 && (
        <div className="mt-4">
          <h5 className="font-medium text-gray-900 mb-3">URLs agregadas</h5>
          <div className="space-y-2">
            {urlDeliveries.map(urlDelivery => (
              <div key={urlDelivery.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ExternalLink className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">{urlDelivery.description}</p>
                    <p className="text-sm text-gray-500">{urlDelivery.platform}</p>
                    <a 
                      href={urlDelivery.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {urlDelivery.url.length > 50 ? urlDelivery.url.substring(0, 50) + '...' : urlDelivery.url}
                    </a>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveUrl(urlDelivery.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}